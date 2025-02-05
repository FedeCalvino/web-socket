import React, { useState, useEffect, useRef } from "react";
import { OrdenCard } from "./OrdenCard";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import { OrdenProduccion } from "./OrdenProduccion";
import { Button } from "react-bootstrap";
import { pdf } from "@react-pdf/renderer";
import { selectRollerConfig,selectConfigRiel } from "./Features/ConfigReducer";
import { useSelector } from "react-redux";
import { Loading } from "./Loading";
import { Row, Col } from "react-bootstrap";
import "./Ventas.css";
import { Client } from '@stomp/stompjs';
import { selectTelasRoller, selectTelas } from "./Features/TelasReducer";

export const Ordenes = () => {

  const [ordenes, setOrdenes] = useState([]);
  const [lotes, setLotes] = useState([]);
  const [forceRender, setForceRender] = useState(false);
  const [agrupadas, setAgrupadas] = useState({});
  const [loading, setLoading] = useState(false);
  const [showOrdenes, setShowOrdenes] = useState(false);
  const [tamano, setTamano] = useState("1");
  const [lote, setLote] = useState(null);

  const [PasosVenta, setPasosVenta] = useState([]);

  const ConfigRoller = useSelector(selectRollerConfig);
  const CanosRoller = ConfigRoller.canos;
  const LadosCadenas = ConfigRoller.ladosCadena;
  const Motores = ConfigRoller.motores;
  const Posiciones = ConfigRoller.posiciones;
  const TiposCadenas = ConfigRoller.tiposCadena;
  const ConfigRiel = useSelector(selectConfigRiel);

  const ladosAcumula = ConfigRiel.ladoAcumula || []; 
  const tipos = ConfigRiel.tipos || [];

  const findNameladoAcumula = (idLado) => {
    return ladosAcumula.find((acc)=>acc.ladoAcumulaId===parseInt(idLado)).nombre;
  };
  const findNameTipoRiel = (id_tipo) => {
    return tipos.find((tipo)=>tipo.tipoId===parseInt(id_tipo)).tipo;
  };

  const findNameCano = (idCano) => {
    return CanosRoller.find((cano) => cano.id === idCano).tipo;
  };
  const findNameLadoCadena = (idlado) => {
    return LadosCadenas.find((lado) => lado.ladoId === idlado).lado;
  };
  const findNameMotor = (idMotor) => {
    return Motores.find((motor) => motor.idMotor === idMotor).nombre;
  };
  const findNamePos = (idPos) => {
    return Posiciones.find((pos) => pos.posicionId === idPos).posicion;
  };
  const findNameTipoCadena = (idTipoCadena) => {
    return TiposCadenas.find((cad) => cad.idTipoCadena === idTipoCadena)
      .tipoCadena;
  };
  const TiposTelas = useSelector(selectTelasRoller);
  
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]); // Fecha actual por defecto
  const fechaRef = useRef(null);
  
  useEffect(() => {
    if (fechaRef.current) {
      fechaRef.current.value = fecha; // Asigna la fecha inicial al input
    }
  }, [fecha]);

  const fetchData = async () => {
    try {
      setLotes([]);
      setLoading(true);
      console.log("Se hace el fetch");

      // Verifica si la referencia existe antes de acceder a su valor
      console.log("fechaRef",fechaRef)
      console.log("fechaRef.current.value",fechaRef.current?.value)
      const fechaInput = fechaRef.current ? fechaRef.current?.value : null;
      console.log("fechaInput",fechaInput)
      const fecha = fechaInput || new Date().toISOString().split("T")[0];
      console.log("Fecha actual:", fecha);
      setFecha(fecha)
      const url = `http://localhost:8083/Lote/Fecha/${fecha}`;
      console.log("URL", url);
      const response = await fetch(url);
      const data = await response.json();
      console.log(data)
    //if(data.status==="OK")
      setLotes(data.body);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching orders:", error);
    }
  };

  const downloadPDF = async (ventas) => {
    const blob = await pdf(<OrdenProduccion Venta={ventas} />).toBlob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${ventas.Datos.cliNomb || "Reporte"}_O.C.pdf`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const DescPdf = async (lote) => {

    const ventasPDF = lote.ventas.map((vent) => {
        const datos = {
          fechaInst: vent.fechaInstalacion,
          obra: vent.obra,
          cliNomb: vent.cliente.nombre,
        };
    
        const listaArticulos = vent.ordenes.map((ord) => {
          const Articulo = ord.articulo;
          if(Articulo.nombre==="Roller"){
          Articulo.MotorRoller.nombre = findNameMotor(Articulo.MotorRoller.idMotor);
          Articulo.TipoCadena.tipoCadena = findNameTipoCadena(Articulo.TipoCadena.idTipoCadena);
          Articulo.cano.tipo = findNameCano(Articulo.cano.id);
          Articulo.posicion.posicion = findNamePos(Articulo.posicion.posicionId);
          Articulo.ladoCadena.lado = findNameLadoCadena(Articulo.ladoCadena.ladoId);
          const telaArt = TiposTelas.find((tela)=>tela.id===Articulo.IdTipoTela);
          Articulo.nombreTela=telaArt.nombre
          Articulo.colorTela=telaArt.color
          }
          if(Articulo.nombre==="Riel"){
            Articulo.ladoAcumula.nombre=findNameladoAcumula(Articulo.ladoAcumula.ladoAcumulaId)
            Articulo.tipoRiel.tipo=findNameTipoRiel(Articulo.tipoRiel.tipoId)
          }
          return Articulo;
        });
    
        return { Datos: datos, listaArticulos };
      });

    console.log("ventasPDF", ventasPDF);
    ventasPDF.map((ventpdf) => {
      downloadPDF(ventpdf);
    });
  };

  const connect = () => {
    const client = new Client({
      brokerURL: 'ws://200.40.89.254:8086/OrdenesSocket',
      reconnectDelay: 5000,
      debug: (msg) => console.log(msg),
      onConnect: () => {
        console.log('Conexión WebSocket exitosa');
        client.subscribe('/topic/orders', (message) => {
          console.log('Mensaje recibido:', message.body);
          fetchData();
        });
      },
      onStompError: (frame) => {
        console.error('Error en STOMP:', frame);
      },
    });

    client.activate();
  };

  const Setpaso = async (pasoid) => {
    console.log(pasoid);
    const url = `http://200.40.89.254:8086/Orden/PasoOrden/Completar/${pasoid}`;
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    };
    try {
      const response = await fetch(url, requestOptions);
      const result = await response.json();
    } catch (error) {
      console.error("Error actualizando el paso:", error);
    }
  };

  const PasoTerminado = (ven, Nombrepaso) => {
    return ven.ordenes.every((orden) =>
      orden.pasos.some((paso) => paso.paso === Nombrepaso && paso.terminada)
    );
  };

  const setPasoHecho = (ven,Paso) => {
    console.log("Seteo telas cortadas");
    ven.ordenes.forEach((orden) => {
      orden.pasos.forEach((paso) => {
        if (paso.paso === Paso) {
          Setpaso(paso.idPasoOrden);
        }
      });
    });
    fetchData();
    setLote(null);
  };


  const LoteCompleto = (lote) => {

    const hasUnfinishedStep = lote.ventas.some((ven) =>
      ven.ordenes.some((orden) =>
        orden.pasos.some((paso) => !paso.terminada)
      )
    );
  
    // Retornar algo simbólico si hay pasos sin terminar
    return hasUnfinishedStep ? (
      <div style={{ color: "red", fontSize: "18px", fontWeight: "bold" }}>
        •
      </div>
    ) : (
      <div style={{ color: "green", fontSize: "18px", fontWeight: "bold" }}>
        ✓
      </div>
    );
  };

  useEffect(() => {
    fetchData();
    connect();
  }, []);

  const fetchPasosLote=()=>{
    let pasos = []
    if(lote){
    lote.ventas?.map((ven)=>{
        ven.ordenes.map((ord)=>{
          ord.pasos.map((paso)=>{
          console.log(paso)
          let pasoOrden = paso.paso
          if(!pasos.find((pasoOrd)=>pasoOrd===pasoOrden)){
            pasos.push(pasoOrden) 
          }
        })
      })
    })
    setPasosVenta(pasos)
  }
  }

  useEffect(() => {
    fetchPasosLote();
  }, [lote]);


  useEffect(() => {
    // Vuelve a ejecutar el fetch si la fecha cambia
    //fetchData();
  }, [fechaRef.current?.value]);

  
  return (
    <div style={{ width: "100%" }}>
      {lote ? (
        <>
          {lote.ventas.map((ven) => (
            <div key={lote.idlote} className="lote-container">
              <h2 className="lote-title">{ven.cliente.nombre}</h2>
              <div className="button-group">
                <Button onClick={() => setLote(null)} className="btn volver-btn">
                  Volver
                </Button>
                {PasosVenta.map((paso) => {
                  return (
                    <Button
                      key={paso} // Ensure you have a unique key for each mapped item
                      onClick={() => setPasoHecho(ven,paso)} // Set the correct 'ven' item here
                      className={`btn pasos-btn ${
                        PasoTerminado(ven, paso) ? "btn-success" : "btn-danger"
                      }`}
                      disabled={PasoTerminado(ven, paso)}
                    >
                      {paso}
                    </Button>
                  );
                })}

                <Button onClick={() => DescPdf(lote)} className="btn pdf-btn">
                  ORDEN
                </Button>
              </div>
              <div className="ordenes-container">
                {ven.ordenes.map((orden) => (
                  <OrdenCard key={orden.idOrden} orden={orden} className="orden-card" />
                ))}
              </div>
            </div>
          ))}
        </>
      ) : (
        <>
          <InputGroup style={{ alignContent: "center", display: "flex", justifyContent: "center" }}>
            <div style={{ alignContent: "center", display: "flex", justifyContent: "center", width: "50%" }}>
              <h3>Fecha </h3>
              <Form.Control
                type="date"
                ref={fechaRef}
                style={{
                  marginLeft: "10px",
                  textAlign: "center",
                  borderRadius: "10px",
                  width: "90%",
                }}
                onChange={fetchData} // Llama a fetchData cuando cambia la fecha
              />
            </div>
          </InputGroup>
          {loading ? (
            <Loading tipo="all" />
          ) : (
            <>
              {lotes.map((lote) => (
                <div
                  className={`venta-card${tamano} shadow-sm p-3 mb-4 bg-white rounded`}
                  style={{ marginTop: "40px" }}
                  key={lote.idlote}
                  onClick={() => setLote(lote)}
                >
                  <Row className="align-items-center">
                    <Col>
                      <div style={{ fontSize: "26px" }} className="fw-bold">
                        {lote.nombre}
                      </div>
                    </Col>
                    <Col>
                      {LoteCompleto(lote)}
                    </Col>
                  </Row>
                </div>
              ))}
            </>
          )}
        </>
      )}
    </div>
  );
};
