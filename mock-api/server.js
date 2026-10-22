// API simulada do classificador de doenças da soja.
// Uso: node mock-api/server.js   (sem dependências)
// Contrato: POST /diagnostico (multipart, campo "foto") -> { doenca, confianca }
const http = require('http');

const PORT = 3000;
const DELAY_MS = 2000; // simula a espera da inferência
const RESULTADOS = [
  { doenca: 'Ferrugem asiática', confianca: 0.91 },
  { doenca: 'Mancha-alvo', confianca: 0.84 },
  { doenca: 'Oídio', confianca: 0.77 },
  { doenca: 'Folha saudável', confianca: 0.96 },
];

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/diagnostico') {
    let bytes = 0;
    req.on('data', (chunk) => (bytes += chunk.length));
    req.on('end', () => {
      console.log(`[${new Date().toISOString()}] foto recebida: ${bytes} bytes`);
      const resultado = RESULTADOS[Math.floor(Math.random() * RESULTADOS.length)];
      setTimeout(() => {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(resultado));
      }, DELAY_MS);
    });
    return;
  }
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ erro: 'rota não encontrada' }));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Mock da API em http://0.0.0.0:${PORT}/diagnostico`);
  console.log('No celular, use o IP do computador na rede local (ex.: http://192.168.0.10:3000).');
});
