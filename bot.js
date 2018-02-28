// Configure logger settings
var logger = require('winston');
var auth = require('./auth.json');
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';


// Rutas de los directorios de las imagenes
const CuteDir = '../../Imagenes/Cute/';
const LoliDir = '../../Imagenes/Loli/';
const KpopDir = '../..//Musica/Kpop/';

// IMAGES ARRAYS
var imagesCute = []; 
var imagesLoli = []; 

// AUDIO ARRAYS
var audioKpop = []; 




// Log en discord e inicialización de arrays y variables
const Discord = require('discord.js');
var client = new Discord.Client();
var environment = require('./environment.json');
const math = require('mathjs');


client.login(auth.token);
function output(error, token) {
        if (error) {
                console.log(`There was an error logging in: ${error}`);
                return;
        } else
                console.log(`Logged in.`);
}
initialLoad();

function VoiceChannelElements() {

    
    var dispatcher;
    var connectionToVoiceChannel;
    var type;
    var audioList;
    var audioDir;


    //Setters
    function setDispatcher(newDispatcher) {
       if (!newDispatcher) 
          throw new Error('errro dispatcher');
          dispatcher = newDispatcher;
    }

    function setConnectionToVoiceChannel(newVoiceConnection) {
        if (!newVoiceConnection) 
           throw new Error('error connection');
           connectionToVoiceChannel = newVoiceConnection;
    }

    function setType(newType) {
           type = newType;
     }

     function setAudioList(newAudioList) {
        if (!newAudioList) 
           throw new Error('error newAudioList');
           audioList = newAudioList;
     }

     function setAudioDir(newAudioDir) {
        if (!newAudioDir) 
           throw new Error('error newAudioDir');
           audioDir = newAudioDir;
     }

     //Getters
    function getDispatcher() {
       return dispatcher;
    }

    function getConnectionToVoiceChannel() {
        return connectionToVoiceChannel;
     }
    
     function getType() {
        return type;
     }

     function getAudioList() {
        return audioList;
     }

     function getAudioDir() {
        return audioDir;
     }


    return {
       setDispatcher: setDispatcher,
       setConnectionToVoiceChannel: setConnectionToVoiceChannel,
       setType: setType,
       setAudioList: setAudioList,
       setAudioDir: setAudioDir,
       getDispatcher: getDispatcher,
       getConnectionToVoiceChannel: getConnectionToVoiceChannel,
       getType: getType,
       getAudioList: getAudioList,
       getAudioDir: getAudioDir
    }; 
    
 } 


// hashmap de conexiones de voz, servidor-dispatcher
var HashMap = require('hashmap');
var activeAudios = new HashMap();



