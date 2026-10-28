# Plan d'Implémentation : Paiements Multi-Méthodes (Stripe, Virement, Bancontact), Sécurisation par Mot de Passe & Espace Membre

Ce plan détaille la mise en place d'un système complet d'encaissement et d'authentification pour **Projet KM0 Belgique**, permettant aux adhérents de payer par carte bancaire/Apple Pay (Stripe), par virement bancaire sans frais avec communication structurée, ou par Bancontact, tout en créant un compte protégé par mot de passe avec un **Espace Membre personnel**.

---

## 1. Architecture Système & Flux de Données

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          PROJET KM0 BELGIQUE                                │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
            ┌──────────────────────────┴──────────────────────────┐
            ▼                                                     ▼
 ┌──────────────────────────────────────┐  ┌───────────────────────────────────┐
 │   Tunnel d'Adhésion / Réservation    │  │     Portail "Espace Membre"       │
 ├──────────────────────────────────────┤  ├───────────────────────────────────┤
 │ 1. Infos cycliste & taille maillot   │  │ • Connexion par Email + Password  │
 │ 2. Création Mot de Passe Sécurisé    │  │ • Carte de Membre Digitale        │
 │ 3. Choix du Mode de Règlement :      │  │ • Mes Sorties & Traces GPX        │
 │    • Carte / Apple Pay via Stripe    │  │ • Mes Voyages & Réservations      │
 │    • Virement bancaire belge (IBAN)  │  │ • Reçus de paiement téléchargeables│
 │    • Bancontact / Payconiq QR        │  │ • Gestion du profil & coordonnées │
 └──────────────────┬───────────────────┘  └─────────────────▲─────────────────┘
                    │                                        │
                    ▼                                        │
 ┌───────────────────────────────────────────────────────────┴─────────────────┐
 │               Moteur de Paiement & Auth (AppContext)                        │
 │  • Enregistrement du mot de passe utilisateur                               │
 │  • Génération du reçu et de l'ID de transaction (ch_... ou Comm. Structurée)│
 │  • Synchronisation automatique avec l'Espace Membre & le Back-Office        │
 └──────────────────────────────────┬──────────────────────────────────────────┘
                                    │
                                    ▼
 ┌─────────────────────────────────────────────────────────────────────────────┐
 │                Back-Office Administrateur (Guy Materne)                     │
 │  • Configuration des clés Stripe (Mode Test / Live)                         │
 │  • Paramétrage IBAN / BIC pour virements bancaires                          │
 │  • Journal des transactions avec validation en 1 clic des virements         │
 │  • Gestion des accès membres et réinitialisation de mot de passe            │
 └─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Charte Visuelle & Expérience Utilisateur (Light Outdoor UI)

- **Palette de Couleurs** :
  - Écrans de paiement : fond épuré `bg-white`, bordures fines `border-stone-200`, sélecteur d'onglets pour le mode de paiement avec focus en ambre doré `border-amber-400 bg-amber-50/30`.
  - Boutons de paiement :
    - *Bouton Apple Pay / Google Pay* : contraste élégant noir profond `bg-black text-white`.
    - *Bouton Carte Bancaire* : ambre chaleureux `bg-amber-400 text-stone-950 font-bold`.
    - *Encadré Virement* : fond ivoire `bg-stone-50` avec communication structurée en police monospace `font-mono text-base font-bold text-amber-900`.
    - *Bancontact / Payconiq* : logo distinctif et QR code dynamique prêt à scanner.
- **Portail Membre** :
  - Disposition carte avec badge de cotisation active, compteur de sorties à venir et récapitulatif des paiements avec statut vert *« Payé »* ou ambre *« Virement en cours »*.

---

## 3. Spécifications Détaillées des Fonctionnalités

### A. Création de Compte & Mot de Passe Sécurisé
1. **Étape d'enregistrement du mot de passe** :
   - Ajout d'un champ **« Mot de passe »** (avec confirmation et bouton afficher/masquer) dans :
     - Le modal d'adhésion au Club (`MembershipModal.tsx`)
     - Le modal d'inscription aux sorties (`RideDetailModal.tsx`)
     - Le modal de réservation de voyages (`TripDetailModal.tsx`)
   - Critères de sécurité minimaux (au moins 6 caractères avec indicateur de force).
2. **Authentification & Session Membre** :
   - Nouveau modal de connexion **« Connexion Membre »** (`MemberLoginModal.tsx`) accessible via la barre de navigation.
   - Les membres peuvent se connecter avec leur email et le mot de passe défini lors de leur inscription.
   - Session mémorisée dans `localStorage` pour ne pas avoir à se reconnecter à chaque rechargement.

### B. Espace Membre Personnel (`MemberPortal.tsx`)
1. **Vue Vue d'ensemble du cycliste** :
   - Carte de membre digitale KM0 Belgique avec nom, prénom, numéro d'adhérent unique, photo/avatar, rôle et taille de maillot.
   - Statut de la cotisation et date d'échéance.
2. **Mes Sorties Club & GPX** :
   - Liste des prochaines sorties auxquelles le cycliste est inscrit.
   - Bouton d'accès direct au téléchargement de la trace GPX et consignes de ralliement.
