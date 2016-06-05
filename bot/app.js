var restify = require('restify');
var builder = require('botbuilder');
var request = require('request');
var cheerio = require('cheerio');


var areaMap = {'downtown':'102', 'midtown':'119', 'upper west side':'135', 'upper east side':'139', 'upper manhattan':'144'};



// Create bot and add dialogs
var bot = new builder.BotConnectorBot({ appId: 'apartmentbot', appSecret: '00eed7d3f1404af89d9f9dad303453ee' });
// bot.add('/', function (session) {
//     session.send('Hello World');
// });

var stopMe = false;
var carlinNumber = '+12345679763';
var twilioNumber = '+12343086132';

var myFunction = function() {}

/*var callback = function(num, x) {
  console.log("HERE12:" + x);
  session.userData.apart1 = x;
  session.send(
}*/

var map0 = new Object();
map0['type_nabe'] = '';
map0['listing'] = '';
map0['price'] = '';
map0['bed'] = '';
map0['bath'] = '';
map0['site'] = '';

var map1 = new Object();
map1['type_nabe'] = '';
map1['listing'] = '';
map1['price'] = '';
map1['bed'] = '';
map1['bath'] = '';
map1['site'] = '';

var map2 = new Object();
map2['type_nabe'] = '';
map2['listing'] = '';
map2['price'] = '';
map2['bed'] = '';
map2['bath'] = '';
map2['site'] = '';

var map3 = new Object();
map3['type_nabe'] = '';
map3['listing'] = '';
map3['price'] = '';
map3['bed'] = '';
map3['bath'] = '';
map3['site'] = '';

var map4 = new Object();
map4['type_nabe'] = '';
map4['listing'] = '';
map4['price'] = '';
map4['bed'] = '';
map4['bath'] = '';
map4['site'] = '';

var map5 = new Object();
map5['type_nabe'] = '';
map5['listing'] = '';
map5['price'] = '';
map5['bed'] = '';
map5['bath'] = '';
map5['site'] = '';

var checkReset = function(x) {
    if (x == 'reset') {

          //  session.send('Resetting');
            session.userData.bathrooms = null;
            session.userData.rooms = null;
            session.userData.price = null;
            session.userData.name = null;
            session.userData.borough = null;
            session.userData.selection = null;
            session.userData.results = false;
           // session.send('Reset');
            return true;

    }
    else
        return false;

}

