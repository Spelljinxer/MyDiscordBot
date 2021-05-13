const fs = require('fs');
const Discord = require('discord.js');
const {Client, MessageAttachment} = require('discord.js');
const {prefix, token} = require('./config.json');
const client = new Discord.Client();
const PREFIX = '!';
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
   const command = require(`./commands/${file}`);
   client.commands.set(command.name, command);
}

const ytdl = require("ytdl-core");
const ms = require('ms');

const cheerio = require('cheerio');
const requestion = require('request');
const { request } = require('http');
const { count } = require('console');



var version = ("Spelljinxer's Version 1.2.7 // Alpha Testing");
var servers = {}; //CONSTRUCTORS

//CHECK IF BOT IS ONLINE
client.once('ready', () => {
   console.log(`I AM COMBAT READY!`);
   client.user.setActivity('Spelljinxer code me uwu', {
      type: 'WATCHING'
   }).catch(console.error);
});

//Welcomes new user to the #general channel
client.on('guildMemberAdd', memer => {
   const channel = member.guild.channels.find(channel => channel.name === "general");
   if (!channel) return;

   channel.send('Welcome to our server, ${member}')
});

// MAIN BODY OF COMMANDS FOR MESSAGES
client.on('message', message => {

   let args = message.content.slice(PREFIX.length).split(" ");

   switch (args[0]) {
   case 'ping':
      client.commands.get('ping').execute(message, args);
      break;
   case 'hello':
       client.commands.get('hello').execute(message, args);
      break;
      
         //returns user's info
   case 'userinfo':
      const embed = new Discord.MessageEmbed()
      .setColor('0xC28FFF')
	.setTitle(message.author.username)
	.setURL('https://discord.js.org/')
	.setAuthor('Bot created by Spelljinxer', 'https://i.imgur.com/2z8iFZO.jpg', 'https://anilist.co/user/Kyokino/')
	.setDescription('*Information I managed to find about you Nyaa~*')
	.setThumbnail(message.author.displayAvatarURL())
   .addFields
   (
		{ name: 'Discord Join Date: ', value: message.author.createdAt},
		{ name: '\u200B', value: '\u200B' },
		{ name: 'Current Server: ', value: message.guild.name, inline: true },
		{ name: 'Last Message Sent: ', value: message.author.lastMessage, inline: true },
	)
	.addField('Server Created: ', message.guild.createdAt, true)
	.setImage(message.author.displayAvatarURL())
	.setTimestamp()
	.setFooter('while (1) return Waifu;', 'https://i.imgur.com/2z8iFZO.jpg');
      message.channel.send(embed);
      break;

     //gives botinfo
   case 'botinfo': {
         message.channel.send('This bot was created by Spelljinxer ' + "\n" + version)
      }
      break;

   case 'avatar': {
      let avatarembed = new Discord.MessageEmbed()
      avatarembed.setTitle('Your Avatar!', true)
      avatarembed.setThumbnail(message.author.displayAvatarURL(), true)
      avatarembed.setColor(0xC28FFF)
      return message.channel.send(avatarembed)
   }
      break;

   //sends "Math :zzz:"
   case 'math':
      message.channel.send('Math :zzz:');
      break;
   case 'compScience' :
      message.channel.send('👉😴');
      break

      //Send my AniList  // currently trying to improve this
   case 'anilist':
      const embed2 = new Discord.MessageEmbed()
         .setTitle('AniList')
         .setDescription('Click Here for Spelljinxers AniList')
         .setURL(`https://anilist.co/user/Kyokino/`)
      message.channel.send(embed2)
      break;

      //clears amount of messages send
   case 'clear':
      if (!args[1]) return message.reply('Error, please define argument')
      message.channel.bulkDelete(args[1]);
      break;

      //MUSIC BOT !!WIP!! STILL NEED TO FIX THIS (skip and stop don't work atm)
   case 'play':
      function play(connection, message) {
         var server = servers[message.guild.id];

         server.dispatcher = connection.play(ytdl(server.queue[0], {
            filter: "audioonly"
         }));

         server.queue.shift();

         server.dispatcher.on("end", function () {
            if (server.queue[0]) {
               play(connection, message);
            } else {
               connection.disconnect();
            }
         })
      }
      if (!args[1]) {
         message.channel.send("Provide a link Nya~");
         return;
      }

      if (!message.member.voice.channel) {
         message.channel.send("Sorry, but you must be in a VC to play music!");
         return;
      }

      if (!servers[message.guild.id]) servers[message.guild.id] = {
         queue: []
      }

      var server = servers[message.guild.id];

      server.queue.push(args[1]);

      if (!message.guild.voiceConnection) message.member.voice.channel.join().then(function (connection) {
         play(connection, message);
      })
      break;

   case 'skip':
      var server = servers[message.guild.id];
      if (server.dispatcher) server.dispatcher.end();
      message.channel.send("Skipping song")
      break;

   case 'stop':
      var server = servers[message.guild.id];
      if (message.member.voiceConnection) {
         for (var i = server.queue.length - 1; i >= 0; i--) {
            server.queue.splice(i, 1);
         }

         server.dispatcher.end();
         message.channel.send("Ending queue, Leaving Voice Channel. Sayonara!")
         console.log('Stopped the queue')
      }

      if (message.guild.connection) message.guild.voiceConnection.disconnect();
      break;



      //Mutes a specified user (only available for role "Kyokino")
   case 'mute':
      if (!message.member.roles.cache.find(r => r.name === "Kyokino")) {
         return message.channel.send('Sorry, but you do not have permission to mute');
      }

      let person = message.guild.member(message.mentions.users.first() || message.guild.members.fetch(args[1]))
      if (!person) return message.reply("User not Found");

      let mainrole = message.guild.roles.cache.find(role => role.name === "role test 1");
      let muterole = message.guild.roles.cache.find(role => role.name === "mute");

      if (!muterole) return message.reply("Couldn't find the role")

      let time = args[2];
      if (!time) {
         return message.reply("How long do you wish to mute the user?");
      }

      person.roles.remove(mainrole.id);
      person.roles.add(muterole.id);

      message.channel.send(`@${person.user.tag} has now been muted for ${ms(ms(time))}`);

      setTimeout(function () {
         person.roles.add(mainrole.id);
         person.roles.remove(muterole.id);
         message.channel.send(`@${person.user.tag} has been unmuted!`);
      }, ms(time));
      break;

   //send private dm of commands (constatntly update this)
   case 'help':
      message.channel.send("Hey! I've sent you a Private DM, check it out!");
      message.author.send("```!help (You already know this command :P)" + "\n" +
         "!mute(time) - Mutes a specified user" + "\n" +
         "!play (song link) - Joins existing VC and plays specified song" + "\n" +
         "!userinfo - Provides an Embed of you" + "\n" +
         "!botinfo - Provide bot info" + "\n" +
         "!clear(number) - Clears a number of previous messages" + "\n" +
         "!anilist - Spelljinxers AniList" + "\n" +
         "!math - Returns what the bot thinks of math```");
      break;
   
   case 'OkayThen':
      const okay = new MessageAttachment('./OkayThen.mp3');
        message.channel.send(message.author, okay);
      break;
   case 'shutUp':
      const shutUp = new MessageAttachment('./alrightShutUp.mp3');
         message.channel.send(message.author, shutUp);
      break;

   case 'bruh':
      const bruh = new MessageAttachment('./Bruh.mp3');
        message.channel.send(message.author, bruh);
      break;

   case 'clap':
      const clap = new MessageAttachment('./animeclap.gif');
        message.channel.send(message.author, clap);
      break;
   
   case 'okHand' :
      message.channel.send('👌');
      break;
   
   case 'HelloWorld' :
      message.channel.send('You thought I was going to say "Hello World" like all the other stupid programming languages?');
      break;

   

   }

})

//say " " when someone says " "
client.on('message', message => {
   if (message.content === 'theOther') {
      message.channel.send('u cant forget about me');
   }
   if (message.content === 'nullableVoid') {
      message.channel.send("U WOT M8");
   }
   if (message.content === 'pavo') {
      message.channel.send("the three gods of cits");
   }
})

client.login(token);
