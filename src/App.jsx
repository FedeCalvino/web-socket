import { React, useState, useEffect } from 'react';

import { useDispatch } from 'react-redux';
import "./App.css"
import {setRollerConfig,setRielConfig} from "./Features/ConfigReducer"
import { Ordenes } from './Ordenes';
import {setTelasRollerFeature,setTelasTradicionalFeature} from "./Features/TelasReducer"

const App = () => {
    
    const dispatch = useDispatch()

    const UrlTipoConfig = "http://200.40.89.254:8086/Conf"
    const UrlTelas = "http://200.40.89.254:8086/Telas"

    const fetchRollerConf = async () => {
      try {
        const res = await fetch(UrlTipoConfig);
        const data = await res.json();
        return data.body; 
      } catch (error) {
        console.error("Error fetching roller configuration:", error);
        return null; 
      }
    };
    const fetchTelas = async()=>{
        try {
            const res = await fetch(UrlTelas);
            const data = await res.json();
            return data.body; 
        } catch (error) {
            console.error("Error fetching roller configuration:", error);
            return null; 
        }
    }
    useEffect(() => {
      const fetchData = async () => {
        const telas = await fetchTelas();
        console.log("telas",telas)
        const TelasRoller = telas.filter(tela=>tela.tipo===1)
        console.log("TelasRoller",TelasRoller)
        const TelasTradi = telas.filter(tela=>tela.tipo===2)
        console.log("TelasTradi",TelasTradi)

        const config = await fetchRollerConf();
        if (config) {
          console.log("config",config)

          dispatch(setRollerConfig(config.configuracionRoller)); 
          dispatch(setRielConfig(config.configuracionRiel)); 
          dispatch(setTelasTradicionalFeature(TelasTradi));
          dispatch(setTelasRollerFeature(TelasRoller))
        }
      };
    
      fetchData();
    }, []);

  return (
    <>
      <Ordenes/>
    </>
  )
}

export default App
