package learn.playlist.models;

import java.util.Objects;

public class Song {
    private int songId;
    private String url;
    private String title;
    private int playlist_id;
    private String imageUrl;

    public Song(int songId, String url, String title, int playlist_id, String imageUrl) {
        this.songId = songId;
        this.url = url;
        this.title = title;
        this.playlist_id = playlist_id;
        this.imageUrl = imageUrl;
    }

    public int getSongId() {
        return songId;
    }

    public void setSongId(int songId) {
        this.songId = songId;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public int getPlaylist_id() {
        return playlist_id;
    }

    public void setPlaylist_id(int playlist_id) {
        this.playlist_id = playlist_id;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    @Override
    public String toString() {
        return "Song{" +
                "songId=" + songId +
                ", url='" + url + '\'' +
                ", title='" + title + '\'' +
                ", playlist_id=" + playlist_id +
                ", imageUrl='" + imageUrl + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Song song = (Song) o;
        return songId == song.songId && playlist_id == song.playlist_id && Objects.equals(url, song.url) && Objects.equals(title, song.title) && Objects.equals(imageUrl, song.imageUrl);
    }

    @Override
    public int hashCode() {
        return Objects.hash(songId, url, title, playlist_id, imageUrl);
    }
}
