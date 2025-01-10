// CryptoDetails.js
import React from 'react';
import { useParams } from 'react-router-dom';
import './CSS/CryptoDetails.css'; 
import { CryptoData } from './NewCryptoData';
// import Chart from './Chart';
import Order from './Order';

export default function CryptoDetails() {
  const { id } = useParams();
  // const apiData = useSelector((state) => state.apiData.data);
  const crypto = CryptoData.find((crypto) => crypto.id === id);

  if (!crypto) {
    return <div className="crypto-details-container">Crypto not found</div>;
  }



  return (
    <div className="crypto-details-container">
      <div>
        <h2 className='crypto_heading'><img style={{ height: '20px' }} src={crypto.image} alt="coin" /> {crypto.name} <p style={{ color: '#616e85' }}>{crypto.symbol.toUpperCase()}</p></h2>
        <div className="crypto-details-info">
          <div className="left">
            <p className='key_pair'>Price: <span className='key_value'>₹{crypto.current_price}</span> </p>
            <p className='key_pair'>1d %: <span className='key_value' style={{ color: parseFloat(crypto.price_change_percentage_24h) > 0 ? '#16c784' : '#ea3943' }}>{(crypto.price_change_percentage_24h).toFixed(2)}%</span></p>
            <p className='key_pair'>Volume (24h): <span className='key_value'>₹{(crypto.total_volume / 1000000000).toFixed(2)}B</span></p>
          </div>
          <div className="right">
            <p className='key_pair'>Market Cap: <span className='key_value'>₹{(crypto.market_cap / 1000000000).toFixed(2)}B</span></p>
            <p className='key_pair'>All-time high: <span className='key_value'>{crypto.ath}</span></p>
            <p className='key_pair'>
              % change from the all-time high: <span className='key_value' style={{ color: parseFloat(crypto.ath_change_percentage) > 0 ? '#16c784' : '#ea3943' }}>{(crypto.ath_change_percentage).toFixed(2)}%</span>
            </p>
          </div>
        </div>
      </div>
      <div className="chart_info">
        {/* <Chart /> */}
      </div>
      <br />
      <div className="order_info">
        <Order />
      </div>
    </div>
  );
}
