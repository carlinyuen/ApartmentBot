// var restify = require('restify');
var builder = require('botbuilder');

// Create bot and add dialogs
var bot = new builder.BotConnectorBot({ appId: 'apartmentbot', appSecret: '00eed7d3f1404af89d9f9dad303453ee' });
// bot.add('/', function (session) {
//     session.send('Hello World');
// });
bot.add('/', [
    function (session, args, next) {
        if (!session.userData.name) {
            session.beginDialog('/profile');
        } else {
            next();
        }
    },
    function (session, results) {
        session.send('Hello %s!', session.userData.name);
    }
]);
bot.add('/profile', [
    function (session) {
        builder.Prompts.text(session, 'Hi! What is your name?');
    },
    function (session, results) {
        session.userData.name = results.response;
        session.endDialog();
    }
]);

exports.handler = function(event, context) {
    console.log("Initalized Bot...");
    context.succeed("Hello World!");
};

// Setup Restify Server
// var server = restify.createServer();
// server.post('/api/messages', bot.verifyBotFramework(), bot.listen());
// server.listen(process.env.port || 3978, function () {
//     console.log('%s listening to %s', server.name, server.url);
// });
