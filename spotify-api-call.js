//hi
/*create a spotify playlist that captures the individuality 
and culture of irvine. Include the nature of irvine 
as a city and community, as well as artists who originated from irvine
*/
BASE_URL = "https://api.spotify.com"
function createPlaylistUrl(){
    const xhr = new XMLHttpRequest();
    req.open('GET', link, true);
    req.setRequestHeader();
    req.setRequestData();
    req.send();
    //Create the url: https://developer.spotify.com/documentation/web-api/reference/create-playlist
}
function callApi(xhr) {
    
    
    
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