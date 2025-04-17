package learn.playlist.models;

import java.util.Objects;

public class Song {
    private int songId;
    private String url;
    private String thumbnail;
    private String title;
    private String videoId;

    public Song() {}

    public Song(int songId, String url, String thumbnail, String title, String videoId) {
        this.songId = songId;
        this.url = url;
        this.thumbnail = thumbnail;
        this.title = title;
        this.videoId = videoId;
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

    public String getThumbnail() {
        return thumbnail;
    }

    public void setThumbnail(String thumbnail) {
        this.thumbnail = thumbnail;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getVideoId() {
        return videoId;
    }

    public void setVideoId(String videoId) {
        this.videoId = videoId;
    }

    @Override
    public String toString() {
        return "Song{" +
                "songId=" + songId +
                ", url='" + url + '\'' +
                ", thumbnail='" + thumbnail + '\'' +
                ", title='" + title + '\'' +
                ", videoId='" + videoId + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Song song = (Song) o;
        return songId == song.songId && Objects.equals(url, song.url) && Objects.equals(thumbnail, song.thumbnail) && Objects.equals(title, song.title) && Objects.equals(videoId, song.videoId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(songId, url, thumbnail, title, videoId);
    }
}