3. **Mes Reçus & Historique de Paiement** :
   - Tableau récapitulatif des paiements : date, montant en €, prestation (adhésion, stage, rando), mode de règlement (Stripe, Virement, Bancontact) et statut.
   - Bouton de visualisation et téléchargement du reçu d'encaissement officiel.
4. **Paramètres du Compte** :
   - Modification de l'adresse, téléphone, taille de maillot, pratique favorite et abonnement à la newsletter.

### C. Module de Paiement Multi-Méthodes
1. **Option 1 : Stripe (Carte Bancaire & Apple Pay / Google Pay)** :
   - Saisie sécurisée de la carte (Numéro, Date expiration, CVC, Nom du porteur).
   - Bouton Apple Pay / Google Pay en 1 clic pour les appareils compatibles.
   - Prise en charge des clés Stripe configurées par Guy Materne dans le back-office (`pk_test_...` ou `pk_live_...`).
   - Confirmation instantanée avec génération d'un numéro de transaction Stripe `ch_3M...` et passage immédiat du statut en *« Confirmé & Payé »*.
2. **Option 2 : Virement Bancaire Belge (100% Gratuit / Sans commissions)** :
   - Affichage immédiat des coordonnées bancaires du club :
     - Titulaire : *Projet KM0 Belgique (Guy Materne)*
     - IBAN : *BE76 0012 3456 7890*
     - BIC : *GEBABEBB*
     - Communication structurée normalisée belge : ex. `+++045/8921/34512+++` calculée avec algorithme modulo 97.
   - Boutons de copie rapide en 1 clic de l'IBAN et de la communication.
   - Statut initial : *« En attente de virement bancaire »*.
3. **Option 3 : Bancontact / Payconiq** :
   - Simulation du paiement mobile Bancontact avec QR code scannable et redirection instantanée de confirmation.

### D. Gestion des Paiements dans le Back-Office (`AdminDashboard.tsx`)
1. **Nouvel onglet « Paiements & Stripe »** :
   - **Configuration Stripe** : champ pour saisir et enregistrer la clé publique Stripe (`pk_...`), la clé secrète (`sk_...`), et basculer entre le mode Test (démo) et Production (réel).
   - **Configuration Bancaire** : modification de l'IBAN, du BIC et du nom du titulaire affichés aux clients.
   - **Tableau des Transactions** : journal complet de tous les règlements reçus (Montant, Client, Prestation, Mode, Date, ID de transaction, Statut).
   - **Bouton « Valider le virement »** : permet à Guy Materne, dès réception des fonds sur le compte bancaire, de valider la transaction et d'activer l'adhésion du membre.
   - Export comptable des transactions au format CSV.

---

## 4. Déroulement de l'Implémentation

1. **Étape 1 : Données & AppContext**
   - Étendre le modèle `ClubMember` pour inclure le mot de passe (`passwordHash`) et l'historique des paiements.
   - Créer le modèle `PaymentTransaction` (id, amount, date, method, status, details, reference).
   - Ajouter les paramètres Stripe et bancaires dans `AppContext.tsx` avec persistance `localStorage`.
   - Créer les fonctions de gestion : `registerWithPayment()`, `loginMember()`, `logoutMember()`, `updateStripeConfig()`, `confirmWirePayment()`.

2. **Étape 2 : Composant de Paiement (`PaymentCheckoutModal.tsx`)**
   - Créer le modal interactif de paiement avec onglets : *Stripe Carte / Apple Pay*, *Virement Bancaire (IBAN)*, *Bancontact*.
   - Intégrer les calculs de communication structurée belge et la validation de formulaire.

3. **Étape 3 : Création de Compte & Mot de Passe**
   - Ajouter les champs de mot de passe sécurisé dans `MembershipModal.tsx`, `RideDetailModal.tsx` et `TripDetailModal.tsx`.
   - Rediriger automatiquement vers l'étape de paiement après la validation du profil.

4. **Étape 4 : Portail Espace Membre (`MemberPortal.tsx` & `MemberLoginModal.tsx`)**
   - Développer l'interface personnelle du cycliste (carte membre digitale, sorties réservées, traces GPX, reçus de paiement et profil).
   - Ajouter le bouton d'accès dans `Navbar.tsx` (*« Mon Espace Membre »* avec avatar / nom).

5. **Étape 5 : Onglet Paiements dans le Back-Office**
   - Ajouter l'onglet **« Paiements & Stripe »** dans `AdminDashboard.tsx` avec les formulaires de clés d'API et le suivi des virements à valider.

6. **Étape 6 : Tests & Validation**
   - Vérification de la création de compte avec mot de passe.
   - Test du paiement Stripe par carte et Apple Pay.
   - Test du virement bancaire et validation dans le back-office.
   - Validation de la connexion à l'Espace Membre.
   - Exécution de `compile_applet` et `lint_applet`.

---

## 5. Critères de Validation
- L'adhérent peut choisir entre Stripe (Carte/Apple Pay), Virement bancaire ou Bancontact.
- Un mot de passe est obligatoire à l'inscription pour sécuriser son compte.
- L'adhérent peut se connecter à son Espace Membre personnel pour retrouver son adhésion, ses sorties, ses traces GPX et ses reçus.
- Guy Materne peut configurer ses clés Stripe et son IBAN dans le back-office et valider les virements reçus.
