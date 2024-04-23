import React, { useEffect, useRef, useState } from 'react'
import './CSS/OrderPopup.css'
import { buyOrder, sellOrder } from '../redux/slices/orderSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { CryptoData } from './NewCryptoData'
import { fetchFundTransferDetails, buyToken, sellToken } from '../redux/slices/walletSlice'
// import { buyToken, sellToken } from '../redux/slices/tradeSlice'
import { buyAsset, sellAsset, fetchAssets } from '../redux/slices/assetSlice'

const Popup = ({ setPopupOpen, orderType }) => {
    const user = useSelector((state) => state.auth?.userDetails) || null;
    const dispatch = useDispatch();
    const popupRef = useRef();
    const { id } = useParams();
    const currentTime = new Date().toISOString();
    const crypto = CryptoData.find((crypto) => crypto.id === id);

    const digits = String(Math.ceil(crypto.current_price)).length - 1;
    let resolution = Math.pow(10, -digits) * 5;

    const [quantity, setQuantity] = useState(Number(resolution.toFixed(digits)));
    const [amount, setAmount] = useState((quantity * crypto.current_price).toFixed(2));

    const availToInvest = useSelector((state) => state.wallet.availableAmount);

    useEffect(() => {
        if (user) {
            dispatch(fetchAssets(user.uid));
        }
    }, [dispatch, user])
    const assets = useSelector((state) => state.assets?.assetMap || []);

    useEffect(() => {
        async function fetchData() {
            if (user) {
                const fundTransferDetails = await fetchFundTransferDetails(user.uid);
                dispatch(fundTransferDetails);
            }
        }
        fetchData();
    }, [dispatch, user]);

    // Check if crypto.name is present, otherwise set it to an empty object
    const selectedAsset = assets[crypto?.id] || {};

    const holdingQuantity = selectedAsset.quantity || 0;
    const investedAmount = holdingQuantity * crypto.current_price;

    const closePopup = () => {
        setPopupOpen(false);
    }

    const closePopupBox = (e) => {
        if (popupRef.current === e.target) {
            closePopup();
        }
    }

    const handleButtonClick = (percentage) => {
        let calculatedAmount;
        if (orderType === 'buy') {
            calculatedAmount = (availToInvest * percentage) / 100;
        } else {
            calculatedAmount = (investedAmount * percentage) / 100;
        }
        let newQuantity = Math.round(calculatedAmount / crypto.current_price / resolution) * resolution;
        let newAmount = newQuantity * crypto.current_price;
        if (newAmount > calculatedAmount) {
            newQuantity -= resolution;
            newAmount = newQuantity * crypto.current_price;
        }
        setQuantity(newQuantity.toFixed(digits));
        setAmount(newAmount);
    };

    /* 
        const incrementQuantity = () => {
            const newQuantity = Number(quantity) + Number(resolution);
            setQuantity(newQuantity.toFixed(digits));
            setAmount(newQuantity * crypto.current_price);
        }
    
        const decrementQuantity = () => {
            if (quantity > 0 && quantity - resolution > 0) {
                setQuantity((Number(quantity) - Number(resolution)).toFixed(digits));
                setAmount(quantity * crypto.current_price);
            }
        }
     */

    const decrementQuantity = (e) => {
        e.preventDefault();
        if (quantity > 0 && quantity - resolution > 0) {
            setQuantity((Number(quantity) - Number(resolution)).toFixed(digits));
            setAmount(quantity * crypto.current_price);
        }
    }

    const incrementQuantity = (e) => {
        e.preventDefault();
        const newQuantity = Number(quantity) + Number(resolution);
        setQuantity(newQuantity.toFixed(digits));
        setAmount(newQuantity * crypto.current_price);
    }

    useEffect(() => {
        let newQuantity = Math.round(amount / crypto.current_price / resolution) * resolution;
        let newAmount = (newQuantity * crypto.current_price).toFixed(2);
        if (newAmount > amount) {
            newQuantity -= resolution;
        }
        setQuantity(newQuantity.toFixed(digits));
    }, [amount, crypto.current_price, resolution, digits])

    useEffect(() => {
        // let newAmount = (quantity * crypto.current_price).toFixed(2);
        // setAmount(newAmount);
    }, [quantity, crypto.current_price])

    const handleOrder = () => {
        if (amount >= 50) {
            if (orderType === 'buy' && amount <= availToInvest) {
                dispatch(buyOrder({
                    userId: user.uid,
                    order: {
                        type: 'buy',
                        name: crypto.name,
                        id: crypto.id,
                        price: crypto.current_price,
                        quantity: quantity,
                        amount: (quantity * crypto.current_price).toFixed(2),
                        time: currentTime,
                    }
                }));

                dispatch(buyToken({ userId: user.uid, amount: (quantity * crypto.current_price).toFixed(2) }));
                dispatch(buyAsset({
                    userId: user.uid,
                    Asset: {
                        name: crypto.name,
                        id: crypto.id,
                        avgPrice: crypto.current_price.toFixed(2),
                        quantity: quantity,
                        amount: (quantity * crypto.current_price).toFixed(2)
                    }
                }));
            }
            else if (orderType === 'sell' && amount <= investedAmount) {
                dispatch(sellOrder({
                    userId: user.uid,
                    order: {
                        type: 'sell',
                        name: crypto.name,
                        id: crypto.id,
                        price: crypto.current_price,
                        quantity: quantity,
                        amount: (quantity * crypto.current_price).toFixed(2),
                        time: currentTime,
                    }
                }));
                dispatch(sellToken({ userId: user.uid, amount: (quantity * crypto.current_price).toFixed(2) }));
                dispatch(sellAsset({
                    userId: user.uid,
                    Asset: {
                        name: crypto.name,
                        id: crypto.id,
                        quantity: quantity,
                        amount: (quantity * crypto.current_price).toFixed(2)
                    }
                }));
            }
            else {
                alert("Error: Insufficient Balance");
            }
        } else {
            alert("Error: Amount should be more than 50 Rs");
        }
        setPopupOpen(false);
    }


    return (
        <div ref={popupRef} onClick={closePopupBox} className='popup'>
            <div className="popup_box">
                <div className="closeBtn">
                    <button onClick={closePopup}>Close</button>
                </div>
                <div>
                    <h2 style={{ color: "#f5e6e6" }}>Order type: <span style={{ color: orderType === 'buy' ? "green" : "red" }}>{orderType}</span></h2>
                    {orderType === 'buy' ? (
                        <p>Available amount: {availToInvest}</p>
                    ) : (
                        <p>Cuurent value: {investedAmount}</p>
                    )}
                    <label>Enter Amount: </label>
                    {/* <button className='quantity_btns' onClick={decrementQuantity}>-</button> */}
                    <input className='input-section' type="text" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder='Enter...' />
                    {/* <button className='quantity_btns' onClick={incrementQuantity}>+</button> */}
                    <div className='amount_btns'>
                        <button onClick={() => handleButtonClick(25)}>25%</button>
                        <button onClick={() => handleButtonClick(50)}>50%</button>
                        <button onClick={() => handleButtonClick(75)}>75%</button>
                        <button onClick={() => handleButtonClick(100)}>100%</button>
                    </div>
                    <div>
                        {/* <label>Enter quantity: </label>
                        <button className='quantity_btns' onClick={decrementQuantity}>-</button>
                        <input className='input-section' type="text" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder='Enter...' />
                        <button className='quantity_btns' onClick={incrementQuantity}>+</button> */}

                        <label>Enter quantity: </label>
                        <button className='quantity_btns' onClick={(e) => decrementQuantity(e)}>-</button>
                        <input className='input-section' type="text" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder='Enter...' />
                        <button className='quantity_btns' onClick={(e) => incrementQuantity(e)}>+</button>
                    </div>
                    <button onClick={handleOrder} className='place_orderBtn' style={{ backgroundColor: orderType === 'buy' ? "#16c784" : "#ea3943" }}>{orderType}</button>
                </div>
            </div>
        </div>
    )
}

export default Popup