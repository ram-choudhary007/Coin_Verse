import React from 'react'
import './CSS//OrderList.css'
import { useSelector } from 'react-redux';

const OrderList = ({ orders }) => {
    const user = useSelector((state) => state.auth?.userDetails) || null;
    // const orders = useSelector((state) => state.order?.orderDetails) || null;
    if (!orders || orders.length === 0) {
        // If orders is undefined or null, return a message or handle it accordingly
        return <div className='NoOrderRender'>No orders available</div>;
    }

    const reversedOrderList = [...orders].reverse();

    return (
        <>{user ?
            (<>
                <div className='OrderList'>
                    <h2 style={{ color: "white" }}>Completed Orders</h2>
                    {
                        reversedOrderList.map((item) =>
                            <div className="order_card" key={item.name}>
                                <div>
                                    <div>Order type: <span style={{ fontWeight: "bold", color: item.type === 'buy' ? "green" : "red" }}>{item.type}</span></div>
                                    <div>Coin: <span style={{ fontWeight: "bold" }}>{item.name}</span></div>
                                </div>
                                <div>
                                    <div>Amount: <span style={{ fontWeight: "bold" }}>{item.amount}</span></div>
                                    <div>Price: <span style={{ fontWeight: "bold" }}>{item.price}</span></div>
                                    <div>Quantity: <span style={{ fontWeight: "bold" }}>{item.quantity}</span></div>
                                </div>
                                <div>
                                    <div>
                                        {new Intl.DateTimeFormat('en-US', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: true,
                                        }).format(new Date(item.time))}
                                    </div>
                                    <div>
                                        completed
                                    </div>
                                </div>
                            </div>
                        )
                    }

                </div>
            </>)
            :
            (<>
                <p className='freefav' style={{ margin: '100px', marginLeft: '600px', padding: '50px' }}>
                    Please log in to see your orders.
                </p>
            </>)}

        </>
    )
}

export default OrderList