import React, { useEffect } from 'react';
import { CryptoData } from './NewCryptoData'; 
import { useSelector, useDispatch } from 'react-redux';
import { fetchAssets } from '../redux/slices/assetSlice';

const AssetList = () => {
  const assets = useSelector((state) => state.assets?.assetMap || []);
  // const apiData = useSelector((state) => state.apiData.data);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth?.userDetails) || null;
  useEffect(() => {
    if (user) {
      dispatch(fetchAssets(user.uid));
    }
  }, [dispatch, user])

  
  // console.log(assets);
  if (!assets || Object.keys(assets).length === 0) {
    return (
      <div style={{ textAlign: 'center', margin: '200px', color: 'white' }}>
        You do not own any assets.
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ color: "white" }}>Asset list</h1>
      {Object.keys(assets).map((cryptoId) => {
        const crypto = CryptoData.find((crypto) => crypto.id === cryptoId);
        const { amount, quantity, avgPrice } = assets[cryptoId];
        // const profit = (parseFloat(quantity * crypto.current_price).toFixed(2) - parseFloat(amount).toFixed(2)).toFixed(2);
        const profit = (parseFloat(quantity * crypto.current_price) - parseFloat(quantity*avgPrice)).toFixed(2);

        return (
          <div key={cryptoId} className="asset_cart">
            <div>
              <img style={{ height: '60px' }} src={crypto.image} alt="coin" />
            </div>
            <div>
              <div>avg price: ₹{avgPrice}</div>
              <div> {crypto.name}: {quantity}</div>
                <div>LTP: ₹{crypto.current_price}</div>
              </div>

              <div>
                <div>Invested: ₹{parseFloat(amount).toFixed(2)}</div>
                <div>₹{(parseFloat(profit)+parseFloat(amount)).toFixed(2)}</div>
                <div>Profit: <span style={{color: profit >= 0 ? "green" : "red"}}>{parseFloat(profit)}₹</span></div>
              </div>
            
          </div>
        );
      })}
    </div>
  );
};

export default AssetList;
