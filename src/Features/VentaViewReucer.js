import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    Venta: {
        Venta: [],
        Cliente: [],
        Cortinas: []
    }
};

export const VentaViewReducer = createSlice({
    name: "Venta",
    initialState,
    reducers: {
        setVentaFeature: (state, action) => {
            state.Venta = action.payload;
        },
        setVenta: (state, action) => {
            state.Venta.Venta = action.payload;
        },
        setCliente: (state, action) => {
            state.Venta.Cliente = action.payload;
        },
        setCortinas: (state, action) => {
            state.Venta.Cortinas = action.payload;
        },
    }
});

// Exporting actions
export const { setVentaFeature, setVenta, setCliente, setCortinas } = VentaViewReducer.actions;

// Selectors for each state
export const selectVenta = (state) => state.Venta.Venta.Venta;
export const selectCliente = (state) => state.Venta.Cliente;
export const selectCortinas = (state) => state.Venta.Venta.Cortinas;

// Export the reducer
export default VentaViewReducer.reducer;
