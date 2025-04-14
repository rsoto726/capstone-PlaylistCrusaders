package learn.playlist.models;

import java.util.Objects;

public class Song {
    private int songId;
    private String url;

    public Song() {}

    public Song(int songId, String url, String title, int playlist_id, String imageUrl) {
        this.songId = songId;
        this.url = url;
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



    @Override
    public String toString() {
        return "Song{" +
                "songId=" + songId +
                ", url='" + url + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Song song = (Song) o;
        return songId == song.songId && Objects.equals(url, song.url);
    }

    @Override
    public int hashCode() {
        return Objects.hash(songId, url);
    }
}
