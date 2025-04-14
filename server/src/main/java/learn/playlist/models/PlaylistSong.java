package learn.playlist.models;

import java.util.Objects;

public class PlaylistSong {
    private int playlistId;
    private int songId;
    private Playlist playlist;
    private Song song;

    public PlaylistSong(int playlistId, int songId) {
        this.playlistId = playlistId;
        this.songId = songId;
    }

    public PlaylistSong() {
    }

    public int getPlaylistId() {
        return playlistId;
    }

    public void setPlaylistId(int playlistId) {
        this.playlistId = playlistId;
    }

    public int getSongId() {
        return songId;
    }

    public void setSongId(int songId) {
        this.songId = songId;
    }

    public Playlist getPlaylist() {
        return playlist;
    }

    public void setPlaylist(Playlist playlist) {
        this.playlist = playlist;
    }

    public Song getSong() {
        return song;
    }

    public void setSong(Song song) {
        this.song = song;
    }

    @Override
    public String toString() {
        return "PlaylistSong{" +
                "playlistId=" + playlistId +
                ", songId=" + songId +
                ", playlist=" + playlist +
                ", song=" + song +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        PlaylistSong that = (PlaylistSong) o;
        return playlistId == that.playlistId && songId == that.songId && Objects.equals(playlist, that.playlist) && Objects.equals(song, that.song);
    }

    @Override
    public int hashCode() {
        return Objects.hash(playlistId, songId, playlist, song);
    }
}
