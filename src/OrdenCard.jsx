import React, { useState } from "react";
import "./OrdenCard.css";
import Button from "react-bootstrap/Button";
import { Toaster, toast } from "react-hot-toast";

export const OrdenCard = ({ orden }) => {
  const { idOrden, articulo, estado, pasos, fechacCreacion } = orden;
  const [idordenSelecc, setidordenSelecc] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [pasosActualizados, setPasosActualizados] = useState(pasos);
  const [forceRender, setForceRender] = useState(false);

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  const Setpaso = async (pasoid) => {
    console.log(pasoid);
    const url = "http://200.40.89.254:8086/Orden/PasoOrden/Completar/" + pasoid;
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    };
    try {
      const response = await fetch(url, requestOptions);
      const result = await response.json();

      console.log(result);
      // Aquí se encuentra el paso a actualizar en el estado
      const pasoIndex = pasosActualizados.findIndex((paso) => paso.idPasoOrden === pasoid);
      if (pasoIndex !== -1) {
        // Actualizar el paso como completado
        const updatedPasos = [...pasosActualizados];
        updatedPasos[pasoIndex] = {
          ...updatedPasos[pasoIndex],
          terminada: true,
        };
        setPasosActualizados(updatedPasos); // Actualizar el estado de pasos
        setForceRender((prev) => !prev); // Forzar re-renderizado
      }
    } catch (error) {
      console.error("Error actualizando el paso:", error);
    }
  };

  return (
    <div className="card-container" onClick={handleFlip}>
      <div className={`orden-card ${isFlipped ? "orden-card--flipped" : ""}`}>
        <div className="orden-card__side orden-card__front">
          <h2 className="orden-card__titulo">Número {articulo.IdArticulo}</h2>
          <p>
            <strong>Artículo:</strong> {articulo.nombre}
          </p>
          <p>
            <strong>Ambiente:</strong> {articulo.Ambiente}
          </p>
          <p
            style={{
              fontSize: "24px",
              alignItems: "center",
              justifyContent: "center",
              display: "flex",
              marginTop: "5px",
            }}
          >
            {articulo.AnchoTela} x {articulo.AltoTela}
          </p>
          <h3>Pasos:</h3>
          <ul className="orden-card__pasos">
            {pasosActualizados.map((paso, index) => (
              <li
                key={index}
                className={
                  paso.terminada ? "paso--completo" : "paso--pendiente"
                }
              >
                {paso.paso.replace("_", " ")} {paso.terminada ? "✔️" : "❌"}
              </li>
            ))}
          </ul>
        </div>
        {/* Cara trasera */}
        <div className="orden-card__side orden-card__back">
          <div className="volver-container">
            <Button>Volver</Button>
          </div>
          <div className="Ticket-container">
            <Button>Ticket</Button>
          </div>
          {pasosActualizados.map((paso) => {
            if (!paso.terminada) {
              return (
                <Button
                  onClick={() => Setpaso(paso.idPasoOrden)}
                  className="botonesPasos"
                  key={paso.id}
                >
                  {paso.paso}
                </Button>
              );
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
};
