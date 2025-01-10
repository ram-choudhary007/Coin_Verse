import CryptoTable from './CryptoTable';
import { useSelector, useDispatch } from 'react-redux';
import { CryptoData } from './NewCryptoData'; 
import { useEffect } from 'react';
import {fetchFavorites } from '../redux/slices/favouritesSlice'

export default function Favourite() {
  let favouriteCoins = useSelector((state) => state.favourites?.favoriteCoins || []);
  const favoriteCoinIds = favouriteCoins.map(coin => coin.coinId);
  // const apiData = useSelector((state) => state.apiData.data);
  const dispatch = useDispatch();
  const filteredCryptoData =  CryptoData.filter(coin => favoriteCoinIds.includes(coin.id));

  const user = useSelector((state) => state.auth?.userDetails) || null;
  useEffect(() => {
    if (user) {
      dispatch(fetchFavorites(user.uid));
    }
  }, [dispatch, user])

  return (
    <div>
      {user ? (
        <>
          {favouriteCoins.length > 0 ? (
            <CryptoTable filteredArray={filteredCryptoData} />
          ) : (
            <p className='freefav' style={{ margin: '100px', marginLeft: '500px', padding: '50px' }}>
              Please add coins to your favorites to see your favorite coins.
            </p>
          )}
        </>
      ) : (
        <div>
          <p className='freefav' style={{ margin: '100px', marginLeft: '600px', padding: '50px' }}>
            Please log in to see your favorite coins.
          </p>
        </div>
      )}
    </div>
  );
}
