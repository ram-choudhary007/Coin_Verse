import React, { useEffect } from 'react'
import OrderList from './OrderList'
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrders } from '../redux/slices/orderSlice';

export const Orders = () => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders?.orders) || null;
  const user = useSelector((state) => state.auth?.userDetails) || null;
  useEffect(() => {
    if (user) {
      dispatch(fetchOrders(user.uid));
    }
  }, [dispatch, user])
  
  return (
    <div>
      <OrderList orders={orders} />
    </div>
  )
}
