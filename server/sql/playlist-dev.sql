drop database if exists playlist;
create database playlist;
use playlist;

create table `user` (
	user_id int primary key auto_increment,
    username varchar(50) not null,
    email varchar(255) not null,
    password_hash varchar(2048) not null
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
    