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
        else if (!session.userData.bathrooms) {
            session.beginDialog('/bathrooms');
        }
        else if (!session.userData.borough) {
            session.beginDialog('/borough');
        }
        else if (session.userData.borough.toLowerCase() == 'manhattan' && !session.userData.manhattan_neighborhood) {
            session.beginDialog('/manhattan_neighborhood');
        }
        else {
            next();
        }
    },
    function (session, results) {
      /*  if (session.userData.name && !session.userData.price) {
            session.send('Hello %s! Let\'s collect some info to help find you an apartment.', session.userData.name);
            session.beginDialog('/price');
        } */
        //else if (session.userData.price && !session.userData.rooms) {
        //    session.send('Hello %s! I\'ll find you an apartment for less than $%d per month', session.userData.name, session.userData.price); 
        //}
        if (session.userData.bathrooms && session.userData.rooms && session.userData.price && session.userData.name && session.userData.borough) {
            var location;
            if (session.userData.manhattan_neighborhood) 
                location = session.userData.manhattan_neighborhood.toLowerCase() + " " + session.userData.borough;
            else
                location = session.userData.borough;

            var string = "Great! I\'ll find you an apartment for less than $" + session.userData.price + " per month with " + session.userData.rooms + " rooms and " + session.userData.bathrooms + " bathrooms in " + location;    
            session.send(string);
            //session.send('Great! I\'ll find you an apartment for less than $%d per month with %d rooms and %d bathrooms in %s', session.userData.price, session.userData.rooms, session.userData.bathrooms, session.userData.borough, session.userData.manhattan_neighborhood);    
        }
        else {
            session.send('crap...'); 
        }        
    }
]);
bot.add('/profile', [
    function (session) {
         session.send('Welcome to brokerless! I\'ll help you find the prefect apartment.');
         builder.Prompts.text(session, 'What\'s your name?');
    },
    function (session, results) {
        session.userData.name = results.response;
        session.beginDialog('/');//session.endDialog();
    }
]);

bot.add('/price', [
    function (session) {
        session.send('Hello %s! Let\'s collect some info to help find you an apartment.', session.userData.name);
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

bot.add('/bathrooms', [
    function (session) {
        builder.Prompts.text(session, "How many bathrooms do you need?");
    },
    function (session, results) {
        session.userData.bathrooms = results.response;
        session.beginDialog('/');
    //    session.endDialog();
    }
]); 

bot.add('/borough', [
    function (session) {
        builder.Prompts.text(session, "Which NYC borough would you like to live in? Manhattan, Brooklyn, Queen, Bronx, or Staten Island?");
    },
    function (session, results) {
        session.userData.borough = results.response;
        session.beginDialog('/');
    //    session.endDialog();
    }
]); 

bot.add('/manhattan_neighborhood', [
    function (session) {
        builder.Prompts.text(session, "Which neighborhood do you prefer? downtown, midtown, upper east side, or upper west side?");
    },
    function (session, results) {
        session.userData.manhattan_neighborhood = results.response;
        session.beginDialog('/');
    //    session.endDialog();
    }
]);

/*bot.add('/firstRun', [
    function (session) {
        session.send("Why hello thereeeee");
        //builder.Prompts.text(session, "Which neighborhood do you prefer? downtown, midtown, upper east side, or upper west side?");
    }/*,
    function (session, results) {
        session.userData.manhattan_neighborhood = results.response;
        session.beginDialog('/');
    //    session.endDialog();
    }
]);
*/


// Setup Restify Server
var server = restify.createServer();
server.post('/api/messages', bot.verifyBotFramework(), bot.listen());
server.listen(process.env.port || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});
