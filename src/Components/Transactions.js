import React from 'react'
import { useSelector } from 'react-redux'

const Transactions = () => {
  const transactions = useSelector((state) => state.wallet.fundTransferDetails) || null;
 
  const user = useSelector((state) => state.auth?.userDetails) || null;

  if (!transactions || transactions.length === 0) {
    return (
      <div style={{ textAlign: 'center', margin: '200px', color: 'white' }}>
        don't have any transactions.
      </div>
    );
  }

  const reversedTransactions = [...transactions].reverse();

  return (
    <div>
      {user ? (<div className='transaction_details'>
        <h2 style={{color: "#fff", margin: "20px"}}>Transactions Details</h2>
        {reversedTransactions.map((transaction, index) => (
          <div className='transaction_cart' key={index}>
            <div style={{padding: "10px"}}>
              <p> {transaction.type}</p>
              <p>
                {new Intl.DateTimeFormat('en-US', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                }).format(new Date(transaction.time))}
              </p>
            </div>
            <div style={{margin: "auto"}}>
              <p>Amount: <span style={{color: transaction.type === 'deposit' ? "green" : "red"}}>₹{transaction.amount}</span></p>
            </div>

          </div>
        ))}
      </div>) : (<>
        <div style={{ textAlign: 'center', margin: '200px', color: 'white' }}>
          Please log In to see your transactions.
        </div>
      </>)}
    </div>
  )
}

export default Transactions