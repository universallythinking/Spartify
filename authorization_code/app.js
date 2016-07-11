/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */
 /**
  * This is an example of a basic node.js script that performs
  * the Authorization Code oAuth2 flow to authenticate against
  * the Spotify Accounts.
  *
  * For more information, read
  * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
  */
 var express = require('express'); // Express web server framework
 var request = require('request'); // "Request" library
 var querystring = require('querystring');
 var cookieParser = require('cookie-parser');

//////  Add Spotify Credentials Here ///////










//////  Add Spotify Credentials Here ///////

 var SpotifyWebApi = require('spotify-web-api-node');

 // credentials are optional
 var spotifyApi = new SpotifyWebApi({
   clientId : '23fda62574464d50be2ecfd8540353b5',
   clientSecret : '44c1395c8390426d8b6b3f938f29af58',
   redirectUri : 'http://localhost:5000/callback/'
 });

 /**
  * Generates a random string containing numbers and letters
  * @param  {number} length The length of the string
  * @return {string} The generated string
  */
 var generateRandomString = function(length) {
   var text = '';
   var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

   for (var i = 0; i < length; i++) {
     text += possible.charAt(Math.floor(Math.random() * possible.length));
   }
   return text;
 };

 var stateKey = 'spotify_auth_state';

 var app = express();

 app.use(express.static(__dirname + '/public'))
    .use(cookieParser());

 app.get('/login', function(req, res) {

   var state = generateRandomString(16);
   res.cookie(stateKey, state);

   // your application requests authorization
   var scope = 'user-read-private playlist-modify-private playlist-read-collaborative playlist-modify-public user-read-email';
   res.redirect('https://accounts.spotify.com/authorize?' +
     querystring.stringify({
       response_type: 'code',
       client_id: client_id,
       scope: scope,
       redirect_uri: redirect_uri,
       state: state
     }));
 });

 app.get('/callback', function(req, res) {

   // your application requests refresh and access tokens
   // after checking the state parameter

   var code = req.query.code || null;
   var state = req.query.state || null;
   var storedState = req.cookies ? req.cookies[stateKey] : null;

   if (state === null || state !== storedState) {
     res.redirect('/#' +
       querystring.stringify({
         error: 'state_mismatch'
       }));
   } else {
     res.clearCookie(stateKey);
     var authOptions = {
       url: 'https://accounts.spotify.com/api/token',
       form: {
         code: code,
         redirect_uri: redirect_uri,
         grant_type: 'authorization_code'
       },
       headers: {
         'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
       },
       json: true
     };

     request.post(authOptions, function(error, response, body) {
       if (!error && response.statusCode === 200) {

         var access_token = body.access_token,
             refresh_token = body.refresh_token;

         var options = {
           url: 'https://api.spotify.com/v1/me',
           headers: { 'Authorization': 'Bearer ' + access_token },
           json: true
         };

         // use the access token to access the Spotify Web API
         request.get(options, function(error, response, body) {
           console.log(body);
         });

         // we can also pass the token to the browser to make requests from there
         res.redirect('/#' +
           querystring.stringify({
             access_token: access_token,
             refresh_token: refresh_token
           }));
       } else {
         res.redirect('/#' +
           querystring.stringify({
             error: 'invalid_token'
           }));
       }
     });
   }
 });

 app.get('/refresh_token', function(req, res) {

   // requesting access token from refresh token
   var refresh_token = req.query.refresh_token;
   var authOptions = {
     url: 'https://accounts.spotify.com/api/token',
     headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
     form: {
       grant_type: 'refresh_token',
       refresh_token: refresh_token
     },
     json: true
   };

   request.post(authOptions, function(error, response, body) {
     if (!error && response.statusCode === 200) {
       var access_token = body.access_token;
       res.send({
         'access_token': access_token
       });
     }
   });
 });
var databaseURL = 'postgres://eeamsawbcvneme:v-U-s4vIw3virD9kX5vo9W2DFg@ec2-54-235-95-188.compute-1.amazonaws.com:5432/d6480t5vkn701i';
var pg = require('pg');
pg.defaults.ssl = true;

var bodyParser = require('body-parser')

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({
    extended: true
}));

app.post('/create', function (request, response) {
    pg.connect(process.env.DATABASE_URL || databaseURL, function (err, client) {
        if (err) { throw err; }
        var partify = request.headers.referer.indexOf("?party=");
        console.log('Connected to postgres! Getting schemas...');
        client
            .query('select * from users where username in ($1)', [request.body.username])
            .on('end', function (responder) {
                if (request.body.party && request.body.username && request.body.playlist && request.body.lastFM && !request.body.search) {
                    try {
                        client
                            .query("UPDATE users SET access_token = $1 where username in ($2)", [request.body.access_token, request.body.username]);
                        client
                            .query("UPDATE users SET playlist = $1 where username in ($2)", [request.body.playlist, request.body.username]);
                        client
                            .query("UPDATE users SET party = $1 where username in ($2)", [request.body.party.toUpperCase(), request.body.username])
                            .on('end', function (res) {
                                console.log(res);
                                if (err) { throw err };
                                var results = "Hello fellow coders!!";
                                response.send(results);
                            });
                    }
                    catch (exception) {
                        console.log(exception);
                    }
                }
                else if (request.body.party && request.body.username && request.body.playlist && request.body.lastFM && !request.body.search) {
                    try {
                        client
                            .query("INSERT INTO users values($1, $2, $3, $4, $5)", [request.body.party.toUpperCase(), request.body.access_token, request.body.lastFM, request.body.username, request.body.playlist])
                            .on('end', function (res) {
                                console.log(res);
                                if (err) { throw err };
                                var results = "Hello fellow coders!!";
                                response.send(results);
                            });
                    }
                        catch (exception) {
                        console.log(exception);
                    }
                }
                else {
                    try {
                        client
                            .query('select * from users where party in ($1)', [request.body.search.toUpperCase()])
                        .on('end', function (res) {
                        if (err) { throw err };
                        var result = {};
                        if (res.rows[0]) {
                            result["access_token"] = JSON.stringify(res.rows[0].access_token);
                            result["lastFM"] = JSON.stringify(res.rows[0].lastFM);
                            result["partyID"] = JSON.stringify(res.rows[0].party);
                            result["username"] = res.rows[0].username;
                            result["playlist"] = res.rows[0].playlist;
                            response.send(result);
                        }
                    });
                }
                catch (exception) {
                    console.log(request);
                }
                }   
            });
    });
});
//app.post('/find', function (request, response) {
//    pg.connect(process.env.DATABASE_URL || databaseURL, function (err, client) {
//        if (err) throw err;
//        var parti;
//        parti = request.headers.referer.split("=").pop();
//        client
//        .query('select * from users where party in ($1)', [parti.toString().toUpperCase()])
//        .on('end', function (res) {
//            if (err) throw err;
//            var result = {};
//            console.log(res.rows[0]);
//            if (res.rows[0]) {
//                result["access_token"] = JSON.stringify(res.rows[0].access_token);
//               // result["guest"] = "guest";
//                result["lastFM"] = JSON.stringify(res.rows[0].lastFM);
//                result["partyID"] = JSON.stringify(res.rows[0].party);                
//                result["username"] = res.rows[0].username;
//                console.log(result);
//                response.send(result);
//            }
//        });
        
//    });
//});
console.log('Listening on 8888');
app.listen(process.env.PORT || 5000)
