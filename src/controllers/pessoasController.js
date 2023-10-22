const express = require('express');
const generateETag = require('../Util/generateETag')
const cache = require('memory-cache');
const router = express.Router();

const pessoas = [{ id: 1, nome: "Marcelo" }, { id: 2, nome: "João" }, { id: 3, nome: "Maria" }];

router.get('/:id', (req, res) => {
  const pessoa = pessoas.find(pes => pes.id === parseInt(req.params.id, 10));
  if (pessoa) {
    res.json(pessoa);
  } else {
    res.status(404).json({ mensagem: "Pessoa não encontrada" });
  }
});

router.get('/', (req, res) => {
  const chaveCache = generateETag(pessoas);
  const tempoDeExpiracao = 300000; // Tempo de expiração do cache em milissegundos (5 minutos)

  const cacheData = cache.get(chaveCache);
  if (cacheData) {
    res.status(304).end();
  } else { 
    cache.put(chaveCache, pessoas, tempoDeExpiracao);
    res.json(pessoas);
  }
});

router.post('/', (req, res) => {
  const novaPessoa = { id: pessoas.length + 1, nome: req.body.nome };
  pessoas.push(novaPessoa);
  res.json(novaPessoa);
});

router.put('/:id', (req, res) => {
  const idSolicitado = parseInt(req.params.id, 10);

  const pos = pessoas.findIndex(pes => pes.id === idSolicitado);

  if (pos !== -1) {
    pessoas[pos] = { id: idSolicitado, nome: req.body.nome };
    res.json(pessoas[pos]);
  } else {
    res.status(404).json({ mensagem: "Pessoa não encontrada" });
  }
});

router.delete('/:id', (req, res) => {
  const idSolicitado = parseInt(req.params.id, 10);
  const pos = pessoas.findIndex(pes => pes.id === idSolicitado);

  if (pos !== -1) {
    pessoas.splice(pos, 1);
    res.status(204).end();
  } else {
    res.status(404).json({ mensagem: "Pessoa não encontrada" });
  }
});

module.exports = router;