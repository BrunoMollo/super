import fastify from 'fastify';
import QRCode from 'qrcode';

const server = fastify({ logger: true });

server.get('/', async (request, reply) => {
  const text = 'https://example.com'

  try {
    const qrCodeBuffer = await QRCode.toBuffer(text, {
      errorCorrectionLevel: 'M',
      type: 'png',
      width: 300,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    reply
      .header('Content-Type', 'image/png')
      .header('Cache-Control', 'public, max-age=3600')
      .send(qrCodeBuffer);

  } catch (error) {
    server.log.error('QR Code generation error:', error);
    reply.status(500).send('Error generating QR code');
  }
});

// Start the server
const start = async () => {
  try {
    await server.listen({ port: 3000 });
    server.log.info('Server listening on port 3000');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
