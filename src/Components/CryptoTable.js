import React, { useEffect } from 'react';
import star from './assets/star.png';
import yStar from './assets/yellow star.png';
import { Link } from 'react-router-dom';
import './CSS//CryptoTable.css';
import { useDispatch, useSelector } from 'react-redux';
import { addToFavourites, removeFromFavourites, fetchFavorites } from '../redux/slices/favouritesSlice';

const CryptoTable = ({ filteredArray }) => {
  const dispatch = useDispatch();

  const favouriteCoins = useSelector((state) => state.favourites?.favoriteCoins || []);

  const user = useSelector((state) => state.auth?.userDetails);

  useEffect(() => {
    if (user) {
      dispatch(fetchFavorites(user.uid));
    }
  }, [dispatch, user])


  const addToFav = (id) => {
    if (user) {
      dispatch(addToFavourites({ userId: user.uid, coinId: id }))
    }
    else {
      console.log("User not logged in");
    }
    ;
  };

  const removeFromFav = (id) => {
    dispatch(removeFromFavourites({ userId: user.uid, coinId: id }));
  };


  const isFavorite = (id) => {
    return user && favouriteCoins && favouriteCoins.some(coin => coin.coinId === id);
  };

  // Add a check for filteredArray
  if (!filteredArray) {
    return <p>Loading...</p>; // or any other fallback UI
  }

  return (
    <table className="crypto-table-container">
      <thead>
        <tr>
          <th></th>
          <th>#Rank</th>
          <th>Coin Name</th>
          <th>Price</th>
          <th>Market Cap</th>
          <th>1d %</th>
          <th>Volume(24h)</th>
          <th>Circulating Supply</th>
        </tr>
      </thead>
      <tbody>
        {filteredArray.map((crypto, index) => (
          <tr key={index} className="table-row">
            <td>
              <button className='favBtn' onClick={() => {
                isFavorite(crypto.id) ? removeFromFav(crypto.id) : addToFav(crypto.id)
              }}>
                <img className="star" src={isFavorite(crypto.id) ? yStar : star} alt="star" />
              </button>
            </td>
            <td className='rowText'>{crypto.market_cap_rank}</td>
            <td className='rowText'>
              <Link to={`/${crypto.id}`}>
                {crypto.name}
              </Link>
            </td>
            <td className='rowText'>₹{crypto.current_price}</td>
            <td className='rowText'>₹{(crypto.market_cap / 1000000000).toFixed(2)}B</td>
            <td className='rowText' style={{ color: parseFloat(crypto.price_change_percentage_24h) > 0 ? '#16c784' : '#ea3943' }}>
              {crypto.price_change_percentage_24h.toFixed(2)}%
            </td>
            <td className='rowText'>₹{(crypto.total_volume / 1000000000).toFixed(2)}B</td>
            <td className='rowText'>
              {((crypto.circulating_supply) / 1000000000).toFixed(2)}B {crypto.symbol}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default CryptoTable;
