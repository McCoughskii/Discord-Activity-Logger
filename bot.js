const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");

var Activities;
var lastmsg;

function getDate() {

    var date = new Date();

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return month + "/" + day + "/" + year;

}

function getTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    if (hour > 12) {
        var newhour = hour - 12;
    } else {
        var newhour = hour;
    }

    var time = newhour + ":" + min;

    var ampm = function () {
        if (hour >= 12) {
            return "PM";
        } else {
            return "AM";
        }
    }

    return time + " " + ampm();
}

client.on('ready', () => {
    console.log(`\nLogged in as ${client.user.tag}!\nCurrently Apart Of ${client.guilds.size} Server/s\nBot Started At: ${client.readyAt}`);
    client.user.setActivity(config.prefix + 'help', { type: 'WATCHING' }).then(presence => console.log(`Activity set to ${presence.game ? presence.game.name : 'none'}`))
    .catch(console.error);
});

// log when joining a server
client.on('guildCreate', guild => {
    console.log(`Server Joined: ${guild.name}\nThis Server Has ${guild.memberCount} Member/s`);
})

// log when kicked from a server
client.on('guildDelete', guild => {
    console.log(`Server Left: ${guild.name}`);
})

client.on('message', message => {

    if (!message.guild || message.author.bot) return;

    // We also stop processing if the message does not start with our prefix.
    if (message.content.indexOf(config.prefix) !== 0) return;

    //Then we use the config prefix to get our arguments and command:
    const args = message.content.split(/\s+/g);
    const command = args.shift().slice(config.prefix.length).toLowerCase();
    
    // find activity-logs channel
    let activityChannelSend = message.guild.channels.find(ch => ch.name === config.logChannel);

    if (command === 'help') {

        message.react('✅').then(message.delete(3000));

        //message.delete().catch(console.error);

        message.author.send({
            "embed": {
                "color": 6207911,
                "timestamp": new Date(),
                "footer": {
                    "text": "This Message Will Be Deleted In 20 Seconds"
                },
                "title": "My Commands",
                "fields": [{
                        "name": "Clock In: " + "`" + config.prefix + "clockin" + "`",
                        "value": "Clocks You In And Sends A Message To #activity-logs"
                    },
                    {
                        "name": "Clock Out: " + "`" + config.prefix + "clockout <activites>" + "`",
                        "value": "Clocks You Out And Sends A Message To #activity-logs With Your Activites"
                    },
                    {
                        "name": "Help: " + "`" + config.prefix + "help" + "`",
                        "value": "Shows This Message"
                    }
                ]
            }
        }).then(msg => {
            msg.delete(20000)
        }).catch(console.error());
    }

    // clockin command
    if (command === 'clockin') {

        message.delete().catch(console.error);

        if (!message.guild.channels.exists(ch => ch.name === config.logChannel)) {
            message.guild.createChannel(config.logChannel, "text");
            return message.reply("The Activity Log Channel Did Not Exist Please Try Again");
        }

        console.log(`${message.author.tag} Has Clocked In On Server: ${message.guild.name}`);

        // notify user that they have clocked In then deletes the message after 5 seconds
        message.channel.send("You Have Successfully Clocked In, " + message.author).then(msg => {
            msg.delete(5000)
        }).catch(console.error);

        activityChannelSend.send({
            "embed": {
                "color": 6207911,
                "timestamp": new Date(),
                "footer": {
                    "icon_url": 'https://discordapp.com/assets/0e291f67c9274a1abdddeb3fd919cbaa.png',
                    "text": "Activity Logger"
                },
                "author": {
                    "name": message.author.tag,
                    "icon_url": message.author.avatarURL
                },
                "title": "Clocked In",
                "fields": [{
                        "name": "User",
                        "value": message.author.toString()
                    },
                    {
                        "name": "Date",
                        "value": getDate()
                    },
                    {
                        "name": "Time",
                        "value": getTime()
                    }
                ]
            }
        }).catch(console.error());

    }

    // clockout command
    if (command === 'clockout') {

        message.delete().catch(console.error);

        if (!message.guild.channels.exists(ch => ch.name === config.logChannel)) {
            message.guild.createChannel(config.logChannel, "text");
            return message.reply("The Activity Log Channel Did Not Exist Please Try Again");
        }

        console.log(`${message.author.tag} Has Clocked Out On Server ${message.guild.name}`);

        // notify user that they have clocked out then delete after 5 seconds
        message.channel.send("You Have Clocked Out, " + message.author).then(msg => {
            msg.delete(5000)
        }).catch(console.error);

        if (JSON.stringify(args) === "[]" || null) {
            Activities = "None Specified";
        } else {
            Activities = ""
            for (var i = 0; args.length > i; i++) {
                Activities = Activities + args[i] + " ";
            }
        }

        activityChannelSend.send({
            "embed": {
                "color": 6207911,
                "timestamp": new Date(),
                "footer": {
                    "icon_url": 'https://discordapp.com/assets/0e291f67c9274a1abdddeb3fd919cbaa.png',
                    "text": "Activity Logger"
                },
                "author": {
                    "name": message.author.tag,
                    "icon_url": message.author.avatarURL,
                },
                "title": "Clocked Out",
                "fields": [{
                        "name": "User",
                        "value": message.author.toString()
                    },
                    {
                        "name": "Date",
                        "value": getDate()
                    },
                    {
                        "name": "Time",
                        "value": getTime()
                    },
                    {
                        "name": "Activities",
                        "value": Activities
                    }
                ]
            }
        }).catch(console.error);

    }

});


client.login(config.token);