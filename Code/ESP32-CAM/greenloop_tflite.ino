/**
 * ================================================================
 *  GreenLoop — Scanner IA Embarqué (TFLite Micro)
 *  Matériel : ESP32-CAM AI-Thinker
 *  Modèle   : Teachable Machine → TFLite (converti par convert_model.py)
 * ================================================================
 *
 *  Modèle :
 *    - Entrée  : 96×96 pixels niveaux de gris (grayscale)
 *    - Sortie  : 2 classes → "compostable" | "non compostable"
 *
 *  Bibliothèques à installer (Arduino Library Manager) :
 *    - "TensorFlowLite_ESP32" par TensorFlow
 *       Chercher "TFLite_esp32" ou importer depuis :
 *       https://github.com/tanakamasayuki/Arduino_TensorFlowLite_ESP32
 *    - "ArduinoJson" par Benoit Blanchon
 *
 *  Fichier requis (généré par convert_model.py) :
 *    - greenloop_model.h  ← copier dans ce même dossier
 *
 * ================================================================
 */

#include <TensorFlowLite_ESP32.h>
#include "tensorflow/lite/micro/all_ops_resolver.h"
#include "tensorflow/lite/micro/micro_interpreter.h"
#include "tensorflow/lite/micro/micro_log.h"
#include "tensorflow/lite/schema/schema_generated.h"

#include "esp_camera.h"
#include <ArduinoJson.h>
#include "SPIFFS.h"

// Modèle converti depuis Teachable Machine (généré par convert_model.py)
#include "greenloop_model.h"

// ----------------------------------------------------------------
//  LABELS — doivent correspondre à l'ordre dans Teachable Machine
//  (visible dans metadata.json → "labels")
// ----------------------------------------------------------------
const char* LABELS[]     = { "compostable", "non compostable" };
const int   LABEL_COUNT  = 2;
const int   LABEL_ACCEPT = 0;  // index de la classe acceptée

// ----------------------------------------------------------------
//  CONFIGURATION
// ----------------------------------------------------------------
#define IMG_SIZE         96      // Résolution modèle (96×96)
#define CONFIDENCE_MIN   0.70f   // Seuil minimum de confiance
#define RELAY_ACTIVE_MS  3000
#define COOLDOWN_MS      8000

// Mémoire allouée pour TFLite Micro (ajuster si erreur d'allocation)
#define TENSOR_ARENA_KB  80
const int TENSOR_ARENA_SIZE = TENSOR_ARENA_KB * 1024;
static uint8_t tensor_arena[TENSOR_ARENA_SIZE];

// ----------------------------------------------------------------
//  BROCHES — AI-Thinker ESP32-CAM
// ----------------------------------------------------------------
#define PWDN_GPIO_NUM     32
#define RESET_GPIO_NUM    -1
#define XCLK_GPIO_NUM      0
#define SIOD_GPIO_NUM     26
#define SIOC_GPIO_NUM     27
#define Y9_GPIO_NUM       35
#define Y8_GPIO_NUM       34
#define Y7_GPIO_NUM       39
#define Y6_GPIO_NUM       36
#define Y5_GPIO_NUM       21
#define Y4_GPIO_NUM       19
#define Y3_GPIO_NUM       18
#define Y2_GPIO_NUM        5
#define VSYNC_GPIO_NUM    25
#define HREF_GPIO_NUM     23
#define PCLK_GPIO_NUM     22

#define PIN_FLASH          4
#define PIN_RELAY_ACCEPT  13
#define PIN_RELAY_REJECT  15
#define PIN_TRIGGER       14
#define PIN_LED_STATUS     2

// ----------------------------------------------------------------
//  TFLite Micro — variables globales
// ----------------------------------------------------------------
tflite::AllOpsResolver        resolver;
const tflite::Model*          model_ptr  = nullptr;
tflite::MicroInterpreter*     interpreter = nullptr;
TfLiteTensor*                 input      = nullptr;
TfLiteTensor*                 output     = nullptr;

// ----------------------------------------------------------------
//  STATISTIQUES (SPIFFS)
// ----------------------------------------------------------------
#define STATS_FILE "/stats.json"
struct Stats { uint32_t total, accepted, rejected, low_conf; };
Stats stats = {0};

