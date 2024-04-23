import React, { useEffect } from 'react';
import CryptoTable from './CryptoTable';
// import { CryptoData } from './NewCryptoData'; 
import { useDispatch, useSelector } from 'react-redux';
import { fetchApiData } from '../redux/slices/apiDataSlice';

export default function Home() {
  const dispatch = useDispatch();
  const apiData = useSelector((state) => state.apiData.data);
 
  useEffect(() => {
    // Dispatch the action once immediately and then set up the interval
    dispatch(fetchApiData());
    const intervalId = setInterval(() => {
      dispatch(fetchApiData());
    }, 3000); // 300000 milliseconds = 5 minutes

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [dispatch]);

  return (
    <div>
      <CryptoTable filteredArray={apiData} />
    </div>
  );
}
