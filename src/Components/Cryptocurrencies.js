/* import React, { useEffect, useState } from 'react';
import url from "./BaseUrl";
import axios from 'axios';
import { CryptoData } from './NewCryptoData'; 
import CryptoTable from './CryptoTable';

export default function Cryptocurrencies() {
  const [loading, setLoading] = useState(true);
  const [coins, setCoins] = useState([]);

  useEffect(() => {
    const getApiData = async () => {
      try {
        const response = await axios.get(`${url}/coins/markets?vs_currency=inr&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=en`);
        console.log(response.data);
        setCoins(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    }

    getApiData();
  }, []);

  return (
    <>
      {loading ? (
        <h2 style={{ textAlign: "center", marginTop: "200px" }}>Loading...</h2>
      ) : (
        <div style={{ textAlign: "center" }}>
          <h1>Cryptocurrencies</h1>
          <div>
            <CryptoTable filteredArray={CryptoData} />
          </div>
        </div>
      )}
    </>
  );
}
 */