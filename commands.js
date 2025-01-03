const { random } = require('./utils');
const axios = require('axios');
const { JSDOM } = require('jsdom');
const {AttachmentBuilder,PermissionsBitField, EmbedBuilder,Client, GatewayIntentBits } = require('discord.js');
const { spawn } = require('child_process');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
//const ytdl = require('ytdl-core');
//const ytSearch = require('yt-search');
const play = require('play-dl');

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

const pathImg = './Dés/';
  
const pileOuFace = ['Pile','Face'];
  
const dndClasse = ["Magicien", "Barde", "Paladin", "Guerrier", "Barbare", "Clerc", "Druide", "Moine", "Rôdeur", "Voleur", "Ensorceleur", "Occultiste"];
const dndRaces = ["Elfe", "Halfelin", "Humain", "Nain", "Demi-elfe", "Demi-orc", "Drakéide", "Gnome", "Tieffelin", "Gnome des profondeurs", "Drow"];
const dndHistorique = ["Acolyte", "Artisan", "Artiste", "Charlatan", "Criminel", "Enfant des rues", "Ermite", "Héros du peuple", "Marin", "Noble", "Sage", "Sauvageon", "Soldat"];
const dndAlignement = ["Loyal bon", "Neutre bon", "Chaotique bon", "Loyal neutre", "Neutre neutre", "Chaotique neutre", "Loyal mauvais", "Neutre mauvais", "Chaotique mauvais"];

//Envoyer les images de dés
function handleDiceRoll(message,images) {
    message.reply(`Lancer de d${images.length} :`);
    const result = random(images);
    const file = new AttachmentBuilder(pathImg + result);
    message.channel.send({ files: [file]});
}

//Envoyer l'image de dé
function handleD20Roll(message,images) {
    message.reply(`Lancer de d20 :`);
    const result = random(images);
    const file = new AttachmentBuilder(pathImg + result);
    message.channel.send({files: [file]});

    //Si le résultat est 1 ou 20
    if (result === '1.png') {
        handleDiceReaction(message,'echecCrit');
    } else if (result === '20.png') {
        handleDiceReaction(message, 'reuCrit');
    }
}

//Si le résultat d'un d20 est 1 ou 20, on envoie une image particulière
function handleDiceReaction(message,emojiName) {
    const emoji = message.guild.emojis.cache.find(emoji => emoji.name === emojiName);
    message.channel.send(`${emoji}`);
}

//Envoyer 'Pile' ou 'Face'
function handlePileOuFace(message){
    message.reply('Pile ou Face : ');
    const result = random(pileOuFace);
    message.channel.send(result);
}

//Envoyer un personnage de DnD aléatoire
function handleDnDCreation(message){
    message.reply("Personnage de DnD aléatoire : ");
    const classe = random(dndClasse);
    const race = random(dndRaces);
    const historique = random(dndHistorique);
    const alignement = random(dndAlignement);
    message.channel.send(classe + "\n" + race + "\n" + historique + "\n" + alignement);
}

//Envoyer des stats de DnD aléatoires
function handleRandomStats(message){
    message.reply("Stats aléatoires : ");
    const force = images[Math.floor(Math.random() * images.length)];
    const dexterite = images[Math.floor(Math.random() * images.length)];
    const constitution = images[Math.floor(Math.random() * images.length)];
    const intelligence = images[Math.floor(Math.random() * images.length)];
    const sagesse = images[Math.floor(Math.random() * images.length)];
    const charisme = images[Math.floor(Math.random() * images.length)];
    message.channel.send("Force : " + force + "\n" + "Dexterité : " + dexterite + "\n" + "Constitution : " + constitution + "\n" + "Intelligence : " + intelligence + "\n" + "Sagesse : " + sagesse + "\n" + "Charisme : " + charisme);
}

function jour(message){
    const currentDate = new Date();
    const dayPassed = currentDate.toLocaleDateString();
    let hour = currentDate.toLocaleTimeString();
    message.reply({ content : `Nous sommes le ${dayPassed} et il est ${hour}`});
}

function reload(message){
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
}

function stop(message){
    if (adminPermission.has(PermissionsBitField.Flags.Administrator)){
        message.reply({ content: "⚠️ Pas assez de droits pour utiliser cette commande !", ephemeral: true});
    } else{
        message.reply("Arrêt du bot 🛑").then(() => {
            process.exit();
        });
    }
}

function help(message){
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
                    { name: 'Faire une recherche générale sur DnD', value: '!searchDnd'},
                    { name: 'Faire une recherche de ressource sur DnD', value: '!RsearchDnd'},
                    { name: 'Nettoyer 100 messages', value: '!clearChannel'},
                    { name: 'Reload le BOT(permissions necessaires)', value: '!reload'},
                    { name: 'Arrêter le BOT(permissions necessaires)', value: '!stop'},
                )
                .setTimestamp();
            message.channel.send({embeds: [menu]});
}

