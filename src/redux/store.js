import { configureStore} from "@reduxjs/toolkit";
import favouritesSlice from "./slices/favouritesSlice"
import authSlice from "./slices/authSlice";
import orderSlice from "./slices/orderSlice";
import walletSlice from "./slices/walletSlice";
import assetSlice from "./slices/assetSlice";
import apiDataSlice from "./slices/apiDataSlice";

export const store = configureStore({
    reducer: {
        favourites: favouritesSlice,
        auth: authSlice,
        orders: orderSlice,
        wallet: walletSlice,
        assets: assetSlice,
        apiData: apiDataSlice,
    },
    // middleware: [thunk], 
})