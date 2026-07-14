# Fasoclassroom - Plateforme E-Learning SaaS Premium (HSE)

Fasoclassroom est une application web Single-Page (SPA) premium, progressive et certifiante, spécialisée dans les formations HSE (Hygiène, Sécurité, Environnement) au Burkina Faso. 

Elle est conçue avec une architecture capable de tourner localement (par double-clic sur le fichier `index.html`, protocole `file:///`) sans contraintes de sécurité CORS de navigateur, tout en offrant une expérience utilisateur (UX/UI) haut de gamme inspirée de standards comme OpenClassrooms.

---

## 1. Technologies Utilisées

*   **Structure** : HTML5 sémantique.
*   **Design & Style** : Vanilla CSS3 avec variables CSS personnalisées (thème sombre par défaut / thème clair supporté). Animations fluides, grilles CSS, flexbox et effets premium (verre dépoli, gradients).
*   **Logique Applicative** : JavaScript (ES6+ classique, sans modules pour contourner les blocages CORS locaux).
*   **Persistance & Backend** : Base de données relationnelle **Supabase** (PostgreSQL) pour l'authentification sécurisée des utilisateurs, le stockage en direct de la progression de cours et la persistance des certificats générés. Gestion de cache hybride via **localStorage** en cas d'absence de connexion internet (mode résilient offline).
*   **Compilation / Inlining** : Script PowerShell automatisé pour compiler les scripts JS séparés directement dans le fichier HTML final en UTF-8 propre.

---

## 2. Structure des Fichiers

```
fasoclassroom/
├── index.html            # Point d'entrée de la SPA (contient le balisage et les scripts inlinés)
├── GEMINI.md             # Ce document de documentation et de contexte
├── css/
│   └── style.css         # Système de design, thèmes, styles de pages et responsive
├── js/
│   ├── db.js             # Base de données des 4 formations HSE officielles, leçons, QCM et examens
│   ├── store.js          # Gestionnaire d'état (session, progression, paiement, certificats)
│   └── app.js            # Contrôleur applicatif, routage, validation de quiz et de paiement
└── assets/               # Images et couvertures thématiques générées par IA (Format HD)
    ├── course_air_cover.jpg       # Couverture qualité de l'air
    ├── course_noise_cover.jpg     # Couverture vibrations et bruit
    ├── course_safety_cover.jpg    # Couverture SST et sécurité incendie
    ├── course_env_cover.jpg       # Couverture évaluation d'impacts
    ├── hero_student.jpg           # Image principale d'étudiante pour le Hero
    ├── auth_anthony.jpg           # Portrait détouré d'Anthony pour la page de connexion
    └── testimonial_chloe.jpg      # Portrait de Chloé pour les témoignages de la Landing page
```

---

## 3. Fonctionnalités Implémentées par Module

### A. Landing Page Publique (Page d'accueil)
*   En-tête de navigation fluide avec logo de la marque.
*   Section Hero avec visuel d'illustration (`hero_student.jpg`).
*   Double carte d'aiguillage interactive pour les Étudiants et Employeurs.
*   Présentation du modèle pédagogique tripartite : "Savoir. Faire. Savoir-faire." (20% théorique, 80% pratique).
*   Section de témoignage étudiante animée avec le portrait de Chloé.
*   Pied de page structuré avec label B Corp et liens légaux.
*   **En-tête intelligent** : Si une session est active, le bouton *Connexion* devient un message de bienvenue personnalisé (`Bonjour, [Nom]`) avec un raccourci d'accès direct vers le tableau de bord (*Mon espace*).

