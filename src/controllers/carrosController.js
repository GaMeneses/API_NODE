const express = require('express');
const cache = require('memory-cache');
const generateETag = require('../Util/generateETag')
const router = express.Router();

const carros = [{id:1, modelo: "Fusca"}, {id:2, modelo: "Gol"}, {id:3, modelo: "Palio"}];

router.get('/:id', (req, res) => {
    const carro = carros.find(car => car.id === parseInt(req.params.id, 10));
    if (carro) {
      res.json(carro);
    } else {
      res.status(404).json({ mensagem: "Carro não encontrado" });
    }
});

router.get('/', (req, res) => {
  const chaveCache = generateETag(carros);
  const tempoDeExpiracao = 300000; // Tempo de expiração do cache em milissegundos (5 minutos)

  const cacheData = cache.get(chaveCache);
  if (cacheData) {
    res.status(304).end();
  } else { 
    cache.put(chaveCache, carros, tempoDeExpiracao);
    res.json(carros);
  }
});

router.post('/', (req, res) => {
    const novoCarro = {id: carros.length +1, nome: req.body.nome};
    carros.push(novoCarro);
    res.json(novoCarro);
});

router.put('/:id', (req, res) => {
    const idSolicitado = parseInt(req.params.id, 10); 

    const pos = carros.findIndex(car => car.id === idSolicitado);
  
    if (pos !== -1) {
        carros[pos] = {id: idSolicitado, nome: req.body.nome };
        res.json(carros[pos]);
    } else {
      res.status(404).json({ mensagem: "Carro não encontrado" });
    }
});

router.delete('/:id', (req, res) => {
    const idSolicitado = parseInt(req.params.id, 10); 
    const pos = carros.findIndex(car => car.id === idSolicitado);
  
    if (pos !== -1) {
        carros.splice(pos, 1);
         res.status(204).end();
    } else {
      res.status(404).json({ mensagem: "Carro não encontrado" });
    }
});

module.exports = router;