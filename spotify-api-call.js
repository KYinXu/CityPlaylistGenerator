//hi
/*create a spotify playlist that captures the individuality 
and culture of irvine. Include the nature of irvine 
as a city and community, as well as artists who originated from irvine
*/
const BASE_URL = "https://api.spotify.com/v1";

function createPlaylist(user_id, name){
    //Reference: https://developer.spotify.com/documentation/web-api/reference/create-playlist
    var url = BASE_URL + '/users/' + user_id + '/playlists';
    var params = {
        "name": name,
        "public": true,
        "collaborative": false
    }
    
    curlPost(url, params, "");
}

function addSongs(playlist_id, tracks) {
    var url = BASE_URL + '/playlists/' + playlist_id + '/tracks';
    
    var params = {
        "uris": tracks
    }

    curlPost(url, params, "");

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
            const response = JSON.parse(xhr.response)
            console.log(response)
        }
        else {
            alert(xhr.statusText);
        }
    }
}

// const client_secret = 'e7c5c2c3246c441b97fc244f2985fdbc';

// app.get('/callback', function(req, res) {

//     var code = req.query.code || null;
//     var state = req.query.state || null;
  
//     if (state === null) {
//       res.redirect('/#' +
//         querystring.stringify({
//           error: 'state_mismatch'
//         }));
//     } else {
//       var authOptions = {
//         url: 'https://accounts.spotify.com/api/token',
//         form: {
//           code: code,
//           redirect_uri: redirect_uri,
//           grant_type: 'authorization_code'
//         },
//         headers: {
//           'content-type': 'application/x-www-form-urlencoded',
//           'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
//         },
//         json: true
//       };
//     }
//   });


// var client_id = 'CLIENT_ID';
// var redirect_uri = 'http://localhost:8888/callback';
// var app = express();
// app.get('/login', function(req, res) {

//   var state = generateRandomString(16);
//   var scope = 'user-read-private user-read-email';

//   res.redirect('https://accounts.spotify.com/authorize?' +
//     querystring.stringify({
//       response_type: 'code',
//       client_id: client_id,
//       scope: scope,
//       redirect_uri: redirect_uri,
//       state: state
//     }));
// });

// app.get('/callback', function(req, res) {

//     var code = req.query.code || null;
//     var state = req.query.state || null;
  
//     if (state === null) {
//       res.redirect('/#' +
//         querystring.stringify({
//           error: 'state_mismatch'
//         }));
//     } else {
//       var authOptions = {
//         url: 'https://accounts.spotify.com/api/token',
//         form: {
//           code: code,
//           redirect_uri: redirect_uri,
//           grant_type: 'authorization_code'
//         },
//         headers: {
//           'content-type': 'application/x-www-form-urlencoded',
//           'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
//         },
//         json: true
//       };
//     }
//   });