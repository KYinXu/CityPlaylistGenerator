//hi
/*create a spotify playlist that captures the individuality 
and culture of irvine. Include the nature of irvine 
as a city and community, as well as artists who originated from irvine
*/
const BASE_URL = "https://api.spotify.com";
function createPlaylist(user_id, name){
    //Reference: https://developer.spotify.com/documentation/web-api/reference/create-playlist
    var url = BASE_URL + '/users/' + user_id + '/playlists';
    var params = {
        "name": name,
        "public": true,
        "collaborative": false
    }
    
    curlPost(url, params, createToken());
}
function curlPost(url, params, token) {
    /*
    curl --request POST \
  --url https://api.spotify.com/v1/users/smedjan/playlists \
  --header 'Authorization: Bearer 1POdFZRZbvb...qqillRxMr2z' \
  --header 'Content-Type: application/json' \
  --data '{
    "name": "New Playlist",
    "description": "New playlist description",
    "public": false
}'
    */
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Authorization', 'Bearer ' + token);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.send(JSON.stringify(params));
    
    xhr.onload = ()=> {
        if (xhr.status === 200) {
            const response = JSON.parse(req.response)
            console.log(response)
        }
        else {
            //error
        }
    }
}

function createToken() {
    var express = require('express');
    var request = require('request');
    var crypto = require('crypto');
    var cors = require('cors');
    var querystring = require('querystring');
    var cookieParser = require('cookie-parser');

    var client_id = 'c0ecea08e95a467ab50824a0c9e2e150'; // your clientId
    var client_secret = 'e7c5c2c3246c441b97fc244f2985fdbc'; // Your secret
    var redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri


    const generateRandomString = (length) => {
    return crypto
    .randomBytes(60)
    .toString('hex')
    .slice(0, length);
    }

    var stateKey = 'spotify_auth_state';

    var app = express();

    app.use(express.static(__dirname + '/public'))
    .use(cors())
    .use(cookieParser());

    app.get('/login', function(req, res) {

    var state = generateRandomString(16);
    res.cookie(stateKey, state);

    // your application requests authorization
    var scope = 'user-read-private user-read-email';
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
            'content-type': 'application/x-www-form-urlencoded',
            Authorization: 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
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

    var refresh_token = req.query.refresh_token;
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: { 
        'content-type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64')) 
        },
        form: {
        grant_type: 'refresh_token',
        refresh_token: refresh_token
        },
        json: true
    };

    request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
        var access_token = body.access_token,
            refresh_token = body.refresh_token;
        res.send({
            'access_token': access_token,
            'refresh_token': refresh_token
        });
        }
    });
    });

    console.log('Listening on 8888');
    app.listen(8888);
}