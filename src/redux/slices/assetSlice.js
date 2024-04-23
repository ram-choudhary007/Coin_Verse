import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { db } from '../../config/firebase';
import { deleteField } from 'firebase/firestore';


export const buyAsset = createAsyncThunk(
  'assets/buyAsset',
  async ({ userId, Asset }) => {
    try {
      if (!userId) {
        throw new Error('User ID is undefined');
      }
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        if (userData.assets && userData.assets[Asset.id]) {
          // If the asset with the same ID exists, update its properties
          const existingAsset = userData.assets[Asset.id];
          const updatedAvgPrice =
            (parseFloat(existingAsset.avgPrice) * parseFloat(existingAsset.quantity) + parseFloat(Asset.avgPrice) * parseFloat(Asset.quantity)) /
            (parseFloat(existingAsset.quantity) + parseFloat(Asset.quantity));
          const updatedAmount = parseFloat(existingAsset.amount) + parseFloat(Asset.amount);
          const updatedQuantity = parseFloat((parseFloat(existingAsset.quantity) + parseFloat(Asset.quantity)).toFixed(10));
          await updateDoc(docRef, {
            [`assets.${Asset.id}.avgPrice`]: updatedAvgPrice.toFixed(2),
            [`assets.${Asset.id}.amount`]: updatedAmount.toFixed(2),
            [`assets.${Asset.id}.quantity`]: updatedQuantity
          });
        } else {
          // If the document exists but the asset doesn't, add the new asset
          await updateDoc(docRef, {
            [`assets.${Asset.id}`]: Asset
          });
        }
      } else {
        // If the document doesn't exist, create itwith the new asset
        await setDoc(docRef, {
          assets: {
            [Asset.id]: Asset
          }
        });
      }
      return Asset;
    } catch (error) {
      console.error("Error adding asset: ", error);
      throw error;
    }
  }
);

// Thunk to sell an order
export const sellAsset = createAsyncThunk(
  'assets/sellAsset',
  async ({ userId, Asset }) => {
    try {
      if (!userId) {
        throw new Error('User ID is undefined');
      }
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        if (userData.assets && userData.assets[Asset.id]) {
          const existingAsset = userData.assets[Asset.id];
          if (parseFloat(existingAsset.quantity) < parseFloat(Asset.quantity)) {
            throw new Error('Not enough asset quantity to sell');
          }
          const updatedQuantity = parseFloat((parseFloat(existingAsset.quantity) - parseFloat(Asset.quantity)).toFixed(10));
          const updatedAmount = parseFloat(existingAsset.amount) - parseFloat(Asset.amount);
          
          // If the quantity becomes zero, delete the asset from the user's assets
          if (updatedQuantity === 0) {
            await updateDoc(docRef, {
              [`assets.${Asset.id}`]: deleteField()
            });
          } else {
            // Update the remaining quantity of the asset
            await updateDoc(docRef, {
              [`assets.${Asset.id}.quantity`]: updatedQuantity,
              [`assets.${Asset.id}.amount`]: updatedAmount
            });
          }
        } else {
          throw new Error('Asset not found');
        }
      } else {
        throw new Error('User document does not exist');
      }
      return { ...Asset, quantity: -Asset.quantity };
    } catch (error) {
      console.error("Error selling asset: ", error);
      throw error;
    }
  }
);


// Thunk to fetch user's assets
export const fetchAssets = createAsyncThunk(
  'assets/fetchAssets',
  async (userId) => {
    try {
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return userData.assets || {};
      } else {
        console.warn(`User document not found for user ID ${userId}.`);
        return {};
      }
    } catch (error) {
      console.error("Error fetching assets: ", error);
      throw error;
    }
  }
);

const assetSlice = createSlice({
  name: "assets",
  initialState: {
    assetMap: {},
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAssets.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(fetchAssets.fulfilled, (state, action) => {
      state.status = 'succeeded';
      state.assetMap = action.payload;
    });
    builder.addCase(fetchAssets.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    });
    builder.addCase(buyAsset.fulfilled, (state, action) => {
      state.assetMap[action.payload.id] = action.payload;
    });
    builder.addCase(sellAsset.fulfilled, (state, action) => {
      state.assetMap[action.payload.id] = action.payload;
    });
  }
});

export default assetSlice.reducer;
