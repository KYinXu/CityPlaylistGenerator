//var XMLHttpRequest = require('xhr2');

const BASE_URL = "https://api.spotify.com/v1";

function createPlaylist(user_id, name){
    //Reference: https://developer.spotify.com/documentation/web-api/reference/create-playlist
    var url = BASE_URL + '/users/' + user_id + '/playlists';
    var params = {
        "name": name,
        "public": true,
        "collaborative": false
    }
    
    curlPost(url, params, getToken());
}

function addSongs(playlist_id, tracks) {
    var url = BASE_URL + '/playlists/' + playlist_id + '/tracks';
    
    var params = {
        "uris": tracks
    }

    curlPost(url, params, token);

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
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Authorization', 'Bearer ' + token);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.send(JSON.stringify(params));
    
    xhr.onload = ()=> {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.response);
            console.log(response);
        }
        else {
            alert.log(xhr.statusText);
        }
    }
}
// const clientId = 'c0ecea08e95a467ab50824a0c9e2e150';
// const clientSecret = 'e7c5c2c3246c441b97fc244f2985fdbcT';
// const _getToken = async () => {

//     const result = await fetch('https://accounts.spotify.com/api/token', {
//         method: 'POST',
//         headers: {
//             'Content-Type' : 'application/x-www-form-urlencoded', 
//             'Authorization' : 'Basic ' + base64encode(clientId) + ':' + base64encode(clientSecret)
//         },
//         body: {'grant_type': 'authorization_type'}
//     });

//     const data = await result.json();
//     console.log(data.access_token);
//     return data.access_token;
// }
// const APIController = (function() {
    
//     const clientId = 'c0ecea08e95a467ab50824a0c9e2e150';
//     const clientSecret = 'e7c5c2c3246c441b97fc244f2985fdbcT';

//     // private methods
//     const _getToken = async () => {

//         const result = await fetch('https://accounts.spotify.com/api/token', {
//             method: 'POST',
//             headers: {
//                 'Content-Type' : 'application/x-www-form-urlencoded', 
//                 'Authorization' : 'Basic ' + btoa(clientId + ':' + clientSecret)
//             },
//             body: 'grant_type=client_credentials'
//         });

//         const data = await result.json();
//         return data.access_token;
//     }
    
    // const _getGenres = async (token) => {

    //     const result = await fetch(`https://api.spotify.com/v1/browse/categories?locale=sv_US`, {
    //         method: 'GET',
    //         headers: { 'Authorization' : 'Bearer ' + token}
    //     });

    //     const data = await result.json();
    //     return data.categories.items;
    // }

    // const _getPlaylistByGenre = async (token, genreId) => {

    //     const limit = 10;
        
    //     const result = await fetch(`https://api.spotify.com/v1/browse/categories/${genreId}/playlists?limit=${limit}`, {
    //         method: 'GET',
    //         headers: { 'Authorization' : 'Bearer ' + token}
    //     });

    //     const data = await result.json();
    //     return data.playlists.items;
    // }

    // const _getTracks = async (token, tracksEndPoint) => {

    //     const limit = 10;

    //     const result = await fetch(`${tracksEndPoint}?limit=${limit}`, {
    //         method: 'GET',
    //         headers: { 'Authorization' : 'Bearer ' + token}
    //     });

    //     const data = await result.json();
    //     return data.items;
    // }

    // const _getTrack = async (token, trackEndPoint) => {

    //     const result = await fetch(`${trackEndPoint}`, {
    //         method: 'GET',
    //         headers: { 'Authorization' : 'Bearer ' + token}
    //     });

    //     const data = await result.json();
    //     return data;
    // }

    // return {
    //     getToken() {
    //         return _getToken();
    //     },
    //     getGenres(token) {
    //         return _getGenres(token);
    //     },
    //     getPlaylistByGenre(token, genreId) {
    //         return _getPlaylistByGenre(token, genreId);
    //     },
    //     getTracks(token, tracksEndPoint) {
    //         return _getTracks(token, tracksEndPoint);
    //     },
    //     getTrack(token, trackEndPoint) {
    //         return _getTrack(token, trackEndPoint);
    //     }
    // }
// })();



async function _getToken() {
    console.log("RUN GET TOKEN");
    const generateRandomString = (length) => {
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const values = crypto.getRandomValues(new Uint8Array(length));
        return values.reduce((acc, x) => acc + possible[x % possible.length], "");
    }
    const codeVerifier  = generateRandomString(64);

    const sha256 = async (plain) => {
        const encoder = new TextEncoder()
        const data = encoder.encode(plain)
        return window.crypto.subtle.digest('SHA-256', data)
    }
    const base64encode = (input) => {
        return btoa(String.fromCharCode(...new Uint8Array(input)))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
    }
    const hashed = await sha256(codeVerifier)
    const codeChallenge = base64encode(hashed);

    const clientId = 'c0ecea08e95a467ab50824a0c9e2e150';
    const redirectUri = 'http://localhost:5500';

    const scope = 'user-read-private user-read-email';
    const authUrl = new URL("https://accounts.spotify.com/authorize")

        // generated in the previous step
    window.localStorage.setItem('code_verifier', codeVerifier);

    const params =  {
        response_type: 'code',
        client_id: clientId,
        scope,
        code_challenge_method: 'S256',
        code_challenge: codeChallenge,
        redirect_uri: redirectUri,
    }

    authUrl.search = new URLSearchParams(params).toString();
    window.location.href = authUrl.toString();

    const urlParams = new URLSearchParams(window.location.search);
    let code = urlParams.get('code');

    const getToken = async code => {

        // stored in the previous step
        let codeVerifier = localStorage.getItem('code_verifier');
        
        const payload = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: clientId,
                grant_type: 'authorization_code',
                code,
                redirect_uri: redirectUri,
                code_verifier: codeVerifier,
            }),
        }
        
        const body = await fetch(url, payload);
        const response = await body.json();
        
        console.log(response.access_token);
        localStorage.setItem('access_token', response.access_token);
        return localStorage.getItem('access_token');
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

  // const _getToken = async () => {

//     const result = await fetch('https://accounts.spotify.com/api/token', {
//         method: 'POST',
//         headers: {
//             'Content-Type' : 'application/x-www-form-urlencoded', 
//             'Authorization' : 'Basic ' + base64encode(clientId) + ':' + base64encode(clientSecret)
//         },
//         body: {'grant_type': 'authorization_type'}
//     });

//     const data = await result.json();
//     console.log(data.access_token);
//     return data.access_token;
// }