void loadStats() {
  if (!SPIFFS.exists(STATS_FILE)) { saveStats(); return; }
  File f = SPIFFS.open(STATS_FILE, "r");
  if (!f) return;
  JsonDocument doc;
  if (deserializeJson(doc, f) == DeserializationError::Ok) {
    stats.total    = doc["total"]    | 0;
    stats.accepted = doc["accepted"] | 0;
    stats.rejected = doc["rejected"] | 0;
    stats.low_conf = doc["low_conf"] | 0;
  }
  f.close();
}

void saveStats() {
  File f = SPIFFS.open(STATS_FILE, "w");
  if (!f) return;
  JsonDocument doc;
  doc["total"]    = stats.total;
  doc["accepted"] = stats.accepted;
  doc["rejected"] = stats.rejected;
  doc["low_conf"] = stats.low_conf;
  serializeJson(doc, f);
  f.close();
}

void printStats() {
  Serial.println("\n════════ STATISTIQUES ════════");
  Serial.printf("  Total    : %u\n", stats.total);
  Serial.printf("  ✅ Accepté : %u (%.0f%%)\n", stats.accepted,
    stats.total > 0 ? (float)stats.accepted / stats.total * 100 : 0);
  Serial.printf("  ❌ Refusé  : %u (%.0f%%)\n", stats.rejected,
    stats.total > 0 ? (float)stats.rejected / stats.total * 100 : 0);
  Serial.printf("  ⚠️  Conf<70%%: %u\n", stats.low_conf);
  Serial.println("══════════════════════════════\n");
}

// ----------------------------------------------------------------
//  INITIALISATION CAMÉRA
//  Grayscale 96×96 — correspond exactement à l'entrée du modèle
// ----------------------------------------------------------------
bool initCamera() {
  camera_config_t cfg;
  cfg.ledc_channel  = LEDC_CHANNEL_0;
  cfg.ledc_timer    = LEDC_TIMER_0;
  cfg.pin_d0        = Y2_GPIO_NUM;
  cfg.pin_d1        = Y3_GPIO_NUM;
  cfg.pin_d2        = Y4_GPIO_NUM;
  cfg.pin_d3        = Y5_GPIO_NUM;
  cfg.pin_d4        = Y6_GPIO_NUM;
  cfg.pin_d5        = Y7_GPIO_NUM;
  cfg.pin_d6        = Y8_GPIO_NUM;
  cfg.pin_d7        = Y9_GPIO_NUM;
  cfg.pin_xclk      = XCLK_GPIO_NUM;
  cfg.pin_pclk      = PCLK_GPIO_NUM;
  cfg.pin_vsync     = VSYNC_GPIO_NUM;
  cfg.pin_href      = HREF_GPIO_NUM;
  cfg.pin_sscb_sda  = SIOD_GPIO_NUM;
  cfg.pin_sscb_scl  = SIOC_GPIO_NUM;
  cfg.pin_pwdn      = PWDN_GPIO_NUM;
  cfg.pin_reset     = RESET_GPIO_NUM;
  cfg.xclk_freq_hz  = 20000000;

  // GRAYSCALE 96×96 — identique à l'entrée du modèle Teachable Machine
  cfg.pixel_format  = PIXFORMAT_GRAYSCALE;
  cfg.frame_size    = FRAMESIZE_96X96;
  cfg.fb_location   = CAMERA_FB_IN_PSRAM;
  cfg.grab_mode     = CAMERA_GRAB_WHEN_EMPTY;
  cfg.fb_count      = 1;
  cfg.jpeg_quality  = 12;

  if (esp_camera_init(&cfg) != ESP_OK) {
    Serial.println("[CAM] Erreur init");
    return false;
  }
  sensor_t* s = esp_camera_sensor_get();
  s->set_brightness(s, 1);
  s->set_contrast(s, 1);
  s->set_whitebal(s, 1);
  s->set_exposure_ctrl(s, 1);
  s->set_gain_ctrl(s, 1);
  s->set_hmirror(s, 0);
  s->set_vflip(s, 0);
  Serial.println("[CAM] Initialisée (96×96 Grayscale)");
  return true;
}

