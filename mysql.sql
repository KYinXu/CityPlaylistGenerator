CREATE TABLE tracks(
    trackURI STRING NOT NULL PRIMARY KEY, 
    trackName STRING NOT NULL, 
    trackArtist STRING NOT NULL);

CREATE TABLE playlists (
    county STRING PRIMARY KEY
);

CREATE TABLE playlist_tracks (
    county STRING,
    trackURI STRING,
    votes INT,
    PRIMARY KEY (county, trackURI),
    FOREIGN KEY (county) REFERENCES playlists(county),
    FOREIGN KEY (trackURI) REFERENCES tracks(trackURI)
);




INSERT INTO tracks(trackURI, trackName, trackArtist) 
VALUES ("1", "Song Name 1", "Song Artist 1");

INSERT INTO tracks(trackURI, trackName, trackArtist) 
VALUES ("2", "Song Name 2", "Song Artist 2");

INSERT INTO tracks(trackURI, trackName, trackArtist) 
VALUES ("3", "Song Name 3", "Song Artist 3");


INSERT INTO playlists(county) VALUES ('Orange County');
INSERT INTO playlists(county) VALUES ('Alameda County');
INSERT INTO playlists(county) VALUES ('Los Angeles');


INSERT INTO playlist_tracks(county, trackURI, votes) VALUES ('Orange County', '1', 0);
INSERT INTO playlist_tracks(county, trackURI, votes) VALUES ('Los Angeles', '2', 0);
INSERT INTO playlist_tracks(county, trackURI, votes) VALUES ('Los Angeles', '3', 0);
INSERT INTO playlist_tracks(county, trackURI, votes) VALUES ('Orange County', '2', 0);
INSERT INTO playlist_tracks(county, trackURI, votes) VALUES ('Alameda County', '1', 0);

SELECT * FROM tracks;
SELECT * FROM playlists;
SELECT * FROM playlist_tracks;






