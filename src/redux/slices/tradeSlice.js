import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from '../../config/firebase';

// Thunk to buy tokens
export const buyToken = createAsyncThunk(
    'wallet/buyToken',
    async ({ userId, amount }, { rejectWithValue }) => {
      try {
        if (!userId) {
          throw new Error('User ID is required');
        }
  
        const userDocRef = doc(db, 'users', userId);
        const userDocSnap = await getDoc(userDocRef);
  
        if (!userDocSnap.exists()) {
          throw new Error('User does not exist');
        }
  
        const walletData = userDocSnap.data().wallet;
        const parsedAmount = parseFloat(amount);
        const parsedAvailableAmount = parseFloat(walletData.availableAmount);
        const parsedAmountInvested = parseFloat(walletData.amountInvested);
  
        const newAvailableAmount = parsedAvailableAmount - parsedAmount;
        const newAmountInvested = parsedAmountInvested + parsedAmount;
  
        if (newAvailableAmount < 0) {
          throw new Error('Insufficient funds');
        }
  
        await updateDoc(userDocRef, {
          'wallet.availableAmount': newAvailableAmount.toFixed(2),
          'wallet.amountInvested': newAmountInvested.toFixed(2),
          'wallet.fundTransferDetails': arrayUnion({
            type: 'Buy',
            amount: amount,
            time: new Date().toISOString(),
          }),
        });
  
        return { amount };
      } catch (error) {
        console.error('Error buying tokens:', error);
        return rejectWithValue(error.message);
      }
    }
  );
  
  // Thunk to sell tokens
  export const sellToken = createAsyncThunk(
    'wallet/sellToken',
    async ({ userId, amount }, { rejectWithValue }) => {
      try {
        if (!userId) {
          throw new Error('User ID is required');
        }
  
        const userDocRef = doc(db, 'users', userId);
        const userDocSnap = await getDoc(userDocRef);
  
        const walletData = userDocSnap.data().wallet;
        if (!walletData) {
          throw new Error('Wallet data not available');
        }
  
        const parsedAmount = parseFloat(amount);
        const parsedAvailableAmount = parseFloat(walletData.availableAmount);
        const parsedAmountInvested = parseFloat(walletData.amountInvested);
  
        const newAvailableAmount = parsedAvailableAmount + parsedAmount;
        const newAmountInvested = parsedAmountInvested - parsedAmount;
  
        if (newAmountInvested < 0) {
          throw new Error('Not enough tokens to sell');
        }
  
        await updateDoc(userDocRef, {
          'wallet.availableAmount': newAvailableAmount.toFixed(2),
          'wallet.amountInvested': newAmountInvested.toFixed(2),
          'wallet.fundTransferDetails': arrayUnion({
            type: 'Sell',
            amount: amount,
            time: new Date().toISOString(),
          }),
        });
  
        return { amount };
      } catch (error) {
        console.error('Error selling tokens:', error);
        return rejectWithValue(error.message);
      }
    }
  );

  const transactionSlice = createSlice({
    name: 'Trade',
    initialState: {
      fundTransferDetails: [], 
      status: 'idle',
      error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(buyToken.pending, (state) => {
            state.status = 'loading';
        });
        builder.addCase(buyToken.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.availableAmount -= parseFloat(action.payload.amount);
            state.amountInvested += parseFloat(action.payload.amount);
        });
        builder.addCase(buyToken.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        });
        builder.addCase(sellToken.pending, (state) => {
            state.status = 'loading';
        });
        builder.addCase(sellToken.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.availableAmount += parseFloat(action.payload.amount);
            state.amountInvested -= parseFloat(action.payload.amount);
        });
        builder.addCase(sellToken.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
        });
        },
  });

    export default transactionSlice.reducer;