import React from 'react'
import { ClipLoader } from "react-spinners";


export const Loading = ({tipo}) => {
    console.log(tipo)
        if(tipo=="all"){
            return (
                <>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <ClipLoader color={"#123abc"} loading={true} size={100} />
                </div>
                </>
            );
        }  
        if(tipo=="loading"){
            return (
                <>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <ClipLoader color={"#123abc"} loading={true} size={100} />
                </div>
                </>
            );
        }  
}
