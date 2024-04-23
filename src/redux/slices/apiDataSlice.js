import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Define the API link outside the async thunk
const apiLink = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=en";

export const fetchApiData = createAsyncThunk(
    "apiData/fetchApiData",
    async (_, { rejectWithValue }) => {
        // Check if the code is running in a browser environment
        if (typeof window === 'undefined') {
            return rejectWithValue('API calls can only be made from the client side.');
        }
        try {
            const response = await fetch(apiLink);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const apiDataSlice = createSlice({
    name: "apiData",
    initialState: {
        data: [],
        status: 'idle',
        error: null
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchApiData.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchApiData.fulfilled, (state, action) => {
                state.status = "succeeded";
                // Replace the existing data with the new payload
                state.data = action.payload;
            })
            .addCase(fetchApiData.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload; // Use payload for the error message
            });
    },
});

export default apiDataSlice.reducer;
