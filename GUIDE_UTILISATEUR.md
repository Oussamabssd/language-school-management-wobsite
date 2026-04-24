# Guide d'Utilisation - Plateforme de Gestion d'École de Langues (EcoleLangues)

Bienvenue dans la documentation officielle de la plateforme **EcoleLangues**. Ce système complet de gestion scolaire est divisé en deux parties principales : un backend robuste en Laravel (API) et une interface utilisateur moderne en React (Frontend).

---

## 🚀 1. Lancement de la Plateforme

Pour utiliser l'application sur votre machine locale, vous devez lancer les deux serveurs en même temps (dans deux terminaux différents).

### Démarrer le Backend (API Laravel)
1. Ouvrez un terminal dans le dossier `backend`.
2. Assurez-vous que votre serveur de base de données MySQL (via XAMPP, Laragon, etc.) est démarré.
3. Exécutez la commande suivante :
   ```bash
   php artisan serve
   ```
   *L'API sera accessible sur `http://127.0.0.1:8000`.*

### Démarrer le Frontend (React/Vite)
1. Ouvrez un autre terminal dans le dossier `frontend`.
2. Exécutez la commande suivante :
   ```bash
   npm run dev
   ```
   *L'interface web sera accessible sur `http://localhost:5173`.*

---

## 🔑 2. Comptes de Démonstration (Identifiants de Test)

La base de données contient déjà des utilisateurs préconfigurés pour chaque rôle. **Le mot de passe pour tous les comptes de test est le même : `password`**.

Voici les comptes disponibles pour tester les différents tableaux de bord :

| Rôle | Email de connexion | Ce qu'il peut faire |
|------|--------------------|---------------------|
| **Administrateur** | `admin@ecole.com` | A un accès total au système. Gère les rôles, active/désactive les comptes, valide ou rejette les inscriptions des étudiants. |
| **Directeur** | `director@ecole.com` | Gère l'aspect académique : création des langues, niveaux, groupes, affectation des étudiants et création de l'emploi du temps. |
| **Enseignant** | `teacher1@ecole.com` | Gère ses propres cours, corrige les devoirs, saisit les notes des étudiants et marque les absences (présences). |
| **Comptable** | `accountant@ecole.com` | Gère toutes les transactions financières : frais de scolarité, salaires des professeurs, et génération des reçus de paiement. |
| **Étudiant** | `ahmed@student.com` | Consulte ses cours, ses notes, son emploi du temps, ses devoirs et les annonces de l'école. Il peut aussi s'inscrire à de nouveaux cours. |
| **Parent** | `parent@ecole.com` | Accède aux informations de ses enfants : suivi des absences, notes, et emploi du temps de l'enfant. |

---

## 🖥️ 3. Guide par Profil d'Utilisateur

### 🛠️ Espace Administrateur (`admin@ecole.com`)
* **Gestion des Utilisateurs :** Accédez à l'onglet "Users" pour voir tous les comptes. Vous pouvez assigner des rôles ou suspendre des comptes.
* **Inscriptions :** Dans "Registrations", vous verrez toutes les demandes d'inscription des nouveaux étudiants. Cliquez sur "Review" pour approuver ou rejeter une candidature.
* **Annonces Globales :** Utilisez le module "Announcements" pour publier des messages urgents ou informatifs à l'attention de tous les utilisateurs ou d'un groupe ciblé.

### 🏫 Espace Directeur (`director@ecole.com`)
* **Structure Académique :** Utilisez le menu pour configurer les `Langues` (ex: Anglais, Français), puis les `Niveaux` (A1, B2...).
* **Gestion des Groupes :** Créez des groupes d'élèves (ex: EN-A1-G1), définissez la capacité maximale, et assignez-y un professeur.
* **Emploi du Temps :** Utilisez le module "Timetable" pour planifier les heures de cours, les jours et les salles pour chaque groupe.

### 👨‍🏫 Espace Enseignant (`teacher1@ecole.com`)
* **Mes Cours :** La page d'accueil affiche les cours qui vous sont assignés pour la journée.
* **Gestion des Notes (Grades) :** Après un examen, sélectionnez le groupe concerné et saisissez les notes pour chaque étudiant.
* **Appel (Absences) :** Pendant ou après le cours, vous pouvez marquer les étudiants comme Présents, Absents ou En retard.

### 💰 Espace Comptable (`accountant@ecole.com`)
* **Suivi des Paiements :** L'onglet "Payments" liste toutes les transactions. Vous pouvez filtrer par statut (En attente, Payé, En retard).
* **Validation & Reçus :** Lorsqu'un étudiant paie en espèces ou par virement, vous pouvez marquer la transaction comme `paid` (payée), ce qui génère automatiquement un reçu PDF/Numérique.

### 🎓 Espace Étudiant (`ahmed@student.com`)
* **Tableau de Bord :** Dès la connexion, l'étudiant voit son prochain cours, ses dernières notes, et les devoirs à rendre.
* **S'inscrire à un nouveau cours :** L'étudiant peut utiliser le formulaire d'inscription pour demander à rejoindre une nouvelle langue ou un niveau supérieur (nécessite l'approbation de l'admin).

### 👪 Espace Parent (`parent@ecole.com`)
* **Suivi des enfants :** Sélectionnez l'enfant dans le menu déroulant (s'il y en a plusieurs) pour voir son profil scolaire.
* **Consultation :** Vous avez un accès en lecture seule à l'emploi du temps, aux retards/absences, et aux bulletins de notes.

---

## 📖 4. Documentation Technique de l'API (Swagger)

Pour les développeurs qui souhaitent intégrer d'autres applications (ex: application mobile) avec ce système, toute la documentation de l'API est générée automatiquement.

1. Assurez-vous que le serveur backend est en cours d'exécution.
2. Allez sur votre navigateur à l'adresse suivante : **[http://localhost:8000/api/documentation](http://localhost:8000/api/documentation)**
3. L'interface Swagger vous montrera l'intégralité des endpoints (routes) disponibles, les paramètres requis, et vous permettra même de tester les requêtes en direct !

> *Astuce : Pour tester les requêtes privées dans Swagger, connectez-vous avec `/api/auth/login`, copiez le token reçu, cliquez sur le bouton "Authorize" (cadenas vert) en haut de la page Swagger, et collez le token.*

---

## ❓ En cas de problème
- Si la base de données semble vide ou produit une erreur : exécutez `php artisan migrate:fresh --seed` dans le backend.
- Si le design (CSS) du frontend ne s'affiche pas : assurez-vous d'avoir exécuté `npm install` puis `npm run dev` dans le dossier frontend.
