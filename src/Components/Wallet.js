import { useEffect, useState } from 'react';
import './CSS/Wallet.css'
import { useSelector, useDispatch } from 'react-redux';
import WalletPopup from './WalletPopup';
import AssetList from './AssetList';
import { Link } from 'react-router-dom';
import { fetchFundTransferDetails } from '../redux/slices/walletSlice';

export default function Wallet() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const apiData = useSelector((state) => state.apiData.data);

  const availToInvestValue = useSelector((state) => state.wallet?.availableAmount);
  const investedAmountValue = useSelector((state) => state.wallet?.amountInvested);
  
  const availToInvest = parseFloat(availToInvestValue);   // we have to change this beacuse it is an object
  const investedAmount = parseFloat(investedAmountValue);

  const [transactionType, setTransactionType] = useState('');
  const user = useSelector((state) => state.auth?.userDetails) || null;
  const assets = useSelector((state) => state.assets?.assetMap || []);
  const [currentValue, setCurrentValue] = useState(0);

  const dispatch = useDispatch();
  
  useEffect(() => {
    async function fetchData() {
      if (user) {
        const fundTransferDetails = await fetchFundTransferDetails(user.uid);
        dispatch(fundTransferDetails);
      }
    }
    fetchData();
  }, [dispatch, user]);

  useEffect(() => {
    if (Object.keys(assets).length > 0) {
      const calculatedValue = Object.keys(assets).reduce((acc, crypto) => {
        const quantity = assets[crypto].quantity;
        const currentPrice = apiData.find((data) => data.id === crypto)?.current_price;
        return acc + quantity * currentPrice;
      }, 0); // Add initial value of 0 here
      setCurrentValue(calculatedValue);
    }else{
      setCurrentValue(0);
    }
  }, [assets, apiData]);

  // const totalGain = parseFloat((currentValue - investedAmount).toFixed(2));
  var totalGain;

  if(assets.length > 0){
    totalGain = parseFloat((currentValue - investedAmount).toFixed(2));
  }else{
    totalGain = 0;
  }
  // console.log(currentValue);
  const totalPortfolioValue = ((parseFloat(currentValue) + parseFloat(availToInvest))).toFixed(2);


  // console.log(typeof availToInvest, availToInvest);


  const setPopup = (transactionType) => {
    setTransactionType(transactionType);
    setIsPopupOpen(true);
  }


  return (
    <div>
      {user ? (
        <div className='Wallet_info'>
          <div className='topWallet'>
            <div className='rowValue'>
              <p>Total portfolio value: <span className='value'>₹{totalPortfolioValue}</span></p>
            </div>
            <div className="rowValue">
              <p>Available to Invest: <span className='value'>₹{availToInvest}</span></p>
            </div>

            <div className='walletActionBtn'>
              <button style={{ backgroundColor: "green", fontWeight: "bold" }} onClick={() => setPopup('deposit')}>deposit</button>
              <button style={{ backgroundColor: "red", fontWeight: "bold" }} onClick={() => setPopup('withdraw')}>withdraw</button>
            </div>
            {isPopupOpen && <WalletPopup setIsPopupOpen={setIsPopupOpen} transactionType={transactionType} />}
             <Link to='/transactions'>Show Transactions</Link>  
            <hr />
            <div className="rowValue" >
              <p>Invested Value: <span className='value'>₹{investedAmount.toFixed(2)}</span></p>
              <p>All time gain: <span className='value' style={{color: totalGain >= 0 ? "green" : "red"}}>₹{totalGain}</span></p>
            </div>
          </div>

          <div>
            <AssetList />
          </div>

        </div>
      ) : (
        <div>
          <p style={{ margin: '100px', marginLeft: '600px', padding: '50px', color: "white" }}>Please log in to see your fund Details.
          </p>

        </div>
      )}
    </div>
  )
}