### B. Authentification Split-Screen & Sécurisée (Supabase Auth)
*   **Double colonne** : Gauche blanche épurée (formulaire), Droite dégradée violet/bleu (charte Fasoweb) contenant le témoignage et le portrait d'Anthony.
*   **Correction de mise en page** : Utilisation d'un flex-layout vertical prévenant tout chevauchement du texte par l'image, et application de la règle `mix-blend-mode: multiply` sur l'image d'Anthony pour éliminer son fond blanc et la fondre de manière native sur l'arrière-plan orange.
*   **Formulaire interactif sécurisé en 3 étapes** : 
    1.  **Saisie d'e-mail** : L'élève saisit son e-mail. Une vérification asynchrone est faite en direct sur la base de profils.
    2.  **Connexion (compte existant)** : Si l'e-mail est déjà enregistré, le champ "Mot de passe" s'affiche pour réaliser une connexion sécurisée (`supabase.auth.signInWithPassword`).
    3.  **Inscription (nouveau compte)** : Si l'e-mail est absent, l'élève définit son nom complet, son rôle (Étudiant/Formateur) et définit un mot de passe (min. 6 caractères) pour créer son compte (`supabase.auth.signUp`).
*   **Routage conditionnel par rôle** :
    *   **Étudiant** : Masque le Back-office et redirige vers le Dashboard d'apprentissage.
    *   **Formateur** : Affiche l'onglet d'administration et redirige directement vers l'espace de suivi.

### C. Suivi de Dossier & Paiements (Afrique / Burkina Faso)
*   **Dossier d'inscription** à étapes (Profil -> Orientation -> Finalisation). Par défaut, l'étape finale est bloquée (dossier complété à 66%).
*   **Intégration d'un Checkout multicanal** (15 000 FCFA) :
    *   **Mobile Money** : Support complet d'**Orange Money** et **Moov Money**. Saisie du numéro à 8 chiffres de type (+226) avec simulation interactive de transaction push USSD (affichage des codes d'appel PIN `*144#` ou `*555#` en cas de délai).
    *   **Carte Bancaire** : Formulaire Visa / Mastercard avec simulation de validation 3D Secure.
    *   **Virement Bancaire** : Coordonnées bancaires locales (Coris Bank International BF) avec option de téléversement de preuve de paiement.
*   Une fois payé, le statut de l'utilisateur passe à `hasPaid: true` (sauvegardé en base PostgreSQL Supabase), le dossier d'inscription passe à `100%` (Dossier validé ✅) et débloque le parcours de formation officiel.

### D. Parcours d'Apprentissage & Anti-triche
*   **Lecteur de cours** interactif avec barre de navigation collante en bas de l'écran (*Sticky bottom player bar*) optimisée pour le mobile.
*   **QCM intermédiaires** de validation à la fin de chaque chapitre (seuil de réussite : 70%).
*   **Exercices pratiques bloquants** (Code Sandbox) : L'élève doit écrire un algorithme JavaScript correct et lancer les tests unitaires via console virtuelle pour débloquer la suite.
*   **Examen final sécurisé** :
    *   Plein écran forcé au démarrage.
    *   Surveillance active du focus (visibility & blur). L'examen est annulé après 3 tentatives de triche (sortie de l'onglet).

### E. Certifications Officielles
*   Génération automatique de diplômes PDF avec UUID de certificat unique et QR Code de validation.
*   Formulaire public de vérification des certificats intégré dans l'application.
*   Mise en page CSS print (`@media print`) ajustée pour l'impression physique au format A4 en un clic.

### F. Espace Formateur & Administration (Back-office Réel)
*   **Grille de statistiques horizontale** : Affichage responsive (cartes horizontales) du nombre total d'étudiants, de cours publiés et de certificats délivrés.
*   **Tableau de suivi des étudiants (Temps réel)** : Liste complète des apprenants inscrits avec leur taux de progression et un bouton d'affichage de profil détaillé (scores de QCM, statut du dossier). **Les données sont extraites en temps réel de Supabase**.
*   **Créateur de cours (Course Builder)** : Outil permettant de créer un nouveau cours en insérant des chapitres, des leçons et des questions d'examen final de manière dynamique. Le cours est immédiatement injecté dans le catalogue.

