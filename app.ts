const Discord = require('discord.js');
const client = new Discord.Client();
const { prefix, token } = require("./config.json");

//Once ready
client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  // Set the client user's presence
  var number = client.guilds.cache.size;
  client.user.setPresence({ activity: { name: `$help in ${number} server(s)` }, status: 'online' })
    .then(console.log)
    .catch(console.error);
});

//Update number when the guild is deleted
client.on('guildDelete', (guild) => {
  var number = client.guilds.cache.size;
  client.user.setPresence({ activity: { name: `$help in ${number} server(s)` }, status: 'online' })
    .then(console.log)
    .catch(console.error);
})

//Update the number when a guild is added
client.on('guildCreate', (guild) => {
  var number = client.guilds.cache.size;
  client.user.setPresence({ activity: { name: `$help in ${number} server(s)` }, status: 'online' })
    .then(console.log)
    .catch(console.error);
})
//Once Reconnected
client.once("reconnecting", () => {
  console.log("Reconnecting!");
});

//Once Disconnected
client.once("disconnect", () => {
  console.log("Disconnect!");
});

//When a new member joins send a message
client.on('guildMemberAdd', member => {
  const channel = member.guild.channels.cache.find(ch => ch.name === 'member-log');
  if (!channel) return;
  channel.send(`Welcome to the server, ${member}` + ". You are a gamer now:video_game:");
});

//When a member leaves send a message
client.on('guildMemberRemove', member => {
  const channel = member.guild.channels.cache.find(ch => ch.name === 'member-log');
  if (!channel) return;
  channel.send(`Bye, ${member}` + ". We'll miss you😞");
});

//Once receive a message
client.on('message', async msg => {
  // Ignore messages that aren't from a guild
  if (!msg.guild) return;
  const args = msg.content.split(" ")

  //Help Module
  if (msg.content === `${prefix}help`) {
    const helpList = new Discord.MessageEmbed()
      .setColor('#ff9302')
      .setTitle('PHOENIX Commands')
      .addFields(
        { name: '$help', value: 'List all the available commands.' },
        { name: '$ping or $pong', value: 'PONG! or PING!' },
        { name: '$kick', value: 'Kick a user from the server.' },
        { name: '$ban', value: 'Ban a user from the server.' },
        { name: '$clear', value: 'Clear the specified amount of messages in the chat.' },
      )
    msg.channel.send(helpList);
  }

  //Ping Module
  if (msg.content === `${prefix}ping`) {
    var ping = new Date().getTime() - msg.createdTimestamp;
    msg.channel.send("PONG! " + ping + " ms");
  }

  //Pong Module
  if (msg.content === `${prefix}pong`) {
    var ping = new Date().getTime() - msg.createdTimestamp;
    msg.channel.send("PING! " + ping + " ms");
  }

  //Show Avatar Module
  if (msg.content === `${prefix}avatar`) {
    msg.reply(msg.author.displayAvatarURL());
  }

  //Bulk Delete Messages Module
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

  //Kick Module
  if (msg.member.hasPermission("KICK_MEMBERS")) {
    if (msg.content.startsWith(`${prefix}kick`)) {
      // Assuming we mention someone in the message, this will return the user
      // Read more about mentions over at https://discord.js.org/#/docs/main/master/class/MessageMentions
      const user = msg.mentions.users.first();
      var ping = new Date().getTime() - msg.createdTimestamp;
      // If we have a user mentioned
      if (user) {
        // Now we get the member from the user
        const member = msg.guild.member(user);
        // If the member is in the guild
        if (member) {
          /**
           * Kick the member
           * Make sure you run this on a member, not a user!
           * There are big differences between a user and a member
           */
          member
            .kick('')
            .then(() => {
              // We let the message author know we were able to kick the person
              msg.reply(`Successfully kicked ${user.tag}` + " | " + "Ping time: " + ping);
            })
            .catch(err => {
              // An error happened
              // This is generally due to the bot not being able to kick the member,
              // either due to missing permissions or role hierarchy
              msg.reply('I was unable to kick the member');
            });
        } else {
          // The mentioned user isn't in this guild
          msg.reply("That user isn't in this guild!");
        }
        // Otherwise, if no user was mentioned
      } else {
        msg.reply("You didn't mention the user to kick!");
      }
    }
  }

  //Ban Module
  if (msg.member.hasPermission("BAN_MEMBERS")) {
    if (msg.content.startsWith(`${prefix}ban`)) {
      // Assuming we mention someone in the message, this will return the user
      // Read more about mentions over at https://discord.js.org/#/docs/main/master/class/MessageMentions
      const user = msg.mentions.users.first();
      var ping = new Date().getTime() - msg.createdTimestamp;
      // If we have a user mentioned
      if (user) {
        // Now we get the member from the user
        const member = msg.guild.member(user);
        // If the member is in the guild
        if (member) {
          /**
           * Kick the member
           * Make sure you run this on a member, not a user!
           * There are big differences between a user and a member
           */
          member
            .ban('')
            .then(() => {
              // We let the message author know we were able to kick the person
              msg.reply(`Successfully banned ${user.tag}` + " | " + "Ping time: " + ping);
            })
            .catch(err => {
              // An error happened
              // This is generally due to the bot not being able to kick the member,
              // either due to missing permissions or role hierarchy
              msg.reply('I was unable to ban the member');
            });
        } else {
          // The mentioned user isn't in this guild
          msg.reply("That user isn't in this guild!");
        }
        // Otherwise, if no user was mentioned
      } else {
        msg.reply("You didn't mention the user to ban!");
      }
    }
  }
});

client.login(token);