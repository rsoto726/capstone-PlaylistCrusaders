import React, {useState, useEffect} from 'react'
import {useLocation} from 'react-router-dom';

type Playlist = {
    playlistId: number;
    name: string;
    description: string;
    publish: boolean;
    dateCreated: string;
    datePublished: string;
    thumbnailUrl: string;
    userId: number;
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
    <div>
        <h1>Search Results for: {query}</h1>
    </div>
  )
}

export default Search