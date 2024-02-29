const { random } = require('./utils');
const { AttachmentBuilder, EmbedBuilder, messageLink } = require('discord.js');
const axios = require('axios');
const { JSDOM } = require('jsdom');

const pathImg = './Dés/';
  
const pileOuFace = ['Pile','Face'];
  
const dndClasse = ["Magicien", "Barde", "Paladin", "Guerrier", "Barbare", "Clerc", "Druide", "Moine", "Rôdeur", "Voleur", "Ensorceleur", "Occultiste"];
const dndRaces = ["Elfe", "Halfelin", "Humain", "Nain", "Demi-elfe", "Demi-orc", "Drakéide", "Gnome", "Tieffelin", "Gnome des profondeurs", "Drow"];
const dndHistorique = ["Acolyte", "Artisan", "Artiste", "Charlatan", "Criminel", "Enfant des rues", "Ermite", "Héros du peuple", "Marin", "Noble", "Sage", "Sauvageon", "Soldat"];
const dndAlignement = ["Loyal bon", "Neutre bon", "Chaotique bon", "Loyal neutre", "Neutre neutre", "Chaotique neutre", "Loyal mauvais", "Neutre mauvais", "Chaotique mauvais"];

// Vos fonctions de gestion des commandes ici
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
                    .setTimestamp()
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
    RsearchDnd
};
