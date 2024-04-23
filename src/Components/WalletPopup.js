import { useState } from 'react'
import './CSS/WalletPopup.css'
import { useDispatch, useSelector } from 'react-redux'
// import { withdrawFunds } from '../redux/slices/transactionSlice'
import { depositFunds, withdrawFunds } from '../redux/slices/walletSlice'

const WalletPopup = ({ setIsPopupOpen, transactionType }) => {

  const user = useSelector((state) => state.auth?.userDetails) || null;
  const currentTime = new Date().toISOString();
  const [amount, setAmount] = useState('')
  const dispatch = useDispatch();
  const availableAmount = useSelector((state) => state.wallet.availableAmount);

  const fundTransaction = () => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < 50 || numAmount < 0) {
      alert('Please enter an vaid amount greater than or equal to 50.');
      return;
    }

    if (transactionType === 'withdraw' && numAmount > availableAmount) {
      alert('Insufficient funds');
      return;
    }

    if (transactionType === 'deposit') {
      dispatch(depositFunds({
        userId: user.uid,
        fundTransferDetail: {
          type: 'deposit',
          amount: numAmount.toFixed(2),
          time: currentTime,
          availableAmount: availableAmount,
          newAmount: availableAmount + numAmount,
        }
      }));
    } else {
      dispatch(withdrawFunds({
        userId: user.uid,
        fundTransferDetail: {
          type: 'Withdrawal',
          amount: numAmount.toFixed(2),
          time: currentTime,
          availableAmount: availableAmount,
          newAmount: availableAmount - numAmount,
        }
      }));
    }

    setIsPopupOpen(false);
  }

  return (
    <div className='WalletPopup'>
      <div className="walletPopBox">
        <h2>{transactionType}</h2>
        <div className="close_Btn">
          <button onClick={() => setIsPopupOpen(false)} >close</button>
        </div>
        <div className='Tansaction'>
          <label htmlFor="#">Enter Amount: </label>
          <input type="text" className='input-section' value={amount} onChange={(e) => setAmount(e.target.value)} placeholder='Enter...' />
          <br />
          <button className='transactionBtn' style={{ backgroundColor: transactionType === 'deposit' ? "#16c784" : "#ea3943" }} onClick={fundTransaction}>{transactionType}</button>
        </div>
      </div>
    </div>
  )
}

export default WalletPopup