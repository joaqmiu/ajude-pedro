const express = require('express');
const app = express();
const path = require('path');
const perguntas = require('./assets/perguntas');

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/perguntas', (req, res) => {
  res.json(perguntas);
});

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
