import React, { useState, useEffect } from "react";
import { OrdenCard } from "./OrdenCard";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import { PDFTela } from "./PDFTela";
import { Button } from "react-bootstrap";
import { pdf } from "@react-pdf/renderer";
import { selectRollerConfig } from "./Features/ConfigReducer";
import { useSelector } from "react-redux";
import { Loading } from "./Loading";
import { Row, Col, Modal } from "react-bootstrap";
import "./Ventas.css";
import { Client } from '@stomp/stompjs';
import { selectTelasRoller, selectTelas } from "./Features/TelasReducer";

export const Ordenes = () => {

  const [ordenes, setOrdenes] = useState([]);
  const [setLotes, Lotes] = useState([]);
  const [lotes, setlotes] = useState([]);
  const [agrupadas, setAgrupadas] = useState({});
  const [Loding, setLoding] = useState(false);
  const [ShowOrdenes, setShowOrdenes] = useState(false);
  const [Fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  console.log("fECHA", Fecha);
  const [Tamano, setTamano] = useState("1");
  const ConfigRoller = useSelector(selectRollerConfig);
  const CanosRoller = ConfigRoller.canos;
  const LadosCadenas = ConfigRoller.ladosCadena;
  const Motores = ConfigRoller.motores;
  const Posiciones = ConfigRoller.posiciones;
  const TiposCadenas = ConfigRoller.tiposCadena;
  const [lote, setlote] = useState(null);


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

  const fetchData = async () => {
    try {
      setLoding(true);
      console.log("se hace el fetch")
      const data = await fetch("http://localhost:8083/Lote/Fecha/" + Fecha);
      const response = await data.json();
      setlotes(response.body);
      console.log("dataa", response.body);
      setLoding(false);
    } catch (error) {
      setLoding(false);
      console.error("Error fetching orders:", error);
    }
  };

  const downloadPDF = async (Ventas) => {
    const blob = await pdf(<PDFTela Venta={Ventas} />).toBlob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${Ventas.Datos.cliNomb || "Reporte"}_O.C.pdf`;
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
        Articulo.MotorRoller.nombre = findNameMotor(Articulo.MotorRoller.idMotor);
        Articulo.TipoCadena.tipoCadena = findNameTipoCadena(Articulo.TipoCadena.idTipoCadena);
        Articulo.cano.tipo = findNameCano(Articulo.cano.id);
        Articulo.posicion.posicion = findNamePos(Articulo.posicion.posicionId);
        Articulo.ladoCadena.lado = findNameLadoCadena(Articulo.ladoCadena.ladoId);
        const telaArt = TiposTelas.find((tela)=>tela.id===Articulo.IdTipoTela);
        Articulo.nombreTela=telaArt.nombre
        Articulo.colorTela=telaArt.color
        return Articulo;
      });
  
      return { Datos: datos, listaArticulos };
    });
    console.log("ventasPDF",ventasPDF)
    ventasPDF.map((ventpdf)=>{
       downloadPDF(ventpdf);
    })
  };

  const connect = () => {
    const client = new Client({
      brokerURL: 'ws://localhost:8083/OrdenesSocket', 
      reconnectDelay: 5000, 
      debug: (msg) => console.log(msg), 
      onConnect: () => {
        console.log('Conexión WebSocket exitosa');
        // Suscribirse al canal
        client.subscribe('/topic/orders', (message) => {
          console.log('Mensaje recibido:', message.body);
          fetchData();
        });
      },
      onStompError: (frame) => {
        console.error('Error en STOMP:', frame);
      },
    });
  
    // Activar la conexión
    client.activate();
  };
  

  useEffect(() => {
    fetchData();
    connect();
  }, []);

  useEffect(() => {
    fetchData();
  }, [Fecha]);

  return (
    <div>
      {lote ? (
        <>
          <div key={lote.idlote} className="lote-container">
            <h2 className="lote-title">{lote.nombre}</h2>
            <div className="button-group">
              <Button onClick={() => setlote(null)} className="btn volver-btn">
                Volver
              </Button>
              <Button onClick={() => DescPdf(lote)} className="btn pdf-btn">
                PDF
              </Button>
            </div>
            <div className="ordenes-container">
              {lote.ventas.map((ven) => (
                  ven.ordenes.map((orden)=>{
                    return(
                    <OrdenCard
                    key={orden.idOrden}
                    orden={orden}
                    className="orden-card"
                  />
                    )
                  })     
              ))}
            </div>
          </div>
        </>
      ) : (
          <>
          <InputGroup
            style={{ alignContent: "center",display:"flex",justifyContent:"center" }}
          >
            <div style={{alignContent: "center",display:"flex",justifyContent:"center",width:"50%"}}>
            <h3>Fecha </h3>
            <Form.Control
              type="date"
              value={Fecha}
              style={{
                marginLeft: "10px",
                textAlign: "center",
                borderRadius: "10px",
                width: "90%"
              }}
              onChange={(e) => setFecha(e.target.value)}
            />
            </div>
          </InputGroup>
          {Loding ? <Loading tipo="all"/>:<>
          {lotes.map((lote) => (
            <div
              className={`venta-card${Tamano} shadow-sm p-3 mb-4 bg-white rounded`}
              style={{ marginTop: "40px" }}
              key={lote.idlote}
              onClick={() => setlote(lote)}
            >
              <Row className="align-items-center">
                <Col>
                  <div style={{ fontSize: "26px" }} className="fw-bold">
                    {lote.nombre}
                  </div>
                </Col>
              </Row>
            </div>
          ))}
          </>
          }
        </>
      )}
    </div>
  );
};
