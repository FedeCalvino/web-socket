import React from "react";
import {
  Document,
  Text,
  Page,
  StyleSheet,
  Image,
  View,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 20,
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    fontSize: 12,
    fontWeight: "bold",
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
    width: "100%",
  },
  itemD:{
    marginBottom:"20px"
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    fontSize: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
    width: "100%",
  },
  // Columnas de la tabla
  tableHeaderCell2: {
    width: "8%", // Número
    textAlign: "center",
  },
  tableHeaderCell1: {
    width: "15%", // Ambiente tiene más espacio
    textAlign: "center",
  },
  tableHeaderCell: {
    width: "6%", // Otras columnas pequeñas
    textAlign: "center",
  },
  tableHeaderCell3: {
    width: "6%", // Otras columnas pequeñas
    textAlign: "center",
  },
  tableHeaderCellPosicion: {
    width: "15%", // Posición con mayor prioridad
    textAlign: "center",
  },
  tableHeaderCellLado: {
    width: "15%", // Lado con mayor prioridad
    textAlign: "center",
  },
  tableHeaderCellMotor: {
    width: "15%", // Motor con mayor prioridad
    textAlign: "center",
  },

  // Celdas de la tabla
  tableCell2: {
    width: "8%", // Número
    textAlign: "center",
  },
  tableCell1: {
    width: "15%", // Ambiente tiene más espacio
    textAlign: "center",
  },  
  logoContainer: {
    position: "absolute",
    top: 12,
    right: 21,
  },
  logo: {
    marginTop: "10px",
    width: 180,
    height: 80,
    marginBottom: 15,
  },
  title1: {
    fontSize: 22,
    marginBottom: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  tableCell: {
    width: "6%", // Otras celdas pequeñas
    textAlign: "center",
  },
  tableCellPosicion: {
    width: "15%", // Posición con mayor prioridad
    textAlign: "center",
  },
  tableCellLado: {
    width: "15%", // Lado con mayor prioridad
    textAlign: "center",
  },
  tableCellMotor: {
    width: "15%", // Motor con mayor prioridad
    textAlign: "center",
  },
  itemContainer: {
    border: "1px solid #ddd",
    borderRadius: 5,
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#fff",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
  },
  itemText: {
    marginBottom: 5,
    lineHeight: 1.5,
  },
  itemLabel: {
    fontWeight: "bold",
    color: "#333",
  }
});


const FormatearFecha = ({ fecha }) => {
  if (!fecha) return ""; // Maneja el caso donde la fecha es nula o indefinida
  const partesFecha = fecha.split("-");
  if (partesFecha.length !== 3) return ""; // Maneja el caso donde la fecha no tiene el formato correcto
  const [anio, mes, dia] = partesFecha;
  return `${dia}/${mes}/${anio}`;
};

const Header = ({Datos}) => (
  <>
    { Datos.fechaInst &&
    <Text style={styles.title1}>
      Fecha Instalación: <FormatearFecha fecha={Datos.fechaInst} />
    </Text>
    }
    <View style={styles.logoContainer}>
      <Image style={styles.logo} src="ImgLogo.png" />
    </View>
    <Text style={styles.title}>Detalles de la Venta</Text>
    <Text style={styles.subtitle}>
      Nombre del Cliente: {Datos.cliNomb}
    </Text>
    <Text style={styles.subtitle}>Obra: {Datos.obra || "N/A"}</Text>
  </>
);

const TableHeader = () => (
  <View style={styles.tableHeader}>
    <Text style={[styles.tableHeaderCell2, styles.subtitle]}>Numero</Text>
    <Text style={[styles.tableHeaderCell1, styles.subtitle]}>Ambiente</Text>
    <Text style={[styles.tableHeaderCell, styles.subtitle]}>Ancho AF-AF</Text>
    <Text style={[styles.tableHeaderCell, styles.subtitle]}>Ancho Tela</Text>
    <Text style={[styles.tableHeaderCell, styles.subtitle]}>Ancho Caño</Text>
    <Text style={[styles.tableHeaderCell, styles.subtitle]}>Caño</Text>
    <Text style={[styles.tableHeaderCell, styles.subtitle]}>Alto Cortina</Text>
    <Text style={[styles.tableHeaderCell, styles.subtitle]}>Alto Tela</Text>
    <Text style={[styles.tableHeaderCell, styles.subtitle]}>Cadena</Text>
    <Text style={[styles.tableHeaderCellPosicion, styles.subtitle]}>Posición</Text>
    <Text style={[styles.tableHeaderCellLado, styles.subtitle]}>Lado</Text>
    <Text style={[styles.tableHeaderCellMotor, styles.subtitle]}>Motor</Text>
  </View>
);


const ItemDetail = ({ label, value }) => (
  <Text style={styles.itemText}>
    <Text style={styles.itemLabel}>{label}: </Text>
    {value || "N/A"}
  </Text>
);


const TelaTitle = ({ tela }) => <Text style={styles.title}>Tela: {tela}</Text>;

