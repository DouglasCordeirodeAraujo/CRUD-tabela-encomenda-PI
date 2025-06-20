const db = require('../database/db');
const { v4: uuidv4 } = require('uuid');

const runAsync = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });

exports.criarEncomenda = async (req, res) => {
  try {
    const usuario_id = req.usuario.id;
    const {
      numero_pedido,
      nome_aplicativo,
      codigo_rastreio,
      perecivel,
      produto_fragil,
      previsao_entrega,
      descricao,
      status = 'em processamento',
      estabelecimento_id
    } = req.body;

    const data_cadastro = new Date().toISOString();

    // Validação básica
    if (!numero_pedido || !nome_aplicativo || !estabelecimento_id) {
      return res.status(400).json({ error: 'Campos obrigatórios ausentes.' });
    }

    const id = uuidv4();

    await runAsync(`
      INSERT INTO encomenda (
        id ,numero_pedido, nome_aplicativo, codigo_rastreio, perecivel,
        produto_fragil, previsao_entrega, descricao, status,
        data_cadastro, usuario_id, estabelecimento_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      id,
      numero_pedido,
      nome_aplicativo,
      codigo_rastreio,
      perecivel,
      produto_fragil,
      previsao_entrega,
      descricao,
      status,
      data_cadastro,
      usuario_id,
      estabelecimento_id
    ]);

    res.status(201).json({ message: 'Encomenda cadastrada com sucesso!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao cadastrar encomenda.' });
  }
};

exports.listarEncomenda = (req, res) => {
  const usuarioId = req.usuario.id;

  const sql = `
    SELECT 
      encomenda.*, 
      estabelecimento.nome_estabelecimento 
    FROM 
      encomenda
    JOIN 
      estabelecimento ON encomenda.estabelecimento_id = estabelecimento.id
    WHERE 
      encomenda.usuario_id = ?
  `;

  db.all(sql, [usuarioId], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Erro ao buscar encomendas.' });
    res.json(rows);
  });
};

exports.listarEncomendas = (req, res) => {
  const query = `SELECT * FROM encomenda ORDER BY data_cadastro DESC`;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Erro ao listar encomendas:', err.message);
      return res.status(500).json({ error: 'Erro ao listar encomendas' });
    }

    res.status(200).json(rows);
  });
};

exports.atualizarEncomenda = (req, res) => {
  const encomendaId = req.params.id;
  const usuarioId = req.usuario.id;

  const {
    numero_pedido,
    nome_aplicativo,
    codigo_rastreio,
    perecivel,
    produto_fragil,
    previsao_entrega,
    descricao
  } = req.body;

  // Validação básica
  if (
    !numero_pedido || !nome_aplicativo ||
    !['sim', 'não'].includes(perecivel) ||
    !['sim', 'não'].includes(produto_fragil)
  ) {
    return res.status(400).json({ error: 'Campos obrigatórios ausentes ou inválidos.' });
  }

  const sql = `
    UPDATE encomenda
    SET 
      numero_pedido = ?, 
      nome_aplicativo = ?, 
      codigo_rastreio = ?, 
      perecivel = ?, 
      produto_fragil = ?, 
      previsao_entrega = ?, 
      descricao = ?
    WHERE id = ? AND usuario_id = ?
  `;

  db.run(sql, [
    numero_pedido,
    nome_aplicativo,
    codigo_rastreio,
    perecivel,
    produto_fragil,
    previsao_entrega,
    descricao,
    encomendaId,
    usuarioId
  ], function (err) {
    if (err) {
      console.error('Erro ao atualizar encomenda:', err.message);
      return res.status(500).json({ error: 'Erro ao atualizar encomenda.' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Encomenda não encontrada ou sem permissão.' });
    }

    res.json({ mensagem: 'Encomenda atualizada com sucesso.' });
  });
};

exports.excluirEncomenda = (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM encomenda WHERE id = ?', [id], function (err) {
    if (err) {
      console.error('Erro ao excluir encomenda:', err);
      return res.status(500).json({ error: 'Erro interno ao excluir encomenda.' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Encomenda não encontrada.' });
    }

    res.status(200).json({ mensagem: 'Encomenda excluída com sucesso.' });
  });
};