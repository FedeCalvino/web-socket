import { React, useState, useEffect, useNavigate } from 'react';
import "./App.css"
import {setRollerConfig} from "./Features/ConfigReducer"
import {setTelasRollerFeature} from "./Features/TelasReducer"
import { Ordenes } from './Ordenes';
import { useDispatch } from 'react-redux';

function App() {
  const [count, setCount] = useState(0)
  const dispatch = useDispatch()

  const UrlTipoConfig = "http://localhost:8083/Conf"
    const UrlTelas = "http://localhost:8083/Telas"

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
        const config = await fetchRollerConf();
        const telas = await fetchTelas();
        const TelasRoller = telas.filter(tela=>tela.tipo===1)
        if (config) {
          console.log("config",config)
          dispatch(setRollerConfig(config)); 
          console.log(TelasRoller)
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
