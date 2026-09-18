#  BIBLIO — Application de Gestion de Bibliothèque

> Projet pratique — Akieni Academy, Cohorte 2, Semaines 14 & 15
> Application web de gestion d'une bibliothèque de quartier : livres, auteurs, adhérents et emprunts.

---

##  Table des matières

- [Contexte du projet]
- [Fonctionnalités]
- [Architecture technique]
- [Modèle de données]
- [Installation]
- [Utilisation]
- [API Endpoints]
- [Structure du projet]
- [Technologies utilisées]
- [Auteur]

---

## Contexte du projet

Une bibliothèque de quartier souhaite informatiser la gestion de ses livres, adhérents et emprunts. Ce projet couvre la conception et la réalisation complète de l'application : de la base de données jusqu'à l'interface utilisateur.


##  Fonctionnalités

###  Gestion des livres
- Consulter la liste des livres (avec nom de l'auteur associé)
- Ajouter, modifier, supprimer un livre (titre, auteur, année de publication)
- Statut de disponibilité (disponible / emprunté)
- Recherche par titre ou auteur
- Pagination des résultats

###  Gestion des auteurs
- Consulter la liste des auteurs enregistrés
- Ajouter, modifier, supprimer un auteur (nom, nationalité)

###  Gestion des adhérents
- Consulter la liste des adhérents (nom, contact)
- Ajouter, modifier, supprimer un adhérent
- Consulter l'historique des emprunts d'un adhérent

###  Gestion des emprunts
- Enregistrer un emprunt (adhérent, livre, date de retour prévue)
- Vérification automatique de la disponibilité du livre
- Enregistrer le retour d'un livre
- Détection automatique des retards
- Filtrage par statut (en cours, en retard, rendu)

###  Statistiques & Tableau de bord
- Nombre total de livres, adhérents, emprunts en cours, emprunts en retard
- Livre le plus emprunté
- Adhérent le plus actif

###  Authentification (démo statique)
- Page d'accueil publique avec image de bibliothèque
- Connexion avec identifiants en dur (`admin` / `admin1234`)
- Bouton "Inscription" grisé (non fonctionnel pour la démo)


##  Architecture technique

L'application suit une architecture **MVC** (Model - View - Controller) avec un **mono-serveur Express** qui sert à la fois l'API REST et le frontend statique.

### Séparation des responsabilités

| Couche | Rôle | Dossier |
| :--- | :--- | :--- |
| **Routes** | Définition des URLs | `/backend/routes` |
| **Controllers** | Logique HTTP (`req`, `res`) | `/backend/controllers` |
| **Models** | Requêtes SQL | `/backend/models` |
| **Middlewares** | Logger, validation, erreurs | `/backend/middlewares` |
| **Frontend** | Interface utilisateur | `/frontend` |

---

## Modèle de données

![Diagramme ER](backend/database/schema.png)

### Tables

#### `auteurs`
| Colonne | Type | Contrainte |
| :--- | :--- | :--- |
| `id_auteur` | SERIAL | PRIMARY KEY |
| `nom` | VARCHAR(150) | NOT NULL |
| `nationalite` | VARCHAR(100) | |

#### `livres`
| Colonne | Type | Contrainte |
| :--- | :--- | :--- |
| `id_livre` | SERIAL | PRIMARY KEY |
| `id_auteur` | INTEGER | FK → auteurs (ON DELETE CASCADE) |
| `titre` | VARCHAR(150) | NOT NULL |
| `date_publication` | INTEGER | |
| `statut` | VARCHAR(20) | DEFAULT 'disponible', CHECK IN ('disponible', 'emprunte') |

#### `adherents`
| Colonne | Type | Contrainte |
| :--- | :--- | :--- |
| `id_adherent` | SERIAL | PRIMARY KEY |
| `nom_adherent` | VARCHAR(150) | NOT NULL |
| `contact` | VARCHAR(100) | NOT NULL |

#### `emprunts`
| Colonne | Type | Contrainte |
| :--- | :--- | :--- |
| `id_emprunt` | SERIAL | PRIMARY KEY |
| `id_livre` | INTEGER | FK → livres |
| `id_adherent` | INTEGER | FK → adherents |
| `date_emprunt` | DATE | DEFAULT CURRENT_DATE |
| `date_retour_prevue` | DATE | NOT NULL |
| `date_retour_reelle` | DATE | |
| `statut` | VARCHAR(20) | CHECK IN ('en_cours', 'rendu', 'retard') |

### Relations
- **Un auteur** peut avoir **plusieurs livres** (1..N)
- **Un livre** peut être emprunté **plusieurs fois** (1..N)
- **Un adhérent** peut faire **plusieurs emprunts** (1..N)

---

## 🚀 Installation

### Prérequis

- **Node.js** v18+ ([télécharger](https://nodejs.org/))
- **PostgreSQL** v14+ ([télécharger](https://www.postgresql.org/download/))
- **Git** ([télécharger](https://git-scm.com/))

### 1. Cloner le dépôt

```bash
git clone https://github.com/dubien321/bibliotheque.git
cd bibliotheque