// ----------------------------------------------------------------
//  INITIALISATION TFLite MICRO
// ----------------------------------------------------------------
bool initTFLite() {
  model_ptr = tflite::GetModel(greenloop_model);
  if (model_ptr->version() != TFLITE_SCHEMA_VERSION) {
    Serial.printf("[TFLite] Version incompatible: %d (attendu %d)\n",
      model_ptr->version(), TFLITE_SCHEMA_VERSION);
    return false;
  }

  interpreter = new tflite::MicroInterpreter(
    model_ptr, resolver, tensor_arena, TENSOR_ARENA_SIZE
  );

  TfLiteStatus status = interpreter->AllocateTensors();
  if (status != kTfLiteOk) {
    Serial.printf("[TFLite] AllocateTensors échoué — augmenter TENSOR_ARENA_KB (actuel: %d KB)\n",
      TENSOR_ARENA_KB);
    return false;
  }

  input  = interpreter->input(0);
  output = interpreter->output(0);

  Serial.printf("[TFLite] Initialisé — Arène: %d KB\n", TENSOR_ARENA_KB);
  Serial.printf("[TFLite] Entrée : [%d,%d,%d,%d] type=%d\n",
    input->dims->data[0], input->dims->data[1],
    input->dims->data[2], input->dims->data[3],
    input->type);
  Serial.printf("[TFLite] Sortie : [%d,%d] type=%d\n",
    output->dims->data[0], output->dims->data[1],
    output->type);
  return true;
}

// ----------------------------------------------------------------
//  CONTRÔLE RELAIS & LED
// ----------------------------------------------------------------
void activateAccept() {
  Serial.println("[RELAI] ✅ ACCEPT");
  for (int i = 0; i < 3; i++) {
    digitalWrite(PIN_LED_STATUS, HIGH); delay(150);
    digitalWrite(PIN_LED_STATUS, LOW);  delay(150);
  }
  digitalWrite(PIN_RELAY_ACCEPT, HIGH);
  delay(RELAY_ACTIVE_MS);
  digitalWrite(PIN_RELAY_ACCEPT, LOW);
}

void activateReject() {
  Serial.println("[RELAI] ❌ REJECT");
  for (int i = 0; i < 6; i++) {
    digitalWrite(PIN_LED_STATUS, HIGH); delay(70);
    digitalWrite(PIN_LED_STATUS, LOW);  delay(70);
  }
  digitalWrite(PIN_RELAY_REJECT, HIGH);
  delay(RELAY_ACTIVE_MS);
  digitalWrite(PIN_RELAY_REJECT, LOW);
}

void blinkError() {
  for (int i = 0; i < 5; i++) {
    digitalWrite(PIN_LED_STATUS, HIGH); delay(100);
    digitalWrite(PIN_LED_STATUS, LOW);  delay(100);
  }
}

// ----------------------------------------------------------------
//  CAPTURE + INFÉRENCE
// ----------------------------------------------------------------
unsigned long lastTriggerMs = 0;

