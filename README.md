# manda.IA

**Ton salaire. Tes objectifs. Ton plan.**

manda.IA est un assistant financier personnel basé sur l'intelligence artificielle. Le but est simple : aider les gens à mieux gérer leur salaire, suivre leurs dépenses et atteindre leurs objectifs financiers, sans avoir à jongler avec des tableaux Excel ou des applications compliquées.

<p align="center">
  <img src="assets/home.jpeg" width="600">
</p>

## D'où vient le nom

"Manda" vient du darija marocain et désigne le salaire. Ce nom reflète l'idée centrale du projet : partir de ce que les gens gagnent réellement chaque mois pour les aider à mieux organiser leur argent au quotidien.

## Le problème de départ

La plupart des gens ne manquent pas d'outils pour suivre leur argent, ils manquent de clarté. On se retrouve souvent avec des questions simples auxquelles on n'a pas vraiment de réponse :

- Où part mon argent chaque mois ?
- Combien je peux réellement mettre de côté ?
- Est-ce que je peux me permettre cet achat ?
- Combien de temps il me faudra pour atteindre mon objectif ?
- Est-ce que je progresse vraiment, ou je tourne en rond ?

Les applications de finance classiques se contentent souvent d'afficher des chiffres et des graphiques, sans vraiment dire à l'utilisateur ce qu'il devrait faire ensuite. C'est ce vide que manda.IA essaie de combler.

## Comment ça fonctionne

L'idée de manda.IA, c'est de mettre la conversation au centre de l'expérience. Plutôt que de remplir des formulaires ou de naviguer entre plusieurs écrans, l'utilisateur peut simplement décrire sa situation à l'assistant, en langage naturel.

Par exemple, quelqu'un peut écrire :

> "Je gagne 8000 DH par mois et je veux acheter une voiture à 120 000 DH."

L'assistant comprend la demande, identifie l'objectif, fait les calculs nécessaires, et propose une stratégie d'épargne réaliste adaptée à la situation de la personne.

## Ce que l'application permet de faire

**Discuter avec l'assistant** — poser des questions sur ses finances, décrire sa situation, demander des conseils ou des simulations d'épargne, tout ça en langage naturel.

**Créer et suivre des objectifs financiers** — acheter une voiture, une maison, préparer un voyage, financer des études, se constituer une épargne de sécurité. Chaque objectif peut être suivi dans le temps avec sa progression.

**Gérer ses dépenses** — enregistrer ce qu'on dépense pour mieux comprendre où va son salaire, et s'en servir pour prendre de meilleures décisions plutôt que de simplement constater les chiffres après coup.

**Consulter un tableau de bord** — une vue d'ensemble de la situation financière : revenus, dépenses, épargne, objectifs en cours, activité récente.

## Aperçu de l'interface

### Page d'accueil

<p align="center">
  <img src="assets/home.jpeg" width="400">
</p>

La page d'accueil présente rapidement ce que fait manda.IA et l'idée générale du projet : transformer un salaire en un plan financier clair.

### Connexion

<p align="center">
  <img src="assets/login.jpeg" width="400">
</p>

Chaque utilisateur accède à son espace personnel de manière sécurisée.

### Tableau de bord

<p align="center">
  <img src="assets/dashboard.jpeg" width="400">
</p>

Le tableau de bord donne une vue d'ensemble : situation financière, objectifs en cours, progression, activité récente.

### Discussion avec Manda

<p align="center">
  <img src="assets/chatbot.jpeg" width="400">
</p>

C'est ici que se passe l'essentiel : l'utilisateur discute directement avec l'assistant au lieu de naviguer dans des menus.

## Architecture du système

<p align="center">
  <img src="assets/architecture.png" width="450">
</p>

Un principe important dans la conception de manda.IA : séparer la compréhension du langage naturel des calculs financiers eux-mêmes. Concrètement, l'architecture s'organise ainsi :

```
                         ┌──────────────────┐
                         │      USER        │
                         │   Web / Mobile   │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │  Next.js / React │
                         │     FRONTEND     │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │     FastAPI      │
                         │      API         │
                         └───────┬──────────┘
                                 │
                ┌────────────────┼────────────────┐
                │                │                │
                ▼                ▼                ▼
          ┌──────────┐    ┌──────────────┐   ┌──────────┐
          │   LLM    │    │  Financial   │   │ Database │
          │          │    │    Engine    │   │          │
          └────┬─────┘    └──────┬───────┘   └────┬─────┘
               │                 │                │
               └─────────────────┼────────────────┘
                                 │
                                 ▼
                         Réponse personnalisée
```

