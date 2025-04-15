import React, { useState } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import { useNavigate, useLocation, matchPath } from 'react-router-dom';
import '../styles/SearchBar.css';

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const hideOnPaths = ['/register', '/login'];

  const isProfilePage = matchPath('/profile/:id', location.pathname);

  if (hideOnPaths.includes(location.pathname) || isProfilePage) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate(`/search?query=${encodeURIComponent(query)}`);
  }

  return (
    <div className="search-bar-wrapper border-bottom py-3 px-4">
      <div className="search-bar-container d-flex justify-content-center align-items-center w-100 position-relative">
        <form onSubmit={handleSubmit}>
          <InputGroup className="search-input">
            <InputGroup.Text>
              {FaSearch({})}
            </InputGroup.Text>
            <Form.Control placeholder="Search" value={query} onChange={(e) => setQuery(e.target.value)} />
          </InputGroup>
        </form>
      </div>
    </div>
  );
};

export default SearchBar;
