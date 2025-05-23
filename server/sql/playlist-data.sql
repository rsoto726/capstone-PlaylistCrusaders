use playlist;
-- seed data 

select * from `user`;
select * from playlist;
select * from song;
select * from playlist_song;
select * from `like`;

insert into `user` (username, email, password) values
('AdminMcAdmin', 'admin@example.com', 'ValidPassword!12'),
('UserMcUser', 'user@example.com', 'ValidPassword!12');

insert into user_role (user_id, role_id) values
(2, 2),
(3, 1);

insert into playlist (name, publish, date_created, date_published, thumbnail_url, user_id) values
('Chill Vibes', 1, now(), now(), 'https://upload.wikimedia.org/wikipedia/en/c/c7/Chill_guy_original_artwork.jpg', 1),
('Workout Mix', 1, now(), null, 'https://pbs.twimg.com/media/FVPP_n-VsAEd3P1.jpg', 1),
('Throwback Hits', 1, now(), now(), 'https://i.redd.it/neuy8pd72ak41.jpg', 2),
('Indie Gems', 0, now(), null, 'https://preview.redd.it/was-told-to-post-this-here-from-a-lego-community-what-do-v0-557ab2azrase1.jpeg?width=640&crop=smart&auto=webp&s=a5a7440b3f5a0ce545664aacd7409528bb752374', 2);

insert into song (url, title, video_id, thumbnail) values
-- chill
('https://www.youtube.com/watch?v=pmXfm4pPHuw&list=PLP_Wd9s4S7eZszuu2zwBmCkZBwOdtH2mk&index=2&ab_channel=lilwakame', "★ Radiohead - Climbing up the walls [Zero 7 Mix]", "pmXfm4pPHuw", "https://img.youtube.com/vi/pmXfm4pPHuw/maxresdefault.jpg"),
('https://www.youtube.com/watch?v=qaYy-ldpIXc&list=PLP_Wd9s4S7eZszuu2zwBmCkZBwOdtH2mk&index=3&ab_channel=CharlyBoillot', "Dj Krush- Mu Getsu", "qaYy-ldpIXc", "https://img.youtube.com/vi/qaYy-ldpIXc/maxresdefault.jpg"),
('https://www.youtube.com/watch?v=Vbh-jn8V54c&list=PLP_Wd9s4S7eZszuu2zwBmCkZBwOdtH2mk&index=66&ab_channel=DianaVillalobos', "GOTAN PROJECT -EPOCA", "Vbh-jn8V54c", "https://img.youtube.com/vi/Vbh-jn8V54c/maxresdefault.jpg"),
-- workout
('https://www.youtube.com/watch?v=VDvr08sCPOc&list=PLuYNdOlG3X4avQtZA1-XbEbR6SvS-9phw&ab_channel=FortMinor', "Remember The Name (Official Video) - Fort Minor", "VDvr08sCPOc", "https://img.youtube.com/vi/VDvr08sCPOc/maxresdefault.jpg"),
('https://www.youtube.com/watch?v=DhlPAj38rHc&list=PLuYNdOlG3X4avQtZA1-XbEbR6SvS-9phw&index=11&ab_channel=aceblade45', "Rocky theme song", "DhlPAj38rHc", "https://img.youtube.com/vi/DhlPAj38rHc/maxresdefault.jpg"),
('https://www.youtube.com/watch?v=vimZj8HW0Kg&list=PLuYNdOlG3X4avQtZA1-XbEbR6SvS-9phw&index=31&ab_channel=LLCoolJVEVO', "LL COOL J - Mama Said Knock You Out (Official Music Video)", "vimZj8HW0Kg", "https://img.youtube.com/vi/vimZj8HW0Kg/maxresdefault.jpg"),
('https://www.youtube.com/watch?v=Hh5jEQraXaw&ab_channel=GhostfacePlaya', "Ghostface Playa - Why Not", "Hh5jEQraXaw", "https://img.youtube.com/vi/Hh5jEQraXaw/maxresdefault.jpg"),
('https://www.youtube.com/watch?v=ssFIc7XL1IA&ab_channel=RUN-DMC-Topic', "Walk This Way", "ssFIc7XL1IA", "https://img.youtube.com/vi/ssFIc7XL1IA/maxresdefault.jpg"),
-- throwback
('https://www.youtube.com/watch?v=Y-9Y4CCIWnM&ab_channel=ChuckBerry-Topic', "Johnny Be Goode", "Y-9Y4CCIWnM", "https://img.youtube.com/vi/Y-9Y4CCIWnM/maxresdefault.jpg"),
('https://www.youtube.com/watch?v=1eD-8NTwP9I&ab_channel=BuffaloSpringfield-Topic', "For What It's Worth", "1eD-8NTwP9I", "https://img.youtube.com/vi/1eD-8NTwP9I/maxresdefault.jpg"),
('https://www.youtube.com/watch?v=S2ujotDMluo&ab_channel=EngelbertHumperdinck', "A Man Without Love LYRICS Video Engelbert Humperdinck 1968 🌙 Moon Knight Episode 1", "S2ujotDMluo", "https://img.youtube.com/vi/S2ujotDMluo/maxresdefault.jpg"),
('https://www.youtube.com/watch?v=n9DmdAwUbxc&ab_channel=BobbyCaldwell-Topic', "What You Won't Do for Love", "n9DmdAwUbxc", "https://img.youtube.com/vi/n9DmdAwUbxc/maxresdefault.jpg"),
-- indie
('https://www.youtube.com/watch?v=BY1yJi__Aos&ab_channel=idontknow', "Neil Cicierega - Just a Baby", "BY1yJi__Aos", "https://img.youtube.com/vi/BY1yJi__Aos/maxresdefault.jpg"),
('https://www.youtube.com/watch?v=5Rk8u2FTaG0&ab_channel=Darude-Topic', "Sandstorm", "5Rk8u2FTaG0", "https://img.youtube.com/vi/5Rk8u2FTaG0/maxresdefault.jpg");

insert into playlist_song (playlist_id, song_id, `index`) values
(1, 1, 0),
(1, 2, 1),
(1, 3, 2),
(2, 4, 0),
(2, 5, 1),
(2, 6, 2),
(2, 7, 3),
(2, 8, 4),
(3, 9, 0),
(3, 10, 1),
(3, 11, 2),
(3, 12, 3),
(4, 13, 0),
(4, 14, 1)
