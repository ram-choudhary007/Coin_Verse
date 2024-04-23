import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { doc, getDoc, updateDoc,arrayUnion } from "firebase/firestore";
import { db } from '../../config/firebase';

export const fetchFundTransferDetails = createAsyncThunk(
  'wallet/fetchFundTransferDetails',
  async (userId) => {
    try {
      const docRef = doc(db, 'users', userId);
      let docSnap = await getDoc(docRef);

      return docSnap.data().wallet;

    } catch (error) {
      console.error('Error fetching fund transfer details:', error);
      throw error;
    }
  }
);


// Thunk to deposit funds
export const depositFunds = createAsyncThunk(
  'wallet/depositFunds',
  async ({ userId, fundTransferDetail }, { rejectWithValue }) => {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const userDocRef = doc(db, 'users', userId);
      const userDocSnap = await getDoc(userDocRef);


      const currentWalletData = userDocSnap.data().wallet || { availableAmount: 0, fundTransferDetails: [] };
      // const newAmount = Number(currentWalletData.availableAmount) + Number(fundTransferDetail.amount);

      const updatedFundTransferDetails = [...currentWalletData.fundTransferDetails, fundTransferDetail];

      await updateDoc(userDocRef, {
        'wallet.availableAmount': fundTransferDetail.newAmount,
        'wallet.fundTransferDetails': updatedFundTransferDetails,
      });

      return fundTransferDetail;
    } catch (error) {
      console.error('Error depositing funds:', error);
      return rejectWithValue(error.message); // Pass error to Redux state
    }
  }
);

// Thunk to withdraw funds
export const withdrawFunds = createAsyncThunk(
  'wallet/withdrawFunds',
  async ({ userId, fundTransferDetail }, { rejectWithValue }) => {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const userDocRef = doc(db, 'users', userId);
      const userDocSnap = await getDoc(userDocRef);


      const currentWalletData = userDocSnap.data().wallet || { availableAmount: 0, fundTransferDetails: [] };
      // const newAmount = Number(currentWalletData.availableAmount) - Number(fundTransferDetail.amount);
      const updatedFundTransferDetails = [...currentWalletData.fundTransferDetails, fundTransferDetail];

      await updateDoc(userDocRef, {
        'wallet.availableAmount': fundTransferDetail.newAmount,
        'wallet.fundTransferDetails': updatedFundTransferDetails,
      });

      return fundTransferDetail;
    } catch (error) {
      console.error('Error depositing funds:', error);
      return rejectWithValue(error.message); // Pass error to Redux state
    }
  }
);

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

const walletSlice = createSlice({
  name: 'wallet',
  initialState: {
    availableAmount: 500,
    amountInvested: 0,
    fundTransferDetails: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchFundTransferDetails.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(fetchFundTransferDetails.fulfilled, (state, action) => {
      // Set the initial state with the fetched data
      state.availableAmount = action.payload.availableAmount;
      state.amountInvested = action.payload.amountInvested;
      state.fundTransferDetails = action.payload.fundTransferDetails;
      state.status = 'idle'; // Assuming the status should be set to 'idle' initially
      state.error = null; // Assuming there is no error initially
    });
    builder.addCase(fetchFundTransferDetails.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    });
    // deposit funds
    builder.addCase(depositFunds.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.availableAmount += Number(action.payload.amount);
      state.fundTransferDetails = action.payload.fundTransferDetail;
    });
    builder.addCase(depositFunds.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(withdrawFunds.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(withdrawFunds.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.availableAmount -= Number(action.payload.amount);
      state.fundTransferDetails = action.payload.fundTransferDetail;
    });
    builder.addCase(withdrawFunds.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    });

    // buy tokens and sell tokens
    builder.addCase(buyToken.pending, (state) => {
      state.status = 'loading';
  });
  builder.addCase(buyToken.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.availableAmount -= Number(action.payload.amount);
      state.amountInvested += Number(action.payload.amount);
      state.fundTransferDetails = action.payload.fundTransferDetail;
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
      state.availableAmount += Number(action.payload.amount);
      state.amountInvested -= Number(action.payload.amount);
      state.fundTransferDetails = action.payload.fundTransferDetail;
  });
  builder.addCase(sellToken.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
  });
  },
});

export default walletSlice.reducer;
