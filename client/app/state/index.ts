import { createSlice, Draft, PayloadAction } from "@reduxjs/toolkit";
import produce from "immer";

interface User {
    id: string;
    name: string;
    friends: string[];
}

interface Post {
    _id: string;
    // Other post properties
}

interface AuthState {
    mode: string;
    user: User | null;
    token: string | null;
    posts: Post[];
}

const initialState: AuthState = {
    mode: "light",
    user: null,
    token: null,
    posts: [],
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setMode: (state) => {
            state.mode = state.mode === "light" ? "dark" : "light";
        },
        setLogin: (state, action: PayloadAction<{ user: User; token: string }>) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        setLogout: (state) => {
            state.user = null;
            state.token = null;
        },
        setFriends: (state, action: PayloadAction<{ friends: string[] }>) => {
            state.user = produce(state.user, (draft: Draft<User | null>) => {
                if (draft) {
                    draft.friends = action.payload.friends;
                } else {
                    console.error("User object is null");
                }
            });
        },
        setPosts: (state, action: PayloadAction<{ posts: Post[] }>) => {
            state.posts = action.payload.posts;
        },
        setPost: (state, action: PayloadAction<{ post: Post }>) => {
            state.posts = state.posts.map((post) =>
                post._id === action.payload.post._id ? action.payload.post : post
            );
        },
    },
});

export const {
    setMode,
    setLogin,
    setLogout,
    setFriends,
    setPosts,
    setPost,
} = authSlice.actions;

export default authSlice.reducer;
