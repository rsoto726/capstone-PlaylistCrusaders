package learn.playlist.models;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class Likes {
    private int likeId;
    private int userId;
    private int playlistId;
    private Playlist playlist;
    private User user;

    public Likes(int likeId, int userId, int playlistId) {
        this.likeId = likeId;
        this.userId = userId;
        this.playlistId = playlistId;
    }

    public Likes() {
    }

    public int getLikeId() {
        return likeId;
    }

    public void setLikeId(int likeId) {
        this.likeId = likeId;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public int getPlaylistId() {
        return playlistId;
    }

    public void setPlaylistId(int playlistId) {
        this.playlistId = playlistId;
    }

    public Playlist getPlaylist() {
        return playlist;
    }

    public void setPlaylist(Playlist playlist) {
        this.playlist = playlist;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    @Override
    public String toString() {
        return "Likes{" +
                "likeId=" + likeId +
                ", userId=" + userId +
                ", playlistId=" + playlistId +
                ", playlists" + playlist +
                ", users" + user +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Likes likes = (Likes) o;
        return likeId == likes.likeId && userId == likes.userId && playlistId == likes.playlistId && Objects.equals(playlist, likes.playlist) && Objects.equals(user, likes.user);
    }

    @Override
    public int hashCode() {
        return Objects.hash(likeId, userId, playlistId, playlist, user);
    }
}
