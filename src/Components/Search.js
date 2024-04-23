import React, { useState } from 'react';
// import { CryptoDataArray } from './CryptoData';
import { CryptoData } from './NewCryptoData';
import Search_icon from '../Components/assets/search-icon.png';
import { Link } from 'react-router-dom';

export default function Search() {
  const [isSearchVisible, setSearchVisibility] = useState(true);
  const [input, setInput] = useState("");

  const toggleSearch = () => {
    setSearchVisibility(!isSearchVisible);
  };

  const handleInput = (value) => {
    setInput(value);
  }

  const hideSearchBox = () => {
    setSearchVisibility(true);
  }

  const resultData = CryptoData.filter((coin) =>
    input && coin && (coin.name.toLowerCase().includes(input.toLowerCase()) || coin.symbol.toLowerCase().includes(input.toLowerCase()))
  );

  return (
    <div>
      {isSearchVisible ? (
        <img
          className='search_icon'
          src={Search_icon}
          alt="Search_icon"
          onClick={toggleSearch}
        />
      ) : (
        <div>
          <input
            className='search'
            type="text"
            placeholder='Search Coin...'
            onChange={(e) => handleInput(e.target.value)} 
          />

          {(input.length > 0 && resultData.length > 0) && (
            <div className="searchResultBox">
              {resultData.map(coin => (
                <div key={coin.id}>
                  <Link style={{color: "black"}} to={`/${coin.id}`} onClick={hideSearchBox}>
                    {coin.name} <span style={{ color: "red" }}>{coin.symbol}</span>
                  </Link>
                  <hr />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
