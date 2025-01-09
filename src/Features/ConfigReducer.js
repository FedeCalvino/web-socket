import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    RollerConfig: [],
};

export const ConfigReducer = createSlice({
    name: "Config",
    initialState,
    reducers: {
        setRollerConfig: (state, action) => {
            state.RollerConfig = action.payload;
        },
    },
});

export const { setRollerConfig } = ConfigReducer.actions;

export const selectRollerConfig = (state) => state.Config.RollerConfig;

export default ConfigReducer.reducer;
