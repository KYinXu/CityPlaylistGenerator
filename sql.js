const sqlite3 = require('sqlite3');

let db = new sqlite3.Database('data.db');


function insertSong(trackURI, trackName, trackArtist) {

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

function newPlaylist(city) {
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