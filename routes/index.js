var express = require('express');
const { status } = require('express/lib/response');
var router = express.Router();
const Link = require('../models/link');

router.get('/:code', async (req, res, next) => {
  const code = req.params.code;
 
  const resultado = await Link.findOne({ where: { code } });
  if (!resultado) return res.sendStatus(404);

  var valido = new Date();
  valido.setDate(valido.getDate())

  if(resultado.validade < valido) 
  {
    res.send('Link expirado!')
    return res.sendStatus(498);
  }

  res.redirect(resultado.url);
})

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Encurtador' });
});

function generateCode(){
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < 8; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}

router.post('/new', async (req, res, next) => {
  const url = req.body.url;
  const code = generateCode();
  var data = new Date();
  data.setDate(data.getDate() + 1);
  const validade = data;

  const resultado = await Link.create({
    url,
    code,
    validade
  })

  res.render('stats', resultado.dataValues);
})

module.exports = router;