// Tratamiento de los mensajes
client.on('message', function(message) {
    if (message.channel.isPrivate) {
            console.log(`(Private) ${message.member.name}: ${message.content}`);
    } else {
            console.log(`(${message.guild.name} / ${message.channel.name}) ${message.member.user.username + '#' + message.member.user.discriminator}: ${message.content}`);
    }
    if (!message.guild) return;

    var messageSplitted = message.content.split(" ");
    var command = messageSplitted[0];


    switch (command){
        case '.cute':
            sendImageMessage(message, imagesCute, CuteDir, '<@' + message.author.id + '> here is your cute image ', client);
            break;
        case '.loli':
            sendImageMessage(message, imagesLoli, LoliDir, '<@' + message.author.id + '> here is your loli ', client);
            break;
        case '.memes':
            sendTextMessage(message, environment.memeListMessage);
            break;
        case '.way':
                sendAudioMeme(message, 'F:/Memes/Audios/do you know the way.mp3');
            break;
        case '.noob':
            sendAudioMeme(message, 'F:/Memes/Audios/noob.mp3');                    
            break;
        case '.cono':
            sendAudioMeme(message, 'F:/Memes/Audios/cono.mp3');                    
            break;
        case '.kpop':
            sendRandomSong(message, audioKpop, KpopDir, 0);
            break;
        case '.kpopi':
            sendRandomSong(message, audioKpop, KpopDir, 1);
            break;
        case '.subnormal':
            sendAudioMeme(message, 'F:/Memes/Audios/Baka.mp3');
            sendTextMessage(message, "Are you trying to disrespect me? Bakaaaaaa o(；△；)o");
            break;
        case '.tonto':
            sendAudioMeme(message, 'F:/Memes/Audios/Baka.mp3');
            sendTextMessage(message, "Are you trying to disrespect me? Bakaaaaaa o(；△；)o");
            break;
        case '.retrasado':
            sendAudioMeme(message, 'F:/Memes/Audios/Baka.mp3');
            sendTextMessage(message, "Are you trying to disrespect me? Bakaaaaaa o(；△；)o");
            break;
        case '.skip':
            skipAudio(message, audioKpop, KpopDir);
            break;
        case '.stop':
            stopAudio(message);
            break;
        case '.pause':
            pauseAudio(message);
            break;
        case '.resume':
            resumeAudio(message);
            break;
        case '.volume':
            if (!isNaN(messageSplitted[1])){
                setAudioVolume(message, math.round(messageSplitted[1], 1));
            }
            else {
                sendTextMessage(message, "Introduce un valor númerico, estupido.");
            }
            break;
        case '.invite':
            sendTextMessage(message, environment.inviteMessage);
            break;
        case '.aeri' :
            sendTextMessage(message, environment.reasonMessage);
            break;
        case '.help':
            sendTextMessage(message, environment.helpMessage);
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
function initialLoad() {
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
    fs.readdir(KpopDir,function(err,files){
        if(err) throw err;
        files.forEach(function(file){
            audioKpop.push(file);  
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

function sendAudioMeme(message, file){

    var voiceChannel = message.member.voiceChannel;

    if (voiceChannel) {
        voiceChannel.join().then(connection => {
            var dispatcher = connection.playFile(file);
            dispatcher.setVolume(1);

            var aux = VoiceChannelElements();
            aux.setDispatcher(dispatcher);
            aux.setConnectionToVoiceChannel(connection);
            activeAudios.set(message.guild.name, aux);
    
            dispatcher.on("end", () => {
                message.member.voiceChannel.leave();
                activeAudios.delete(message.guild.name);
                
            });
    
            dispatcher.on('error', e => {
                console.log(e);
              });
    
    
        });
    }
    else {
    sendTextMessage(message, "No estas en el canal de voz, Baka!");
    }

    
    
  
}

//type=0 no infinite, =1 infinite
function sendRandomSong(message, audioList, audioDir, type){

    var audio_index = Math.floor(Math.random() * audioList.length);
    var audio_name = audioList[audio_index];
    var audio = audioDir + audio_name;
    var voiceChannel = message.member.voiceChannel;

    if (voiceChannel) {
        voiceChannel.join().then(connection => {

                var dispatcher = connection.playFile(audio);
                dispatcher.setVolume(0.1);


                var aux = VoiceChannelElements();
                aux.setDispatcher(dispatcher);
                aux.setConnectionToVoiceChannel(connection);
                aux.setType(type);
                aux.setAudioList(audioList);
                aux.setAudioDir(audioDir);

                

                activeAudios.set(message.guild.name, aux);

                sendTextMessage(message, "current song: " + audio_name.substr(0,audio_name.length - 4));  

                dispatcher.on("end", () => {
                    activeAudios.delete(message.guild.name);
                    if (type==1){
                        audio_index = Math.floor(Math.random() * audioList.length);
                        audio_name = audioList[audio_index];
                        audio = audioDir + audio_name;
                        dispatcher = connection.playFile(audio);
                        aux.setDispatcher(dispatcher);
                        sendTextMessage(message, "current song: " + audio_name.substr(0,audio_name.length - 4)); 

                        activeAudios.set(message.guild.name,aux);
                    }
                    else {
                        message.member.voiceChannel.leave();
                    }
                });
    
                dispatcher.on('error', e => {
                    console.log(e);
                });  
           
        });               
    } else {
        sendTextMessage(message, "No estas en el canal de voz, Baka!");
    }
  
}

function skipAudio(message){
    if (activeAudios.get(message.guild.name)){
        var aux = activeAudios.get(message.guild.name);
        stopAudio(message);
        sendRandomSong(message, aux.getAudioList(), aux.getAudioDir());
    }
    else {
            sendTextMessage(message, "No hay sonando nada");
        }

        
/*
        var audio_index = Math.floor(Math.random() * audioList.length);
        var audio_name = audioList[audio_index];
        var audio = audioDir + audio_name;
        
        var aux = activeAudios.get(message.guild.name);

        activeAudios.delete(message.guild.name);

        
        //aux.getDispatcher().pause();

        aux.getConnectionToVoiceChannel().playFile(audio);

        /*

        var newDispatcher = aux.getConnectionToVoiceChannel().playFile(audio);
        aux.setDispatcher(newDispatcher);

        activeAudios.set(message.guild.name, aux);
        */
/*
        newDispatcher.on("end", () => {
            
            activeAudios.delete(message.guild.name);
            if (aux.getType==1){
                audio_index = Math.floor(Math.random() * audioList.length);
                audio_name = audioList[audio_index];
                audio = audioDir + audio_name;
                newDispatcher = aux.getConnectionToVoiceChannel().playFile(audio);
                sendTextMessage(message, "current song: " + audio_name.substr(0,audio_name.length - 4)); 
                activeAudios.set(message.guild.name, aux);
            }
            else {
                message.member.voiceChannel.leave();
            }
            
           
        });

        newDispatcher.on('error', e => {
            console.log(e);
        });  

        */
       //console.log("parado");
    

}

function stopAudio(message){

    if (activeAudios.get(message.guild.name)){
        activeAudios.get(message.guild.name).getDispatcher().end();
        activeAudios.delete(message.guild.name);
    }
    else {
        sendTextMessage(message, "No hay sonando nada");
    }
}

function pauseAudio(message){
    if (activeAudios.get(message.guild.name)){
        activeAudios.get(message.guild.name).getDispatcher().pause();
    }
    else {
        sendTextMessage(message, "No hay sonando nada");
    }
}

function resumeAudio(message){
    if (activeAudios.get(message.guild.name)){
        activeAudios.get(message.guild.name).getDispatcher().resume();
    }
    else {
        sendTextMessage(message, "No hay sonando nada");
    }
}

function setAudioVolume(message, volume){
    if (activeAudios.get(message.guild.name)){
        activeAudios.get(message.guild.name).getDispatcher().setVolume(volume);
    }
    else {
        sendTextMessage(message, "No hay sonando nada");
    }
}



// descoenctar el bot de discord
function desconectarse(){
client.logOut((err) => {
    console.log(err);
});
}
