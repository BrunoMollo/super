import Afip from "@afipsdk/afip.js";  // Asegúrate de importar correctamente
import path from 'path';  // Importar el módulo path
import fs from 'fs';  // Importar el módulo fs
import puppeteer from 'puppeteer';  // Importar puppeteer
import { fileURLToPath } from 'url';  // Importar fileURLToPath para convertir import.meta.url

const afip = new Afip({ CUIT: 20409378472 }); // Crear la instancia de Afip con tu CUIT

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function faturar() {
  const punto_de_venta = 13;
  const tipo_de_factura = 1; // 11 = Factura C

  // Obtener el último comprobante
  const last_voucher = await afip.ElectronicBilling.getLastVoucher(punto_de_venta, tipo_de_factura);
  console.log({ last_voucher });

  const fecha = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split("T")[0];
  console.log({ fecha });

  const data = {
    CantReg: 1,
    PtoVta: 13,
    CbteDesde: last_voucher + 1,
    CbteHasta: last_voucher + 1,
    CbteTipo: 1,
    Concepto: 1,
    DocTipo: 80,
    DocNro: 20111111112,
    CbteFch: parseInt(fecha.replace(/-/g, "")),
    ImpTotal: 184.05,
    ImpNeto: 150,
    ImpTrib: 7.8,
    ImpIVA: 26.25,
    MonId: "PES",
    MonCotiz: 1,
    CondicionIVAReceptorId: 1,
    Iva: [
      { Id: 5, BaseImp: 100, Importe: 21 },
      { Id: 4, BaseImp: 50, Importe: 5.25 }
    ],
    Tributos: [
      { Id: 99, Desc: "Ingresos Brutos", BaseImp: 150, Alic: 5.2, Importe: 7.8 }
    ]
  };

  const res = await afip.ElectronicBilling.createVoucher(data);
  console.log({
    cae: res.CAE,
    vencimiento: res.CAEFchVto
  });

  // Verificar que el CAE y otros datos se han recibido correctamente
  if (!res.CAE || !res.CAEFchVto) {
    console.error('Error: No se recibió el CAE o la fecha de vencimiento del CAE.');
    return;
  }

  // Leer la plantilla HTML
  const templatePath = path.join(__dirname, 'bill.html');
  const template = fs.readFileSync(templatePath, 'utf8');

  // Reemplazar valores en la plantilla
  let htmlContent = template
    .replace('{{CbteDesde}}', data.CbteDesde)
    .replace('{{PtoVta}}', data.PtoVta)
    .replace('{{Fecha}}', fecha)
    .replace('{{CAE}}', res.CAE)
    .replace('{{VencimientoCAE}}', res.CAEFchVto)
    .replace('{{ImpNeto}}', data.ImpNeto)
    .replace('{{ImpIVA}}', data.ImpIVA)
    .replace('{{ImpTotal}}', data.ImpTotal);

  // Usar Puppeteer para generar el PDF
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent);
  await page.pdf({ path: 'factura.pdf', format: 'A4' });

  await browser.close();
  console.log('PDF generado exitosamente: factura.pdf');
}

faturar();