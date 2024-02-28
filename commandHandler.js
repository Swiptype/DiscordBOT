const { handleDiceRoll, handleD20Roll, handlePileOuFace, handleDnDCreation, handleRandomStats,trackchap } = require('./commands');
const {PermissionsBitField, EmbedBuilder,Client, GatewayIntentBits } = require('discord.js');
const { spawn } = require('child_process');

const bot = new Client({ intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages, 
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildMessageReactions,
]});

const adminPermission = new PermissionsBitField(PermissionsBitField.Default);

const images = [
    '1.png','2.png','3.png','4.png','5.png','6.png','7.png','8.png','9.png','10.png','11.png','12.png','13.png','14.png','15.png','16.png','17.png','18.png','19.png','20.png'
];

function commandHandler(message) {
    const content = message.content;

    // Votre logique de gestion des commandes ici
    switch(content){

        //Lancés de dés
        case '!d4':
            handleDiceRoll(message,images.slice(0,4));
            break;
        case '!d6':
            handleDiceRoll(message,images.slice(0,6));
            break;
        case '!d8':
            handleDiceRoll(message,images.slice(0,8));
            break;
        case '!d10':
            handleDiceRoll(message,images.slice(0,10));
            break;
        case '!d20':
            handleD20Roll(message,images);
            break;

        //Pile ou Face
        case '!PF':
            handlePileOuFace(message);
            break;

        //Créer un personnage de DnD
        case '!creerPersonnage':
            handleDnDCreation(message);
            break;

        //Envoyer des stats aléatoires de personnage de DnD
        case '!aleaStats':
            handleRandomStats(message);
            break;

        //Quel jour sommes nous ?
        case '!jour':
            const currentDate = new Date();
            const dayPassed = currentDate.toLocaleDateString();
            let hour = currentDate.toLocaleTimeString();
            message.reply({ content : `Nous sommes le ${dayPassed} et il est ${hour}`});
            break;

        //Reload le BOT
        case '!reload':
            if (adminPermission.has(PermissionsBitField.Flags.Administrator)){
                message.reply({ content: "⚠️ Pas assez de droits pour utiliser cette commande !", ephemeral: true});
            } else{
                message.reply("Redémarrage du bot ⌛").then(() => {
                    console.log("Reloading... ⌛");
                    bot.destroy();
                });
                spawn('node', ['index.js']);
                message.channel.send("Bot redémarré ! ⭐");
                console.log("Bot redémarré ! ⭐");
            }
            break;

        //Stop le BOT
        case '!stop':
            if (adminPermission.has(PermissionsBitField.Flags.Administrator)){
                message.reply({ content: "⚠️ Pas assez de droits pour utiliser cette commande !", ephemeral: true});
            } else{
                message.reply("Arrêt du bot 🛑").then(() => {
                    process.exit();
                });
            }
            break;

        //Menu
        case '!help':
            const menu = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('Help Menu')
                .setDescription('Liste des commandes du bot')
                .addFields(
                    { name: 'Lancer un d4', value: '!d4'},
                    { name: 'Lancer un d6', value: '!d6'},
                    { name: 'Lancer un d8', value: '!d8'},
                    { name: 'Lancer un d10', value: '!d10'},
                    { name: 'Lancer un d20', value: '!d20'},
                    { name: 'Pile ou Face', value: '!PF'},
                    { name: 'Créer perso DND', value: '!creerPersonnage'},
                    { name: 'Stats aléatoires pour un perso de DND', value: '!aleaStats'},
                    { name: 'Date du jour', value: '!jour'},
                    { name: 'Lancer un timer', value: '!timer "valeur en secondes"'},
                    { name: 'Voir les derniers chapîtres', value: '!chapitre'},
                    { name: 'Reload le BOT(permissions necessaires)', value: '!reload'},
                    { name: 'Arrêter le BOT(permissions necessaires)', value: '!stop'},
                )
                .setTimestamp();
            message.channel.send({embeds: [menu]});
            break;

        //TweetTracking
        case '!chapitre':
            message.channel.send("Tracking des chapitres...⌛");
            //startTrackingTweets();
            trackchap(message);
            break;

        case '5/01/2024':
            message.reply("va te faire enculer, c'est bon frere c'est quoi cette soirée de merde, on met 1h pour enfin faire quelque chose dans SoT, on fait un crâne vert, one le vend, on va faire un crâne rouge, on a le brouillard, une tempête et quand on se barre de l'île, y a un galion fantôme qui nous spamme de boulets d'ancre, puis un megalodon qui nous fais des trous donc on coule, Axel reste avec le coffre Athena, se fait tuer par 3 requins en même temps, on y retourne pour que l'un des barils athéna qu'on avait ramassé explose sur la coque du bateau et nous refasse couler. Apres on s'est dit foutus pour foutus autant jouer à LoL et j'ai rarement passé une aussi mauvaise game de ma vie. Il est 00h58 le 6 janvier quand j'écris et je vais aller me coucher le mort aux lèvres. Soirée de merde") 
            break;
    }

    //Répondre feur quand un message finit par 'quoi'
    if (message.content.split(" ").slice(-1)[0] === "quoi"){
        message.channel.send({ content : 'feur'});
    }

    //Arobase everyone si j'ecris quelque chose dans 'annonces'
    if (message.channel.id === '793909511764312154'){
        if (message.author.id === "1056250387579027466"){
            return;
        }
        else{
            message.channel.send({ content : "@everyone, NOUVELLE ANNONCE !!!"});
        }
    }

    //Créer un timer qui affiche les secondes au fur et a mesure qu'elles descendent
    if (message.content.startsWith('!timer')) {
        const time = parseInt(message.content.split(' ')[1]);
        if (!time || time < 0) {
          message.reply({ content : 'veuillez spécifier une durée en secondes.'});
          return;
        }
      
        let remaining = time;
        const countdown = setInterval(() => {
          message.channel.send(`${remaining}`);
          remaining--;
          if (remaining < 0) {
            clearInterval(countdown);
            message.channel.send('Temps écoulé');
          }
        }, 1000);
    }
}

module.exports = commandHandler;
