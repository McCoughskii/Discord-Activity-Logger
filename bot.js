const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");

var Activities;

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
    }

    var time = newhour + ":" + min;

    var ampm = function () {
        if (hour > 12) {
            return "PM";
        } else {
            return "AM";
        }
    }

    return time + " " + ampm();
}

client.on('ready', () => {
    console.log(`\nLogged in as ${client.user.tag}!
Currently Apart Of ${client.guilds.size} Server/s
Bot Started At: ${client.readyAt}`);
});

client.on('message', message => {

    if (!message.guild || message.author.bot) return; 
    
    // We also stop processing if the message does not start with our prefix.
    if (message.content.indexOf(config.prefix) !== 0) return;

    //Then we use the config prefix to get our arguments and command:
    const args = message.content.split(/\s+/g);
    const command = args.shift().slice(config.prefix.length).toLowerCase();

    let activityChannelSend = message.guild.channels.find(ch => ch.name === "activity-logs");

    // clockin command
    if (command === 'clockin') {

        if (message.guild.channels.find(ch => ch.name === "activity-logs") === null ){
            message.guild.createChannel("activity-logs", "text");
            return message.reply("The Activity Log Channel Did Not Exist Please Try Again");
        }

        message.channel.send("You Have Clocked In " + message.author);

        activityChannelSend.send({
            "embed": {
                "color": 6207911,
                "timestamp": new Date(),
                "footer": {
                    "icon_url": client.user.avatarURL,
                    "text": "ImperialRP Activity Logger"
                },
                "author": {
                    "name": message.author.tag,
                    "icon_url": message.author.avatarURL,
                },
                "title": "Clocked In",
                "fields": [{
                        "name": "Date",
                        "value": getDate(),
                    },
                    {
                        "name": "Time",
                        "value": getTime(),
                    }
                ]
            }
        }).catch(console.error(error));

        message.delete;

    }

    // clockout command
    if (command === 'clockout') {

        if (!message.guild.channels.exists(ch => ch.name === "activity-logs")){
            message.guild.createChannel("activity-logs", "text");
            return message.reply("The Activity Log Channel Did Not Exist Please Try Again");
        }

        message.channel.send("You Have Clocked Out " + message.author);

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
                    "icon_url": client.user.avatarURL,
                    "text": "ImperialRP Activity Logger"
                },
                "author": {
                    "name": message.author.tag,
                    "icon_url": message.author.avatarURL,
                },
                "title": "Clocked Out",
                "fields": [{
                        "name": "Date",
                        "value": getDate(),
                    },
                    {
                        "name": "Time",
                        "value": getTime(),
                    },
                    {
                        "name": "Activities",
                        "value": Activities,
                    }
                ]
            }
        }).catch(console.error(error));

        message.delete;

    }


});


client.login(config.token);