function timer(message){
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

function trackchap(message){
    const baseURL = 'https://mangamoins.shaeishu.co';
    const url = 'https://mangamoins.shaeishu.co/';

    axios.get(url)
        .then(response => {
            let data = response.data;

            let dom = new JSDOM(data);
            let divs = dom.window.document.querySelectorAll('div.sortie');
            let divArray = Array.from(divs).slice(0,3);

            divArray.forEach((div) => {
                let mangaTitle = Array.from(div.querySelector('p').childNodes)
                    .filter(node => node.nodeName === '#text')
                    .map(node => node.textContent.trim())
                    .join(' ');

                    let mangaImageSrc = div.querySelector('img').getAttribute('src');
                    mangaImageSrc = baseURL + mangaImageSrc;

                    let mangas = new EmbedBuilder()
                        .setColor('DarkerGrey')
                        .addFields(
                            {name: mangaTitle, value: '‎'},
                        )
                        .setImage(mangaImageSrc)
                        .setTimestamp();
                    message.channel.send({embeds: [mangas]});
            });
        })
        .catch(error => {
            console.error('Erreur lors de la requete', error);
        });
}

async function searchDnd(message){
    const searchTerm = message.content.slice('!searchDnd'.length).trim();

    try{
        const response = await fetch(`https://api.open5e.com/search/?text=${encodeURIComponent(searchTerm)}`);
        
        if(!response.ok){
            throw new Error(`Failed to fetch. Status code : ${response.status}`);
        }

        const data = await response.json();

        if (data.results.length > 0){
            const names = data.results.map(spell => spell.name).join(', ');
            message.channel.send( `Résultats : ${names}`);
        } else {
            message.channel.send("Pas de résultats");
        }
    } catch (error){
        console.error('Error fetching : ', error);
        message.channel.send('Erreur');
    }
}

async function RsearchDnd(message){
    const [command, ...searchWords] = message.content.split(' ');
    const searchTerm = searchWords.join(' ');

    try{
        const response = await fetch(`https://api.open5e.com/${command}/?search=${encodeURIComponent(searchTerm)}`);

        if(!response.ok){
            throw new Error(`Failed to fetch. Status code : ${response.status}`);
        }

        const data = await response.json();

        if (data.results.length > 0){
            const names = data.results.map(spell => spell.name).join(', ');
            message.channel.send( `Résultats : ${names}`);
        } else {
            message.channel.send("Pas de résultats");
        }
    } catch (error){
        console.error('Error fetching : ', error);
        message.channel.send('Erreur');
    }
}

async function clearChannel(message){
    const channel = message.channel;

    try{
        const fetched = await channel.messages.fetch({limit : 100});
        const messagesToDelete = fetched.filter(msg => (Date.now() - msg.createdTimestamp) > 1209600000);
        const messagesToBulkDelete = fetched.filter(msg => !messagesToDelete.has(msg.id));

        if(messagesToDelete.size > 0){
            messagesToDelete.forEach(async msg => {
                try {
                    await msg.delete();
                    console.log(`Deleted messages older than 14 days in ${channel.name}`);
                } catch (error){
                    console.error('Error deleting messages :',error);
                }
            });
        }

        if(messagesToBulkDelete.size > 0){
            await channel.bulkDelete(messagesToBulkDelete);
            console.log(`Cleared ${messagesToBulkDelete.size} messages younger than 14 days old in ${channel.name}`);
        }

    } catch (error){
        console.error('Error cleaning :', error);
    }
}

async function playYoutubeAudio(message,query){
    if (!message.member.voice.channel){
        message.reply('Vous devez être dans un salon vocal pour utiliser cette commande');
        return;
    }

    //const searchResult = await ytSearch(query);
    //if(!searchResult.videos.length){
    //    message.reply('Pas de résultats trouvés');
    //    return;
    //}

    const searchResult = await play.search(query, {limit: 1});
    if (!searchResult.length){
        return message.reply('Aucun résultat trouvé');
    }

    const video = searchResult[0];
    console.log(video);
    //const stream = ytdl(video.url, {filter: 'audioonly',highWaterMark: 1 << 25});
    const stream = await play.stream(video.url);
    console.log("Stream créé avec succès");

    const voiceChannel = message.member.voice.channel;

    const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });

    const player = createAudioPlayer();
    //const resource = createAudioResource(stream);
    const resource = createAudioResource(stream.stream, {
        inputType: stream.type,
    });

    player.play(resource);

    connection.subscribe(player);

    player.on(AudioPlayerStatus.Playing, () => {
        console.log(`Lecture de ${video.title}`);
    });

    player.on(AudioPlayerStatus.Idle, () => {
        console.log('Le lecteur audio est inactif.');
    });
    
    player.on(AudioPlayerStatus.Buffering, () => {
        console.log('Le lecteur audio est en cours de mise en tampon.');
    });
    
    player.on(AudioPlayerStatus.AutoPaused, () => {
        console.log('Le lecteur audio est automatiquement en pause.');
    });

    player.on('error', (error) => {
        console.error(`Erreur de lecture audio : ${error.message}`);
    });

    console.log(`Type de flux : ${stream.type}`);

    message.reply(`🎵 Lecture de **${video.title}** dans le salon vocal.`);
}

/*Tracker les tweets -> fonctionne mais j'ai pas le niveau d'API pour lire des tweets
async function startTrackingTweets(){
    try{
        const twitterUserId = '1175026703397195776';

        const tweet = await getLatestTweets(twitterUserId);

        const tweetEmbed = new EmbedBuilder()
                .setColor('#1DA1F2')
                .setTitle(`Tweet by ${tweet.user.screen_name}`)
                .setDescription(tweet.full_text)
                .setURL(`https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`);

        await message.channel.send(tweetEmbed);
    } catch(error) {
        console.error('Error getting the last tweet', error);
    }
}

async function getLatestTweets(username){
    const params = {
        screen_name: username,
        count: 1,
        tweet_mode: 'extended'
    };

    return new Promise((resolve, reject) => {
        twitterClient.get('statuses/user_timeline',params, (err,data) => {
            if (err){
                reject(err);
            } else {
                if (data.length > 0){
                    resolve(data[0]);
                } else{
                    reject('No tweets found');
                }
            }
        });
    });
}
*/

module.exports = {
    handleDiceRoll,
    handleD20Roll,
    handlePileOuFace,
    handleDnDCreation,
    handleRandomStats,
    trackchap,
    searchDnd,
    RsearchDnd,
    clearChannel,
    jour,
    reload,
    stop,
    help,
    timer,
    playYoutubeAudio
};
