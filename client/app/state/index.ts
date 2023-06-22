import { createSlice } from "@reduxjs/toolkit";

// Define the initial state of the application
const initialState = {
    mode: "light", // Represents the current theme mode ("light" or "dark")
    user: null, // Represents the currently logged-in user
    token: null, // Represents the authentication token
    posts: [], // Represents a list of posts
};

// Create a slice of the Redux store using the createSlice function from Redux Toolkit
export const authSlice = createSlice({
    name: "auth", // Name of the slice
    initialState, // Initial state of the slice
    reducers: {
        setMode: (state) => {
            /* In Redux, it's recommended not to modify the state directly. Instead, you should create a new state object based on the previous state.
             * Redux Toolkit uses a library called immer that makes it easier to create the new state object without directly modifying the original state.
             * So, even though it looks like we're modifying the state directly, under the hood, Redux Toolkit creates a new state object and replaces the old one with it.
             */

            // Toggle the theme mode between "light" and "dark"
            state.mode = state.mode === "light" ? "dark" : "light";
            // Here, `state.mode` represents the previous theme mode(mode: "light"), and `state.mode === "light" ? "dark" : "light"` represents the new theme mode.
        },
    },
});
