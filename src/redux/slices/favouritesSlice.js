import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { db } from '../../config/firebase'; // Assuming this imports your Firebase configuration
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, setDoc } from "firebase/firestore";

// Thunk to add a coin to a user's favorites
export const addToFavourites = createAsyncThunk(
  'users/addToFavourites',
  async ({ userId, coinId }) => {
    try {
      if (!userId) {
        throw new Error('User ID is undefined');
      }

      const docRef = doc(db, 'users', userId); // Assuming 'users' is the collection for user data
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // If the document exists, update it to add the new coin ID to the "coins" array
        await updateDoc(docRef, {
          favouriteCoins: arrayUnion( coinId)
        });
      } else {
        // If the document doesn't exist, create it with the new coin ID
        await setDoc(docRef, {
          favouriteCoins: [ coinId]
        });
      }

      return {  coinId };
    } catch (error) {
      console.error("Error adding document: ", error);
      throw error;
    }
  }
);

// Thunk to remove a coin from a user's favorites
export const removeFromFavourites = createAsyncThunk(
  'users/removeFromFavorites',
  async ({ userId, coinId }) => {
    try {
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const { favouriteCoins } = docSnap.data();
        if (favouriteCoins && favouriteCoins.includes(coinId)) {
          await updateDoc(docRef, {
            favouriteCoins: arrayRemove(coinId)
          });
          return coinId;
        } else {
          console.warn(`Coin ID ${coinId} not found in favourites.`);
          return null; // or throw an error if necessary
        }
      } else {
        console.warn(`User document not found for user ID ${userId}.`);
        return null; // or throw an error if necessary
      }
    } catch (error) {
      console.error("Error removing document: ", error);
      throw error;
    }
  }
);


// Thunk to fetch a user's favorites
export const fetchFavorites = createAsyncThunk(
  'users/fetchFavorites',
  async (userId) => { 
    try {
      const querySnapshot = await getDoc(doc(db, 'users', userId)); // Assuming 'users' is the collection name and 'userId' is the document ID
      const userData = querySnapshot.data();
      const favoriteCoins = userData && userData.favouriteCoins ? userData.favouriteCoins : []; // Check if 'favouriteCoins' exists and is an array
      return favoriteCoins;
    } catch (error) {
      console.error("Error fetching favorites: ", error);
      throw error;
    }
  }
);



// Slice for managing favorite coins
const favouritesSlice = createSlice({
  name: "favoriteCoins",
  initialState: {
    favoriteCoins: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchFavorites.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(fetchFavorites.fulfilled, (state, action) => {
      state.status = 'succeeded';
      // state.favoriteCoins = action.payload;
      state.favoriteCoins = action.payload.map(coinId => ({ coinId }));
    });
    builder.addCase(fetchFavorites.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.error.message;
    });
    builder.addCase(addToFavourites.fulfilled, (state, action) => {
      state.favoriteCoins.push(action.payload);
    });
    builder.addCase(removeFromFavourites.fulfilled, (state, action) => {
      state.favoriteCoins = state.favoriteCoins.filter(item => item.coinId !== action.payload);
    });
  }
});

export default favouritesSlice.reducer;
