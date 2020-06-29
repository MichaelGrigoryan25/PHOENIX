const Discord = require('discord.js');
const client = new Discord.Client();
const { prefix, token } = require("./config.json");

//Once ready
client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  // Set the client user's presence
  client.user.setPresence({ activity: { name: '$help' }, status: 'online' })
    .then(console.log)
    .catch(console.error);
});

//Reconnect
client.once("reconnecting", () => {
  console.log("Reconnecting!");
});

//Disconnect
client.once("disconnect", () => {
  console.log("Disconnect!");
});

//When a new member joins send a message
client.on('guildMemberAdd', member => {
  const channel = member.guild.channels.cache.find(ch => ch.name === 'member-log');
  if (!channel) return;
  channel.send(`Welcome to the server, ${member}` + ". You are a gamer now:video_game:");
});

//Once receive a message
client.on('message', async msg => {
  const args = msg.content.split(" ")

  //Help
  if (msg.content === `${prefix}help`) {
    const helpList = new Discord.MessageEmbed()
      .setColor('#ff9302')
      .setTitle('PHOENIX Commands')
      .setThumbnail('https://raw.githubusercontent.com/MichaelGrigoryan25/PHOENIX/master/logo.jpg')
      .setDescription('Here is the list for all available commands for PHOENIX.')
      .addFields(
        { name: '$help', value: 'List all the available commands.' },
        { name: '$ping', value: 'PONG!' },
        { name: '$hello', value: 'Hey there!' },
        { name: '$fps', value: 'Surprise!' },
        { name: '$clear', value: 'Clear the specified amount of messages in the chat.' }
      )
      .setTimestamp()
      .setFooter('PHOENIX');
    msg.channel.send(helpList);
  }

  //Ping
  if (msg.content === `${prefix}ping`) {
    var ping = new Date().getTime() - msg.createdTimestamp;
    msg.channel.send("PONG! " + ping + " ms");
  }

  id (msg.content === `${prefix}pong`) {
    var ping = new Date().getTime() -msg.createdTimestamp;
    msg.channel.send("PING! " + ping + " ms");
  }

  //Say Hello
  if (msg.content === `${prefix}hello`) {
    msg.reply('HEY THERE!');
  }

  //Show Avatar
  if (msg.content === `${prefix}avatar`) {
    msg.reply(msg.author.displayAvatarURL());
  }

  if (msg.content === `${prefix}fps`) {
    msg.channel.send("120FPS🎮🤪 + 4K Display", { files: ["./media/rainbow.gif"] });
  }

  //Bulk Delete Messages
  if (args[0] == `${prefix}clear`) {
    const deleteCount = parseInt(args[1], 10);
    if (!deleteCount) {
      return msg.reply('You haven\'t given an amount of messages which should be deleted!');
    }
    if (deleteCount > 1 && deleteCount <= 100) {
      const fetched = await msg.channel.messages.fetch({ limit: deleteCount });
      msg.channel.bulkDelete(fetched)
        .catch(error => {
          msg.reply(`Couldn't delete messages because of: ${error}`);
        });
    }
  }
});

client.login(token);