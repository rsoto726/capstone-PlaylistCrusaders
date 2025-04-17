package learn.playlist.data;

import learn.playlist.models.PlaylistSong;

import java.util.List;

public interface PlaylistSongRepository {
    boolean add(PlaylistSong playlistSong);

    boolean update(PlaylistSong playlistSong);

    boolean deleteByKey(int playlistId, int songId);

    boolean replaceAllForPlaylist(int playlistId, List<PlaylistSong> playlistSongs);
}
