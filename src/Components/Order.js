import React, { useEffect, useState } from 'react'
import Popup from './OrderPopup'
import OrderList from './OrderList';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchOrders } from '../redux/slices/orderSlice';

const Order = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth?.userDetails) || null;
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [orderType, setOrderType] = useState('');
  const { id } = useParams();
  const orders = useSelector((state) => state.orders?.orders) || null;
  const filteredOrdered = orders.filter((crypto) => (crypto.id) === id)

  useEffect(() => {
    if (user) {
      dispatch(fetchOrders(user.uid));
    }
  }, [dispatch, user])

  const openPopup = (type) => {
    if (user) {
      setOrderType(type);
      setPopupOpen(true);
    } else {
      alert("Please Login to place order")
    }

  }

  return (
    <div className="orders">
      <div className="orderBtn">
        <button style={{ backgroundColor: "#16c784" }} onClick={() => openPopup('buy')}>buy</button>
        <button style={{ backgroundColor: "#ea3943" }} onClick={() => openPopup('sell')}>sell</button>
      </div>
      <br />
      <hr />
      <br />
      {isPopupOpen && <Popup setPopupOpen={setPopupOpen} orderType={orderType} />}
      <h2 style={{ color: "white" }}>Orders</h2>

      <OrderList orders={filteredOrdered} />
    </div>


  )
}

export default Order