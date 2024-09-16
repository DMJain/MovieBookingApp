import { createSlice} from '@reduxjs/toolkit';

const initialState = {
    selectedSeats: [],
    totalPrice: null,
}

const bookingSlice = createSlice({
    name:"booking",
    initialState,
    reducers: {
        setBookingDetails: (state, action) => {
            state.selectedSeats = action.payload.selectedSeats;
            state.totalPrice = action.payload.totalPrice;
        },
    },
});

export const { setBookingDetails } = bookingSlice.actions;

export default bookingSlice.reducer;