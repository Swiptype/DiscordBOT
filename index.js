const { Client, GatewayIntentBits, ActivityType,PermissionsBitField, AttachmentBuilder, EmbedBuilder, Embed } = require('discord.js');
const { token, TwiAPIKey, TwiAPIKeySecret, TwiAccessToken, TwiAccessTokenSecret } = require('./config.json');
const { spawn } = require('child_process');
const axios = require('axios');
const { JSDOM } = require('jsdom');
const { handleDiceRoll, handleD20Roll, handlePileOuFace, handleDnDCreation, handleRandomStats } = require('./commands');
const commandHandler = require('./commandHandler');

const bot = new Client({ intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildMessageReactions,
]});

bot.on("ready", () => {
    console.log(`Connecté en tant que ${bot.user.tag}`);
});

bot.on("reconnecting", () => {
    console.log("Connexion!");
});

bot.on("disconnect", () => {
    console.log("Deconnecté!");
    spawn('node', ['index.js']);
});

//Activité du bot
bot.on("ready", () => {
    bot.user.setPresence({
        activities : [{
            name: "L'elimination des démons",
            type: ActivityType.Competing
        }],
        status: 'online',
    });
});

bot.on('messageCreate', commandHandler);

bot.login(token);