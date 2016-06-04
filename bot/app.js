var restify = require('restify');
var builder = require('botbuilder');

// Create bot and add dialogs
var bot = new builder.BotConnectorBot({ appId: 'apartmentbot', appSecret: '00eed7d3f1404af89d9f9dad303453ee' });
// bot.add('/', function (session) {
//     session.send('Hello World');
// });
bot.add('/', [
    function (session, args, next) { //session.send("name:%s, price:%d", session.userData.name, session.userData.price);
        if (!session.userData.name) {
            session.beginDialog('/profile');
        } 
        else if (!session.userData.price) {
            session.beginDialog('/price');
        }
        else if (!session.userData.rooms) {
            session.beginDialog('/rooms');
        }
        else {
            next();
        }
    },
    function (session, results) {
        if (session.userData.name && !session.userData.price) {
            session.send('Hello %s!', session.userData.name);
            session.beginDialog('/price');
        } 
        //else if (session.userData.price && !session.userData.rooms) {
        //    session.send('Hello %s! I\'ll find you an apartment for less than $%d per month', session.userData.name, session.userData.price); 
        //}
        else if (session.userData.rooms && session.userData.rooms && session.userData.price) {
             session.send('Hello %s!!!! I\'ll find you an apartment for less than $%d per month with %d rooms', session.userData.name, session.userData.price, session.userData.rooms);    
        }
        else {
            session.send('crap...'); 
        }
        
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

bot.add('/price', [
    function (session) {
        builder.Prompts.text(session, "What's the most you'd want to pay per month?");
    },
    function (session, results) {
        session.userData.price = results.response;
        session.beginDialog('/');
    //    session.endDialog();
    }
]);

bot.add('/rooms', [
    function (session) {
        builder.Prompts.text(session, "How many bedrooms do you need?");
    },
    function (session, results) {
        session.userData.rooms = results.response;
        session.beginDialog('/');
    //    session.endDialog();
    }
]);

// Setup Restify Server
var server = restify.createServer();
server.post('/api/messages', bot.verifyBotFramework(), bot.listen());
server.listen(process.env.port || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});
