import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { doc, getDoc, updateDoc, arrayUnion, setDoc } from "firebase/firestore";
import { db } from '../../config/firebase';

// Thunk to add an buy order
export const buyOrder = createAsyncThunk(
  'orders/buyOrder',
  async ({ userId, order }) => {
    try {
      if (!userId) {
        throw new Error('User ID is undefined');
      }
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        // If the document exists, update it to add the new coin ID to the "coins" array
        await updateDoc(docRef, {
          orders: arrayUnion( order)
        });} else {
          // If the document doesn't exist, create it with the new coin ID
          await setDoc(docRef, {
            orders: [ order]
          });
        }
      return order;
    } catch (error) {
      console.error("Error adding order: ", error);
      throw error;
    }
  }
);

// Thunk to remove an order
export const sellOrder = createAsyncThunk(
  'orders/sellOrder',
  async ({ userId, order }) => {
    try {
      if (!userId) {
        throw new Error('User ID is undefined');
      }
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        // If the document exists, update it to add the new order to the "orders" array
        await updateDoc(docRef, {
          orders: arrayUnion(order)
        });
        return order;
      } /* else {
        // If the document doesn't exist, create it with the new order
        await setDoc(docRef, {
          orders: [order]
        });
        return order;
      } */
    } catch (error) {
      console.error("Error adding order: ", error);
      throw error;
    }
  }
);


// Thunk to fetch user's orders
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (userId) => {
    try {
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return userData.orders || [];
      } else {
        console.warn(`User document not found for user ID ${userId}.`);
        return [];
      }
    } catch (error) {
      console.error("Error fetching orders: ", error);
      throw error;
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    orders: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchOrders.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(fetchOrders.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.orders = action.payload;
    });
    builder.addCase(fetchOrders.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    });
    builder.addCase(buyOrder.fulfilled, (state, action) => {
      state.orders.push(action.payload);
    });
    builder.addCase(sellOrder.fulfilled, (state, action) => {
      state.orders.push(action.payload);
    });
  }
});

export default orderSlice.reducer;
