import { configureStore } from '@reduxjs/toolkit';
import ArticulosReducer from './Features/ArticulosReducer'; 
import TelasReducer from './Features/TelasReducer';
import ClienteReducer from './Features/ClienteReducer'
import ConfigReducer from './Features/ConfigReducer';
import VentaViewReducer from "./Features/VentaViewReucer"

export const store = configureStore({
  reducer: {
    Articulos: ArticulosReducer,
    Telas:TelasReducer,
    Cliente:ClienteReducer,
    Config:ConfigReducer,
    Venta:VentaViewReducer,
  },
});

