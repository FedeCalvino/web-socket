import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    RollerConfig: [],
    RielConfig: []
};

export const ConfigReducer = createSlice({
    name: "Config",
    initialState,
    reducers: {
        setRollerConfig: (state, action) => {
            state.RollerConfig = action.payload;
        },
        setRielConfig: (state, action) => {
            state.RielConfig = action.payload;
        }
    },
});

export const { setRollerConfig } = ConfigReducer.actions;
export const { setRielConfig } = ConfigReducer.actions;

export const selectRollerConfig = (state) => state.Config.RollerConfig;
export const selectConfigRiel= (state) => state.Config.RielConfig;

export default ConfigReducer.reducer;
