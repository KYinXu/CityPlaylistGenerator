
//test

  var express = require('express');
  var request = require('request');
  var crypto = require('crypto');
  var cors = require('cors');
  var querystring = require('querystring');
  var cookieParser = require('cookie-parser');
  
var current_token = '';
var current_refresh_token = '';
var user_id = '';
var playlist_id = '';
var URIS = [];
const BASE_URL = "https://api.spotify.com/v1";
  const sqlite3 = require('sqlite3');
  const { open } = require('sqlite');

  var client_id = '259088b65dba41fda3991a8dd6d7c303'; // your clientId
  var client_secret = 'f1e890a5c63d4723bfadf25654105498'; // Your secret
  var redirect_uri = 'http://localhost:5500/callback'; // Your redirect uri
  
  
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
     .use(cookieParser())
     .use((req, res, next) => {
        res.header('Access-Contol-Allow-Origin', 'http://localhost:5500');
        next();
     });
  
    app.get('/', function(req, res) {
        res.sendFile(path.join(__dirname + '/index.html'));
      });

  app.get('/login', function(req, res) {
  
    var state = generateRandomString(16);
    res.cookie(stateKey, state);
  
    // your application requests authorization
    var scope = 'playlist-modify-public';
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
            user_id = body.id;
          });
  
          // we can also pass the token to the browser to make requests from there
          res.redirect('/#' +
            querystring.stringify({
              access_token: access_token,
              refresh_token: refresh_token
            }));
            current_token = access_token;
            current_refresh_token = refresh_token;
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
  
    //var refresh_token = req.query.refresh_token;
    var refresh_token = current_refresh_token;
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
      current_token = body.access_token;
      console.log(body);
    });
    
  });
  

  app.post('/create_playlist', function(req, res){
    //createPlaylist('shockersongz','Test new playlist');
    
    if (current_token == ''){
      console.log('Please log in');
      res.redirect('/');
      return;
    }
    var name = req.query.name;
    var url = BASE_URL + '/users/' + user_id + '/playlists';
    var params = {
      'name': name,
      'public': true,
      'collaborative': false
    };
    var clientServerOptions = {
      method: 'POST',
      url: url,
      body: JSON.stringify({
        'name': name,
        'public': true,
        'collaborative': false
      }),
      headers:{
        'Authorization': 'Bearer ' + current_token,
        'Content-Type': 'application/json'
      }
    }
    request.post(clientServerOptions, function (error, response, body) {
      console.log(response.statusCode);
      if (error || response.statusCode != 201) {
        console.log(body);
        playlist_id = response.id;
        console.log(response.id);
      }
      return;

    });
  });
  console.log('Listening on 5500');
  app.listen(5500);


  app.post('/add_songs', function(req, res){
    if (current_token == ''){
      console.log('Please log in');
      res.redirect('/');
      return;
    }
    let county = req.query.county;
    const db = open({
      filename: 'data.db',
      driver: sqlite3.Database
    });
    URIS = db.all(`SELECT trackURI AS id FROM playlist_tracks WHERE county = "${county}"`).flatMap((value) => value.id);

    var url = BASE_URL + `/playlists/${playlist_id}/tracks`;
    var params = {
      'uris': URIS
    };
    var clientServerOptions = {
      method: 'POST',
      url: url,
      body: JSON.stringify({
        'uris': URIS
      }),
      headers:{
        'Content-Type': 'application/json'
      }
    }
    request.post(clientServerOptions, function (error, response, body) {
      console.log(response.statusCode);
      if (error || response.statusCode != 201) {
        console.log(body);
      }
      return;

    });
  });


// function createPlaylist(user_id, name){
//     //Reference: https://developer.spotify.com/documentation/web-api/reference/create-playlist
//     var url = BASE_URL + '/users/' + user_id + '/playlists';
//     var params = {
//         "name": name,
//         "public": true,
//         "collaborative": false
//     }
    
//     curlPost(url, params, current_token);
// }

// function addSongs(playlist_id, tracks) {
//     var url = BASE_URL + '/playlists/' + playlist_id + '/tracks';
    
//     var params = {
//         "uris": tracks
//     }

//     curlPost(url, params, current_token);

// }

// function curlPost(url, params, token) {

//     var xhr = new XMLHttpRequest();
//     xhr.open('POST', url, true);
//     xhr.setRequestHeader('Authorization', 'Bearer ' + token);
//     xhr.setRequestHeader('Content-Type', 'application/json');

//     xhr.send(JSON.stringify(params));
    
//     xhr.onload = ()=> {
//         if (xhr.status === 200) {
//             const response = JSON.parse(xhr.response);
//             console.log(response);
//         }
//         else {
//             alert.log(xhr.statusText);
//         }
//     }
// }


function addSong(trackURI, trackName, trackArtist) {

    let db = new sqlite3.Database('data.db');

    let statement = `INSERT INTO tracks(trackURI, trackName, trackArtist) 
                     VALUES ("${trackURI}", "${trackName}", "${trackArtist}")`;
    db.run(statement, function(err) {
        if (err) {
            return console.error(err.message);
        }
    });
    
    db.close();
}

function newPlaylist(county) {
    let db = new sqlite3.Database('data.db');

    let statement = `INSERT INTO playlists(county) VALUES ("${county}");`;
    db.run(statement, function(err) {
        if (err) {
            return console.error(err.message);
        }
    });
    
    db.close();
}

function addSongToPlaylist(county, trackURI){
    let db = new sqlite3.Database('data.db');

    let statement = `INSERT INTO playlist_tracks(county, trackURI, votes) VALUES (
                    "${county}", "${trackURI}", 0);`;
    db.run(statement, function(err) {
        if (err) {
            return console.error(err.message);
        }
    });
    
    db.close();

}

function deleteSongFromPlaylist(county, trackURI) {
  let db = new sqlite3.Database('data.db');

  let statement = `DELETE FROM playlist_tracks 
                   WHERE county = "${county}" AND trackURI = "${trackURI}";`;

  db.run(statement, function(err) {
      if (err) {
          return console.error(err.message);
      }
  });

  db.close();
}

function modifyVote(county, trackURI, val) {
    let db = new sqlite3.Database('data.db');

    let statement = `UPDATE playlist_tracks
                     SET votes = votes + ${val}
                     WHERE county = "${county}"
                     AND trackURI = "${trackURI}";`;
    db.run(statement, function(err) {
        if (err) {
            return console.error(err.message);
        }
    });
    
    db.close();

} 

