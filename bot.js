// Configure logger settings
var logger = require('winston');
var auth = require('./auth.json');
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';


// IMAGES ARRAYS
var imagesCute = []; 
var imagesLoli = []; 

// Rutas de los directorios de las imagenes
const CuteDir = '../../Imagenes/Cute/';
const LoliDir = '../../Imagenes/Loli/';


// Log en discord e inicialización de arrays y variables
const Discord = require('discord.js');
const music = require('discord.js-music-v11');
var client = new Discord.Client();
var environment = require('./environment.json');

client.login(auth.token);
function output(error, token) {
        if (error) {
                console.log(`There was an error logging in: ${error}`);
                return;
        } else
                console.log(`Logged in.`);
}
imagesLoad();



var HashMap = require('hashmap');

var activeAudios = new HashMap();



// Tratamiento de los mensajes
client.on('message', function(message) {
    if (message.channel.isPrivate) {
            console.log(`(Private) ${message.author.name}: ${message.content}`);
    } else {
            console.log(`(${message.guild.name} / ${message.channel.name}) ${message.author.name}: ${message.content}`);
    }
    if (!message.guild) return;

    switch (message.content){
        case '-cute':
            sendImageMessage(message, imagesCute, CuteDir, '<@' + message.author.id + '> here is your cute image ', client);
            break;
        case '.loli':
            sendImageMessage(message, imagesLoli, LoliDir, '<@' + message.author.id + '> here is your loli ', client);
            break;
        case '.memes':
            sendTextMessage(message, environment.memeListMessage);
            break;
        case '.way':
            var voiceChannel = message.member.voiceChannel;
            if (voiceChannel) {
                connectVoiceChannel(voiceChannel,  message, 'F:/Memes/Audios/do you know the way.mp3');
            } else {
                sendTextMessage(message, "No estas en ningún canal de voz, Baka!");
            }
            break;
        case '.noob':
            var voiceChannel = message.member.voiceChannel;
            if (voiceChannel) {
                connectVoiceChannel(voiceChannel,  message, 'F:/Memes/Audios/noob.mp3');                    
            } else {
                sendTextMessage(message, "No estas en el canal de voz, Baka!");
            }
            break;
        case '.stop':
            if (activeAudios.get(message.guild.name)){
                activeAudios.get(message.guild.name).end();
                activeAudios.delete(message.guild.name);
            }
            else {
                sendTextMessage(message, "No hay sonando nada");
            }
            break;
        case '.invite':
            sendTextMessage(message, environment.inviteMessage);
            break;
        case '.aeri' :
            sendTextMessage(message, "The reason of my name is because my creator @Dani#6143 loves this name and its also cute in korean (애리) and Japanese(あえり) （＾3＾）~♪");
            break;
        case '.help':
            sendTextMessage(message, environment.helpMessage, client);
            break;
    }
    
});

/*
bletsuClient.on('message', function(message) {
    bletsuClient.reply(message, "Hello!");
});

client.on('ready', () => {
    //client.setStatus('online', 'En pruebas negro');
    client.setPlayingGame('En pruebas negro');
});
*/


// INICIALIZA LOS ARRAYS QUE CONTIENEN LAS RUTAS DE LAS IMÁGENES
function imagesLoad() {
    var fs = require('fs');
    fs.readdir(CuteDir,function(err,files){
        if(err) throw err;
        files.forEach(function(file){
            imagesCute.push(file);  
        });
    });
    fs.readdir(LoliDir,function(err,files){
        if(err) throw err;
        files.forEach(function(file){
            imagesLoli.push(file);  
        });
    });
}

// prepara una respuesta con solo texto ante un determinado comando
function sendTextMessage(message, message_body){
    message.channel.send(message_body);
}

// prepara una respuesta con imagen ante un determinado comando
function sendImageMessage(message, pic_list, pic_dir, message_body, client){

    var fs = require('fs');
    var args = [];
    var attachments = [];
    var attachment = null;
    var pic_index = Math.floor(Math.random() * pic_list.length);
    var pic_name = pic_list[pic_index];
    var pic = pic_dir + pic_name;

    attachment = new Discord.Attachment(pic, pic_name);
    attachments.push(attachment);
    message.channel.send(message_body, {'files': attachments});
}

function connectVoiceChannel(voiceChannel, message, file){


    voiceChannel.join().then(connection => {
        var dispatcher = connection.playFile(file);
        activeAudios.set(message.guild.name,dispatcher);

        dispatcher.on("end", () => {
            message.member.voiceChannel.leave();
            activeAudios.delete(message.guild.name);
            
        });

        dispatcher.on('error', e => {
            console.log(e);
          });


    });
    
  
}

// descoenctar el bot de discord
function desconectarse(){
client.logOut((err) => {
    console.log(err);
});
}
