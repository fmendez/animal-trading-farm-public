import { createSlice } from "@reduxjs/toolkit";
import { TradeSliceState } from '../../types';

const initialState: TradeSliceState = { offers: [], tokens: [], mintsWithAccounts: [] };

const tradesSlice = createSlice({
    name: 'trades',
    initialState,
    reducers: {
        addOffers(state, action) {
            state.offers = action.payload;
        },
        addOffer(state, action) {
            state.offers.push(action.payload);
        },
        removeOffer(state, action) {
            state.offers = state.offers.filter(offer => offer.id !== action.payload)
        },

        addTokens(state, action) {
            state.tokens = action.payload;
        },
        addMintsWithAccount(state, action) {
            state.mintsWithAccounts = action.payload
        }
    }
});

export const { addOffers, addOffer, removeOffer, addTokens, addMintsWithAccount } = tradesSlice.actions;
export default tradesSlice.reducer;