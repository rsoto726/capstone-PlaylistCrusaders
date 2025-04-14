package learn.playlist.models;

import java.time.LocalDateTime;
import java.util.Objects;

public class Playlist {
    private int playlistId;
    private String name;
    private String description;
    private boolean published;
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;
    private int userId;

    public Playlist(int playlistId, String name, String description, boolean published, LocalDateTime createdAt, LocalDateTime modifiedAt, int userId) {
        this.playlistId = playlistId;
        this.name = name;
        this.description = description;
        this.published = published;
        this.createdAt = createdAt;
        this.modifiedAt = modifiedAt;
        this.userId = userId;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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

    public LocalDateTime getModifiedAt() {
        return modifiedAt;
    }

    public void setModifiedAt(LocalDateTime modifiedAt) {
        this.modifiedAt = modifiedAt;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Playlist playlist = (Playlist) o;
        return playlistId == playlist.playlistId && published == playlist.published && userId == playlist.userId && Objects.equals(name, playlist.name) && Objects.equals(description, playlist.description) && Objects.equals(createdAt, playlist.createdAt) && Objects.equals(modifiedAt, playlist.modifiedAt);
    }

    @Override
    public int hashCode() {
        return Objects.hash(playlistId, name, description, published, createdAt, modifiedAt, userId);
    }

    @Override
    public String toString() {
        return "Playlist{" +
                "playlistId=" + playlistId +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", published=" + published +
                ", createdAt=" + createdAt +
                ", modifiedAt=" + modifiedAt +
                ", userId=" + userId +
                '}';
    }
}
