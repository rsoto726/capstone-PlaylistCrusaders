import React, {useState, useEffect} from 'react'
import {useLocation} from 'react-router-dom';
import PlaylistContainer from './PlaylistContainer';

type Song = {
  songId: number;
  url: string;
  title: string;
  videoId: string;
  thumbnail: string;
};

type Playlist = {
  playlistId: number;
  userId: number;
  name: string;
  thumbnailUrl: string;
  published: boolean;
  createdAt: string;
  publishedAt: string | null;
  songs: Array<{
    playlistId: number;
    songId: number;
    song: Song;
    index: number;
  }>;
};

// search result
const Search = () => {
    const [query, setQuery] = useState<string>('');
    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const location = useLocation();
  
    useEffect(() => {
      const searchParams = new URLSearchParams(location.search);
      setQuery(searchParams.get('query') || '');
    }, [location]);

    useEffect(() => {
        if(!!query){
            fetch(`http://localhost:8080/api/playlist/name/${query}`)
            .then(r=>r.json())
            .then((data:Playlist[])=>{
                console.log(data);
                setPlaylists(data);
            })
        }
    }, [query])

  return (
    <div className='container'>
        <h3 className='mt-2 ml-2'>Search results for: <span style={{fontStyle : "italic"}}>{query}</span></h3>
        {playlists.length > 0  ? (
          <PlaylistContainer playlists={playlists}/>
        ) : (
          <h2>{"No results found :{"}</h2>
        )}
        
    </div>
  )
}

export default Search