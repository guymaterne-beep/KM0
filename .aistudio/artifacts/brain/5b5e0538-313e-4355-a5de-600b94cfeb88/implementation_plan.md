# Restauration de la Charte Bleu KM0 (Suppression Totale de l'Orange)

Rétablissement strict de l'identité visuelle officielle KM0 : suppression intégrale des tons orange sur l'ensemble des boutons, textes, badges et éléments interactifs, pour réappliquer le bleu marine officiel (`#1e2f47`) et les nuances bleu royal, tout en préservant le drapeau belge tricolore sous le logo, la vidéo intégrée, les sorties sans jauge restrictive et le profil altimétrique précis.

> [!IMPORTANT]
> **Décision confirmée par l'utilisateur** : Aucun élément orange ne doit subsister sur le site ou dans le panneau d'administration. Tous les textes, boutons, badges, icônes d'action et états actifs repassent en bleu marine KM0 (`#1e2f47` / `bg-[#1e2f47]` hover `bg-[#152336]`) et bleu royal (`text-blue-600`, `bg-blue-600`). Le drapeau belge (noir, jaune, rouge) sous le logo KM0 est rigoureusement maintenu tel quel.

---

## 1. Vue d'Ensemble & Objectifs

- **Problème résolu** : L'introduction des couleurs oranges était en désaccord avec la charte graphique officielle du club KM0.
- **Résultat attendu** : Une application moderne, élégante et professionnelle fidèle à la marque KM0 (bleu marine profond `#1e2f47`, blanc pur, gris technique ardoise, accents bleu royal).
- **Fonctionnalités préservées** :
  - **Logo KM0 officiel** avec le drapeau belge stylisé (noir / jaune / rouge) sous la signature.
  - **Vidéo officielle** stratégiquement positionnée en section Hero.
  - **Sorties ouvertes sans limite de places** : affichage du nombre réel d'inscrits (`X inscrit(s)`) au lieu d'un décompte anxiogène de places restantes.
  - **Tarifs clairs** : Gratuit (0 €) pour les adhérents du club, 3 € par sortie pour les non-adhérents.
  - **Profil altimétrique précis à 100 points** avec calcul respectueux du dénivelé réel et conservation de la valeur D+ saisie manuellement si souhaitée.
  - **Gestion de galerie photos** dans l'administration pour les sorties et voyages avec visualisation publique.

---

## 2. Expérience Utilisateur & Charte Graphique Rétablie

### Palette de Couleurs KM0 Officielle (60-30-10)

```
┌────────────────────────────────────────────────────────────────────────┐
│  60% Fond & Toile Neutre      : Blanc pur (#FFFFFF) / Gris très doux   │
│  30% Surfaces & Typographie   : Bleu marine nuit KM0 (#1e2f47) / Slate │
│  10% Accents & Actions Clés   : Bleu Royal vif (#2563EB) & Marine      │
│  Signature Exceptionnelle     : Drapeau Belge (⬛ Noir / 🟨 Jaune / 🟥) │
└────────────────────────────────────────────────────────────────────────┘
```

- **Boutons principaux (CTA)** :
  - `bg-[#1e2f47] hover:bg-[#152336] text-white font-bold transition-all`
  - Boutons secondaires : `border border-[#1e2f47]/20 text-[#1e2f47] hover:bg-blue-50`
- **Titres et textes d'accentuation** :
  - Remplacement de tous les `text-orange-500` et `text-orange-600` par `text-[#1e2f47]` ou `text-blue-600` / `text-blue-700`.
- **Badges et pilules d'information** :
  - Remplacement des `bg-orange-50 text-orange-600 border-orange-200` par `bg-blue-50 text-blue-900 border-blue-200` ou fond neutre avec séparateurs typographiques discrets.
- **Graphique altimétrique & survol** :
  - Courbe altimétrique en dégradé bleu marine / bleu ciel (`#1e2f47` vers `rgba(30, 47, 71, 0.1)`), curseur de survol bleu royal (`#2563eb`).
- **Paiements & Réservations** :
  - Modale de checkout (Stripe / Apple Pay / Carte) en bleu marine & bleu de marque (plus aucun orange dans les états sélectionnés ou boutons de validation).

---

## 3. Plan d'Exécution par Composant

