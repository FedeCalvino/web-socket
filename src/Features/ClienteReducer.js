import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    Cliente: {
        Id: "",
        Nombre: "",
        direccion: "",
        NumeroTelefono: "",
        rut: "",
        Tipo: "Cliente",
        MailCli:"",
        set: false,
    }
};

export const ClienteReducer = createSlice({
    name: "Cliente", 
    initialState,
    reducers: {
        setClienteFeature: (state, action) => {
            state.Cliente = action.payload;
        },
        Reset: (state) => {
            state.Cliente ={
                Id: "",
                Nombre: "",
                direccion: "",
                NumeroTelefono: "",
                rut: "",
                TipoId: 0,
                set: false,
            }
        },
    }
});

export const { setClienteFeature,Reset } = ClienteReducer.actions;

export const selectCliente = (state) => state.Cliente.Cliente;

export default ClienteReducer.reducer;
 