### Pourquoi séparer le LLM du moteur financier

Le modèle de langage (LLM) s'occupe de comprendre ce que dit l'utilisateur, d'identifier son intention et d'extraire les informations utiles (montant du salaire, objectif, délai, etc.). Ensuite, il reformule les résultats en une réponse naturelle et compréhensible.

Le moteur financier, lui, s'occupe de tout ce qui touche aux calculs : simulations d'épargne, projections, analyse du budget. L'idée derrière cette séparation est simple : on ne veut pas laisser un modèle de langage faire des calculs financiers tout seul, au risque de se tromper. Les calculs passent donc par une logique déterministe et fiable, pendant que le LLM se concentre sur ce qu'il fait de mieux, comprendre et générer du texte.

Voici à quoi ressemble le trajet d'une demande, du message de l'utilisateur jusqu'à la réponse finale :

```
Utilisateur
     │
     │ "Je gagne 8000 DH et je veux épargner 30 000 DH."
     ▼
LLM (compréhension)
     │
     │ Intention + informations financières extraites
     ▼
Moteur financier (calculs)
     │
     │ Simulation d'épargne
     ▼
LLM (génération)
     │
     ▼
Réponse personnalisée pour l'utilisateur
```

## Technologies utilisées

| Technologie | Rôle |
|---|---|
| Python | Backend et logique métier |
| FastAPI | API REST |
| React | Interface utilisateur |
| Next.js | Framework frontend |
| LLM | Compréhension et génération du langage naturel |
| OpenAI API | Capacités d'intelligence artificielle |
| Base de données | Stockage des données utilisateurs et financières |
| Moteur financier | Calculs et simulations financières |

## Structure du projet

```
manda.IA/
│
├── manda_backend/
│   ├── chatbot.py
│   ├── database.py
│   ├── financial_engine.py
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   ├── security.py
│   └── requirements.txt
│
├── manda-frontend/
│   ├── app/
│   │   ├── budget/
│   │   ├── chat/
│   │   ├── dashboard/
│   │   ├── goals/
│   │   ├── login/
│   │   ├── signup/
│   │   └── transactions/
│   │
│   ├── components/
│   │   ├── ActionSheet.tsx
│   │   ├── BottomNav.tsx
│   │   ├── TaskItem.tsx
│   │   └── TaskList.tsx
│   │
│   ├── public/
│   ├── package.json
│   └── ...
│
├── assets/
│   ├── home.jpeg
│   ├── login.jpeg
│   ├── dashboard.jpeg
│   ├── chatbot.jpeg
│   └── architecture.png
│
├── .gitignore
└── README.md
```

## Installation et démarrage

### 1. Cloner le dépôt

```bash
git clone https://github.com/khadijamaaroufi/Manda.IA.git
cd Manda.IA
```

### 2. Mettre en place le backend

Se déplacer dans le dossier backend :

```bash
cd manda_backend
```

Créer un environnement virtuel :

```bash
python -m venv venv
```

L'activer (sous Windows) :

```bash
venv\Scripts\activate
```

Installer les dépendances :

```bash
pip install -r requirements.txt
```

Créer un fichier `.env` avec les variables nécessaires, par exemple :

```env
OPENAI_API_KEY=votre_clé_api
```

Lancer le serveur :

```bash
uvicorn main:app --reload
```

L'API sera accessible sur `http://127.0.0.1:8000`.

### 3. Mettre en place le frontend

Dans un autre terminal :

```bash
cd manda-frontend
npm install
npm run dev
```

Le frontend sera accessible sur `http://localhost:3000`.

## À propos des clés API

Pour des raisons évidentes de sécurité, le fichier `.env` et les clés API ne sont pas inclus dans ce dépôt. Il faut créer son propre fichier `.env` en local et ne jamais le committer.

## Pistes d'évolution

Le projet peut encore évoluer dans plusieurs directions :

- Rapports financiers plus détaillés
- Stratégies d'épargne encore plus personnalisées
- Notifications intelligentes
- Résumés financiers mensuels
- Interaction vocale
- Application mobile
- Intégration Open Banking
- Déploiement en production

## L'idée derrière le projet

Le but n'est pas d'ajouter un énième tableau de bord financier compliqué, mais de rendre la gestion de son argent plus accessible, en mettant la conversation au centre de l'expérience. Comprendre sa situation, se fixer des objectifs réalistes, et suivre sa progression, sans complexité inutile.

## Auteur

**Khadija Maaroufi**
Projet d'ingénierie IA — 2026
