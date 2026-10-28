# Plan d'Implémentation : Gestion des Membres, Rôles, Mailing List & Abonnements Dynamiques

Ce plan détaille l'enrichissement du Back-Office de **Projet KM0 Belgique** pour permettre à Guy Materne (administrateur référent) de gérer en totale autonomie l'ensemble de la communauté de cyclistes, leurs droits d'accès, la communication par email, ainsi que la tarification et les formules d'adhésion du club.

---

## 1. Architecture Système & Flux de Données

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       PROJET KM0 BELGIQUE - BACK-OFFICE                      │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
            ┌──────────────────────────┼──────────────────────────┐
            ▼                          ▼                          ▼
 ┌──────────────────────┐   ┌──────────────────────┐   ┌──────────────────────┐
 │ Gestion Utilisateurs │   │    Mailing List      │   │   Abonnements &      │
 │       & Membres      │   │   & Communications   │   │     Tarifs Club      │
 ├──────────────────────┤   ├──────────────────────┤   ├──────────────────────┤
 │ • Profils cyclistes  │   │ • Abonnés newsletter │   │ • Création formules  │
 │ • Rôles & droits :   │   │ • Filtres segments   │   │ • Édition des prix € │
 │   - Administrateur   │   │ • Export CSV         │   │ • Liste d'avantages  │
 │   - Capitaine Route  │   │ • Compositeur emails │   │ • Formule en vedette │
 │   - Membre Adhérent  │   │   avec prévisualis.  │   │ • Activation/pause   │
 │ • Statut cotisation  │   │ • Journal des envois │   │ • Sync site public   │
 └──────────┬───────────┘   └──────────┬───────────┘   └──────────┬───────────┘
            │                          │                          │
            └──────────────────────────┼──────────────────────────┘
                                       │
                                       ▼
 ┌────────────────────────────────────────────────────────────────────────────┐
 │                      AppContext & Persistance LocalStorage                 │
 │   (km0_be_members_v2, km0_be_mailing_v2, km0_be_tiers_v2, km0_be_rides_v2) │
 └─────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
 ┌────────────────────────────────────────────────────────────────────────────┐
 │                       Site Public & Expérience Membres                     │
 │  • Grille des tarifs mise à jour en direct (#adhesion)                     │
 │  • Modal d'inscription reflétant les formules & prix modifiés              │
 │  • Capitaines de route mis en avant sur les sorties encadrées              │
 └────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Charte Visuelle & Spécifications Interface (Light SaaS)

- **Palette de Couleurs** :
  - Fond général : `bg-stone-50` et `bg-stone-100` pour un confort visuel optimal.
  - Cartes et panneaux : `bg-white` avec bordures subtiles `border-stone-200` et ombres douces `shadow-xs`.
  - Badges de rôles :
    - *Administrateur* : `bg-purple-100 text-purple-800 border-purple-200`
    - *Capitaine de route* : `bg-amber-100 text-amber-900 border-amber-300`
    - *Membre adhérent* : `bg-emerald-100 text-emerald-800 border-emerald-200`
  - Statuts d'adhésion : Vert (À jour), Jaune (À renouveler), Rouge (Expiré / Inactif).
- **Typographie** :
  - Titres et repères : `Barlow Condensed` en capitales sportives.
  - Textes d'interface : `Plus Jakarta Sans` 12px–14px pour une lisibilité dense et aérée.
  - Chiffres et montants financiers : `JetBrains Mono` / `tabular-nums` pour un alignement précis.

---

## 3. Périmètre Fonctionnel Détaillé

### A. Gestion des Utilisateurs & Attribution des Rôles
1. **Modèle de données Membre / Utilisateur** :
   - Identifiant, Nom, Prénom, Email, Téléphone, Ville, Code Postal, Taille maillot.
   - **Rôle attribué** :
     - `admin` (Administrateur complet : accès back-office, modification tarifs, suppression, broadcast emails).
     - `captain` (Capitaine de route : peut animer des sorties, être assigné guide, voir la liste des participants de son ride).
     - `member` (Membre adhérent : consultation de la communauté, sorties club, remises voyages).
   - **Statut de cotisation** : Actif, En attente, Expiré.
   - **Date d'adhésion & date d'échéance**.
   - **Statut Mailing List** : Abonné / Désabonné.
2. **Interface d'administration des membres** :
   - Recherche en direct par nom, ville ou email.
   - Filtrage par rôle et par statut de cotisation.
   - Bouton d'action rapide : **Changer de rôle** (Admin / Capitaine / Membre) en un clic.
   - Modal d'édition complète du profil membre.
   - Formulaire d'ajout d'un nouveau membre manuel.

### B. Module Mailing List & Compositeur d'Emails
1. **Gestion des abonnés** :
   - Liste consolidée des membres du club + contacts inscrits via le formulaire de contact ou les réservations.
   - Taux d'inscription à la mailing list.
   - Toggle d'inscription / désinscription en direct.
   - Bouton **« Exporter la Mailing List en CSV »**.
2. **Compositeur de Broadcast / Newsletter** :
   - Sélection du segment cible : *Tous les abonnés*, *Membres actifs uniquement*, *Capitaines de route uniquement*, ou *Participants VTT Hiver*.
   - Objet de l'email, type d'annonce (Sortie spéciale, Météo du week-end, Nouveau stage, Rappel cotisation).
   - Zone de rédaction avec balises personnalisées (`{{prenom}}`, `{{nom}}`, `{{sortie}}`).
   - Prévisualisation instantanée du rendu email aux couleurs de Projet KM0 Belgique.
   - Simulation d'envoi avec enregistrement dans l'historique des envois récents.

### C. Moteur d'Abonnements & Tarification Dynamique
1. **Modèle de données dynamique des Abonnements** :
   - Identifiant, Nom de la formule, Prix par an (€), Période, Badge promo, Description, Liste des avantages (puces configurables), Statut (Actif / Inactif), Formule recommandée (oui/non).
2. **Gestion en Back-Office** :
   - Onglet dédié **« Tarifs & Adhésions »**.
   - **Création libre** d'une nouvelle formule d'adhésion (ex : *Pack Étudiant / Moins de 25 ans*, *Adhésion Couple*, *Pack Hiver VTT Seul*).
   - **Modification des tarifs existants** (ex : ajuster la cotisation annuelle de 160€ à 150€ ou 175€).
   - Ajout / retrait d'avantages inclus (maillot offert, réductions voyages, assurance).
   - Sélection de la formule "Recommandée" mise en avant.
3. **Synchronisation avec le Site Public** :
   - La section `#adhesion` du site public lit directement les formules depuis le store dynamique.
   - Le modal d'inscription client (`MembershipModal`) propose instantanément les formules et tarifs à jour.

---

## 4. Déroulement de l'Implémentation

- **Étape 1** : Étendre `AppContext.tsx` avec les types, le store persistant `members`, `mailingList`, `membershipTiers` dynamiques et leurs méthodes CRUD.
- **Étape 2** : Créer les sous-composants d'administration :
  - `MemberFormModal.tsx` : Ajout / édition d'un membre et attribution de rôle.
  - `EmailComposerModal.tsx` : Rédaction et envoi ciblé de newsletter.
  - `TierFormModal.tsx` : Création et modification de formule d'adhésion / tarif.
- **Étape 3** : Enrichir `AdminDashboard.tsx` avec les 2 nouveaux onglets principaux :
  - *Membres & Rôles* (avec vue tableau, filtres, badges et boutons d'action rapide).
  - *Mailing List & Newsletters* (avec métriques, filtre de segment, compositeur et export).
  - *Tarifs & Abonnements* (avec cartes d'édition, toggle actif, mise à jour des prix en direct).
- **Étape 4** : Mettre à jour `ClubMembership.tsx` et `MembershipModal.tsx` pour consommer les formules éditables depuis `useApp()`.
- **Étape 5** : Vérification complète de la compilation TypeScript et des flux utilisateurs.

---

## 5. Critères de Validation
- L'administrateur peut promouvoir un membre en "Capitaine de route" ou "Administrateur" et changer son statut en direct.
- L'administrateur peut exporter la liste des membres abonnés en CSV.
- L'administrateur peut rédiger une communication et voir le journal des envois.
- Toute modification de tarif dans le back-office se reflète immédiatement sur la page d'accueil publique.
- La persistance dans `localStorage` garantit la conservation des données après rafraîchissement de la page.