### A. Navigation & En-tête
- Vérifier `src/components/Navbar.tsx` et `src/components/Hero.tsx` :
  - Garder le logo KM0 avec le drapeau belge sous le logo.
  - Remplacer tout accent orange résiduel par `#1e2f47` ou bleu royal.

### B. Sorties, Calendrier & Modales de Sortie
- `src/components/RideCalendar.tsx` & `src/components/UpcomingRides.tsx` :
  - Boutons de filtre, badges de dénivelé, icône d'inscrits et liens "Voir la sortie" : basculer vers `text-[#1e2f47]`, `text-blue-600` et `bg-[#1e2f47]`.
- `src/components/RideDetailModal.tsx` & `src/components/RideModal.tsx` :
  - Badge de tarif (0 € membres / 3 € non-membres), boutons d'inscription, boutons GPX et graphique d'altitude : conversion totale au bleu KM0.

### C. Niveaux, Quiz & Adhésions
- `src/components/LevelMatrix.tsx` & `src/components/LevelQuizModal.tsx` :
  - Bouton du quiz ("Trouver mon groupe"), onglets actifs (Découverte, Régulier, Performance), puces de sélection : basculer de l'orange au bleu `#1e2f47`.
- `src/components/ClubMembership.tsx` & `src/components/MembershipModal.tsx` :
  - Cartes de cotisation (Découverte, Passionné, Compétition), boutons "Adhérer" : `bg-[#1e2f47] hover:bg-[#152336] text-white`.

### D. Voyages & Expéditions
- `src/components/TripsSection.tsx` & `src/components/TripDetailModal.tsx` :
  - Filtres d'onglets, étiquettes de tarif, puces de points forts, boutons de réservation et d'accès galerie : du bleu marine élégant.

### E. Espace Membre & Administration
- `src/components/member/MemberPortal.tsx` & `MemberLoginModal.tsx` :
  - Onglets, badge statut, boutons de téléchargement de licence et GPX : bleu marine.
- `src/components/admin/AdminDashboard.tsx`, `RideFormModal.tsx`, `TripFormModal.tsx`, `PhotoGalleryManager.tsx`, `RideAttendeesModal.tsx`, `GpxUploadField.tsx`, `EmailComposerModal.tsx` :
  - Nettoyer les 100% des classes `orange-*` restantes pour uniformiser l'espace administrateur avec la charte bleu KM0.

---

## 4. Architecture & Flux

```
┌────────────────────────────────────────────────────────┐
│                   Charte Graphique KM0                 │
│                 Logo Officiel + Drapeau 🇧🇪             │
├────────────────────────────────────────────────────────┤
│                       Navigation                       │
│      [Logo KM0] ── [Sorties] [Voyages] [Adhésion]      │
│               [Espace Membre] [Admin]                  │
├────────────────────────────────────────────────────────┤
│                      Section Hero                      │
│     Vidéo intégrée KM0 + Boutons Actions Bleu Marine    │
│            bg-[#1e2f47] hover:bg-[#152336]             │
├────────────────────────────────────────────────────────┤
│               Sorties & Calendrier KM0                 │
│  - Sans limite restrictive (affiche "X inscrit(s)")    │
│  - Tarif : 0 € Membres / 3 € Non-membres               │
│  - Profil Altimétrique GPX 100-pts en nuance Bleu      │
├────────────────────────────────────────────────────────┤
│                   Espace Admin & Galerie               │
│  - Upload GPX + Téléchargement                         │
│  - Dénivelé D+ manuel / calculé                        │
│  - Liste privée des inscrits aux sorties               │
│  - Gestionnaire de photos sorties & voyages            │
│  - Thème unifié 100% Bleu KM0                          │
└────────────────────────────────────────────────────────┘
```

---

## 5. Vérification & Contrôle Qualité

1. **Recherche automatisée** : Exécution d'un scan complet pour garantir 0 occurrence de `orange-` dans l'arborescence `src/` (hors éventuels codes couleurs du drapeau belge).
2. **Validation TypeScript** : Contrôle via `lint_applet` (`tsc --noEmit`) pour valider l'absence d'erreurs de typage.
3. **Compilation & Build** : Exécution de `compile_applet` pour confirmer un build de production sans faille.
4. **Vérification du Serveur Dev** : Contrôle du serveur sur le port 3000.
