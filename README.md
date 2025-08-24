# 🔐 Discord Email Verification Bot
**[Français]** Un bot Discord open-source pour vérifier les utilisateurs via un **code envoyé par email** (Gmail, Outlook, etc.). Idéal pour sécuriser l'accès à ton serveur !

**[English]** An open-source Discord bot to verify users via a **6-digit code sent by email**. Perfect for securing access to your server!

---

## 📌 **Fonctionnalités**
✅ **Vérification par email** : Envoie un code unique à l'utilisateur.
✅ **Système de rôles** : Ajoute/retire automatiquement des rôles après vérification.
✅ **Protection anti-spam** : Cooldown de 30 secondes pour éviter les abus.
✅ **Interface intuitive** : Modal Discord pour saisir le code.
✅ **Personnalisable** : Modèle HTML de l'email modifiable, regex pour les emails, etc.
✅ **Compatibilité** : Fonctionne avec n'importe quel service email (Gmail, Outlook, etc.).

---

## 📦 **Installation**

### **1️⃣ Prérequis**
- Un **bot Discord** avec les permissions :
  - `Gérer les rôles` (pour ajouter/retirer des rôles).
  - `Utiliser les commandes slash`.
- Un **compte email** (Gmail recommandé) pour envoyer les codes.
  - Si tu utilises Gmail avec la **2FA**, génère un [mot de passe d'application](https://myaccount.google.com/apppasswords).
- **Node.js v16 ou supérieur** installé sur ta machine.

---

### **2️⃣ Configuration**
1. **Clone le dépôt** :
   ```bash
   git clone https://github.com/ton-utilisateur/discord-email-verification-bot.git
   cd discord-email-verification-bot```

2. **Installe les dépendances** :
   ```npm install discord.js nodemailer dotenv```

3. **Crée un fichier `.env` (copie `.env.example`) :** :
  ```# Token de ton bot Discord (à récupérer sur https://discord.com/developers/applications)
  DISCORD_TOKEN=ton_token_bot_ici

  # Identifiants pour l'envoi des emails (Gmail par défaut)
  EMAIL_USER=ton_email@gmail.com
  EMAIL_PASS=ton_mot_de_passe_ou_app_password
  EMAIL_SECURE=true # Ne pas modifier
  EMAIL_PORT=465 # Ne pas modifier
  EMAIL_HOST=smtp.gmail.com # Ne pas modifier

  # ID du serveur Discord où le bot opère
  GUILD_ID=123456789012345678

  # ID des rôles à retirer/ajouter (optionnel)
  ROLE_ID_OLD=987654321098765432  # Rôle à retirer après vérification (ex: "Non vérifié")
  ROLE_ID_NEW=123456789012345678  # Rôle à ajouter après vérification (ex: "Membre")
  ROLE_ID=1234567891011121314 # Rôle utilisé pour vérifier si le membre est déjà vérifié
```

Lance le bot:
```bash
node index.js
```

---

## 🛠 **Personnalisation**

### **1. Modifier le modèle d'email**
Le template HTML est dans `index.js` (ligne ~10):
```html
<div class="code">{{CODE}}</div>
```

### **2. Changer le regex pour les emails**
Par défaut (Gmail uniquement):
```javascript
const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
```

Pour tous les emails:
```javascript
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
```

### **3. Ajuster le cooldown**
Modifie la durée (en ms):
```javascript
if (lastUsed && now - lastUsed < 60000) { ... } // 60000ms = 60s
```

---

## ⚠️ **Problèmes courants**

| Problème               | Solution |
|------------------------|----------|
| Email non envoyé       | Vérifie `EMAIL_USER` et `EMAIL_PASS` dans `.env` |
| Erreur "Invalid email"  | Modifie le regex si tu veux accepter d'autres domaines |
| Bot ne répond pas      | Vérifie le token et les permissions |
| Rôles non mis à jour   | Vérifie les `ROLE_ID` et les permissions du bot |

---

## 🤝 **Contribuer**
1. Fork le dépôt
2. Crée une branche (`git checkout -b fonctionnalite-exemple`)
3. Commit tes changements
4. Push (`git push origin fonctionnalite-exemple`)
5. Ouvre une Pull Request

---
