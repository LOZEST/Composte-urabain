#  Greenloop — Composteur Urbain Autonome (OSI 2026)


![Projet](https://img.shields.io/badge/Projet-Olympiades%20SI%202026-green)
![Plateforme](https://img.shields.io/badge/Plateforme-Arduino-blue)
![Énergie](https://img.shields.io/badge/Énergie-Solaire-yellow)
![Statut](https://img.shields.io/badge/Statut-En%20développement-orange)

<img src="https://github.com/user-attachments/assets/5566e445-7e59-4c4f-8d6f-80ce420a6304" width="300" align="right" />

**Greenloop** est un projet développé dans le cadre des **Olympiades des Sciences de l'Ingénieur 2026**.

L'objectif est de concevoir un **composteur urbain intelligent et autonome**, capable de transformer les biodéchets en ressource locale directement en ville, tout en simplifiant l'utilisation pour les citoyens.

---

#  Sommaire

* [Le concept](#-le-concept)
* [Objectifs du projet](#-objectifs-du-projet)
* [Prototype](#-prototype)
* [Architecture système](#-architecture-système)
* [Approche technique](#-approche-technique)
* [Structure du projet](#-structure-du-projet)
* [Équipe](#-équipe)
* [Licence](#-licence)

---

# Le concept

Le projet **Greenloop** vise à rendre le **compostage urbain simple, accessible et autonome**.

Les composteurs urbains existants présentent plusieurs limites :

* gestion complexe
* odeurs
* accès non contrôlé
* absence de données sur l'utilisation

Greenloop apporte une solution en intégrant **automatisation, capteurs et énergie solaire**.

### Fonctionnalités principales

 **Accès sécurisé**
Ouverture de la trappe via scan de QR Code.

 **Pesée automatique**
Mesure du poids des biodéchets déposés.

 **Cycle de compostage intelligent**
Gestion de plusieurs états de décomposition via plusieurs cuves sous-terraines.

 **Autonomie énergétique**
Système alimenté par un trackeur solaire.

 **Suivi des données**
Donées disponible sur une application connécté en temps réel.

---

#  Objectifs du projet

* Encourager le **tri des biodéchets en ville**
* Simplifier l'utilisation du compostage collectif
* Produire un **système autonome et durable**
* Collecter des **données d'utilisation**

---

#  Prototype

Le prototype intègre :

* un **scanner qrcode**
* un **système de pesée**
* un **microcontrôleur Arduino**
* un **panneau solaire et une batterie**
* un **modélisation en 3D**

### Aperçu

*(Vous pouvez ajouter ici des photos du prototype ou des rendus CAO)*

```markdown
![Prototype](images/prototype.jpg)
```

---

#  Architecture système

Le système repose sur deux chaînes principales :

### Chaîne d'information

Capteurs → Microcontrôleur → Traitement → Actionneurs


* lecture du QR code
* capteur de poids
* traitement Arduino
* commande du servomoteur

### Chaîne d'énergie

Panneau solaire → Batterie → Régulateur → Arduino + moteurs

Cela permet un **fonctionnement totalement autonome**.

---

#  Approche technique

Le projet mobilise plusieurs domaines d'ingénierie :

### Ingénierie système

* analyse du besoin
* diagrammes SysML
* architecture fonctionnelle

### Conception 3D

Modélisation de l'ensemble depots de déchets et retrait de dechets, 
modélisation enssemble des 4 cuves de stockages sous-terraines avec **Fusion 360**.

puis **impression 3D**.

### Électronique et programmation

Pilotage du système avec **Arduino** :

* capteurs pression
* capteurs qualité d'air
* capteur gaz
* capteur himidité
* poulie
* Sérure éléctro-magnétique
* scanner qrcode
* trackeur solaire


### Gestion de projet

Suivi du budget et des composants avec **Excel**.

---

#  Structure du projet

```text
Greenloop/
│
├── README.md
│
├── Soutien/
│   ├── mairies/
│   ├── entreprises/
│   └── 
│
├── Code/
│   ├── capteurs/
│   ├── appli/
│   └── trackeur_solaire/
│
├── CAO/
│   ├── mode_maison/
│   └── mode_cuves/
│
├── Documentation/
│   ├── exels/
│   └── sysml/
│
└── Presentation/
    ├── powerpoint/
    ├── 
    └── demo_projet.mp4

```

---

Voici un accès direct aux différentes ressources du projet :

Documents de soutien 
👉 [Accéder au dossier Soutien](./Soutien) 

Codes du projet 
👉 [Accéder au dossier Code](./Code) 

Conception 3D (CAO) 
👉 [Accéder au dossier CAO](./CAO) 

Documentation technique 
👉 [Accéder au dossier Documentation](./Documentation) 

Présentation du projet 
👉 [Accéder au dossier Presentation](./Presentation)

#  Équipe

Projet réalisé par :

* **Louis Giraudel**
* **Lucien Bisiaux**
* **Eliot Farys**
* **Théophile Berenger**
* **Clément Hintzy**

Dans le cadre des **Olympiades des Sciences de l’Ingénieur 2026**.

---

#  Licence

Projet académique réalisé à des fins éducatives.

---

Si ce projet vous intéresse, n'hésitez pas à explorer le dépôt !


