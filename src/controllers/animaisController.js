const express = require('express');
const cache = require('memory-cache');
const generateETag = require('../Util/generateETag')
const router = express.Router();

const animais = [{id:1, nome: "Cachorro"}, {id:2, nome: "Gato"}, {id:3, nome: "Papagaio"}]

router.get('/:id', (req, res) => {
    const animal = animais.find(ani => ani.id === parseInt(req.params.id, 10));
    if (animal) {
      res.json(animal);
    } else {
      res.status(404).json({ mensagem: "Animal não encontrado" });
    }
});

router.get('/', (req, res) => {
  const chaveCache = generateETag(animais);
  const tempoDeExpiracao = 300000; // Tempo de expiração do cache em milissegundos (5 minutos)

  const cacheData = cache.get(chaveCache);
  if (cacheData) {
    res.status(304).end();
  } else { 
    cache.put(chaveCache, animais, tempoDeExpiracao);
    res.json(animais);
  }
});

router.post('/', (req, res) => {
    const novoAnimal = {id: animais.length +1, nome: req.body.nome};
    animais.push(novoAnimal);
    res.json(novoAnimal);
});

router.put('/:id', (req, res) => {
    const idSolicitado = parseInt(req.params.id, 10); 

    const pos = animais.findIndex(ani => ani.id === idSolicitado);
  
    if (pos !== -1) {
        animais[pos] = {id: idSolicitado, nome: req.body.nome };
        res.json(animais[pos]);
    } else {
      res.status(404).json({ mensagem: "Animal não encontrado" });
    }
});

router.delete('/:id', (req, res) => {
    const idSolicitado = parseInt(req.params.id, 10);  
    const pos = animais.findIndex(ani => ani.id === idSolicitado);
  
    if (pos !== -1) {
        animais.splice(pos, 1);
         res.status(204).end();
    } else {
      res.status(404).json({ mensagem: "Animal não encontrada" });
    }
});


module.exports = router;