# M-SANTÉ HARMONIE — Chatbot WhatsApp

Chatbot de santé sexuelle, reproductive et mentale pour les jeunes de Kinshasa (15-30 ans), porté par le Dr Joel Matungulu (médecin généraliste, Hôpital Militaire Central Kokolo).

> *"Le compagnon numérique des ménages pour une santé globale, digne et éclairée."*

---

## 📋 Pour bien démarrer — lire dans cet ordre

1. **`MSH_Specifications_Techniques.docx`** (document séparé fourni par le porteur du projet) — explique le PRINCIPE DE CONCEPTION du chatbot (pourquoi certains modules ont un "cadrage préalable" et d'autres non). À lire avant de toucher au code.
2. **Ce README** — installation et architecture du code
3. **`src/content.js`** — tout le texte conversationnel, le plus important à comprendre

---

## 🏗️ Architecture

```
msh_bot/
├── src/
│   ├── server.js              ← Point d'entrée. Webhook WhatsApp.
│   ├── conversationEngine.js  ← Logique : quel noeud afficher au prochain message ?
│   ├── content.js             ← TOUT le texte des 6 modules (à éditer pour changer le contenu)
│   ├── emergencyDetection.js  ← Liste des mots-clés d'urgence + détection
│   ├── whatsappClient.js      ← Envoi des messages vers l'API WhatsApp
│   └── database.js            ← Stockage SQLite anonymisé (sessions + stats)
├── data/                      ← Fichier SQLite généré automatiquement (ne pas committer)
├── .env.example                ← Modèle des variables d'environnement
├── package.json
└── README.md                   ← Ce fichier
```

### Comment une conversation circule dans le code

```
Message WhatsApp entrant
        ↓
server.js (webhook POST /webhook)
        ↓
conversationEngine.js → processMessage()
        ↓
   1. emergencyDetection.js : mot-clé d'urgence détecté ?
      → OUI : on bascule direct vers le noeud d'urgence
      → NON : on continue
   2. L'utilisateur a cliqué un bouton ?
      → on suit le "next" défini dans content.js
   3. Sinon (texte libre attendu, ex: Module 6) → noeud suivant
        ↓
database.js : on enregistre l'interaction (anonymisée) et on
              met à jour la session
        ↓
conversationEngine.js → buildOutgoingMessage()
   (résout le texte si le noeud est conditionnel — Module 6)
        ↓
whatsappClient.js : envoi du message + boutons vers WhatsApp
```

---

## 🚀 Installation

### 1. Prérequis

- Node.js 18 ou supérieur
- Un compte WhatsApp Business API actif (via Meta directement, ou un BSP comme 360dialog ou Twilio)

### 2. Installation des dépendances

```bash
npm install
```

### 3. Configuration

```bash
cp .env.example .env
```

Remplir le fichier `.env` avec :
- `WHATSAPP_TOKEN` et `WHATSAPP_PHONE_ID` — récupérés dans le tableau de bord Meta for Developers
- `WEBHOOK_VERIFY_TOKEN` — une valeur que vous choisissez vous-même
- `HASH_SALT` — générer avec : `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### 4. Lancer en local (pour tester avant déploiement)

```bash
npm start
```

Le serveur démarre sur `http://localhost:3000`. Pour que Meta puisse l'appeler en développement, utiliser [ngrok](https://ngrok.com/) :

```bash
ngrok http 3000
```

Utiliser l'URL HTTPS fournie par ngrok (ex: `https://abc123.ngrok.io/webhook`) comme URL de webhook dans le tableau de bord Meta.

### 5. Déploiement en production

Recommandé : [Render](https://render.com) ou [Railway](https://railway.app) — les deux ont une offre gratuite ou très peu coûteuse suffisante pour démarrer, et gèrent automatiquement le HTTPS.

Une fois déployé, configurer dans Meta for Developers :
- **URL du webhook** : `https://votre-domaine.com/webhook`
- **Verify Token** : la même valeur que `WEBHOOK_VERIFY_TOKEN` dans `.env`
- **Champs d'abonnement** : cocher `messages`

---

## ✏️ Modifier le contenu du chatbot

**Tout le texte se trouve dans `src/content.js`.** Pour modifier une réponse, changer un module, ou ajouter un bouton, c'est le seul fichier à toucher dans la majorité des cas — aucune connaissance en programmation avancée n'est nécessaire, juste éditer le texte entre guillemets.

### Ajouter un nouveau noeud de conversation

```js
mon_nouveau_noeud: {
  text: "Le message que le bot enverra",
  buttons: [
    { label: "Texte du bouton 1", next: "id_du_noeud_suivant" },
    { label: "🏠 Menu principal", next: "accueil" },
  ],
},
```

### Ajouter un mot-clé d'urgence

Éditer `src/emergencyDetection.js`, ajouter une chaîne dans le tableau `keywords` de la catégorie concernée.

---

## ⚠️ Avant le lancement public — checklist critique

Voir la **section 10 du document de spécifications techniques** pour la checklist complète. Points bloquants à ne pas oublier :

- [ ] Liste de mots-clés d'urgence étendue et validée par le porteur du projet (lingala, variantes SMS)
- [ ] Contacts réels de structures de santé partenaires à Kinshasa ajoutés dans `content.js`
- [ ] Protocole de référencement santé mentale validé par un professionnel local
- [ ] `HASH_SALT` changé pour une valeur aléatoire forte (ne jamais utiliser la valeur d'exemple)
- [ ] Test du flux complet par un utilisateur pilote réel avant ouverture publique

---

## 🔒 Confidentialité

Les numéros de téléphone WhatsApp ne sont **jamais stockés en clair**. Voir `src/database.js` — fonction `hashPhoneNumber()`. Seul un hash irréversible (SHA-256 + sel secret) est conservé, permettant de faire le lien entre les messages d'un même utilisateur sans pouvoir retrouver son numéro.

---

*Document préparé pour M-SANTÉ HARMONIE — Dr Joel Matungulu, médecin généraliste, Hôpital Militaire Central Kokolo, Kinshasa.*
