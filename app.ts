const Discord = require('discord.js');
const client = new Discord.Client();
const { prefix, token } = require("./config.json");

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});


client.on('guildMemberAdd', member => {
  const channel = member.guild.channels.cache.find(ch => ch.name === 'member-log');
  if (!channel) return;
  channel.send(`Welcome to the server, ${member}` + ". You are a gamer now:video_game:");
});

client.on('message', async msg => {
  const args = msg.content.split(" ") 
  //Ping
  if (args[0] === `${prefix}ping`) {
    var ping = new Date().getTime() - msg.createdTimestamp;
    msg.channel.send("PONG! " + ping + " ms");
  }

  //Help
  if (args[0] === `${prefix}help`) {
    var helpList = "> 1. `$ping` - Measures minimum time needed to send smallest possible amount of data and receive response from the server.\n> 2. `$hello` - Hey there\n> 3. `$avatar` - Sends the link with your Discord avatar in it.";
    msg.channel.send("Here are the commands of PHOENIX" + "\n" + helpList);
  }

  //Say Hello
  if (args[0] === `${prefix}hello`) {
    msg.reply('HEY THERE!');
  }

  //Show Avatar
  if (args[0] === `${prefix}avatar`) {
    msg.reply(msg.author.displayAvatarURL());
  }

  if (args[0] == `${prefix}clear`){
    const deleteCount = parseInt(args[1], 10);
    if (!deleteCount) {
      return msg.reply('You haven\'t given an amount of messages which should be deleted!');
    } 
    if(deleteCount > 1 && deleteCount <= 100){
        const fetched = await msg.channel.messages.fetch({limit: deleteCount});
        msg.channel.bulkDelete(fetched)
        .catch(error => {
            msg.reply(`Couldn't delete messages because of: ${error}`);
        });
      }
    }
})

client.login(token);