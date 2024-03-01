const { jour, reload, stop, help, timer, handleDiceRoll, handleD20Roll, handlePileOuFace, handleDnDCreation, handleRandomStats, trackchap, checkDataAndSend, searchDnd, RsearchDnd, clearChannel } = require('./commands');
import('node-fetch');

const images = [
    '1.png','2.png','3.png','4.png','5.png','6.png','7.png','8.png','9.png','10.png','11.png','12.png','13.png','14.png','15.png','16.png','17.png','18.png','19.png','20.png'
];

function commandHandler(message) {
    const content = message.content;

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
            jour(message);
            break;

        //Reload le BOT
        case '!reload':
            reload(message);
            break;

        //Stop le BOT
        case '!stop':
            stop(message);
            break;

        //Menu
        case '!help':
            help(message);
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

        case '!clearChannel':
            clearChannel(message);
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
        timer(message);
    }

    if(message.content.startsWith('!searchDnd') && message.content.length > '!searchDnd'.length){
        searchDnd(message);
    }

    if(message.content.startsWith('!RsearchDnd') && message.content.length > '!RsearchDnd'.length){
        RsearchDnd(message);
    }

    checkDataAndSend("Chapitre !");
}

module.exports = commandHandler;
