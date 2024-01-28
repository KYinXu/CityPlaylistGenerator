const sqlite3 = require('sqlite3');

let db = new sqlite3.Database('data.db');


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

function modifyVote(county, trackURI, val) {
    let db = new sqlite3.Database('data.db');

    let statement = `UPDATE playlist_tracks  VALUES (
                    "${county}", "${trackURI}", 0);`;
    db.run(statement, function(err) {
        if (err) {
            return console.error(err.message);
        }
    });
    
    db.close();

} 
