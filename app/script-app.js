const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("in-view");
  });
}, { threshold: 0.1 });

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

const topProgress = document.getElementById("topProgress");
const updateProgress = () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (topProgress) topProgress.style.width = ratio + "%";
};

window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("load", updateProgress);

const simTabs = document.querySelectorAll(".sim-tab-btn");
const simScreens = document.querySelectorAll(".sim-screen");

simTabs.forEach((btn) => {
  btn.addEventListener("click", () => {
    simTabs.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const target = btn.getAttribute("data-sim-tab");
    simScreens.forEach((screen) => {
      screen.hidden = screen.getAttribute("data-sim-screen") !== target;
    });
  });
});

const kgInput = document.getElementById("sim-kg-input");
const kgDisplay = document.getElementById("sim-kg-display");
const gainDisplay = document.getElementById("sim-gain-display");
const addDepositBtn = document.getElementById("sim-add-deposit");

const simPoints = document.getElementById("sim-points");
const simMetricPoints = document.getElementById("sim-metric-points");
const simMetricDeposits = document.getElementById("sim-metric-deposits");
const simMetricCompost = document.getElementById("sim-metric-compost");
const simCuve1 = document.getElementById("sim-cuve1");
const simCuve2 = document.getElementById("sim-cuve2");
const simCuve3 = document.getElementById("sim-cuve3");
const simCuve4 = document.getElementById("sim-cuve4");

let simState = {
  points: 120,
  deposits: 3,
  compost: 1.2,
  cuve1: 63,
  cuve2: 58,
  cuve4: 28,
};

function updateSimDepositPreview() {
  if (!kgInput || !kgDisplay || !gainDisplay) return;

  const kg = Number(kgInput.value || 3);
  const points = Math.round(kg * 100);
  const compost = (kg * 0.4).toFixed(1);

  kgDisplay.textContent = kg.toFixed(1) + " kg";
  gainDisplay.textContent = "+" + points + " points · " + compost + " kg de compost estimé";
}

function renderSim() {
  if (simPoints) simPoints.textContent = simState.points + " pts";
  if (simMetricPoints) simMetricPoints.textContent = simState.points;
  if (simMetricDeposits) simMetricDeposits.textContent = simState.deposits;
  if (simMetricCompost) simMetricCompost.textContent = simState.compost.toFixed(1) + " kg";
  if (simCuve1) simCuve1.textContent = "Remplissage · " + simState.cuve1 + "%";
  if (simCuve2) simCuve2.textContent = "Digestion active · " + simState.cuve2 + "°C";
  if (simCuve3) simCuve3.textContent = "Maturation · ventilation régulée";
  if (simCuve4) simCuve4.textContent = "Stockage final · " + simState.cuve4 + "%";
}

if (kgInput) {
  kgInput.addEventListener("input", updateSimDepositPreview);
  updateSimDepositPreview();
}

if (addDepositBtn) {
  addDepositBtn.addEventListener("click", () => {
    const kg = Number(kgInput?.value || 3);

    simState.points += Math.round(kg * 100);
    simState.deposits += 1;
    simState.compost += kg * 0.4;
    simState.cuve1 = Math.min(100, simState.cuve1 + Math.round(kg * 4));
    simState.cuve4 = Math.min(100, simState.cuve4 + Math.round(kg * 2));

    renderSim();
  });
}

setInterval(() => {
  simState.cuve2 = 54 + Math.round(Math.random() * 8);
  simState.cuve1 = Math.max(
    12,
    Math.min(100, simState.cuve1 + Math.round((Math.random() - 0.45) * 3))
  );
  simState.cuve4 = Math.max(
    8,
    Math.min(100, simState.cuve4 + Math.round((Math.random() - 0.5) * 2))
  );

  renderSim();
}, 2200);

renderSim();
