import React, {useState, useEffect} from 'react'
import {useLocation} from 'react-router-dom';

// search result
const Search = () => {
    const [query, setQuery] = useState<string>('');
    const location = useLocation();
  
    useEffect(() => {
      const searchParams = new URLSearchParams(location.search);
      setQuery(searchParams.get('query') || '');
    }, [location]);

  return (
    <div>
        <h1>Search Results for: {query}</h1>
    </div>
  )
}

export default Search