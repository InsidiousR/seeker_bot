const config = require('./config.json')
const { VK } = require('vk-io');
const { HearManager } = require('@vk-io/hear');

const braille = require('./commands/braille');

const vk = new VK({
    token: config.token
});

const command = new HearManager();
vk.updates.on('message', command.middleware);

function collectForwardMessages(context) {
    var messages = context.forwards.map(msgContext => msgContext.text);
    if (context.replyMessage) {
        messages.push(context.replyMessage.text);
    }

    return messages;
}

function wrapResponse(comment, str) {
    return "Seeker Bot: " + comment + "\n" + str;
}

command.hear('/русскийплиз', async (context) => {
    if (context.peerType != "chat"){
        return;
    }
    var messages = collectForwardMessages(context);
    if (messages.length > 0) {
        var translates = [];
        messages.forEach(str => {
            translates.push(braille.decodeRU(str));
        });
        context.send(wrapResponse("брайль->русский", translates.join("\n")));
    }
})
command.hear('/английскийплиз', async (context) => {
    if (context.peerType != "chat"){
        return;
    }
    var messages = collectForwardMessages(context);
    if (messages.length > 0) {
        var translates = [];
        messages.forEach(str => {
            translates.push(braille.decodeEN(str));
        });
        context.send(wrapResponse("брайль->английский", translates.join("\n")));
    }
})

var baseSunndraChance = 1.0;
var currentSunndraChance = 1.0;
var baseSuperSunndraChance = 0.1;
var currentSuperSunndraChance = 0.1;

command.hear(/^.*$/, async (context) => {
    if (context.peerType != "chat"){
        return;
    }
    var r = Math.random() * 100;
    var checkChance = r < currentSunndraChance;
    var checkSuper = r < currentSuperSunndraChance;
    var resetChances = checkChance || checkSuper;
    console.log("chances: " + currentSunndraChance + "/" + currentSuperSunndraChance + " vs " + r);
    if (checkSuper){
        context.send("АХЪАХЪАЪХАВПАЪЖХЭВЫПЪХВЫАЪПАВЪПХПЫВАЪХ");
    } else
    if (checkChance){
        context.send("ахахахаха");
    }
    if (resetChances){
        currentSunndraChance = baseSunndraChance;
        currentSuperSunndraChance = baseSuperSunndraChance;
    } else {
        currentSunndraChance += 0.1;
        currentSuperSunndraChance += 0.01;
    }
})

vk.updates.start()
    .then(() => console.log('ok'))
    .catch(console.error);
