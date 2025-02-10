import Afip from "@afipsdk/afip.js";

const afip = new Afip({ CUIT: 20409378472 });

async function faturar() {
  const punto_de_venta = 13;

  const tipo_de_factura = 1; // 11 = Factura C

  const last_voucher = await afip.ElectronicBilling.getLastVoucher(
    punto_de_venta,
    tipo_de_factura,
  );

  console.log({ last_voucher });

  const fecha = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .split("T")[0];
  console.log({ fecha });

  const data = {
    CantReg: 1, // Cantidad de comprobantes a registrar
    PtoVta: 13, // Punto de venta

    CbteDesde: last_voucher,
    CbteHasta: last_voucher,

    CbteTipo: 1, // Tipo de comprobante (ver tipos disponibles)
    Concepto: 1, // Concepto del Comprobante: (1)Productos, (2)Servicios, (3)Productos y Servicios

    DocTipo: 80, // Tipo de documento del comprador (ver tipos disponibles)
    DocNro: 20111111112, // Numero de documento del comprador

    CbteDesde: last_voucher + 1, // Numero de comprobante o numero del primer comprobante en caso de ser mas de uno
    CbteHasta: last_voucher + 1, // Numero de comprobante o numero del ultimo comprobante en caso de ser mas de uno
    CbteFch: parseInt(fecha.replace(/-/g, "")),

    // El campo  'Importe Total' ImpTotal, debe ser igual  a la  suma de ImpTotConc + ImpNeto + ImpOpEx + ImpTrib + ImpIVA.
    ImpTotal: 184.05, // Importe total del comprobante
    ImpNeto: 150, // Importe neto gravado
    ImpTrib: 7.8, //Importe total de tributos
    ImpIVA: 26.25, //Importe total de IVA
    ImpTotConc: 0, // Importe neto no gravado
    ImpOpEx: 0, // Importe exento de IVA

    MonId: "PES", //Tipo de moneda usada en el comprobante (ver tipos disponibles)('PES' para pesos argentinos)
    MonCotiz: 1, // Cotización de la moneda usada (1 para pesos argentinos)

    CondicionIVAReceptorId: 1,

    Iva: [
      {
        Id: 5, // Id del tipo de IVA (ver tipos disponibles)
        BaseImp: 100, // Base imponible
        Importe: 21, // Importe
      },
      {
        Id: 4, // Id del tipo de IVA (ver tipos disponibles)
        BaseImp: 50, // Base imponible
        Importe: 5.25, // Importe
      },
    ],

    Tributos: [
      // (Opcional) Tributos asociados al comprobante
      {
        Id: 99, // Id del tipo de tributo (ver tipos disponibles)
        Desc: "Ingresos Brutos", // (Opcional) Descripcion
        BaseImp: 150, // Base imponible para el tributo
        Alic: 5.2, // Alícuota
        Importe: 7.8, // Importe del tributo
      },
    ],
    // FchServDesde: fecha_servicio_desde,
    // FchServHasta: fecha_servicio_hasta,
    // FchVtoPago: fecha_vencimiento_pago,
  };

  console.log({ dsadasdsa: data.CbteFch });
  const res = await afip.ElectronicBilling.createVoucher(data);

  console.log({
    cae: res.CAE, //CAE asignado a la Factura
    vencimiento: res.CAEFchVto, //Fecha de vencimiento del CAE
  });
}

faturar();