### G. Support Client WhatsApp
*   Bouton d'assistance flottant vert en bas à droite de l'écran avec effet de pulsation pour rediriger vers un support WhatsApp avec message pré-rempli.

### H. Intégration Backend Supabase
*   **Live DB Sync** : Les tables PostgreSQL `profiles`, `course_progress` et `certificates` sont utilisées pour stocker l'intégralité de l'état applicatif.
*   **Sécurité Row Level Security (RLS)** : 
    *   Les étudiants ne peuvent modifier que leurs propres données de profil et progression.
    *   Les formateurs ont accès en lecture à l'intégralité des profils étudiants pour le suivi pédagogique.

---

## 4. Choix de Design Techniques

1.  **Exécution sans serveur (CORS-free)** : Pour permettre aux utilisateurs de lancer l'application en cliquant simplement sur `index.html` depuis leur explorateur de fichiers, toutes les ressources JS internes sont regroupées. Nous évitons ainsi le blocage des modules JavaScript ES6 (`type="module"`) par le protocole `file:///`.
2.  **État résilient autogéré** : Les fonctions du store JS vérifient et initialisent automatiquement les structures de progression (`completedLessons`, etc.) s'il n'y a pas d'historique local. Cela évite les plantages JavaScript classiques liés aux valeurs nulles (`Cannot read properties of null`).

---

## 5. Instructions pour les Futurs Modèles d'IA

### A. Flux de modification du code
Le code JavaScript de l'application finale dans `index.html` est compilé. Pour effectuer des modifications de code pérennes :
1.  **Ne modifiez pas** directement les scripts à la fin de `index.html`.
2.  Modifiez les fichiers sources séparés :
    *   `js/db.js` pour la base de données de cours.
    *   `js/store.js` pour le gestionnaire d'état et le local storage.
    *   `js/app.js` pour les pages, le lecteur, le backoffice et la logique UI.
3.  Exécutez le script PowerShell de compilation situé dans les scripts temporaires ou recréez-le pour réinjecter le code propre dans `index.html`.

### B. Script de compilation recommandable (PowerShell)
```powershell
$htmlPath = "c:/Users/franc/fasoclassroom/index.html"
$dbPath = "c:/Users/franc/fasoclassroom/js/db.js"
$storePath = "c:/Users/franc/fasoclassroom/js/store.js"
$appPath = "c:/Users/franc/fasoclassroom/js/app.js"

$html = [System.IO.File]::ReadAllText($htmlPath, [System.Text.Encoding]::UTF8)
$dbContent = [System.IO.File]::ReadAllText($dbPath, [System.Text.Encoding]::UTF8)
$storeContent = [System.IO.File]::ReadAllText($storePath, [System.Text.Encoding]::UTF8)
$appContent = [System.IO.File]::ReadAllText($appPath, [System.Text.Encoding]::UTF8)

# Remplacement de l'ancien bloc script
$regex = "(?s)<!-- Main scripts loading.*?/script>\s*</body>"
$htmlMarkupOnly = [regex]::Replace($html, $regex, "</body>")

$finalInlined = "<!-- Main scripts loading (Inlined for CORS-free local execution) -->
    <script>
$dbContent
    </script>
    <script>
$storeContent
    </script>
    <script>
$appContent
    </script>
</body>"

$finalHtml = $htmlMarkupOnly.Replace("</body>", $finalInlined)
[System.IO.File]::WriteAllText($htmlPath, $finalHtml, (New-Object System.Text.UTF8Encoding $false))
Write-Host "Inlining UTF-8 completed successfully!"
```

### C. Sécurisation de l'Encodage (UTF-8)
Lors de l'écriture ou de l'inlining de fichiers sur un OS Windows local, faites attention aux corruptions d'encodage (émojis transformés en carrés noirs ou caractères étranges). Utilisez toujours la classe `System.IO.File` avec l'encodage UTF-8 explicite en PowerShell et vérifiez l'intégrité des caractères des pages à chaque étape.
