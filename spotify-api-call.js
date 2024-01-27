//hi
BASE_URL = "https://developer.spotify.com/documentation/web-api/reference/"
function createPlaylistUrl(){
    //Create the url: https://developer.spotify.com/documentation/web-api/reference/create-playlist
}
function callApi(link) {
    const req = new XMLHttpRequest();
    req.open('GET', link, true);
    req.send();
    
    req.onload = ()=> {
        if (req.status === 200) {
            const response = JSON.parse(req.response)
            console.log(response)
        }
        else {
            //error
        }
    }
}