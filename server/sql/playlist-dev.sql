drop database if exists playlist;
create database playlist;
use playlist;

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