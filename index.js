require('dotenv').config();
const { Client, GatewayIntentBits, SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const nodemailer = require('nodemailer');

const htmlTemplate = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Vérification par Email</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');
    body {
      background-color: #1e1e1e;
      font-family: 'Inter', sans-serif;
      color: #a058e7;
      padding: 40px 20px;
      margin: 0;
    }
    .container {
      background-color: #2c2c2c;
      border-radius: 12px;
      padding: 30px;
      max-width: 520px;
      margin: auto;
      box-shadow: 0 0 30px rgba(160, 88, 231, 0.1);
      border: 1px solid #333;
    }
    h1 {
      color: #a058e7;
      text-align: center;
      margin-bottom: 10px;
    }
    p {
      font-size: 15px;
      line-height: 1.6;
      color: #cfcfcf;
      text-align: center;
    }
    .code {
      display: block;
      text-align: center;
      font-size: 28px;
      font-weight: 600;
      color: #1e1e1e;
      background-color: #a058e7;
      padding: 12px 0;
      margin: 25px auto;
      width: 200px;
      border-radius: 8px;
      letter-spacing: 6px;
    }
    .footer {
      font-size: 12px;
      color: #888;
      text-align: center;
      margin-top: 30px;
    }
    .logo {
      display: block;
      margin: 0 auto 25px auto;
      width: 60px;
      filter: brightness(1.2);
    }
  </style>
</head>
<body>
  <div class="container">
    <img src="https://cdn-icons-png.flaticon.com/512/3064/3064197.png" alt="Icône Email" class="logo" />
    <h1>Vérification par Email</h1>
    <p>Bonjour !<br>Voici votre code de vérification pour accéder au serveur :</p>
    <div class="code">{{CODE}}</div>
    <p>Entrez ce code dans le champ prévu sur Discord pour finaliser votre vérification.</p>
    <div class="footer">
      <p>Ce code est valable pour une durée limitée.<br>
      Si vous n'avez pas demandé cette vérification, vous pouvez ignorer cet email.</p>
    </div>
  </div>
</body>
</html>`;

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent, GatewayIntentBits.DirectMessages] });

const verificationCodes = new Map();
const cooldowns = new Map();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

async function sendVerificationEmail(email, code) {
    const mailOptions = {
        from: `"Vérification Discord" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Votre code de vérification',
        html: htmlTemplate.replace('{{CODE}}', code)
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error("Erreur d'envoi d'email :", error);
        return false;
    }
}

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'verif') {
        const userId = interaction.user.id;
        const now = Date.now();
        const lastUsed = cooldowns.get(userId);

        if (lastUsed && now - lastUsed < 30000) {
            const remaining = Math.ceil((30000 - (now - lastUsed)) / 1000);
            return interaction.reply({
                content: `⏳ Vous devez attendre **${remaining} seconde${remaining > 1 ? 's' : ''}** avant de pouvoir réessayer.`,
                ephemeral: true
            });
        }

        cooldowns.set(userId, now);

        const guild = interaction.guild;
        const member = await guild.members.fetch(userId);
        const role = guild.roles.cache.get(process.env.ROLE_ID_NEW);

        if (role && member.roles.cache.has(role.id)) {
            return interaction.reply({
                content: "✅ Vous êtes déjà vérifié sur ce serveur !",
                ephemeral: true
            });
        }

        const email = interaction.options.getString('email');
        const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        if (!emailRegex.test(email)) {
            return interaction.reply({
                content: "❌ Veuillez entrer une adresse **Gmail valide** (ex: utilisateur@gmail.com).",
                ephemeral: true
            });
        }

        const code = Math.floor(100000 + Math.random() * 900000);
        verificationCodes.set(userId, code);

        const emailSent = await sendVerificationEmail(email, code);
        if (!emailSent) {
            return interaction.reply({
                content: "❌ Impossible d'envoyer l'email. Veuillez réessayer plus tard ou contacter un administrateur.",
                ephemeral: true
            });
        }

        const modal = new ModalBuilder()
            .setCustomId('verification_modal')
            .setTitle('✉️ Vérification par Email')
            .addComponents(
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('verification_code')
                        .setLabel("Entrez le code à 6 chiffres reçu par email :")
                        .setStyle(TextInputStyle.Short)
                        .setRequired(true)
                        .setPlaceholder("123456")
                        .setMaxLength(6)
                )
            );

        await interaction.showModal(modal);
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isModalSubmit()) return;

    if (interaction.customId === 'verification_modal') {
        const enteredCode = interaction.fields.getTextInputValue('verification_code');
        const userId = interaction.user.id;
        const expectedCode = verificationCodes.get(userId);

        if (parseInt(enteredCode) === expectedCode) {
            verificationCodes.delete(userId);

            try {
                const guild = interaction.guild;
                const member = await guild.members.fetch(userId);

                const roleToRemove = guild.roles.cache.get(process.env.ROLE_ID_OLD);
                const roleToAdd = guild.roles.cache.get(process.env.ROLE_ID_NEW);

                if (roleToRemove && member.roles.cache.has(roleToRemove.id)) {
                    await member.roles.remove(roleToRemove);
                }

                if (roleToAdd && !member.roles.cache.has(roleToAdd.id)) {
                    await member.roles.add(roleToAdd);
                }

                await interaction.reply({
                    content: "✅ **Vérification réussie !** Vous avez maintenant accès au serveur.",
                    ephemeral: true
                });
            } catch (error) {
                console.error("Erreur lors de la gestion des rôles :", error);
                await interaction.reply({
                    content: "❌ Une erreur est survenue. Veuillez contacter un administrateur.",
                    ephemeral: true
                });
            }
        } else {
            await interaction.reply({
                content: "❌ Code incorrect. Vérifiez votre email ou demandez un nouveau code avec `/verif`.",
                ephemeral: true
            });
        }
    }
});

client.on('ready', async () => {
    const guild = await client.guilds.fetch(process.env.GUILD_ID);
    const commands = guild.commands;

    try {
        await commands.create(
            new SlashCommandBuilder()
                .setName('verif')
                .setDescription('Lance la vérification par email pour accéder au serveur')
                .addStringOption(option =>
                    option.setName('email')
                        .setDescription('Votre adresse Gmail (ex: utilisateur@gmail.com)')
                        .setRequired(true)
                )
        );
        console.log("✅ Commande /verif enregistrée avec succès !");
    } catch (error) {
        console.error("❌ Erreur lors de l'enregistrement de la commande slash :", error);
    }
});

client.login(process.env.DISCORD_TOKEN);
