import { configureStore } from '@reduxjs/toolkit'; 
import TelasReducer from './Features/TelasReducer';
import ConfigReducer from './Features/ConfigReducer';


export const store = configureStore({
  reducer: {
    Telas:TelasReducer,
    Config:ConfigReducer,
  },
});

