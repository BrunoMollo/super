import QRCode from 'qrcode';
import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
  try {
    const fecha = url.searchParams.get('fecha');
    const cuit = url.searchParams.get('cuit');
    const ptoVta = url.searchParams.get('ptoVta');
    const tipoCmp = url.searchParams.get('tipoCmp');
    const nroCmp = url.searchParams.get('nroCmp');
    const importe = url.searchParams.get('importe');
    const moneda = url.searchParams.get('moneda');
    const ctz = url.searchParams.get('ctz');
    const tipoDocRec = url.searchParams.get('tipoDocRec');
    const nroDocRec = url.searchParams.get('nroDocRec');
    const tipoCodAut = url.searchParams.get('tipoCodAut');
    const codAut = url.searchParams.get('codAut');

    if (
      !fecha ||
      !cuit ||
      !ptoVta ||
      !tipoCmp ||
      !nroCmp ||
      !importe ||
      !moneda ||
      !ctz ||
      !tipoCodAut ||
      !codAut
    ) {
      throw error(400, 'Missing required parameters');
    }

    const jsonData = JSON.stringify({
      ver: 1,
      fecha,
      cuit: Number(cuit),
      ptoVta: Number(ptoVta),
      tipoCmp: Number(tipoCmp),
      nroCmp: Number(nroCmp),
      importe: Number(importe),
      moneda,
      ctz: Number(ctz),
      tipoDocRec,
      nroDocRec,
      tipoCodAut,
      codAut: Number(codAut)
    });

    const base64 = Buffer.from(jsonData).toString('base64');
    const afipURL = `https://afip.gob.ar/fe/qr/?p=${base64}`;

    const qrCodeBuffer = await QRCode.toBuffer(afipURL, {
      errorCorrectionLevel: 'M',
      type: 'png',
      width: 300,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    return new Response(qrCodeBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (err) {
    console.error('QR Code generation error:', err);
    throw error(500, 'Error generating QR code');
  }
};
