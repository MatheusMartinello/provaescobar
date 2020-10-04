const express = require("express");
const pool = require("../database/databaseCompra");
const router = express.Router();

function geraDataAtual() {
  let data = new Date();
  return data.toUTCString();
}
function getRandomInt() {
  return Math.random() * (45 - 20) + 20;
}
function geraPrazo() {
  const days = getRandomInt();
  let date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}
function controlerMain() {
  return (req, res, next) => {
    next();
  };
}
async function geraPedidoCotacao(idusuario) {
  try {
    await pool.query("insert into cotacoes(idusuario,data)values($1,$2)", [
      idusuario,
      geraDataAtual(),
    ]);
    const result = await pool.query("SELECT MAX(idcotacoes) from cotacoes");
    return result;
  } catch (error) {
    console.error(error);
  }
}
async function geraCotacoesNosEstoques(idproduto, idusuario, idcotacao) {
  let resultadoV = [];
  try {
    const validaProdutosDisponiveis = await pool.query(
      "SELECT idestoques, custo FROM produtos WHERE idprodutos = $1",
      [idproduto]
    );
    if (validaProdutosDisponiveis.rows.length >= 2) {
      for (const element of validaProdutosDisponiveis.rows) {
        resultadoV.push(
          await pool.query(
            "INSERT INTO cotacoes_produtos(idcotacoes,idusuario,idprodutos,idestoques,valortotal,prazoentrega,prazopagamento)values($1,$2,$3,$4,$5,$6,$7)",
            [
              idcotacao,
              idusuario,
              idproduto,
              element.idestoques,
              element.custo,
              geraPrazo(),
              geraPrazo(),
            ]
          )
        );
      }
    } else throw "Existe menos de 3 estoques para consulta desse produto!";
  } catch (error) {
    console.error(error);
  }
}
async function pegaMelhorProposta(idproposta) {
  const pegaProposta = await pool.query(
    "SELECT * from cotacoes_produtos where idcotacoes = $1",
    [idproposta]
  );
  let aux = pegaProposta.rows[0];
  for (const element of pegaProposta.rows) {
    if (parseFloat(aux.valortotal) > parseFloat(element.valortotal))
      aux = element;
  }
  return aux;
}
async function geraNota(tipo) {
  pool.query("INSERT INTO notafiscal(datavenda,tipo) values($1,$2)", [
    geraDataAtual(),
    tipo,
  ]);
  const result = await pool.query("SELECT MAX(idnotafiscal) from notafiscal");
  return result.rows[0].max;
}
//gera todas as propostas
router.post("/proposta", async (req, res) => {
  const { idusuario, idproduto } = req.body;
  const geraCotacaoId = await geraPedidoCotacao(idusuario);
  geraCotacaoId
    ? await geraCotacoesNosEstoques(
        idproduto,
        idusuario,
        geraCotacaoId.rows[0].max
      )
    : res.status(400).send("Nao foi possivel gerar cotacao");
  const result = await pool.query(
    "SELECT * from cotacoes_produtos where idcotacoes = $1",
    [geraCotacaoId.rows[0].max]
  );
  res.send(result.rows);
});
//Seleciona a melhor proposta a partir do id proposta
router.get("/seleciona/proposta/:idproposta", async (req, res) => {
  const idproposta = req.params.idproposta;
  const pegaProposta = await pegaMelhorProposta(idproposta);
  res.send(pegaProposta);
});
router.post("/ordemcompra", async (req, res) => {
  const { idproposta, autoriacao } = req.body;
  const proposta = await pegaMelhorProposta(idproposta);
  await pool.query(
    "INSERT INTO ordemfornecimento(idcotacoes,idusuario,idprodutos,idestoques,autoriacao)values($1,$2,$3,$4,$5)",
    [
      proposta.idcotacoes,
      proposta.idusuario,
      proposta.idprodutos,
      proposta.idestoques,
      autoriacao,
    ]
  );
  res.send("Confirmacao de compra adicionada!");
});
router.post("/recebido", async (req, res) => {
  const { idordemfornecimento } = req.body;
  const nota = await geraNota("Entrada");
  try {
    await pool.query(
      "INSERT INTO entrada(data,idordemfornecimento,idnotafiscal)values($1,$2,$3)",
      [await geraDataAtual(), idordemfornecimento, nota]
    );
    res.send("Recebido!");
  } catch (error) {
    res.status(400).send("Nao foi possivel dar entrada");
  }
});

module.exports = (controlerMain, (app) => app.use("/compras", router));
