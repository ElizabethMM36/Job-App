import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        loading: false,
        user: null
    },
    reducers: {
        // Actions
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setUser: (state, action) => {
            console.log("Updating Redux User Data:", action.payload); // Debugging
            state.user = action.payload;
        }
    }
});


export const {setLoading, setUser} = authSlice.actions;
export default authSlice.reducer;