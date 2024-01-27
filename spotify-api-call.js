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
    
    curlPost(url, params, '');
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