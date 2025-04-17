package learn.playlist.models;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class Playlist {
    private int playlistId;
    private String name;
    private boolean published;
    private LocalDateTime createdAt;
    private LocalDateTime publishedAt;
    private int userId;
    private User user;
    private String thumbnailUrl;
    private List<PlaylistSong> songs = new ArrayList<>();


    public Playlist(int playlistId, String name, String thumbnailUrl, boolean published, LocalDateTime createdAt, LocalDateTime publishedAt, int userId, User user) {
        this.playlistId = playlistId;
        this.name = name;
        this.published = published;
        this.createdAt = createdAt;
        this.publishedAt = publishedAt;
        this.userId = userId;
        this.thumbnailUrl = thumbnailUrl;
    }

    public Playlist() {
    }

    public int getPlaylistId() {
        return playlistId;
    }

    public void setPlaylistId(int playlistId) {
        this.playlistId = playlistId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isPublished() {
        return published;
    }

    public void setPublished(boolean published) {
        this.published = published;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getPublishedAt() {
        return publishedAt;
    }

    public void setPublishedAt(LocalDateTime publishedAt) {
        this.publishedAt = publishedAt;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    @Override
    public String toString() {
        return "Playlist{" +
                "playlistId=" + playlistId +
                ", name='" + name + '\'' +
                ", published=" + published +
                ", createdAt=" + createdAt +
                ", publishedAt=" + publishedAt +
                ", userId=" + userId +
                ", user=" + user +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Playlist playlist = (Playlist) o;
        return playlistId == playlist.playlistId && published == playlist.published && userId == playlist.userId && Objects.equals(name, playlist.name) && Objects.equals(createdAt, playlist.createdAt) && Objects.equals(publishedAt, playlist.publishedAt) && Objects.equals(user, playlist.user);
    }

    @Override
    public int hashCode() {
        return Objects.hash(playlistId, name, published, createdAt, publishedAt, userId, user);
    }

    public String getThumbnailUrl() {
        return thumbnailUrl;
    }

    public void setThumbnailUrl(String thumbnailUrl) {
        this.thumbnailUrl = thumbnailUrl;
    }

    public List<PlaylistSong> getSongs() {
        return songs;
    }

    public void setSongs(List<PlaylistSong> songs) {
        this.songs = songs;
    }
}
