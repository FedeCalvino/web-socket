import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    Telas:{
        TelasRoller:[]
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
    }
});

export const { setTelasRollerFeature} = TelasReducer.actions;

export const selectTelas = (state) => state.Telas.Telas;

export const selectTelasRoller = (state) => state.Telas.Telas.TelasRoller;

export default TelasReducer.reducer;
