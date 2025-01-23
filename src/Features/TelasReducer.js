import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    Telas:{
        TelasRoller:[],
        TelasTradicional:[]
    }
};


export const TelasReducer = createSlice({
    name: "Telas",
    initialState,
    reducers: {
        setTelasRollerFeature: (state, action) => {
            console.log("enfeature",action.payload)
            state.Telas.TelasRoller = action.payload;
        },
        setTelasTradicionalFeature: (state, action) => {
            console.log("enfeature",action.payload)
            state.Telas.TelasTradicional = action.payload;
        },
    }
});

export const { setTelasRollerFeature,setTelasTradicionalFeature} = TelasReducer.actions;

export const selectTelas = (state) => state.Telas.Telas;

export const selectTelasRoller = (state) => state.Telas.Telas.TelasRoller;

export const selectTelasTradicional = (state) => state.Telas.Telas.TelasTradicional;

export default TelasReducer.reducer;
