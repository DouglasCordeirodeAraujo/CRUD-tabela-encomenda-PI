# 📁 Projeto Portaria da Comunidade

## 📋 CRUD - Tabela de Encomendas

*CRUD completo da tabela de encomendas.*

---

## 🚀 Funcionalidades

- Criar novo usuário (`POST /api/usuarios/register`);
- Login de usuário (`POST /api/usuarios/login`);
- Criar encomenda (`POST /api/encomendas/criarencomenda`);
- Listar uma encomenda (`GET /api/encomendas/listarencomenda`);
- Listar todas as encomendas (`GET /api/encomendas/listarencomendas`);
- Atualizar encomenda (`PUT /api/encomendas/:id`);
- Deletar encomenda (`DELETE /api/encomendas/:id`);

---

## 🛠️ Tecnologias utilizadas

- node.js
- express
- body-parser
- cors
- helmet
- express-rate-limit
- cookie-parser
- jsonwebtoken
- validator
- date-fns
- sqlite3
- bcryptjs
- uuid
- dotenv

---

## 📂 Estrutura do Projeto

/CRUD-tabela-encomenda-PI
│
├── node_modules/
├── src/
│   ├── controllers/
│   ├── database/
│   ├── middlewares/
│   ├── routes/
│   └── app.js
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── server.js

---

## ▶️ Como executar

1. **Clone ou baixe o projeto** do GitHub
2. **Descompacte o arquivo**, se tiver baixado em .zip  
3. **Abra a pasta no Visual Studio Code**  
4. **Certifique-se de ter o Node.js instalado**  
   👉 [Baixar Node.js](https://nodejs.org/)

5. 🔧 **Abra o terminal** e instale as dependências com:

```bash
npm install express body-parser cors helmet express-rate-limit cookie-parser jsonwebtoken validator date-fns sqlite3 bcryptjs uuid dotenv
```
6. Inicie o servidor com:

```bash
node server.js
```

7. Abra o Insomnia ou Postman para testar as rotas:

### Registro de usuário:
    POST - http://localhost:3000/api/usuarios/register
    json: {
        "nome": "seu nome", 
        "sobrenome": "seu sobrenome", 
        "email": "email valido", 
        "senha": "6 caracteres ou +", 
        "dataNascimento":"ano-mes-dia"
        }

### Login de usuário:
    POST - http://localhost:3000/api/usuarios/login
    json: {
        "email": "email registrado, 
        "senha": "senha registrada"
        }
### Criar encomenda:
    POST - http://localhost:3000/api/encomendas/criarencomenda
    OBS: precisa está logado.
    json: {
        "numero_pedido": "numero do meu pedido",
        "nome_aplicativo": "nome do aplicativo que fez a compra",
        "codigo_rastreio": "código de rastreio",
        "perecivel": "sim" ou "não",
        "produto_fragil": "sim" ou "não",
        "previsao_entrega": "dia/mes/ano",
        "descricao": "descrição do pedido(opcional)",
        "status": "em processamento",
        "estabelecimento_id": "2b56257b-ea9e-48f8-890b-2f7de4d3f74f"
    }

### Listar uma encomenda:
    GET - http://localhost:3000/api/encomendas/listarencomenda
    OBS: precisa está logado.

### Listar todas as encomendas:
    GET - http://localhost:3000/api/encomendas/listarencomendas

### Atualizar encomendas:
    PUT - http://localhost:3000/api/encomendas/:id
    OBS: precisa está logado.
    json: {
        "numero_pedido": "numero do meu pedido",
        "nome_aplicativo": "nome do aplicativo que fez a compra",
        "codigo_rastreio": "código de rastreio",
        "perecivel": "sim" ou "não",
        "produto_fragil": "sim" ou "não",
        "previsao_entrega": "dia/mes/ano",
        "descricao": "descrição do pedido(opcional)",
        "status": "em processamento",
        "estabelecimento_id": "2b56257b-ea9e-48f8-890b-2f7de4d3f74f"
    }
    
### Deletar encomenda:
    DELETE - http://localhost:3000/api/encomendas/:id
    OBS: precisa está logado.
    
---