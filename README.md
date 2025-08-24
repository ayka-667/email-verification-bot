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
  ROLE_ID=1234567891011121314 # Rôle utilisé pour vérifier si le membre est déjà vérifié```

4.
