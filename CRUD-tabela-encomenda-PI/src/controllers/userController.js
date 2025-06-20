const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuid } = require('uuid');
const db = require('../database/db');
require('dotenv').config();

exports.register = (req, res) => {
  const {
    nome, sobrenome, email, senha,
    dataNascimento, cpf = null, cep = null, rua = null,
    numero = null, bairro = null, cidade = null, estado = null, celular = null
  } = req.body;

  const id = uuid();
  const hash = bcrypt.hashSync(senha, 10);

  const senhaAtualizadaEm = new Date().toISOString();

  const sql = `
    INSERT INTO usuario
    (id, nome, sobrenome, email, senha, data_nascimento,
     cpf, cep, rua, numero, bairro, cidade, estado, celular, senha_atualizada_em)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `;

  db.run(
    sql,
    [
      id, nome, sobrenome, email, hash, dataNascimento,
      cpf, cep, rua, numero, bairro, cidade, estado, celular, senhaAtualizadaEm
    ],
    function (err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res.status(409).json({ error: 'Email já cadastrado.' });
        }
        return res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
      }

      // Gerar e enviar o token no cookie HttpOnly
      const token = jwt.sign(
        { sub: id, email },
        process.env.JWT_SECRET,
        { expiresIn: '2h' }
      );

      
      res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'Lax',
        maxAge: 2 * 60 * 60 * 1000
      });

      return res.status(201).json({ id, nome, sobrenome, email });
    }
  );
};

exports.login = (req, res) => {
  const { email, senha } = req.body;

  db.get(
    'SELECT id, email, senha, senha_atualizada_em FROM usuario WHERE email = ?',
    [email],
    (err, user) => {
      if (err) return res.status(500).json({ error: 'Erro interno.' });

      if (!user || !bcrypt.compareSync(senha, user.senha)) {
        return res.status(401).json({ error: 'Credenciais inválidas.' });
      }

      const token = jwt.sign(
        { sub: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '2h' }
      );

      

      res
        .cookie('token', token, {
          httpOnly: true,
          secure: false,
          sameSite: 'Lax',
          maxAge: 2 * 60 * 60 * 1000
        })
        .json({ message: 'Login bem-sucedido',
          redirecionar: `${process.env.URL_FRONT}/html/mainScreen.html`
        });
    }
  );
};

exports.getProfile = (req, res) => {
  db.get('SELECT * FROM usuario WHERE id = ?', [req.usuario.id], (err, user) => {
    if (err) return res.status(500).json({ error: 'Erro interno.' });
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
    delete user.senha;
    res.json(user);
  });
};

exports.updateProfile = (req, res) => {
  const {
    nome, sobrenome, cpf, cep, rua, numero, bairro, cidade, estado, celular
  } = req.body;

  const sql = `
    UPDATE usuario SET
      nome = ?, sobrenome = ?, cpf = ?, cep = ?, rua = ?, numero = ?,
      bairro = ?, cidade = ?, estado = ?, celular = ?
    WHERE id = ?
  `;

  db.run(
    sql,
    [nome, sobrenome, cpf, cep, rua, numero, bairro, cidade, estado, celular, req.usuario.id],
    function (err) {
      if (err) return res.status(500).json({ error: 'Erro ao atualizar.' });
      res.json({ message: 'Perfil atualizado com sucesso.' });
    }
  );
};

exports.deleteUser = (req, res) => {
  const userId = req.usuario.id;

  const sql = 'DELETE FROM usuario WHERE id = ?';

  db.run(sql, [userId], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Erro ao deletar usuário.' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    res.json({ message: 'Usuário deletado com sucesso.' });
  });
};

exports.logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'Lax',
    secure: false
  });
  res.json({ message: 'Logout realizado com sucesso.' });
};

exports.alterarSenhaLogado = (req, res) => {
  const { senhaAtual, novaSenha } = req.body;
  const userId = req.usuario.id; // vem do middleware verificarToken

  db.get('SELECT * FROM usuario WHERE id = ?', [userId], (err, usuario) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ mensagem: 'Erro ao acessar o banco.' });
    }
    if (!usuario) return res.status(404).json({ mensagem: 'Usuário não encontrado.' });

    bcrypt.compare(senhaAtual, usuario.senha, (err, senhaCorreta) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ mensagem: 'Erro ao comparar senhas.' });
      }
      if (!senhaCorreta) return res.status(400).json({ mensagem: 'Senha atual incorreta.' });

      bcrypt.hash(novaSenha, 10, (err, novaSenhaHash) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ mensagem: 'Erro ao gerar hash da nova senha.' });
        }

        db.run('UPDATE usuario SET senha = ? WHERE id = ?', [novaSenhaHash, userId], function (err) {
          if (err) {
            console.error(err);
            return res.status(500).json({ mensagem: 'Erro ao atualizar a senha.' });
          }
          return res.status(200).json({ mensagem: 'Senha atualizada com sucesso!' });
        });
      });
    });
  });
};