void captureAndClassify() {
  Serial.println("\n[SCAN] Déclenchement...");

  // 1. Flash + capture grayscale 96×96
  digitalWrite(PIN_FLASH, HIGH);
  delay(150);
  camera_fb_t* fb = esp_camera_fb_get();
  digitalWrite(PIN_FLASH, LOW);

  if (!fb || fb->len != IMG_SIZE * IMG_SIZE) {
    Serial.printf("[CAM] Échec — len=%u (attendu %d)\n",
      fb ? fb->len : 0, IMG_SIZE * IMG_SIZE);
    if (fb) esp_camera_fb_return(fb);
    blinkError();
    return;
  }

  // 2. Copier les pixels dans le tenseur d'entrée
  //    Teachable Machine attend des float normalisés [0.0, 1.0]
  //    Le modèle est en grayscale → 1 seul canal
  if (input->type == kTfLiteFloat32) {
    for (int i = 0; i < IMG_SIZE * IMG_SIZE; i++) {
      input->data.f[i] = (float)fb->buf[i] / 255.0f;
    }
  } else if (input->type == kTfLiteUInt8) {
    memcpy(input->data.uint8, fb->buf, IMG_SIZE * IMG_SIZE);
  } else if (input->type == kTfLiteInt8) {
    for (int i = 0; i < IMG_SIZE * IMG_SIZE; i++) {
      input->data.int8[i] = (int8_t)(fb->buf[i] - 128);
    }
  }
  esp_camera_fb_return(fb);

  // 3. Lancer l'inférence
  unsigned long t0 = millis();
  TfLiteStatus status = interpreter->Invoke();
  unsigned long inference_ms = millis() - t0;

  if (status != kTfLiteOk) {
    Serial.println("[TFLite] Erreur inférence");
    blinkError();
    return;
  }

  // 4. Lire les résultats
  float scores[LABEL_COUNT];
  if (output->type == kTfLiteFloat32) {
    for (int i = 0; i < LABEL_COUNT; i++) scores[i] = output->data.f[i];
  } else if (output->type == kTfLiteUInt8) {
    float scale    = output->params.scale;
    int   zero_pt  = output->params.zero_point;
    for (int i = 0; i < LABEL_COUNT; i++)
      scores[i] = (output->data.uint8[i] - zero_pt) * scale;
  } else if (output->type == kTfLiteInt8) {
    float scale    = output->params.scale;
    int   zero_pt  = output->params.zero_point;
    for (int i = 0; i < LABEL_COUNT; i++)
      scores[i] = (output->data.int8[i] - zero_pt) * scale;
  }

  // 5. Afficher tous les scores
  Serial.println("\n  Résultats :");
  int best_idx = 0;
  for (int i = 0; i < LABEL_COUNT; i++) {
    Serial.printf("    %-20s : %.1f%%\n", LABELS[i], scores[i] * 100);
    if (scores[i] > scores[best_idx]) best_idx = i;
  }
  Serial.printf("  Temps inférence : %lu ms\n", inference_ms);

  float best_score = scores[best_idx];

  // 6. Décision
  stats.total++;

  if (best_score < CONFIDENCE_MIN) {
    Serial.printf("\n[DÉCISION] ❌ Confiance trop faible (%.0f%%) → REFUSÉ\n",
      best_score * 100);
    stats.rejected++;
    stats.low_conf++;
    saveStats();
    activateReject();
    printStats();
    return;
  }

  bool accepted = (best_idx == LABEL_ACCEPT);

  Serial.println("\n┌─────────────────────────────┐");
  Serial.printf ("│ %-27s │\n", accepted ? "✅  COMPOSTABLE — ACCEPTÉ" : "❌  NON COMPOSTABLE — REFUSÉ");
  Serial.printf ("│ Confiance : %-3.0f%%              │\n", best_score * 100);
  Serial.println("└─────────────────────────────┘");

  if (accepted) { stats.accepted++; activateAccept(); }
  else          { stats.rejected++; activateReject(); }

  saveStats();
  printStats();
}

// ----------------------------------------------------------------
//  SETUP
// ----------------------------------------------------------------
void setup() {
  Serial.begin(115200);
  Serial.println("\n╔════════════════════════════════════╗");
  Serial.println("║  GreenLoop — TFLite Micro v1.0     ║");
  Serial.println("║  Modèle Teachable Machine embarqué ║");
  Serial.println("╚════════════════════════════════════╝\n");

  pinMode(PIN_FLASH,        OUTPUT);
  pinMode(PIN_RELAY_ACCEPT, OUTPUT);
  pinMode(PIN_RELAY_REJECT, OUTPUT);
  pinMode(PIN_LED_STATUS,   OUTPUT);
  pinMode(PIN_TRIGGER,      INPUT_PULLDOWN);
  digitalWrite(PIN_FLASH,        LOW);
  digitalWrite(PIN_RELAY_ACCEPT, LOW);
  digitalWrite(PIN_RELAY_REJECT, LOW);

  if (!SPIFFS.begin(true))
    Serial.println("[SPIFFS] Erreur — stats désactivées");
  else
    loadStats();

  if (!initCamera()) {
    Serial.println("[BOOT] Caméra introuvable");
    while (true) { blinkError(); delay(1000); }
  }

  if (!initTFLite()) {
    Serial.println("[BOOT] TFLite init échoué");
    while (true) { blinkError(); delay(1000); }
  }

  Serial.println("\n[PRÊT] En attente d'un dépôt...");
  digitalWrite(PIN_LED_STATUS, HIGH);
}

// ----------------------------------------------------------------
//  LOOP
// ----------------------------------------------------------------
void loop() {
  if (digitalRead(PIN_TRIGGER) == HIGH &&
      millis() - lastTriggerMs > COOLDOWN_MS) {
    lastTriggerMs = millis();
    digitalWrite(PIN_LED_STATUS, LOW);
    captureAndClassify();
    digitalWrite(PIN_LED_STATUS, HIGH);
  }
  delay(50);
}
