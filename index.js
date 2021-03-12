const config = require('./config.json')
const { VK, API } = require('vk-io');
const { HearManager } = require('@vk-io/hear');

const braille = require('./commands/braille');

const vk = new VK({
    token: config.token
});
const api = new API({
	token: config.token
});

const command = new HearManager();
vk.updates.on('message', command.middleware);

function collectForwardMessages(context) {
    var messages = [];
    if (context.replyMessage) {
        messages.push(context.replyMessage.text);
    }
    if (context.forwards.length > 0) {
        context.forwards.forEach(msgContext => {
            messages.push(msgContext.text);
        });
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

vk.updates.start()
    .then(() => console.log('ok'))
    .catch(console.error);
