import React, {useState} from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/SearchBar.css';

const SearchBar: React.FC = () => {
      const [query, setQuery] = useState("");
      const navigate = useNavigate();
      const location = useLocation();
      if (/*location.pathname === '/' ||*/ location.pathname === '/register' || location.pathname === '/login') {
        return null;
      }

      const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        navigate(`/search?query=${encodeURIComponent(query)}`);
      }

  return (
    <div className="search-bar-wrapper border-bottom py-3 px-4">
      <div className="search-bar-container d-flex justify-content-center align-items-center w-100 position-relative">
        <form onSubmit = {handleSubmit}>
          <InputGroup className="search-input">
            <InputGroup.Text>
            {FaSearch({})}          
            </InputGroup.Text>
            <Form.Control placeholder="Search" value={query} onChange={(e) => setQuery(e.target.value)}/>
          </InputGroup>
        </form>
        </div>
      </div>
  );
};

export default SearchBar;
