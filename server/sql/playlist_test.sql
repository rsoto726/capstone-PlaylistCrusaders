drop database if exists playlist_test;
create database playlist_test;
use playlist_test;

create table `user` (
	user_id int primary key auto_increment,
    username varchar(50) not null,
    email varchar(255) not null,
    `password` varchar(2048) not null
);

create table role (
	role_id int primary key auto_increment,
    `name` varchar(50) not null unique
);

create table user_role (
	user_id int not null,
	role_id int not null,
    constraint pk_user_role
        primary key (user_id, role_id),
    constraint fk_user_role_user_id
        foreign key (user_id)
        references user(user_id),
	constraint fk_user_role_role_id
        foreign key (role_id)
        references role(role_id)
);

insert into role(`name`) values
    ('USER'),
    ('ADMIN'),
    ('DISABLED');

create table playlist (
	playlist_id int primary key auto_increment,
    `name` varchar(255) not null,
    publish bit not null default 0,
    date_created datetime not null,
    date_published datetime,
    thumbnail_url varchar(500),
    user_id int not null,
    constraint fk_playlist_user_id
		foreign key (user_id)
        references user(user_id)
);

create table `like`(
	user_id int not null,
    playlist_id int not null,
    constraint pk_like
		primary key (user_id, playlist_id),
	constraint fk_like_user_id
		foreign key (user_id)
        references user(user_id),
	constraint fk_like_playlist_id
		foreign key (playlist_id)
        references playlist(playlist_id)
);

create table song(
	song_id int primary key auto_increment,
    url varchar(500) not null,
	title varChar(200) not null,
    video_id varChar(20) not null,
    thumbnail varChar(100) not null
);

create table playlist_song(
	playlist_id int not null,
    song_id int not null,
    `index` int not null,
    constraint pk_playlist_song
		primary key (playlist_id, song_id),
	constraint fk_playlist_song_playlist_id
		foreign key (playlist_id)
        references playlist(playlist_id),
	constraint fk_playlist_song_song_id
		foreign key (song_id)
        references song(song_id)
);

DELIMITER //
CREATE PROCEDURE set_known_good_state()
BEGIN
    SET SQL_SAFE_UPDATES = 0;

    -- Clear dependent tables first
    DELETE FROM playlist_song;
    DELETE FROM `like`;
    DELETE FROM playlist;
    DELETE FROM user_role;
    DELETE FROM `user`;
    DELETE FROM song;
    DELETE FROM role;

    -- Reset auto-increments
    ALTER TABLE playlist AUTO_INCREMENT = 1;
    ALTER TABLE `user` AUTO_INCREMENT = 1;
    ALTER TABLE role AUTO_INCREMENT = 1;
    ALTER TABLE song AUTO_INCREMENT = 1;

    -- Re-insert roles
    INSERT INTO role(`name`) VALUES ('USER'), ('ADMIN'), ('DISABLED');

    -- Re-insert users
    INSERT INTO `user` (username, email, `password`) VALUES 
        ('alice', 'alice@example.com', 'Password123!'),
        ('bob', 'bob@example.com', 'SecurePass456!');

    -- Assign roles
    INSERT INTO user_role (user_id, role_id) VALUES
        (1, 1), -- alice is USER
        (2, 2); -- bob is ADMIN

    -- Insert songs with required fields
    INSERT INTO song (url, title, video_id, thumbnail) VALUES 
        ('https://soundcloud.com/example-song1', 'Song 1', 'vid123', 'thumb1.jpg'),
        ('https://soundcloud.com/example-song2', 'Song 2', 'vid456', 'thumb2.jpg');

    -- Insert playlists
    INSERT INTO playlist (name, publish, date_created, date_published, thumbnail_url, user_id) VALUES
        ('Alice\'s Public Playlist', 1, NOW(), NOW(), 'https://img.com/1.jpg', 1),
        ('Bob\'s Private Playlist', 0, NOW(), NULL, 'https://img.com/2.jpg', 2),
        ('Alice\'s Second Playlist', 1, NOW(), NOW(), 'https://img.com/3.jpg', 1);

    -- Add songs to playlists
    INSERT INTO playlist_song (playlist_id, song_id, `index`) VALUES
        (1, 1, 1),
        (1, 2, 2),
        (2, 2, 1);

    -- Likes
    INSERT INTO `like` (user_id, playlist_id) VALUES
        (2, 1); -- bob likes alice's playlist

    SET SQL_SAFE_UPDATES = 1;
END //

DELIMITER ;