export const OrdenProduccion = ({ Venta }) => {

  console.log("Ventas",Venta)
  //Ventas.map((Venta)=>{

  const Cortinasroller = Venta.listaArticulos.filter((art) => art.nombre === "Roller");
  const Rieles = Venta.listaArticulos.filter((art) => art.nombre === "Riel");

  const groupedCortinas = Object.entries(
    Cortinasroller.reduce((groups, cortina) => {
      const key = `${cortina.nombreTela} ${cortina.colorTela}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(cortina);
      return groups;
    }, {})
  );

  const groupedRieles = [];
  for (let i = 0; i < Rieles.length; i += 2) {
    groupedRieles.push(Rieles.slice(i, i + 2));
  }

  if (Cortinasroller.length > 9) {
    const pages = [];

    groupedCortinas.forEach(([key, cortinas]) => {
      // Dividimos las cortinas en bloques de 9
      for (let i = 0; i < cortinas.length; i += 9) {
        const cortinasSlice = cortinas.slice(i, i + 9);
        pages.push({
          tela: key,
          cortinas: cortinasSlice,
        });
      }
    });

    return (
      <Document>
        {pages.map((page, index) => (
          <Page
            key={index}
            size="A4"
            style={styles.page}
            orientation="landscape"
          >
            <Header Datos={Venta.Datos} />
            <TelaTitle tela={page.tela} />
            <TableHeader />
            {page.cortinas.map((Roll, cortinaIndex) => (
              <View style={styles.tableRow} key={cortinaIndex}>
                <Text style={[styles.tableCell2, styles.text]}>{Roll.IdArticulo}</Text>
                <Text style={[styles.tableCell1, styles.text]}>{Roll.Ambiente}</Text>
                <Text style={[styles.tableCell, styles.text]}>{Roll.ancho}</Text>
                <Text style={[styles.tableCell, styles.text]}>{Roll.AnchoTela}</Text>
                <Text style={[styles.tableCell, styles.text]}>{Roll.AnchoTubo}</Text>
                <Text style={[styles.tableCell, styles.text]}>{Roll.cano.tipo}</Text>
                <Text style={[styles.tableCell, styles.text]}>{Roll.alto}</Text>
                <Text style={[styles.tableCell, styles.text]}>{Roll.AltoTela}</Text>
                <Text style={[styles.tableCell, styles.text]}>{Roll.LargoCadena}</Text>
                <Text style={[styles.tableCellPosicion, styles.text]}>{Roll.posicion.posicion}</Text>
                <Text style={[styles.tableCellLado, styles.text]}>{Roll.ladoCadena.lado}</Text>
                <Text style={[styles.tableCellMotor, styles.text]}>{Roll.MotorRoller.nombre}</Text>
              </View>
            ))}
          </Page>
        ))}      
      </Document>
    );
  } else {
    return (
      <Document>
        {Cortinasroller.length > 0 && (
          <>
          <Page size="A4" style={styles.page} orientation="landscape">
            {/* Header */}
            <Header Datos={Venta.Datos} />
    
            {groupedCortinas.map(([key, cortinas], index) => (
              <React.Fragment key={index}>
                {/* Tela Title */}
                <TelaTitle tela={key} />
    
                {cortinas.length > 0 && (
                  <>
                    {/* Table Header */}
                    <TableHeader />
    
                    {/* Cortinas Data Rows */}
                    {cortinas.map((Roll, cortinaIndex) => (
                      <View style={styles.tableRow} key={cortinaIndex}>
                        <Text style={[styles.tableCell2, styles.text]}>{Roll.IdArticulo}</Text>
                        <Text style={[styles.tableCell1, styles.text]}>{Roll.Ambiente}</Text>
                        <Text style={[styles.tableCell, styles.text]}>{Roll.ancho}</Text>
                        <Text style={[styles.tableCell, styles.text]}>{Roll.AnchoTela}</Text>
                        <Text style={[styles.tableCell, styles.text]}>{Roll.AnchoTubo}</Text>
                        <Text style={[styles.tableCell, styles.text]}>{Roll.cano.tipo}</Text>
                        <Text style={[styles.tableCell, styles.text]}>{Roll.alto}</Text>
                        <Text style={[styles.tableCell, styles.text]}>{Roll.AltoTela}</Text>
                        <Text style={[styles.tableCell, styles.text]}>{Roll.LargoCadena}</Text>
                        <Text style={[styles.tableCellPosicion, styles.text]}>{Roll.posicion.posicion}</Text>
                        <Text style={[styles.tableCellLado, styles.text]}>{Roll.ladoCadena.lado}</Text>
                        <Text style={[styles.tableCellMotor, styles.text]}>{Roll.MotorRoller.nombre}</Text>
                      </View>
                    ))}
                  </>
                )}
              </React.Fragment>
            ))}
          </Page>
          </>
        )}
        {groupedRieles.map((group, pageIndex) => (
    <Page
      key={pageIndex}
      size="A4"
      style={styles.page}
      orientation="portrait"
    >
      <Header Datos={Venta.Datos} />
      {group.map((riel, rielIndex) => (
        <View style={styles.itemContainer} key={rielIndex}>
          <ItemDetail label="Numero" value={riel.IdArticulo} />
          <ItemDetail label="Ambiente" value={riel.ambiente} />
          <ItemDetail label="Ancho" value={riel.ancho} />
          <ItemDetail label="Tipo" value={riel.tipoRiel.tipo} />
          <ItemDetail label="Acumula" value={riel.ladoAcumula.nombre} />
          <ItemDetail label="Bastones" value={riel.bastones.nombre} />
          <ItemDetail label="Cantidad de Bastones" value={riel.bastones.cantidad} />
          <ItemDetail label="Soportes" value={riel.soportes.nombre} />
          <ItemDetail label="Cantidad de Soportes" value={riel.soportes.cantidad} />
          <ItemDetail label="Detalle" value={riel.detalle} />
        </View>
      ))}
    </Page>
  ))
  }
         
      </Document>
    );
                    }
    //  })
};
