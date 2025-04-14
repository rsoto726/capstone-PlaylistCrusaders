package learn.playlist.data;

import learn.playlist.models.PlaylistSong;

public interface PlaylistSongRepository {
    boolean add(PlaylistSong playlistSong);

    boolean update(PlaylistSong playlistSong);

    boolean deleteByKey(int playlistId, int songId);
}
