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

// Rutas de los directorios de las imagenes
const CuteDir = '../../Imagenes/Cute/';


// Log en discord e inicialización de arrays y variables
const Discord = require('discordv8');
var client = new Discord.Client();
var environment = require('./environment.json');

client.loginWithToken(auth.token, output);
function output(error, token) {
        if (error) {
                console.log(`There was an error logging in: ${error}`);
                return;
        } else
                console.log(`Logged in.`);
}
imagesLoad();


// Tratamiento de los mensajes
client.on('message', function(message) {
    if (message.channel.isPrivate) {
            console.log(`(Private) ${message.author.name}: ${message.content}`);
    } else {
            console.log(`(${message.server.name} / ${message.channel.name}) ${message.author.name}: ${message.content}`);
    }

    switch (message.content){
        case '.cute':
            sendImageMessage(message, imagesCute, CuteDir, '<@' + message.author.id + '> here is your cute ', client);
            break;
        case '.aeri' :
            sendTextMessage(message, "The reason of my name is because my creator @Dani#6143 loves this name and its also cute in korean (애리) and Japanese(あえり) （＾3＾）~♪", client);
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
    fs.readdir('./images/cute/',function(err,files){
    if(err) throw err;
    files.forEach(function(file){
        console.log(file);
        imagesCute.push(file);  
    });
    console.log(imagesCute.length)
 });
}

// INICIALIZA LOS ARRAYS QUE CONTIENEN LAS RUTAS DE LAS IMÁGENES
function imagesLoad() {
    var fs = require('fs');
    fs.readdir(CuteDir,function(err,files){
    if(err) throw err;
    files.forEach(function(file){
        imagesCute.push(file);  
    });
 });
}

function sendTextMessage(message, message_body, client){
    console.log("entro a la funcion text");
    console.log(message_body);
    client.reply(message, message_body);
}

// prepara la respuesta a enviar ante un determinado comando
function sendImageMessage(message, pic_list, pic_dir, message_body, client){

    var fs = require('fs');
    var args = [];
    var attachments = [];
    var attachment = null;
    var pic_index = Math.floor(Math.random() * pic_list.length);
    var pic_name = pic_list[pic_index];
    var pic = pic_dir + pic_name;
    client.sendFile(message, pic_dir + pic_name, pic_name, message_body, (err, m) => {
        if (err) console.log(err);
    });
}

function desconectarse(){
client.logOut((err) => {
    console.log(err);
});
}
