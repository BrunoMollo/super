const request = require("request");
const { parseString } = require('xml2js');
const puppeteer = require('puppeteer');
const fs = require('fs');
const { CUIT, TOKEN, SIGN, ENDPOINT } = require("../config/config");

// Aca esta la solicitud SOAP
const requestBody = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
xmlns:ar="http://ar.gov.afip.dif.FEV1/">
    <soapenv:Header/>
    <soapenv:Body>
        <ar:FECAESolicitar>
            <ar:Auth>
                <ar:Token>${TOKEN}</ar:Token>
                <ar:Sign>${SIGN}</ar:Sign>
                <ar:Cuit>${CUIT}</ar:Cuit>
            </ar:Auth>
            <ar:FeCAEReq>
                <ar:FeCabReq>
                    <ar:CantReg>1</ar:CantReg>
                    <ar:PtoVta>13</ar:PtoVta>
                    <ar:CbteTipo>1</ar:CbteTipo>
                </ar:FeCabReq>
                <ar:FeDetReq>
                    <ar:FECAEDetRequest>
                        <ar:Concepto>1</ar:Concepto>
                        <ar:DocTipo>80</ar:DocTipo>
                        <ar:DocNro>20111111112</ar:DocNro>
                        <ar:CondicionIVAReceptorId>1</ar:CondicionIVAReceptorId>
                        <ar:CbteDesde>8</ar:CbteDesde>
                        <ar:CbteHasta>8</ar:CbteHasta>
                        <ar:CbteFch>20250210</ar:CbteFch>
                        <ar:ImpTotal>184.05</ar:ImpTotal>
                        <ar:ImpNeto>150</ar:ImpNeto>
                        <ar:ImpTrib>7.8</ar:ImpTrib>
                        <ar:ImpIVA>26.25</ar:ImpIVA>
                        <ar:MonId>PES</ar:MonId>
                        <ar:MonCotiz>1</ar:MonCotiz>
                        <ar:Tributos>
                            <ar:Tributo>
                                <ar:Id>99</ar:Id>
                                <ar:Desc>Impuesto Municipal</ar:Desc>
                                <ar:BaseImp>150</ar:BaseImp>
                                <ar:Alic>5.2</ar:Alic>
                                <ar:Importe>7.8</ar:Importe>
                            </ar:Tributo>
                        </ar:Tributos>
                        <ar:Iva>
                            <ar:AlicIva>
                                <ar:Id>5</ar:Id>
                                <ar:BaseImp>100</ar:BaseImp>
                                <ar:Importe>21</ar:Importe>
                            </ar:AlicIva>
                            <ar:AlicIva>
                                <ar:Id>4</ar:Id>
                                <ar:BaseImp>50</ar:BaseImp>
                                <ar:Importe>5.25</ar:Importe>
                            </ar:AlicIva>
                        </ar:Iva>
                    </ar:FECAEDetRequest>
                </ar:FeDetReq>
            </ar:FeCAEReq>
        </ar:FECAESolicitar>
    </soapenv:Body>
</soapenv:Envelope>`;

// algunas funciones para que quede bien el pdf je
function formatDate(dateStr) {
    return `${dateStr.substr(6, 2)}/${dateStr.substr(4, 2)}/${dateStr.substr(0, 4)}`;
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS'
    }).format(amount);
}

function getIVARate(id) {
    const ivaRates = {
        '4': '10.5',
        '5': '21',
        '6': '27'
    };
    return ivaRates[id] || id;
}

// Aca generamos el pdf....
async function generateInvoicePDF(xmlResponse, requestData) {
    parseString(xmlResponse, async (err, result) => {
        if (err) {
            console.error('Error al parsear XML:', err);
            return;
        }

        try {
            // por si las dudas imprimo todo antes
            console.log(JSON.stringify(result, null, 2));

            // extraigo los datos
            const soapResponse = result['soap:Envelope']['soap:Body'][0];
            const feResponse = soapResponse['FECAESolicitarResponse'][0]['FECAESolicitarResult'][0];

            // verifico si existen antes de todo
            if (!feResponse || !feResponse.FeDetResp || !feResponse.FeDetResp[0] || !feResponse.FeDetResp[0].FECAEDetResponse) {
                console.error('Estructura de respuesta inesperada:', JSON.stringify(feResponse, null, 2));
                return;
            }

            const cae = feResponse.FeDetResp[0].FECAEDetResponse[0].CAE[0];
            const caeVto = feResponse.FeDetResp[0].FECAEDetResponse[0].CAEFchVto[0];

         
            const requestObj = {
                FeCAEReq: {
                    FeCabReq: {
                        PtoVta: "13",
                        CbteTipo: "1"
                    },
                    FeDetReq: {
                        FECAEDetRequest: {
                            CbteDesde: "6",
                            CbteFch: "20250206",
                            ImpTotal: "184.05",
                            ImpNeto: "150",
                            ImpTrib: "7.8",
                            DocNro: "20111111112",
                            Iva: {
                                AlicIva: [
                                    {
                                        Id: "5",
                                        BaseImp: "100",
                                        Importe: "21"
                                    },
                                    {
                                        Id: "4",
                                        BaseImp: "50",
                                        Importe: "5.25"
                                    }
                                ]
                            },
                            Tributos: {
                                Tributo: {
                                    Desc: "Impuesto Municipal",
                                    BaseImp: "150",
                                    Importe: "7.8"
                                }
                            }
                        }
                    }
                }
            };

           
            const path = require('path');
            const template = fs.readFileSync(path.join(__dirname, '..', 'src', 'bill.html'), 'utf8');

            
            let htmlContent = template
                .replace('FACTURA C', `Factura ${requestObj.FeCAEReq.FeCabReq.CbteTipo}`)
                .replace('Codigo 11', `Código ${requestObj.FeCAEReq.FeCabReq.CbteTipo}`)
                .replace('P.V: 00004', `P.V: ${requestObj.FeCAEReq.FeCabReq.PtoVta}`)
                .replace('Nro: 00001484', `Nro: ${requestObj.FeCAEReq.FeDetReq.FECAEDetRequest.CbteDesde}`)
                .replace('Fecha: 21/11/2023', `Fecha: ${formatDate(requestObj.FeCAEReq.FeDetReq.FECAEDetRequest.CbteFch)}`)
                .replace('1.500,00', formatCurrency(requestObj.FeCAEReq.FeDetReq.FECAEDetRequest.ImpTotal))
                .replace('12345678912345', cae)
                .replace('05/11/2023', formatDate(caeVto));

            // Usar puppeteer para generar el PDF
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.setContent(htmlContent);
            await page.pdf({ path: 'factura.pdf', format: 'A4' });

            await browser.close();
            console.log('PDF generado exitosamente: factura.pdf');
        } catch (error) {
            console.error('Error al generar PDF:', error);
        }
    });
}

// Configuración de la solicitud SOAP
const options = {
    method: "POST",
    url: ENDPOINT,
    headers: {
        "SOAPAction": "http://ar.gov.afip.dif.FEV1/FECAESolicitar",
        "Content-Type": "text/xml;charset=utf-8",
    },
    body: requestBody
};

request(options, (error, response, body) => {
    if (error) {
        console.error("Error en la solicitud:", error);
        console.log("Respuesta del servidor:");

        return;
    }
    console.log("Respuesta del servidor recibida");
    
   
    generateInvoicePDF(body, requestBody);
});