/*
     var myMap = new Map();
            for (var i = 0; i < 15; i++) {
                 myMap.set(i, {'type_nabe':'', 'listing':'', 'prince':'', 'bed':'', 'bath':'', 'site':''});
            };
*/
bot.add('/', [
    function (session, args, next) { //session.send("name:%s, price:%d", session.userData.name, session.userData.price);
   // session.send('here000');

        if (!session.userData.name) {
            session.beginDialog('/profile');
            session.userData.results = false;
            session.userData.interest = false;
            session.userData.results = false;
            session.userData.interest = false;
            session.userData.printed = false;
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
        /*else if (!session.userData.selection) {
            session.beginDialog('selection');
        }*/
        else if (session.userData.results && session.userData.interest && session.userData.borough.toLowerCase() == 'manhattan' && session.userData.manhattan_neighborhood && !session.userData.contact) {
            session.beginDialog('/contact');
        }
        else if (session.userData.contact && session.userData.results && session.userData.interest && session.userData.borough.toLowerCase() == 'manhattan' && session.userData.manhattan_neighborhood && !session.userData.contact) {
        //    session.send("IIEIE");
            session.beginDialog('/number');
        }

        else {
            next();
        }
    },
    function (session, results) {

        // set to false

        if (results.response == 'reset') {
            session.userData.bathrooms = null;
            session.userData.rooms = null;
            session.userData.price = null;
            session.userData.name = null;
            session.userData.borough = null;
            session.userData.selection = null;
            session.userData.results = false;
            session.beginDialog('/');

        }


      /*  if (session.userData.name && !session.userData.price) {
            session.send('Hello %s! Let\'s collect some info to help find you an apartment.', session.userData.name);
            session.beginDialog('/price');
        } */
        //else if (session.userData.price && !session.userData.rooms) {
        //    session.send('Hello %s! I\'ll find you an apartment for less than $%d per month', session.userData.name, session.userData.price);
        //}

        if (!session.userData.results && session.userData.bathrooms && session.userData.rooms && session.userData.price && session.userData.name && session.userData.borough && !session.userData.selection) {
            var location;

            //session.userData.results = true;

            if (session.userData.manhattan_neighborhood)
                location = session.userData.manhattan_neighborhood.toLowerCase() + " " + session.userData.borough;
            else
                location = session.userData.borough;


            minprice = '1000';
            maxprice = session.userData.price.toString();
            bed = session.userData.rooms.toString();
            bath = session.userData.bathrooms.toString();
            area = areaMap[session.userData.manhattan_neighborhood.toLowerCase()];

            var string = "Great! I\'ll find you an apartment for less than $" + maxprice + " per month with " + bed + " rooms and " + bath + " bathrooms in " + session.userData.manhattan_neighborhood + "...";

            if (!session.userData.printed) {
                session.send(string);
                session.userData.printed = true;
            }

            url = 'http://streeteasy.com/for-rent/nyc/price:'+minprice+'-'+maxprice+'%7Carea:'+area+'%7Cbeds%3E='+bed+'%7Cbaths%3E='+bath+'%7Cno_fee:1';





            var simple = 'NO';
            session.userData.apart1 = 'NO';

            request(url, function(error, response, html){
              if(!error){

                var resultsString = '';

                var $ = cheerio.load(html);

                var listing, address, price, site, bed, bath, type_nabe;

                $('.details-title').each(function(i, elem){
                  var data = $(this);
                  listing = data.children().first().text().trim();
                  site = 'http://streeteasy.com' + data.children().first().attr('href');
                  price = data.next().children().filter('.price').text().trim();
                  var bb = data.next().next()
                  bed = bb.children().first().text().trim();
                  bath = bb.children().next().text().trim();
                  type_nabe = data.next().next().next().text().trim();


                  console.log('listing #'+i);
                  console.log(type_nabe);
                  console.log(listing);
                  console.log(price + ' ' + bed + ' ' + bath);
                  console.log(site);
                  console.log();

                 // listings[i] = {type_nabe, listing, price, bed, bath, site};
              /*    myMap.get(i).type_nabe = type_nabe;
                  (myMap.get(i))['listing'] = listing;
                  myMap.get(i).price = price;
                  myMap.get(i).bed = bed;
                  myMap.get(i).bath = bath;
                  myMap.get(i).site = site;
                  */

                  if (i==0) {

                      map0['type_nabe'] = type_nabe;
                      map0['listing'] = listing;
                      map0['price'] = price;
                      map0['bed'] = bed;
                      map0['bath'] = bath;
                      map0['site'] = site;
                  }
                  else if (i==1) {
                      map1['type_nabe'] = type_nabe;
                      map1['listing'] = listing;
                      map1['price'] = price;
                      map1['bed'] = bed;
                      map1['bath'] = bath;
                      map1['site'] = site;
                  }
                  else if (i==2) {
                      map2['type_nabe'] = type_nabe;
                      map2['listing'] = listing;
                      map2['price'] = price;
                      map2['bed'] = bed;
                      map2['bath'] = bath;
                      map2['site'] = site;
                  }
                  else if (i==3) {
                      map3['type_nabe'] = type_nabe;
                      map3['listing'] = listing;
                      map3['price'] = price;
                      map3['bed'] = bed;
                      map3['bath'] = bath;
                      map3['site'] = site;
                  }
                  else if (i==4) {
                      map4['type_nabe'] = type_nabe;
                      map4['listing'] = listing;
                      map4['price'] = price;
                      map4['bed'] = bed;
                      map4['bath'] = bath;
                      map4['site'] = site;
                  }
                  else if (i==5) {
                      map5['type_nabe'] = type_nabe;
                      map5['listing'] = listing;
                      map5['price'] = price;
                      map5['bed'] = bed;
                      map5['bath'] = bath;
                      map5['site'] = site;
                  }

                   //session.userData.apart1 = 'YES';

                  //callback(i, listing);




//                  myMap.set(i, {'type_nabe':type_nabe, 'listing':listing, 'prince':price, 'bed':bed, 'bath':bath, 'site':site});
                     if (i < 6 && !session.userData.results)
                        session.send("Listing #" + (i+1) + "\n" + type_nabe + "\n" + listing + "\n" + price + "\n" + bed + "\n" + bath + "\n" + site + "\n");
                     else
                        session.userData.results = true;
                    //if (i == 6) session.beginDialog('/selection');
                    //if (i<6) resultsString[i] = "Listing #" + i + "\n" + type_nabe + "\n" + listing + "\n" + price + "\n" + bed + "\n" + bath + "\n" + site + "\n";

                 // session.send(myMap.get(i).listing);
                 // session.send(myMap.get(i).price);
                  //console.log(myMap.get(i));
                })

              }
             /* if (!session.userData.results) {
                session.send(resultsString);
                session.userData.results = true;

              }*/
              session.beginDialog('/selection');
            })



            console.log('TEST123');
//            console.log(myMap.get(1)['listing'].toString());
            //console.log(session.userData.apart1);
            //console.log(map1['listing'].toString());
            console.log('TEST4');
            //session.send(myMap.get(1).toString());



            if (!stopMe) {
                stopMe = true;
             //   session.send('test listing: ' + listings[0].listing);

            }

            //session.send('Great! I\'ll find you an apartment for less than $%d per month with %d rooms and %d bathrooms in %s', session.userData.price, session.userData.rooms, session.userData.bathrooms, session.userData.borough, session.userData.manhattan_neighborhood);
        }


        else {
            //session.send('(end)');
            session.beginDialog('/');
        }
    }
]);
bot.add('/profile', [
    function (session) {
         session.send('Welcome to brokerless! I\'ll help you find the prefect apartment.');
         builder.Prompts.text(session, 'What\'s your name?');
    },
    function (session, results) {
        if (results.response == 'reset') {
            session.userData.bathrooms = null;
            session.userData.rooms = null;
            session.userData.price = null;
            session.userData.name = null;
            session.userData.borough = null;
            session.userData.selection = null;
            session.userData.results = false;

        }
        else {
            session.userData.name = results.response;
        }
        session.beginDialog('/');

    }
]);

bot.add('/price', [
    function (session) {
        session.send('Hello %s! Let\'s collect some info to help find you an apartment.', session.userData.name);
        builder.Prompts.text(session, "What's the most you'd want to pay per month?");
    },
    function (session, results) {
        if (results.response == 'reset') {
            session.userData.bathrooms = null;
            session.userData.rooms = null;
            session.userData.price = null;
            session.userData.name = null;
            session.userData.borough = null;
            session.userData.selection = null;
            session.userData.results = false;
        }
        else {
            session.userData.price = results.response;
        }
        session.beginDialog('/');
    //    session.endDialog();
    }
]);

bot.add('/rooms', [
    function (session) {
        builder.Prompts.text(session, "How many bedrooms do you need?");
    },
    function (session, results) {
        if (results.response == 'reset') {
            session.userData.bathrooms = null;
            session.userData.rooms = null;
            session.userData.price = null;
            session.userData.name = null;
            session.userData.borough = null;
            session.userData.selection = null;
            session.userData.results = false;
        }
        else {
            session.userData.rooms = results.response;
        }
        session.beginDialog('/');

        /*
        else {
            session.send("HERE999");
            session.beginDialog('/');
        }*/
    //    session.endDialog();
    }
]);

bot.add('/bathrooms', [
    function (session) {
        builder.Prompts.text(session, "How many bathrooms do you need?");
    },
    function (session, results) {
        if (results.response == 'reset') {
            session.userData.bathrooms = null;
            session.userData.rooms = null;
            session.userData.price = null;
            session.userData.name = null;
            session.userData.borough = null;
            session.userData.selection = null;
            session.userData.results = false;
        }
        else {
            session.userData.bathrooms = results.response;
        }
        session.beginDialog('/');
    //    session.endDialog();
    }
]);

bot.add('/borough', [
    function (session) {
        builder.Prompts.text(session, "Which NYC borough would you like to live in? Manhattan, Brooklyn, Queen, Bronx, or Staten Island?");
    },
    function (session, results) {
        if (results.response == 'reset') {
            session.userData.bathrooms = null;
            session.userData.rooms = null;
            session.userData.price = null;
            session.userData.name = null;
            session.userData.borough = null;
            session.userData.selection = null;
            session.userData.results = false;
        }
        else {
            session.userData.borough = results.response;
        }
        session.beginDialog('/');    //    session.endDialog();
    }
]);

bot.add('/manhattan_neighborhood', [
    function (session) {
        builder.Prompts.text(session, "Which neighborhood do you prefer? Downtown, midtown, upper east side, upper west side, or upper Manhattan?");
    },
    function (session, results) {
        if (results.response == 'reset') {
            session.userData.bathrooms = null;
            session.userData.rooms = null;
            session.userData.price = null;
            session.userData.name = null;
            session.userData.borough = null;
            session.userData.selection = null;
            session.userData.results = false;
        }
        else {
            session.userData.manhattan_neighborhood = results.response;
        }
        session.beginDialog('/');        session.beginDialog('/');
    //    session.endDialog();
    }
]);

bot.add('/selection', [
    function (session, next) {

    //    session.send('here11');
        if (!session.userData.interest) {
            builder.Prompts.text(session, "Which listing number are you interested in?");
            session.userData.interest = true;
        }
        else
            next();
    },
    function (session, results) {
 //session.send('here33333');
        if (results.response == 'reset') {
            session.userData.bathrooms = null;
            session.userData.rooms = null;
            session.userData.price = null;
            session.userData.name = null;
            session.userData.borough = null;
            session.userData.selection = null;
            session.userData.results = false;
        }
        else {

            session.userData.selection = results.response;
            //session.send("That's listing at " + myMap.get(session.userData.selection));



    /*        session.send('map1'+ map1['listing']);
            */

            var address;
            if (session.userData.selection === '1') {
                address = map0['listing'];
                session.send("You've selected the listing at " + address);
            }
            else if (session.userData.selection === '2') {
                address = map1['listing'];
                session.send("You've selected the listing at " + map1['listing']);

            }
            else if (session.userData.selection === '3') {
                session.send("You've selected the listing at " + map2['listing']);
                address = map2['listing'];
            }
            else if (session.userData.selection === '4') {
                session.send("You've selected the listing at " + map3['listing']);
                address = map3['listing'];
            }
            else if (session.userData.selection === '5') {
                session.send("You've selected the listing at " + map4['listing']);
                address = map4['listing'];
            }
            else if (session.userData.selection === '6') {
                session.send("You've selected the listing at "+ map5['listing']);
                address = map5['listing'];
            }
            else
                session.send('shoot!');

            session.userData.address = address;
            //session.send("Sure, we'll get someone to help you find ")

        }
        session.beginDialog('/');
    //    session.endDialog();
    }
]);

bot.add('/contact', [
    function (session) {
        builder.Prompts.text(session, "Would you like us to put you in touch with someone at Brokerless who can visit the apartment on your behalf?");
    },
    function (session, results) {
        session.userData.contact = results.response;
        if (results.response == 'reset') {
            session.userData.bathrooms = null;
            session.userData.rooms = null;
            session.userData.price = null;
            session.userData.name = null;
            session.userData.borough = null;
            session.userData.selection = null;
            session.userData.results = false;
        }
        else if (results.response == 'yes') {
            //session.send("Great! Hold on one moment...")
           // session.send("YES RESPONSE");
            session.beginDialog('/number');
        }
        else {
            session.send("Sure thing. You can still go and check it out yourself.")
        }
        //session.beginDialog('/');        session.beginDialog('/');
    //    session.endDialog();
    }
]);


bot.add('/number', [
    function (session) {
        builder.Prompts.text(session, "What's your phone number? We'll have someone get in touch with you about a visit to that apartment. They'll be able to FaceTime you when they visit.");
    },
    function (session, results) {
        session.userData.number = results.response;
        if (results.response == 'reset') {
            session.userData.bathrooms = null;
            session.userData.rooms = null;
            session.userData.price = null;
            session.userData.name = null;
            session.userData.borough = null;
            session.userData.selection = null;
            session.userData.results = false;
        }
        else {
            session.send("Great! You'll be contacted by a Brokerless teammember shortly...")

            //require the Twilio module and create a REST client
            var client = require('twilio')('AC93b9823919f052d8dcfeb434c68cba6c', '530457ab01624b26fe6baad1d3e42c8b');

            // Send an SMS text message
            client.sendMessage({
              to:carlinNumber, from:twilioNumber,
              body: 'Brokerless friend in need!',
            }, function(err, responseData) {
              if (!err) {
                console.log(responseData.from);
                console.log(responseData.body);
              } else {
                console.log(err);
              }
            });
            client.sendMessage({
              to:carlinNumber, from:twilioNumber,
              body: 'Contact #: ' + session.userData.number,
            }, function(err, responseData) {
              if (!err) {
                console.log(responseData.from);
                console.log(responseData.body);
              } else {
                console.log(err);
              }
            });
            client.sendMessage({
              to:carlinNumber, from:twilioNumber,
              body: 'Addy: ' + session.userData.address,
            }, function(err, responseData) {
              if (!err) {
                console.log(responseData.from);
                console.log(responseData.body);
              } else {
                console.log(err);
              }
            });
        }
        //session.beginDialog('/');        session.beginDialog('/');
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
