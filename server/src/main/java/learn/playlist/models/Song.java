package learn.playlist.models;

import java.util.Objects;

public class Song {
    private int songId;
    private String url;
    private String title;
    private String imageUrl;

    public Song(int songId, String url, String title, String imageUrl) {
        this.songId = songId;
        this.url = url;
        this.title = title;
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
                ", imageUrl='" + imageUrl + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Song song = (Song) o;
        return songId == song.songId && Objects.equals(url, song.url) && Objects.equals(title, song.title) && Objects.equals(imageUrl, song.imageUrl);
    }

    @Override
    public int hashCode() {
        return Objects.hash(songId, url, title, imageUrl);
    }
}
