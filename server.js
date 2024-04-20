// login com token.
require("dotenv-safe").config();
const jwt = require("jsonwebtoken");

const express = require("express");
const bodyParser = require("body-parser");
var cors = require("cors");
const { request } = require("express");
const app = express();
const PORT = process.env.PORT || 3333;

app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Request-Private-Network", "true");
  res.header("Access-Control-Allow-Private-Network", "true");
  res.header(
    "Access-Control-Request-Private-Network",
    "Access-Control-Allow-Private-Network",
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
    "Access-Control-Allow-Origin: *"
  );
  next();
});
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", (request, response) => {
  response.json({
    info: "API Node.js + Express + Postgres API - LEPTON",
  });
});

app.listen(PORT, () => {
  console.log("API rodando na porta " + PORT);
});

const Pool = require("pg").Pool;
const pool = new Pool({
  /*
    user: "postgres",
    host: "localhost",
    database: "pulsar",
    password: "pulsar",
    port: 5432,
  */

  user: "postgres",
  // host: "containers-us-west-126.railway.app",
  host: "viaduct.proxy.rlwy.net",
  database: "railway",
  password: "DDCF5BCdEEC246bcGDEaB2E31b1egB4f",
  port: 12671,
});

// ENDPOINTS //

// CLIENTES (HOSPITAIS E UNIDADES DE SAÚDE).
// listar todos os clientes (hospitais).
app.get("/list_hospitais", (req, res) => {
  var sql = "SELECT * FROM cliente_hospital";
  pool.query(sql, (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// CLIENTES (HOSPITAIS E UNIDADES DE SAÚDE).
// listar todos as unidades de internação.
app.get("/list_unidades", (req, res) => {
  var sql = "SELECT * FROM cliente_unidade";
  pool.query(sql, (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// USUÁRIOS.
// verificando se o usuário é valido.
app.post("/checknomeusuario", (req, res) => {
  const { usuario } = req.body;
  var sql = "SELECT * FROM usuarios WHERE login = $1";
  pool.query(sql, [usuario], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    var x = results.rows;
    const id = x.map((item) => item.id_usuario).pop();
    const nome = x.map((item) => item.nome_usuario).pop();
    const dn = x.map((item) => item.dn_usuario).pop();
    const cpf = x.map((item) => item.cpf_usuario).pop();
    const email = x.map((item) => item.contato_usuario).pop();
    const senha = x.map((item) => item.senha).pop();
    const login = x.map((item) => item.login).pop();
    const conselho = x.map((item) => item.conselho).pop();
    const n_conselho = x.map((item) => item.n_conselho).pop();
    const tipo_usuario = x.map((item) => item.tipo_usuario).pop();
    const paciente = x.map((item) => item.paciente).pop();
    const prontuario = x.map((item) => item.prontuario).pop();
    const laboratorio = x.map((item) => item.laboratorio).pop();
    const farmacia = x.map((item) => item.farmacia).pop();
    const faturamento = x.map((item) => item.faturamento).pop();
    const usuarios = x.map((item) => item.usuarios).pop();
    const primeiro_acesso = x.map((item) => item.primeiro_acesso).pop();
    res.json({
      id: id,
      nome: nome,
      dn: dn,
      cpf: cpf,
      email: email,
      senha: senha,
      login: login,
      conselho: conselho,
      n_conselho: n_conselho,
      tipo_usuario: tipo_usuario,
      paciente: paciente,
      prontuario: prontuario,
      laboratorio: laboratorio,
      farmacia: farmacia,
      faturamento: faturamento,
      usuarios: usuarios,
      primeiro_acesso: primeiro_acesso,
    });
  });
});

// permitindo o acesso após a autenticação, com entrega de token (JWT).
app.post("/grant", (req, res) => {
  const id = req.body;
  const token = jwt.sign({ id }, process.env.SECRET, {
    expiresIn: 1800, // expira em 30 minutos.
  });
  res.json({
    auth: true,
    token: token,
    id: id,
  });
});

// login e identificação do usuário, com entrega de token (JWT).
app.post("/checkusuario", (req, res) => {
  const { usuario, senha } = req.body;
  var sql = "SELECT * FROM usuarios WHERE login = $1 AND senha = $2";
  pool.query(sql, [usuario, senha], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    var x = results.rows;
    const id = x.map((item) => item.id_usuario).pop();
    const nome = x.map((item) => item.nome_usuario).pop();
    const dn = x.map((item) => item.dn_usuario).pop();
    const cpf = x.map((item) => item.cpf_usuario).pop();
    const email = x.map((item) => item.contato_usuario).pop();
    const conselho = x.map((item) => item.conselho).pop();
    const n_conselho = x.map((item) => item.n_conselho).pop();
    const tipo_usuario = x.map((item) => item.tipo_usuario).pop();
    const paciente = x.map((item) => item.paciente).pop();
    const prontuario = x.map((item) => item.prontuario).pop();
    const laboratorio = x.map((item) => item.laboratorio).pop();
    const farmacia = x.map((item) => item.farmacia).pop();
    const faturamento = x.map((item) => item.faturamento).pop();
    const usuarios = x.map((item) => item.usuarios).pop();
    if (x.length > 0) {
      const token = jwt.sign({ id }, process.env.SECRET, {
        expiresIn: 1800, // expira em 30 minutos.
      });
      res.json({
        auth: true,
        token: token,
        id: id,
        nome: nome,
        dn: dn,
        cpf: cpf,
        email: email,
        conselho: conselho,
        n_conselho: n_conselho,
        tipo_usuario: tipo_usuario,
        paciente: paciente,
        prontuario: prontuario,
        laboratorio: laboratorio,
        farmacia: farmacia,
        faturamento: faturamento,
        usuarios: usuarios,
      });
    } else {
      res.json({ auth: false });
    }
  });
});

function verifyJWT(req, res, next) {
  const token = req.headers.authorization;
  console.log("TOKEN RECEBIDO DO FRONT: " + req.headers.authorization);
  if (!token)
    return res
      .status(401)
      .json({ auth: false, message: "NENHUM TOKEN FOI GERADO. HACKER!" });

  jwt.verify(token, process.env.SECRET, function (err, decoded) {
    if (err)
      return res.status(500).json({
        auth: false,
        message: "TOKEN PARA VALIDAÇÃO DO ACESSO EXPIRADO.",
      });
    // se tudo estiver ok, salva no request para uso posterior
    req.userId = decoded.id;
    next();
  });
}

// identificando unidades de acesso do usuário logado.
app.post("/getunidades", verifyJWT, (req, res) => {
  const { id_usuario } = req.body;
  var sql = "SELECT * FROM usuarios_acessos WHERE id_usuario = $1";
  pool.query(sql, [id_usuario], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// listar todos os usuários cadastrados na aplicação.
app.get("/list_usuarios", (req, res) => {
  var sql = "SELECT * FROM usuarios";
  pool.query(sql, (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// ACESSOS.
// listar todos os hospitais cadastrados.
app.get("/list_hospitais", (req, res) => {
  var sql = "SELECT * FROM cliente_hospital";
  pool.query(sql, (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// listar todas as unidades vinculadas a hospitais cadastradas.
app.get("/list_unidades", (req, res) => {
  var sql = "SELECT * FROM cliente_unidade";
  pool.query(sql, (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// listar todos os acessos cadastrados.
app.get("/list_todos_acessos", (req, res) => {
  var sql = "SELECT * FROM usuarios_acessos";
  pool.query(sql, (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// listar os acessos cadastrados para a unidade controlada pelo coordenador do serviço.
app.get("/list_acessos/:id_unidade", (req, res) => {
  const id_unidade = parseInt(req.params.id_unidade);
  var sql = "SELECT * FROM usuarios_acessos WHERE id_unidade = $1";
  pool.query(sql, [id_unidade], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// inserir acesso.
app.post("/insert_acesso", (req, res) => {
  const {
    id_cliente, // hospital.
    id_unidade, // cti.
    id_usuario, // id do usuário.
    boss, // privilégio para manipular acessos.
  } = req.body;
  var sql =
    "INSERT INTO usuarios_acessos (id_cliente, id_unidade, id_usuario, boss) VALUES ($1, $2, $3, $4)";
  pool.query(
    sql,
    [id_cliente, id_unidade, id_usuario, boss],
    (error, results) => {
      if (error)
        return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    }
  );
});

// atualizar acesso.
app.post("/update_acesso/:id_acesso", (req, res) => {
  const id_acesso = parseInt(req.params.id_acesso);
  const { id_cliente, id_unidade, id_usuario, boss } = req.body;
  var sql =
    "UPDATE usuarios_acessos SET id_cliente = $1, id_unidade = $2, id_usuario = $3, boss = $4 WHERE id_acesso = $5";
  pool.query(
    sql,
    [id_cliente, id_unidade, id_usuario, boss, id_acesso],
    (error, results) => {
      if (error)
        return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    }
  );
});

// excluir acesso.
app.get("/delete_acesso/:id_acesso", (req, res) => {
  const id_acesso = parseInt(req.params.id_acesso);
  var sql = "DELETE FROM usuarios_acessos WHERE id_acesso = $1";
  pool.query(sql, [id_acesso], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// PACIENTES.
// listar todos os pacientes internados.
app.get("/list_pacientes", verifyJWT, (req, res) => {
  var sql = "SELECT * FROM paciente";
  pool.query(sql, (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// inserir paciente internado.
app.post("/insert_paciente", (req, res) => {
  const {
    nome_paciente,
    nome_mae_paciente,
    dn_paciente,
    antecedentes_pessoais,
    medicacoes_previas,
    exames_previos,
    exames_atuais,
    tipo_documento,
    numero_documento,
    cns,
    endereco,
    logradouro,
    bairro,
    localidade,
    uf,
    cep,
    telefone,
    email,
    nome_responsavel,
    sexo,
    nacionalidade,
    cor,
    etnia,
    orgao_emissor,
    endereco_numero,
    endereco_complemento,
  } = req.body;
  var sql =
    "INSERT INTO paciente (nome_paciente, nome_mae_paciente, dn_paciente, antecedentes_pessoais, medicacoes_previas, exames_previos, exames_atuais, tipo_documento, numero_documento, cns, endereco, logradouro, bairro, localidade, uf, cep, telefone, email, nome_responsavel, sexo, nacionalidade, cor, etnia, orgao_emissor, endereco_numero, endereco_complemento) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26)";
  pool.query(
    sql,
    [
      nome_paciente,
      nome_mae_paciente,
      dn_paciente,
      antecedentes_pessoais,
      medicacoes_previas,
      exames_previos,
      exames_atuais,
      tipo_documento,
      numero_documento,
      cns,
      endereco,
      logradouro,
      bairro,
      localidade,
      uf,
      cep,
      telefone,
      email,
      nome_responsavel,
      sexo,
      nacionalidade,
      cor,
      etnia,
      orgao_emissor,
      endereco_numero,
      endereco_complemento,
    ],
    (error, results) => {
      if (error)
        return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    }
  );
});

// atualizar paciente.
app.post("/update_paciente/:id_paciente", (req, res) => {
  const id_paciente = parseInt(req.params.id_paciente);
  const {
    nome_paciente,
    nome_mae_paciente,
    dn_paciente,
    antecedentes_pessoais,
    medicacoes_previas,
    exames_previos,
    exames_atuais,
    tipo_documento,
    numero_documento,
    cns,
    endereco,
    logradouro,
    bairro,
    localidade,
    uf,
    cep,
    telefone,
    email,
    nome_responsavel,
    sexo,
    nacionalidade,
    cor,
    etnia,
    orgao_emissor,
    endereco_numero,
    endereco_complemento,
  } = req.body;
  var sql =
    "UPDATE paciente SET nome_paciente = $1, nome_mae_paciente = $2, dn_paciente = $3, antecedentes_pessoais = $4, medicacoes_previas = $5, exames_previos = $6, exames_atuais = $7, tipo_documento = $8, numero_documento = $9, cns = $10, endereco = $11, logradouro = $12, bairro = $13, localidade = $14, uf = $15, cep = $16, telefone = $17, email = $18, nome_responsavel = $19, sexo = $20, nacionalidade = $21, cor = $22, etnia = $23, orgao_emissor = $24, endereco_numero = $25, endereco_complemento = $26 WHERE id_paciente = $27";
  pool.query(
    sql,
    [
      nome_paciente,
      nome_mae_paciente,
      dn_paciente,
      antecedentes_pessoais,
      medicacoes_previas,
      exames_previos,
      exames_atuais,
      tipo_documento,
      numero_documento,
      cns,
      endereco,
      logradouro,
      bairro,
      localidade,
      uf,
      cep,
      telefone,
      email,
      nome_responsavel,
      sexo,
      nacionalidade,
      cor,
      etnia,
      orgao_emissor,
      endereco_numero,
      endereco_complemento,
      id_paciente,
    ],
    (error, results) => {
      if (error)
        return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    }
  );
});

// excluir paciente.
app.get("/delete_paciente/:id_paciente", (req, res) => {
  const id_paciente = parseInt(req.params.id_paciente);
  var sql = "DELETE FROM paciente WHERE id_paciente = $1";
  pool.query(sql, [id_paciente], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// PACIENTES - ALERGIAS.
// listar todas as alergias do paciente selecionado.
app.get("/paciente_alergias/:id_paciente", verifyJWT, (req, res) => {
  const id_paciente = parseInt(req.params.id_paciente);
  var sql = "SELECT * FROM paciente_alergias WHERE id_paciente = $1";
  pool.query(sql, [id_paciente], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// inserir alergia.
app.post("/insert_alergia", (req, res) => {
  const { id_paciente, alergia } = req.body;
  var sql =
    "INSERT INTO paciente_alergias (id_paciente, alergia) VALUES ($1, $2)";
  pool.query(sql, [id_paciente, alergia], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// atualizar alergia.
app.post("/update_alergia/:id_alergia", (req, res) => {
  const id_alergia = parseInt(req.params.id_alergia);
  const { id_paciente, alergia } = req.body;
  var sql =
    "UPDATE paciente_alergias SET id_paciente = $1, alergia = $2 WHERE id_alergia = $3";
  pool.query(sql, [id_paciente, alergia, id_alergia], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// excluir alergia.
app.get("/delete_alergia/:id_alergia", (req, res) => {
  const id_alergia = parseInt(req.params.id_alergia);
  var sql = "DELETE FROM paciente_alergias WHERE id_alergia = $1";
  pool.query(sql, [id_alergia], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// PACIENTES - LESÕES.
// listar todas as lesões do paciente selecionado.
app.get("/paciente_lesoes/:id_paciente", (req, res) => {
  const id_paciente = parseInt(req.params.id_paciente);
  var sql = "SELECT * FROM paciente_lesoes WHERE id_paciente = $1";
  pool.query(sql, [id_paciente], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// inserir lesão.
app.post("/insert_lesao", (req, res) => {
  const {
    id_paciente,
    local,
    grau,
    curativo,
    observacoes,
    data_abertura,
    data_fechamento,
  } = req.body;
  var sql =
    "INSERT INTO paciente_lesoes (id_paciente, local, grau, curativo, observacoes, data_abertura, data_fechamento) VALUES ($1, $2, $3, $4, $5, $6, $7)";
  pool.query(
    sql,
    [
      id_paciente,
      local,
      grau,
      curativo,
      observacoes,
      data_abertura,
      data_fechamento,
    ],
    (error, results) => {
      if (error)
        return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    }
  );
});

// atualizar lesão.
app.post("/update_lesao/:id_lesao", (req, res) => {
  const id_lesao = parseInt(req.params.id_lesao);
  const {
    id_paciente,
    local,
    grau,
    curativo,
    observacoes,
    data_abertura,
    data_fechamento,
  } = req.body;
  var sql =
    "UPDATE paciente_lesoes SET id_paciente = $1, local = $2, grau = $3, curativo = $4, observacoes = $5, data_abertura = $6, data_fechamento = $7 WHERE id_lesao = $8";
  pool.query(
    sql,
    [
      id_paciente,
      local,
      grau,
      curativo,
      observacoes,
      data_abertura,
      data_fechamento,
      id_lesao,
    ],
    (error, results) => {
      if (error)
        return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    }
  );
});

// excluir lesão.
app.get("/delete_lesao/:id_lesao", (req, res) => {
  const id_lesao = parseInt(req.params.id_lesao);
  var sql = "DELETE FROM paciente_lesoes WHERE id_lesao = $1";
  pool.query(sql, [id_lesao], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// PACIENTES - PRECAUÇÕES.
// listar todas as precauções de todos os pacientes (para exibição na lista de pacientes).
app.get("/paciente_all_precaucoes", (req, res) => {
  var sql = "SELECT * FROM paciente_precaucoes WHERE data_termino IS NULL";
  pool.query(sql, (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO: " + error });
    res.send(results);
  });
});

// listar todas as precauções do paciente selecionado.
app.get("/paciente_precaucoes/:id_paciente", (req, res) => {
  const id_paciente = parseInt(req.params.id_paciente);
  var sql = "SELECT * FROM paciente_precaucoes WHERE id_paciente = $1";
  pool.query(sql, [id_paciente], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// inserir precaução.
app.post("/insert_precaucao", (req, res) => {
  const { id_paciente, precaucao, data_inicio, data_termino, id_profissional } =
    req.body;
  var sql =
    "INSERT INTO paciente_precaucoes (id_paciente, precaucao, data_inicio, data_termino, id_profissional) VALUES ($1, $2, $3, $4, $5)";
  pool.query(
    sql,
    [id_paciente, precaucao, data_inicio, data_termino, id_profissional],
    (error, results) => {
      if (error)
        return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    }
  );
});

// atualizar precaução.
app.post("/update_precaucao/:id_precaucao", (req, res) => {
  const id_precaucao = parseInt(req.params.id_precaucao);
  const { id_paciente, precaucao, data_inicio, data_termino, id_profissional } =
    req.body;
  var sql =
    "UPDATE paciente_precaucoes SET id_paciente = $1, precaucao = $2, data_inicio = $3, data_termino = $4, id_profissional = $5 WHERE id_precaucao = $6";
  pool.query(
    sql,
    [
      id_paciente,
      precaucao,
      data_inicio,
      data_termino,
      id_profissional,
      id_precaucao,
    ],
    (error, results) => {
      if (error)
        return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    }
  );
});

// excluir precaução.
app.get("/delete_precaucao/:id_precaucao", (req, res) => {
  const id_precaucao = parseInt(req.params.id_precaucao);
  var sql = "DELETE FROM paciente_precaucoes WHERE id_precaucao = $1";
  pool.query(sql, [id_precaucao], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// PACIENTES - RISCOS.
// listar todos os riscos de todos os pacientes (para exibição na lista de pacientes).
app.get("/paciente_all_riscos", (req, res) => {
  const id_paciente = parseInt(req.params.id_paciente);
  var sql = "SELECT * FROM paciente_riscos WHERE data_termino IS NOT NULL";
  pool.query(sql, [id_paciente], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// listar todos os riscos do paciente selecionado.
app.get("/paciente_riscos/:id_paciente", (req, res) => {
  const id_paciente = parseInt(req.params.id_paciente);
  var sql = "SELECT * FROM paciente_riscos WHERE id_paciente = $1";
  pool.query(sql, [id_paciente], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// inserir risco.
app.post("/insert_risco", (req, res) => {
  const { id_paciente, risco, data_inicio, data_termino } = req.body;
  var sql =
    "INSERT INTO paciente_riscos (id_paciente, risco, data_inicio, data_termino) VALUES ($1, $2, $3, $4)";
  pool.query(
    sql,
    [id_paciente, risco, data_inicio, data_termino],
    (error, results) => {
      if (error)
        return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    }
  );
});

// atualizar risco.
app.post("/update_risco/:id_risco", (req, res) => {
  const id_risco = parseInt(req.params.id_risco);
  const { id_paciente, risco, data_inicio, data_termino } = req.body;
  var sql =
    "UPDATE paciente_riscos SET id_paciente = $1, risco = $2, data_inicio = $3, data_termino = $4 WHERE id_risco = $5";
  pool.query(
    sql,
    [id_paciente, risco, data_inicio, data_termino, id_risco],
    (error, results) => {
      if (error)
        return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    }
  );
});

// excluir risco.
app.get("/delete_risco/:id_risco", (req, res) => {
  const id_risco = parseInt(req.params.id_risco);
  var sql = "DELETE FROM paciente_riscos WHERE id_risco = $1";
  pool.query(sql, [id_risco], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// ATENDIMENTOS.
// listar todos os atendimentos registrados.
app.get("/all_atendimentos", (req, res) => {
  var sql =
    "SELECT * FROM atendimento";
  pool.query(sql, (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// listar todos os atendimentos do paciente selecionado.
app.get("/list_atendimentos/:id_unidade", verifyJWT, (req, res) => {
  const id_unidade = parseInt(req.params.id_unidade);
  var sql =
    "SELECT * FROM atendimento WHERE id_unidade = $1 AND data_termino IS NULL";
  pool.query(sql, [id_unidade], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// listar atendimentos para CONSULTAS AMBULATORIAIS (unidade ambulatorial id = 5 no front).
// listar todos os atendimentos do paciente selecionado.
app.get("/list_consultas/:id_unidade", verifyJWT, (req, res) => {
  const id_unidade = parseInt(req.params.id_unidade);
  var sql =
    "SELECT * FROM atendimento WHERE id_unidade = $1";
  pool.query(sql, [id_unidade], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// inserir atendimento.
app.post("/insert_atendimento", (req, res) => {
  const {
    data_inicio,
    data_termino,
    problemas,
    id_paciente,
    id_unidade,
    nome_paciente,
    leito,
    situacao,
    id_cliente,
    classificacao,
  } = req.body;
  var sql =
    "INSERT INTO atendimento (data_inicio, data_termino, problemas, id_paciente, id_unidade, nome_paciente, leito, situacao, id_cliente, classificacao) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)";
  pool.query(
    sql,
    [
      data_inicio,
      data_termino,
      problemas,
      id_paciente,
      id_unidade,
      nome_paciente,
      leito,
      situacao,
      id_cliente,
      classificacao,
    ],
    (error, results) => {
      if (error)
        return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    }
  );
});

// inserir consulta ambulatorial.
app.post("/insert_consulta", (req, res) => {
  const {
    data_inicio,
    data_termino,
    problemas,
    id_paciente,
    id_unidade,
    nome_paciente,
    leito,
    situacao,
    id_cliente,
    classificacao,
    id_profissional
  } = req.body;
  var sql =
    "INSERT INTO atendimento (data_inicio, data_termino, problemas, id_paciente, id_unidade, nome_paciente, leito, situacao, id_cliente, classificacao, id_profissional) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)";
  pool.query(
    sql,
    [
      data_inicio,
      data_termino,
      problemas,
      id_paciente,
      id_unidade,
      nome_paciente,
      leito,
      situacao,
      id_cliente,
      classificacao,
      id_profissional
    ],
    (error, results) => {
      if (error)
        return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    }
  );
});

// atualizar atendimento.
app.post("/update_atendimento/:id_atendimento", (req, res) => {
  const id_atendimento = parseInt(req.params.id_atendimento);
  const {
    data_inicio,
    data_termino,
    problemas,
    id_paciente,
    id_unidade,
    nome_paciente,
    leito,
    situacao,
    id_cliente,
    classificacao
  } = req.body;
  var sql =
    "UPDATE atendimento SET data_inicio = $1, data_termino = $2, problemas = $3, id_paciente = $4, id_unidade = $5, nome_paciente = $6, leito = $7, situacao = $8, id_cliente = $9, classificacao = $10 WHERE id_atendimento = $11";
  pool.query(
    sql,
    [
      data_inicio,
      data_termino,
      problemas,
      id_paciente,
      id_unidade,
      nome_paciente,
      leito,
      situacao,
      id_cliente,
      classificacao,
      id_atendimento,
    ],
    (error, results) => {
      if (error)
        return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    }
  );
});

// excluir atendimento.
app.get("/delete_atendimento/:id_atendimento", (req, res) => {
  const id_atendimento = parseInt(req.params.id_atendimento);
  var sql = "DELETE FROM atendimento WHERE id_atendimento = $1";
  pool.query(sql, [id_atendimento], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// ATENDIMENTOS - EVOLUÇÕES.
// listar todas as evoluções do atendimento selecionado.
app.get("/list_evolucoes/:id_atendimento", (req, res) => {
  const id_atendimento = parseInt(req.params.id_atendimento);
  var sql = "SELECT * FROM atendimento_evolucoes WHERE id_atendimento = $1";
  pool.query(sql, [id_atendimento], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// inserir evolução.
app.post("/insert_evolucao", (req, res) => {
  const { id_atendimento, evolucao, data_evolucao, id_usuario } = req.body;
  var sql =
    "INSERT INTO atendimento_evolucoes (id_atendimento, evolucao, data_evolucao, id_usuario) VALUES ($1, $2, $3, $4)";
  pool.query(
    sql,
    [id_atendimento, evolucao, data_evolucao, id_usuario],
    (error, results) => {
      if (error)
        return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    }
  );
});

// atualizar evolucao.
app.post("/update_evolucao/:id_evolucao", (req, res) => {
  const id_evolucao = parseInt(req.params.id_evolucao);
  const { id_atendimento, evolucao, data_evolucao, id_usuario } = req.body;
  var sql =
    "UPDATE atendimento_evolucoes SET id_atendimento = $1, evolucao = $2, data_evolucao = $3, id_usuario = $4 WHERE id_evolucao = $5";
  pool.query(
    sql,
    [id_atendimento, evolucao, data_evolucao, id_usuario, id_evolucao],
    (error, results) => {
      if (error)
        return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    }
  );
});

// excluir evolucao.
app.get("/delete_evolucao/:id_evolucao", (req, res) => {
  const id_evolucao = parseInt(req.params.id_evolucao);
  var sql = "DELETE FROM atendimento_evolucoes WHERE id_evolucao = $1";
  pool.query(sql, [id_evolucao], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// ATENDIMENTOS - INFUSÕES.
// listar todas as infusões do atendimento selecionado.
app.get("/list_infusoes/:id_atendimento", (req, res) => {
  const id_atendimento = parseInt(req.params.id_atendimento);
  var sql = "SELECT * FROM atendimento_infusoes WHERE id_atendimento = $1";
  pool.query(sql, [id_atendimento], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// inserir infusão.
app.post("/insert_infusao", (req, res) => {
  const { id_atendimento, droga, velocidade, data_inicio, data_termino } =
    req.body;
  var sql =
    "INSERT INTO atendimento_infusoes (id_atendimento, droga, velocidade, data_inicio, data_termino) VALUES ($1, $2, $3, $4, $5)";
  pool.query(
    sql,
    [id_atendimento, droga, velocidade, data_inicio, data_termino],
    (error, results) => {
      if (error)
        return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    }
  );
});

// atualizar infusão.
app.post("/update_infusao/:id_infusao", (req, res) => {
  const id_infusao = parseInt(req.params.id_infusao);
  const { id_atendimento, droga, velocidade, data_inicio, data_termino } =
    req.body;
  var sql =
    "UPDATE atendimento_infusoes SET id_atendimento = $1, droga = $2, velocidade = $3, data_inicio = $4, data_termino = $5 WHERE id_infusao = $6";
  pool.query(
    sql,
    [id_atendimento, droga, velocidade, data_inicio, data_termino, id_infusao],
    (error, results) => {
      if (error)
        return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    }
  );
});

// excluir infusão.
app.get("/delete_infusao/:id_infusao", (req, res) => {
  const id_infusao = parseInt(req.params.id_infusao);
  var sql = "DELETE FROM atendimento_infusoes WHERE id_infusao = $1";
  pool.query(sql, [id_infusao], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// ATENDIMENTOS - INVASÕES.
// listar todas as invasões do atendimento selecionado.
app.get("/list_invasoes/:id_atendimento", (req, res) => {
  const id_atendimento = parseInt(req.params.id_atendimento);
  var sql = "SELECT * FROM atendimento_invasoes WHERE id_atendimento = $1";
  pool.query(sql, [id_atendimento], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// inserir invasão.
app.post("/insert_invasao", (req, res) => {
  const { id_atendimento, local, dispositivo, data_implante, data_retirada } =
    req.body;
  var sql =
    "INSERT INTO atendimento_invasoes (id_atendimento, local, dispositivo, data_implante, data_retirada) VALUES ($1, $2, $3, $4, $5)";
  pool.query(
    sql,
    [id_atendimento, local, dispositivo, data_implante, data_retirada],
    (error, results) => {
      if (error)
        return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    }
  );
});

// atualizar invasão.
app.post("/update_invasao/:id_invasao", (req, res) => {
  const id_invasao = parseInt(req.params.id_invasao);
  const { id_atendimento, local, dispositivo, data_implante, data_retirada } =
    req.body;
  var sql =
    "UPDATE atendimento_invasoes SET id_atendimento = $1, local = $2, dispositivo = $3, data_implante = $4, data_retirada = $5 WHERE id_invasao = $6";
  pool.query(
    sql,
    [
      id_atendimento,
      local,
      dispositivo,
      data_implante,
      data_retirada,
      id_invasao,
    ],
    (error, results) => {
      if (error)
        return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    }
  );
});

// excluir invasão.
app.get("/delete_invasao/:id_invasao", (req, res) => {
  const id_invasao = parseInt(req.params.id_invasao);
  var sql = "DELETE FROM atendimento_invasoes WHERE id_invasao = $1";
  pool.query(sql, [id_invasao], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// ATENDIMENTOS - PROPOSTAS.
// listar todas as propostas do atendimento selecionado.
app.get("/list_propostas/:id_atendimento", (req, res) => {
  const id_atendimento = parseInt(req.params.id_atendimento);
  var sql = "SELECT * FROM atendimento_propostas WHERE id_atendimento = $1";
  pool.query(sql, [id_atendimento], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// inserir proposta.
app.post("/insert_proposta", (req, res) => {
  const {
    id_atendimento,
    proposta,
    status,
    data_proposta,
    id_usuario,
    prazo,
    data_conclusao,
  } = req.body;
  var sql =
    "INSERT INTO atendimento_propostas (id_atendimento, proposta, status, data_proposta, id_usuario, prazo, data_conclusao) VALUES ($1, $2, $3, $4, $5, $6, $7)";
  pool.query(
    sql,
    [
      id_atendimento,
      proposta,
      status,
      data_proposta,
      id_usuario,
      prazo,
      data_conclusao,
    ],
    (error, results) => {
      if (error)
        return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    }
  );
});

// atualizar proposta.
app.post("/update_proposta/:id_proposta", (req, res) => {
  const id_proposta = parseInt(req.params.id_proposta);
  const {
    id_atendimento,
    proposta,
    status,
    data_proposta,
    id_usuario,
    prazo,
    data_conclusao,
  } = req.body;
  var sql =
    "UPDATE atendimento_propostas SET id_atendimento = $1, proposta = $2, status = $3, data_proposta = $4, id_usuario = $5, prazo = $6, data_conclusao = $7 WHERE id_proposta = $8";
  pool.query(
    sql,
    [
      id_atendimento,
      proposta,
      status,
      data_proposta,
      id_usuario,
      prazo,
      data_conclusao,
      id_proposta,
    ],
    (error, results) => {
      if (error)
        return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    }
  );
});

// excluir proposta.
app.get("/delete_proposta/:id_proposta", (req, res) => {
  const id_proposta = parseInt(req.params.id_proposta);
  var sql = "DELETE FROM atendimento_propostas WHERE id_proposta = $1";
  pool.query(sql, [id_proposta], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// ATENDIMENTOS - SINAIS VITAIS.
// listar todos os registros de sinais vitais do atendimento selecionado.
app.get("/list_sinais_vitais/:id_atendimento", (req, res) => {
  const id_atendimento = parseInt(req.params.id_atendimento);
  var sql = "SELECT * FROM atendimento_sinais_vitais WHERE id_atendimento = $1";
  pool.query(sql, [id_atendimento], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// inserir sinais vitais.
app.post("/insert_sinais_vitais", (req, res) => {
  const {
    id_atendimento,
    pas,
    pad,
    fc,
    fr,
    sao2,
    tax,
    glicemia,
    diurese,
    balanco,
    evacuacao,
    estase,
    data_sinais_vitais,
  } = req.body;
  var sql =
    "INSERT INTO atendimento_sinais_vitais (id_atendimento, pas, pad, fc, fr, sao2, tax, glicemia, diurese, balanco, evacuacao, estase, data_sinais_vitais) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)";
  pool.query(
    sql,
    [
      id_atendimento,
      pas,
      pad,
      fc,
      fr,
      sao2,
      tax,
      glicemia,
      diurese,
      balanco,
      evacuacao,
      estase,
      data_sinais_vitais,
    ],
    (error, results) => {
      if (error)
        return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    }
  );
});

// atualizar sinais vitais.
app.post("/update_sinais_vitais/:id_sinais_vitais", (req, res) => {
  const id_sinais_vitais = parseInt(req.params.id_sinais_vitais);
  const {
    id_atendimento,
    pas,
    pad,
    fc,
    fr,
    sao2,
    tax,
    glicemia,
    diurese,
    balanco,
    evacuacao,
    estase,
    data_sinais_vitais,
  } = req.body;
  var sql =
    "UPDATE atendimento_sinais_vitais SET id_atendimento = $1, pas = $2, pad = $3, fc = $4, fr = $5, sao2 = $6, tax  = $7, glicemia  = $8, diurese = $9, balanco = $10, evacuacao = $11, estase  = $12, data_sinais_vitais  = $13 WHERE id_sinais_vitais = $14";
  pool.query(
    sql,
    [
      id_atendimento,
      pas,
      pad,
      fc,
      fr,
      sao2,
      tax,
      glicemia,
      diurese,
      balanco,
      evacuacao,
      estase,
      data_sinais_vitais,
      id_sinais_vitais,
    ],
    (error, results) => {
      if (error)
        return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    }
  );
});

// excluir sinais vitais.
app.get("/delete_sinais_vitais/:id_sinais_vitais", (req, res) => {
  const id_sinais_vitais = parseInt(req.params.id_sinais_vitais);
  var sql = "DELETE FROM atendimento_sinais_vitais WHERE id_sinais_vitais = $1";
  pool.query(sql, [id_sinais_vitais], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// ATENDIMENTOS - VENTILAÇÃO MECÂNICA.
// listar todos os registros de ventilaçção mecânica (VM) do atendimento selecionado.
app.get("/list_vm/:id_atendimento", (req, res) => {
  const id_atendimento = parseInt(req.params.id_atendimento);
  var sql = "SELECT * FROM atendimento_vm WHERE id_atendimento = $1";
  pool.query(sql, [id_atendimento], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// inserir vm.
app.post("/insert_vm", (req, res) => {
  const { id_atendimento, modo, pressao, volume, peep, fio2, data_vm } =
    req.body;
  var sql =
    "INSERT INTO atendimento_vm (id_atendimento, modo, pressao, volume, peep, fio2, data_vm) VALUES ($1, $2, $3, $4, $5, $6, $7)";
  pool.query(
    sql,
    [id_atendimento, modo, pressao, volume, peep, fio2, data_vm],
    (error, results) => {
      if (error)
        return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    }
  );
});

// atualizar vm.
app.post("/update_vm/:id_vm", (req, res) => {
  const id_vm = parseInt(req.params.id_vm);
  const { id_atendimento, modo, pressao, volume, peep, fio2, data_vm } =
    req.body;
  var sql =
    "UPDATE atendimento_vm SET id_atendimento = $1, modo = $2, pressao = $3, volume = $4, peep = $5, fio2 = $6, data_vm  = $7 WHERE id_vm = $8";
  pool.query(
    sql,
    [id_atendimento, modo, pressao, volume, peep, fio2, data_vm, id_vm],
    (error, results) => {
      if (error)
        return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    }
  );
});

// excluir vm.
app.get("/delete_vm/:id_vm", (req, res) => {
  const id_vm = parseInt(req.params.id_vm);
  var sql = "DELETE FROM atendimento_vm WHERE id_vm = $1";
  pool.query(sql, [id_vm], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// ATENDIMENTOS - CULTURAS.
// listar todos os registros de culturas relativos ao atendimento selecionado.
app.get("/list_culturas/:id_atendimento", (req, res) => {
  const id_atendimento = parseInt(req.params.id_atendimento);
  var sql = "SELECT * FROM atendimento_culturas WHERE id_atendimento = $1";
  pool.query(sql, [id_atendimento], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// inserir cultura.
app.post("/insert_cultura", (req, res) => {
  const { id_atendimento, material, resultado, data_pedido, data_resultado } =
    req.body;
  var sql =
    "INSERT INTO atendimento_culturas (id_atendimento, material, resultado, data_pedido, data_resultado) VALUES ($1, $2, $3, $4, $5)";
  pool.query(
    sql,
    [id_atendimento, material, resultado, data_pedido, data_resultado],
    (error, results) => {
      if (error)
        return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    }
  );
});

// atualizar cultura.
app.post("/update_cultura/:id_cultura", (req, res) => {
  const id_cultura = parseInt(req.params.id_cultura);
  const { id_atendimento, material, resultado, data_pedido, data_resultado } =
    req.body;
  var sql =
    "UPDATE atendimento_culturas SET id_atendimento = $1, material = $2, resultado = $3, data_pedido = $4, data_resultado = $5 WHERE id_cultura = $6";
  pool.query(
    sql,
    [
      id_atendimento,
      material,
      resultado,
      data_pedido,
      data_resultado,
      id_cultura,
    ],
    (error, results) => {
      if (error)
        return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    }
  );
});

// excluir cultura.
app.get("/delete_cultura/:id_cultura", (req, res) => {
  const id_cultura = parseInt(req.params.id_cultura);
  var sql = "DELETE FROM atendimento_culturas WHERE id_cultura = $1";
  pool.query(sql, [id_cultura], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// ATENDIMENTOS - ANTIBIÓTICOS.
// listar todos os registros de antibióticos relativos ao atendimento selecionado.
app.get("/list_antibioticos/:id_atendimento", (req, res) => {
  const id_atendimento = parseInt(req.params.id_atendimento);
  var sql = "SELECT * FROM atendimento_antibioticos WHERE id_atendimento = $1";
  pool.query(sql, [id_atendimento], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// inserir antibiótico.
app.post("/insert_antibiotico", (req, res) => {
  const { id_atendimento, antibiotico, data_inicio, data_termino, prazo } =
    req.body;
  var sql =
    "INSERT INTO atendimento_antibioticos (id_atendimento, antibiotico, data_inicio, data_termino, prazo) VALUES ($1, $2, $3, $4, $5)";
  pool.query(
    sql,
    [id_atendimento, antibiotico, data_inicio, data_termino, prazo],
    (error, results) => {
      if (error)
        return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    }
  );
});

// atualizar antibiótico.
app.post("/update_antibiotico/:id_antibiotico", (req, res) => {
  const id_antibiotico = parseInt(req.params.id_antibiotico);
  const { id_atendimento, antibiotico, data_inicio, data_termino, prazo } =
    req.body;
  var sql =
    "UPDATE atendimento_antibioticos SET id_atendimento = $1, antibiotico = $2, data_inicio = $3, data_termino = $4, prazo = $5 WHERE id_antibiotico = $6";
  pool.query(
    sql,
    [
      id_atendimento,
      antibiotico,
      data_inicio,
      data_termino,
      prazo,
      id_antibiotico,
    ],
    (error, results) => {
      if (error)
        return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    }
  );
});

// excluir antibiótico.
app.get("/delete_antibiotico/:id_antibiotico", (req, res) => {
  const id_antibiotico = parseInt(req.params.id_antibiotico);
  var sql = "DELETE FROM atendimento_antibioticos WHERE id_antibiotico = $1";
  pool.query(sql, [id_antibiotico], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// ATENDIMENTOS - DIETA.
// listar todos os registros de dieta relativos ao atendimento selecionado.
app.get("/list_dietas/:id_atendimento", (req, res) => {
  const id_atendimento = parseInt(req.params.id_atendimento);
  var sql = "SELECT * FROM atendimento_dietas WHERE id_atendimento = $1";
  pool.query(sql, [id_atendimento], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// inserir dieta.
app.post("/insert_dieta", (req, res) => {
  const { infusao, get, tipo, data_inicio, data_termino, id_atendimento } =
    req.body;
  var sql =
    "INSERT INTO atendimento_dietas (infusao, get, tipo, data_inicio, data_termino, id_atendimento) VALUES ($1, $2, $3, $4, $5, $6)";
  pool.query(
    sql,
    [infusao, get, tipo, data_inicio, data_termino, id_atendimento],
    (error, results) => {
      if (error)
        return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    }
  );
});

// atualizar dieta.
app.post("/update_dieta/:id_dieta", (req, res) => {
  const id_dieta = parseInt(req.params.id_dieta);
  const { infusao, get, tipo, data_inicio, data_termino, id_atendimento } =
    req.body;
  var sql =
    "UPDATE atendimento_dietas SET infusao = $1, get = $2, tipo = $3, data_inicio = $4, data_termino = $5, id_atendimento = $6 WHERE id_dieta = $7";
  pool.query(
    sql,
    [infusao, get, tipo, data_inicio, data_termino, id_atendimento, id_dieta],
    (error, results) => {
      if (error)
        return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    }
  );
});

// excluir dieta.
app.get("/delete_dieta/:id_dieta", (req, res) => {
  const id_dieta = parseInt(req.params.id_dieta);
  var sql = "DELETE FROM atendimento_dietas WHERE id_dieta = $1";
  pool.query(sql, [id_dieta], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// ATENDIMENTOS //
// listar todos os atendimentos para um hospital (cliente).
app.get("/allatendimentos/:cliente", (req, res) => {
  const cliente = parseInt(req.params.cliente);
  var sql =
    "SELECT * FROM atendimento WHERE id_cliente = $1 AND data_termino IS NULL";
  pool.query(sql, [cliente], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// ATENDIMENTOS - INTERCONSULTAS.
// listar todos os registros de interconsultas.
app.get("/all_interconsultas", (req, res) => {
  var sql = "SELECT * FROM atendimento_interconsultas WHERE status != 'ENCERRADA'";
  pool.query(sql, (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO: " + error });
    res.send(results);
  });
});

// listar todos os registros de interconsultas relativos ao atendimento selecionado.
app.get("/list_interconsultas/:id_atendimento", (req, res) => {
  const id_atendimento = parseInt(req.params.id_atendimento);
  var sql =
    "SELECT * FROM atendimento_interconsultas WHERE id_atendimento = $1";
  pool.query(sql, [id_atendimento], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// inserir interconsulta.
app.post("/insert_interconsulta", (req, res) => {
  const {
    id_atendimento,
    especialidade,
    status,
    data_pedido,
    parecer,
    id_solicitante,
    id_interconsultor,
    id_paciente,
  } = req.body;
  var sql =
    "INSERT INTO atendimento_interconsultas (id_atendimento, especialidade, status, data_pedido, parecer, id_solicitante, id_interconsultor, id_paciente) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)";
  pool.query(
    sql,
    [
      id_atendimento,
      especialidade,
      status,
      data_pedido,
      parecer,
      id_solicitante,
      id_interconsultor,
      id_paciente,
    ],
    (error, results) => {
      if (error)
        return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    }
  );
});

// atualizar interconsulta.
app.post("/update_interconsulta/:id_interconsulta", (req, res) => {
  const id_interconsulta = parseInt(req.params.id_interconsulta);
  const {
    id_atendimento,
    especialidade,
    status,
    data_pedido,
    parecer,
    id_solicitante,
    id_interconsultor,
    id_paciente,
  } = req.body;
  var sql =
    "UPDATE atendimento_interconsultas SET id_atendimento = $1, especialidade = $2, status = $3, data_pedido = $4, parecer = $5, id_solicitante = $6, id_interconsultor = $7, id_paciente = $8 WHERE id_interconsulta = $9";
  pool.query(
    sql,
    [
      id_atendimento,
      especialidade,
      status,
      data_pedido,
      parecer,
      id_solicitante,
      id_interconsultor,
      id_paciente,
      id_interconsulta,
    ],
    (error, results) => {
      if (error)
        return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    }
  );
});

// excluir interconsulta.
app.get("/delete_interconsulta/:id_interconsulta", (req, res) => {
  const id_interconsulta = parseInt(req.params.id_interconsulta);
  var sql =
    "DELETE FROM atendimento_interconsultas WHERE id_interconsulta = $1";
  pool.query(sql, [id_interconsulta], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// ## CONFIGURAÇÕES / SETTINGS ##
// listar configurações.
app.get("/settings/:id_usuario", (req, res) => {
  const id_usuario = parseInt(req.params.id_usuario);
  var sql = "SELECT * FROM settings WHERE id_usuario = $1";
  pool.query(sql, [id_usuario], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// inserir configurações.
app.post("/insert_settings", (req, res) => {
  const {
    id_usuario,
    tema,
    card_diasinternacao,
    card_alergias,
    card_anamnese,
    card_evolucoes,
    card_propostas,
    card_precaucoes,
    card_riscos,
    card_alertas,
    card_sinaisvitais,
    card_body,
    card_vm,
    card_infusoes,
    card_dieta,
    card_culturas,
    card_antibioticos,
    card_interconsultas,
  } = req.body;
  var sql =
    "INSERT INTO settings (id_usuario, tema, card_diasinternacao, card_alergias, card_anamnese, card_evolucoes, card_propostas, card_precaucoes, card_riscos, card_alertas, card_sinaisvitais, card_body, card_vm, card_infusoes, card_dieta, card_culturas, card_antibioticos, card_interconsultas) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)";
  pool.query(
    sql,
    [
      id_usuario,
      tema,
      card_diasinternacao,
      card_alergias,
      card_anamnese,
      card_evolucoes,
      card_propostas,
      card_precaucoes,
      card_riscos,
      card_alertas,
      card_sinaisvitais,
      card_body,
      card_vm,
      card_infusoes,
      card_dieta,
      card_culturas,
      card_antibioticos,
      card_interconsultas,
    ],
    (error, results) => {
      if (error)
        return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    }
  );
});

// atualizar configurações.
app.post("/update_settings/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const {
    id_usuario,
    tema,
    card_diasinternacao,
    card_alergias,
    card_anamnese,
    card_evolucoes,
    card_propostas,
    card_precaucoes,
    card_riscos,
    card_alertas,
    card_sinaisvitais,
    card_body,
    card_vm,
    card_infusoes,
    card_dieta,
    card_culturas,
    card_antibioticos,
    card_interconsultas,
  } = req.body;
  var sql =
    "UPDATE settings SET id_usuario = $1, tema = $2, card_diasinternacao = $3, card_alergias = $4, card_anamnese = $5, card_evolucoes = $6, card_propostas = $7, card_precaucoes = $8, card_riscos = $9, card_alertas = $10, card_sinaisvitais = $11, card_body = $12, card_vm = $13, card_infusoes = $14, card_dieta = $15, card_culturas = $16, card_antibioticos = $17, card_interconsultas = $18 WHERE id = $19";
  pool.query(
    sql,
    [
      id_usuario,
      tema,
      card_diasinternacao,
      card_alergias,
      card_anamnese,
      card_evolucoes,
      card_propostas,
      card_precaucoes,
      card_riscos,
      card_alertas,
      card_sinaisvitais,
      card_body,
      card_vm,
      card_infusoes,
      card_dieta,
      card_culturas,
      card_antibioticos,
      card_interconsultas,
      id,
    ],
    (error, results) => {
      if (error)
        return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    }
  );
});

// listagem de todos os dados dos atendimentos (para gerar PDF).
app.get("/all_evolucoes", (req, res) => {
  var sql = "SELECT * FROM atendimento_evolucoes";
  pool.query(sql, (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

app.get("/all_antibioticos", (req, res) => {
  var sql = "SELECT * FROM atendimento_antibioticos";
  pool.query(sql, (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

app.get("/all_culturas", (req, res) => {
  var sql = "SELECT * FROM atendimento_culturas";
  pool.query(sql, (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

app.get("/all_infusoes", (req, res) => {
  var sql = "SELECT * FROM atendimento_infusoes";
  pool.query(sql, (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

app.get("/all_invasoes", (req, res) => {
  var sql = "SELECT * FROM atendimento_invasoes";
  pool.query(sql, (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

app.get("/all_propostas", (req, res) => {
  var sql = "SELECT * FROM atendimento_propostas";
  pool.query(sql, (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

app.get("/all_vm", (req, res) => {
  var sql = "SELECT * FROM atendimento_vm";
  pool.query(sql, (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// ## PRESCRIÇÃO ##

// lista de prescrições.
// listar todos os registros de prescrição relativos ao atendimento selecionado.
app.get("/list_prescricoes/:id_atendimento", (req, res) => {
  const id_atendimento = parseInt(req.params.id_atendimento);
  var sql = "SELECT * FROM atendimento_lista_prescricoes WHERE id_atendimento = $1";
  pool.query(sql, [id_atendimento], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// inserir item de prescrição.
app.post("/insert_prescricao", (req, res) => {
  const {
    id_paciente,
    id_atendimento,
    data,
    status,
    id_profissional,
    nome_profissional,
    registro_profissional,
  } = req.body;
  var sql =
    "INSERT INTO atendimento_lista_prescricoes (id_paciente, id_atendimento, data, status, id_profissional, nome_profissional, registro_profissional) VALUES ($1, $2, $3, $4, $5, $6, $7)";
  pool.query(
    sql,
    [
      id_paciente,
      id_atendimento,
      data,
      status,
      id_profissional,
      nome_profissional,
      registro_profissional
    ],
    (error, results) => {
      if (error)
        return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
      console.log('enviado');
    }
  );
});

// atualizar item de prescrição.
app.post("/update_prescricao/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const {
    id_paciente,
    id_atendimento,
    data,
    status,
    id_profissional,
    nome_profissional,
    registro_profissional,
  } = req.body;
  var sql =
    "UPDATE atendimento_lista_prescricoes SET id_paciente = $1, id_atendimento = $2, data = $3, status = $4, id_profissional = $5, nome_profissional = $6, registro_profissional = $7 WHERE id = $8";
  pool.query(
    sql,
    [
      id_paciente,
      id_atendimento,
      data,
      status,
      id_profissional,
      nome_profissional,
      registro_profissional,
      id
    ],
    (error, results) => {
      if (error)
        return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    }
  );
});

// excluir prescrição.
app.get("/delete_prescricao/:id", (req, res) => {
  const id = parseInt(req.params.id);
  var sql = "DELETE FROM atendimento_lista_prescricoes WHERE id = $1";
  pool.query(sql, [id], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

app.get("/all_prescricoes", (req, res) => {
  var sql = "SELECT * FROM atendimento_prescricoes";
  pool.query(sql, (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// listar todos os registros de itens de prescrição relativas ao atendimento selecionado.
app.get("/list_itens_prescricoes/:id_atendimento", (req, res) => {
  const id_atendimento = parseInt(req.params.id_atendimento);
  var sql = "SELECT * FROM atendimento_prescricoes WHERE id_atendimento = $1";
  pool.query(sql, [id_atendimento], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// inserir item de prescrição.
app.post("/insert_item_prescricao", (req, res) => {
  const {
    id_unidade,
    id_paciente,
    id_atendimento,
    categoria,
    codigo_item,
    nome_item,
    qtde_item,
    via,
    freq,
    agora,
    acm,
    sn,
    obs,
    data,
    id_componente_pai, // código usado para recrutar registros de componentes para o item de prescrição.
    id_componente_filho, // código que caracteriza o item como componente, a ser recrutado pelo tem de prescrição.
    id_prescricao,
    id_pai,
  } = req.body;
  var sql =
    "INSERT INTO atendimento_prescricoes (id_unidade, id_paciente, id_atendimento, categoria, codigo_item, nome_item, qtde_item, via, freq, agora, acm, sn, obs, data, id_componente_pai, id_componente_filho, id_prescricao, id_pai) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)";
  pool.query(
    sql,
    [
      id_unidade,
      id_paciente,
      id_atendimento,
      categoria,
      codigo_item,
      nome_item,
      qtde_item,
      via,
      freq,
      agora,
      acm,
      sn,
      obs,
      data,
      id_componente_pai,
      id_componente_filho,
      id_prescricao,
      id_pai,
    ],
    (error, results) => {
      if (error)
        return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    }
  );
});

// atualizar item de prescrição.
app.post("/update_item_prescricao/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const {
    id_unidade,
    id_paciente,
    id_atendimento,
    categoria,
    codigo_item,
    nome_item,
    qtde_item,
    via,
    freq,
    agora,
    acm,
    sn,
    obs,
    data,
    id_componente_pai,
    id_componente_filho,
    id_prescricao,
    id_pai,
  } = req.body;
  var sql =
    "UPDATE atendimento_prescricoes SET id_unidade = $1, id_paciente = $2, id_atendimento = $3, categoria = $4, codigo_item = $5, nome_item = $6, qtde_item = $7, via = $8, freq = $9, agora = $10, acm = $11, sn = $12, obs = $13, data = $14, id_componente_pai = $15, id_componente_filho = $16, id_prescricao = $17, id_pai = $18 WHERE id = $19";
  pool.query(
    sql,
    [
      id_unidade,
      id_paciente,
      id_atendimento,
      categoria,
      codigo_item,
      nome_item,
      qtde_item,
      via,
      freq,
      agora,
      acm,
      sn,
      obs,
      data,
      id_componente_pai,
      id_componente_filho,
      id_prescricao,
      id_pai,
      id,
    ],
    (error, results) => {
      if (error)
        return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    }
  );
});

// excluir registro de item de prescrição.
app.get("/delete_item_prescricao/:id", (req, res) => {
  const id = parseInt(req.params.id);
  var sql = "DELETE FROM atendimento_prescricoes WHERE id = $1";
  pool.query(sql, [id], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// ## OPÇÕES DE ITENS DE PRESCRIÇÃO ##
app.get("/opcoes_prescricoes", (req, res) => {
  var sql = "SELECT * FROM prescricoes";
  pool.query(sql, (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// inserir item de opção de prescrição.
app.post("/insert_opcoes_prescricao", (req, res) => {
  const { nome_item, categoria, qtde_item, via, freq, obs, id_componente_filho, id_componente_pai, codigo_item } = req.body;
  var sql =
    "INSERT INTO prescricoes (nome_item, categoria, qtde_item, via, freq, obs, id_componente_filho, id_componente_pai, codigo_item) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)";
  pool.query(
    sql,
    [nome_item, categoria, qtde_item, via, freq, obs, id_componente_filho, id_componente_pai, codigo_item],
    (error, results) => {
      if (error)
        return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    }
  );
});

// atualizar item de opção de prescrição.
app.post("/update_opcoes_prescricao/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { nome_item, categoria, qtde_item, via, freq, obs, id_componente_filho, id_componente_pai, codigo_item } = req.body;
  var sql =
    "UPDATE prescricoes SET nome_item = $1, categoria = $2, qtde_item = $3, via = $4, freq = $5, obs = $6, id_componente_filho = $7, id_componente_pai = $8, codigo_item  = $9 WHERE id = $10";
  pool.query(
    sql,
    [nome_item, categoria, qtde_item, via, freq, obs, id_componente_filho, id_componente_pai, codigo_item, id],
    (error, results) => {
      if (error)
        return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    }
  );
});

// excluir registro de opção de item de prescrição.
app.get("/delete_opcoes_prescricao/:id", (req, res) => {
  const id = parseInt(req.params.id);
  var sql = "DELETE FROM prescricoes WHERE id = $1";
  pool.query(sql, [id], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// USUÁRIOS
app.post("/inserir_usuario", (req, res) => {
  const {
    nome_usuario,
    dn_usuario,
    cpf_usuario,
    contato_usuario,
    senha,
    login,
    conselho,
    n_conselho,
    tipo_usuario,
    paciente,
    prontuario,
    laboratorio,
    farmacia,
    faturamento,
    usuarios,
    primeiro_acesso,
  } = req.body;
  var sql =
    "INSERT INTO usuarios (nome_usuario, dn_usuario, cpf_usuario, contato_usuario, senha, login, conselho, n_conselho, tipo_usuario, paciente, prontuario, laboratorio, farmacia, faturamento, usuarios, primeiro_acesso) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)";
  pool.query(
    sql,
    [
      nome_usuario,
      dn_usuario,
      cpf_usuario,
      contato_usuario,
      senha,
      login,
      conselho,
      n_conselho,
      tipo_usuario,
      paciente,
      prontuario,
      laboratorio,
      farmacia,
      faturamento,
      usuarios,
      primeiro_acesso,
    ],
    (error, results) => {
      if (error)
        return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    }
  );
});

// atualizar usuário.
app.post("/update_usuario/:id_usuario", (req, res) => {
  const id_usuario = parseInt(req.params.id_usuario);
  const {
    nome_usuario,
    dn_usuario,
    cpf_usuario,
    contato_usuario,
    senha,
    login,
    conselho,
    n_conselho,
    tipo_usuario,
    paciente,
    prontuario,
    laboratorio,
    farmacia,
    faturamento,
    usuarios,
    primeiro_acesso,
  } = req.body;
  var sql =
    "UPDATE usuarios SET nome_usuario = $1, dn_usuario = $2, cpf_usuario = $3, contato_usuario = $4, senha = $5, login = $6, conselho = $7, n_conselho = $8, tipo_usuario = $9, paciente = $10, prontuario = $11, laboratorio = $12, farmacia = $13, faturamento = $14, usuarios = $15, primeiro_acesso = $16 WHERE id_usuario = $17";
  pool.query(
    sql,
    [
      nome_usuario,
      dn_usuario,
      cpf_usuario,
      contato_usuario,
      senha,
      login,
      conselho,
      n_conselho,
      tipo_usuario,
      paciente,
      prontuario,
      laboratorio,
      farmacia,
      faturamento,
      usuarios,
      primeiro_acesso,
      id_usuario,
    ],
    (error, results) => {
      if (error)
        return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    }
  );
});

// excluir usuário.
app.get("/delete_usuario/:id_usuario", (req, res) => {
  const id_usuario = parseInt(req.params.id_usuario);
  var sql = "DELETE FROM usuarios WHERE id_usuario = $1";
  pool.query(sql, [id_usuario], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

app.post("/inserir_usuario", (req, res) => {
  const {
    nome_usuario,
    dn_usuario,
    cpf_usuario,
    contato_usuario,
    senha,
    login,
    conselho,
    n_conselho,
  } = req.body;
  var sql =
    "INSERT INTO usuarios (nome_usuario, dn_usuario, cpf_usuario, contato_usuario, senha, login, conselho, n_conselho) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)";
  pool.query(
    sql,
    [
      nome_usuario,
      dn_usuario,
      cpf_usuario,
      contato_usuario,
      senha,
      login,
      conselho,
      n_conselho,
    ],
    (error, results) => {
      if (error)
        return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    }
  );
});

// GESTÃO DE LEITOS.
// atualizar leito.
app.post("/update_leito/:id_leito", (req, res) => {
  const id_leito = parseInt(req.params.id_leito);
  const { id_unidade, leito, status } = req.body;
  var sql =
    "UPDATE leitos SET id_unidade = $1, leito = $2, status = $3 WHERE id_leito = $4";
  pool.query(sql, [id_unidade, leito, status, id_leito], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

app.post("/inserir_leito", (req, res) => {
  const { id_unidade, leito, status } = req.body;
  var sql =
    "INSERT INTO leitos (id_unidade, leito, status) VALUES ($1, $2, $3)";
  pool.query(sql, [id_unidade, leito, status], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// carregar leitos.
app.get("/list_leitos/:id_unidade", (req, res) => {
  var id_unidade = req.params.id_unidade;
  var sql = "SELECT * FROM leitos WHERE id_unidade = $1";
  pool.query(sql, [id_unidade], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// carregar todos os leitos.
app.get("/list_all_leitos", (req, res) => {
  var sql = "SELECT * FROM leitos";
  pool.query(sql, (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// TRIAGEM/CHAMADAS PARA CONSULTA
// listar registros de triagem/chamada para consulta.
app.get("/list_chamada/:id_unidade", (req, res) => {
  const id_unidade = parseInt(req.params.id_unidade);
  var sql = "SELECT * FROM triagem WHERE id_unidade = $1";
  pool.query(sql, [id_unidade], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// inserir chamada de triagem ou consulta.
app.post("/insert_chamada", (req, res) => {
  const {
    id_unidade,
    id_paciente,
    nome_paciente,
    id_atendimento,
    id_sala,
    data,
  } = req.body;
  var sql =
    "INSERT INTO triagem (id_unidade, id_paciente, nome_paciente, id_atendimento, id_sala, data) VALUES ($1, $2, $3, $4, $5, $6)";
  pool.query(
    sql,
    [
      id_unidade,
      id_paciente,
      nome_paciente,
      id_atendimento,
      id_sala,
      data,
    ],
    (error, results) => {
      if (error)
        return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    }
  );
});

// excluir chamada.
app.get("/delete_chamada/:id", (req, res) => {
  const id_usuario = parseInt(req.params.id);
  var sql = "DELETE FROM triagem WHERE id = $1";
  pool.query(sql, [id_usuario], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// DOCUMENTOS (ADMISSÃO, EVOLUÇÃO, SUMÁRIO DE ALTA, ATESTADO).
// listar documentos.
app.get("/list_documentos/:id_atendimento", (req, res) => {
  const id_atendimento = parseInt(req.params.id_atendimento);
  var sql = "SELECT * FROM atendimento_documentos WHERE id_atendimento = $1";
  pool.query(sql, [id_atendimento], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// inserir registro de documento.
app.post("/insert_documento", (req, res) => {
  const {
    id_paciente,
    nome_paciente,
    id_atendimento,
    data,
    texto,
    status,
    tipo_documento,
    profissional,
    conselho,
    id_profissional,
  } = req.body;
  var sql =
    "INSERT INTO atendimento_documentos (id_paciente, nome_paciente, id_atendimento, data, texto, status, tipo_documento, profissional, conselho, id_profissional) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)";
  pool.query(
    sql,
    [
      id_paciente,
      nome_paciente,
      id_atendimento,
      data,
      texto,
      status,
      tipo_documento,
      profissional,
      conselho,
      id_profissional
    ],
    (error, results) => {
      if (error)
        return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    }
  );
});

app.post("/update_documento/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const {
    id_paciente,
    nome_paciente,
    id_atendimento,
    data,
    texto,
    status,
    tipo_documento,
    profissional,
    conselho,
    id_profissional
  } = req.body;
  var sql =
    "UPDATE atendimento_documentos SET id_paciente = $1, nome_paciente = $2, id_atendimento = $3, data = $4, texto = $5, status = $6, tipo_documento = $7, profissional = $8, conselho = $9, id_profissional = $10 WHERE id = $11";
  pool.query(
    sql,
    [
      id_paciente,
      nome_paciente,
      id_atendimento,
      data,
      texto,
      status,
      tipo_documento,
      profissional,
      conselho,
      id_profissional,
      id
    ], (error, results) => {
      if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    });
});

// excluir documento.
app.get("/delete_documento/:id", (req, res) => {
  const id = parseInt(req.params.id);
  var sql = "DELETE FROM atendimento_documentos WHERE id = $1";
  pool.query(sql, [id], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// MODELO DE DOCUMENTOS.
// modelos personalizados de receita médica e demais documentos, criados pelos usuários, que podem ser resgatados para edição de novos documentos.
// listar documentos.
app.get("/list_model_documentos/:id_usuario", (req, res) => {
  const id_usuario = parseInt(req.params.id_usuario);
  var sql = "SELECT * FROM documentos_modelos WHERE id_usuario = $1";
  pool.query(sql, [id_usuario], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// listar documentos.
app.get("/list_all_model_documentos", (req, res) => {
  var sql = "SELECT * FROM documentos_modelos";
  pool.query(sql, (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// inserir registro de documento.
app.post("/insert_model_documento", (req, res) => {
  const {
    id_usuario,
    tipo_documento,
    nome_modelo,
    texto,
  } = req.body;
  var sql =
    "INSERT INTO documentos_modelos (id_usuario, tipo_documento, nome_modelo, texto) VALUES ($1, $2, $3, $4)";
  pool.query(
    sql,
    [
      id_usuario,
      tipo_documento,
      nome_modelo,
      texto,
    ],
    (error, results) => {
      if (error)
        return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    }
  );
});

app.post("/update_model_documento/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const {
    id_usuario,
    tipo_documento,
    nome_modelo,
    texto
  } = req.body;
  var sql =
    "UPDATE documentos_modelos SET id_usuario = $1, tipo_documento = $2, nome_modelo = $3, texto = $4 WHERE id = $5";
  pool.query(
    sql,
    [
      id_usuario,
      tipo_documento,
      nome_modelo,
      texto
    ], (error, results) => {
      if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    });
});

// excluir documento.
app.get("/delete_model_documento/:id", (req, res) => {
  const id = parseInt(req.params.id);
  var sql = "DELETE FROM documentos_modelos WHERE id = $1";
  pool.query(sql, [id], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// MODELO DE PRESCRIÇÃO.
// modelos personalizados de prescrição, criados pelos usuários, que podem ser resgatados para edição de novas prescrições.
// listar modelos.
app.get("/list_model_prescricao/:id_usuario", (req, res) => {
  const id_usuario = parseInt(req.params.id_usuario);
  var sql = "SELECT * FROM modelos_prescricao WHERE id_usuario = $1";
  pool.query(sql, [id_usuario], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// inserir registro de documento.
app.post("/insert_model_prescricao", (req, res) => {
  const {
    id_usuario,
    nome_prescricao,
    key_modelo,
  } = req.body;
  var sql =
    "INSERT INTO modelos_prescricao (id_usuario, nome_prescricao, key_modelo) VALUES ($1, $2, $3)";
  pool.query(
    sql,
    [
      id_usuario,
      nome_prescricao,
      key_modelo
    ],
    (error, results) => {
      if (error)
        return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    }
  );
});

app.post("/update_model_prescricao/:id_modelo_prescricao", (req, res) => {
  const id = parseInt(req.params.id_modelo_prescricao);
  const {
    id_usuario,
    nome_prescricao,
    key_modelo,
  } = req.body;
  var sql =
    "UPDATE modelos_prescricao SET id_usuario = $1, nome_prescricao = $2, key_modelo = $3 WHERE id_modelo_prescricao = $4";
  pool.query(
    sql,
    [
      id_usuario,
      nome_prescricao,
      key_modelo,
    ], (error, results) => {
      if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    });
});

// excluir documento.
app.get("/delete_model_prescricao/:id_modelo_prescricao", (req, res) => {
  const id = parseInt(req.params.id_modelo_prescricao);
  var sql = "DELETE FROM modelos_prescricao WHERE id_modelo_prescricao = $1";
  pool.query(sql, [id], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// ITENS DE MODELOS DE PRESCRIÇÃO.
// listar itens de modelos de prescrição.
app.get("/list_itens_model_prescricao/:id_modelo_prescricao", (req, res) => {
  const id_modelo_prescricao = req.params.id_modelo_prescricao;
  var sql = "SELECT * FROM modelos_prescricao_itens WHERE id_modelo_prescricao = $1";
  pool.query(sql, [id_modelo_prescricao], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// inserir registro de item para modelo de prescrição.
app.post("/insert_item_model_prescricao", (req, res) => {
  const {
    id_modelo_prescricao,
    id_unidade,
    id_paciente,
    id_atendimento,
    categoria,
    codigo_item,
    nome_item,
    qtde_item,
    via,
    freq,
    agora,
    acm,
    sn,
    obs,
    data,
    id_componente_pai,
    id_componente_filho,
    id_prescricao,
    id_pai
  } = req.body;
  var sql =
    "INSERT INTO modelos_prescricao_itens (id_modelo_prescricao, id_unidade, id_paciente, id_atendimento, categoria, codigo_item, nome_item, qtde_item, via, freq, agora, acm, sn, obs, data, id_componente_pai, id_componente_filho, id_prescricao, id_pai) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)";
  pool.query(
    sql,
    [
      id_modelo_prescricao,
      id_unidade,
      id_paciente,
      id_atendimento,
      categoria,
      codigo_item,
      nome_item,
      qtde_item,
      via,
      freq,
      agora,
      acm,
      sn,
      obs,
      data,
      id_componente_pai,
      id_componente_filho,
      id_prescricao,
      id_pai
    ],
    (error, results) => {
      if (error)
        return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    }
  );
});

// excluir item de modelo de orescrição.
app.get("/delete_item_model_prescricao/:id", (req, res) => {
  const id = parseInt(req.params.id);
  var sql = "DELETE FROM modelos_prescricao_itens WHERE id = $1";
  pool.query(sql, [id], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO " + error });
    res.send(results);
  });
});

// APRAZAMENTO DOS ITENS DE PRESCRIÇÃO.
// listar aprazamentos.
app.get("/list_aprazamentos/:id_prescricao", (req, res) => {
  const id_prescricao = parseInt(req.params.id_prescricao);
  var sql = "SELECT * FROM atendimento_prescricoes_aprazamento WHERE id_prescricao = $1";
  pool.query(sql, [id_prescricao], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// inserir registro de aprazamento.
app.post("/insert_aprazamento", (req, res) => {
  const {
    id_atendimento,
    id_prescricao,
    id_componente_pai,
    id_componente_filho,
    nome,
    qtde,
    prazo,
    dispensado,
    codigo_item,
  } = req.body;
  var sql =
    "INSERT INTO atendimento_prescricoes_aprazamento (id_atendimento, id_prescricao, id_componente_pai, id_componente_filho, nome, qtde, prazo, dispensado, codigo_item) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)";
  pool.query(
    sql,
    [
      id_atendimento,
      id_prescricao,
      id_componente_pai,
      id_componente_filho,
      nome,
      qtde,
      prazo,
      dispensado,
      codigo_item,
    ],
    (error, results) => {
      if (error)
        return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    }
  );
});

// atualizar registro de aprazamento.
app.post("/update_aprazamento/:id", (req, res) => {
  const id = req.params.id;
  const {
    id_atendimento,
    id_prescricao,
    id_componente_pai,
    id_componente_filho,
    nome,
    qtde,
    prazo,
    dispensado,
    codigo_item,
  } = req.body;
  var sql =
    "UPDATE atendimento_prescricoes_aprazamento SET id_atendimento = $1, id_prescricao = $2, id_componente_pai = $3, id_componente_filho = $4, nome = $5, qtde = $6, prazo = $7, dispensado = $8, codigo_item = $9 WHERE id = $10";
  pool.query(
    sql,
    [
      id_atendimento,
      id_prescricao,
      id_componente_pai,
      id_componente_filho,
      nome,
      qtde,
      prazo,
      dispensado,
      codigo_item,
      id,
    ],
    (error, results) => {
      if (error)
        return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    }
  );
});

// excluir aprazamento.
app.get("/delete_aprazamento/:id", (req, res) => {
  const id = parseInt(req.params.id);
  var sql = "DELETE FROM atendimento_prescricoes_aprazamento WHERE id = $1";
  pool.query(sql, [id], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// LABORATÓRIO.
// LISTA DE EXAMES LABORATORIAIS.

// listar exames laboratoriais solicitados para um dado atendimento.
app.get("/lista_all_laboratorio", (req, res) => {
  var sql = "SELECT * FROM atendimento_lista_laboratorio";
  pool.query(sql, (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// listar exames laboratoriais solicitados para um dado atendimento.
app.get("/lista_laboratorio/:id_atendimento", (req, res) => {
  const id_atendimento = req.params.id_atendimento;
  var sql = "SELECT * FROM atendimento_lista_laboratorio WHERE id_atendimento = $1";
  pool.query(sql, [id_atendimento], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// inserir registro de pedido laboratorial (lista no painel lateral que agrupa os itens de exames).
app.post("/insert_lista_laboratorio", (req, res) => {
  const {
    id_paciente,
    id_atendimento,
    data,
    status,
    id_profissional,
    nome_profissional,
    registro_profissional,
    random,
    urgente,
  } = req.body;
  var sql =
    "INSERT INTO atendimento_lista_laboratorio (id_paciente, id_atendimento, data, status, id_profissional, nome_profissional, registro_profissional, random, urgente) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)";
  pool.query(
    sql,
    [
      id_paciente,
      id_atendimento,
      data,
      status,
      id_profissional,
      nome_profissional,
      registro_profissional,
      random,
      urgente,
    ],
    (error, results) => {
      if (error)
        return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    }
  );
});

// atualizar registro de pedido de exame laboratorial (lista).
app.post("/update_lista_laboratorio/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const {
    id_paciente,
    id_atendimento,
    data,
    status,
    id_profissional,
    nome_profissional,
    registro_profissional,
    random,
    urgente,
  } = req.body;
  var sql =
    "UPDATE atendimento_lista_laboratorio SET id_paciente = $1, id_atendimento = $2, data = $3, status = $4, id_profissional = $5, nome_profissional = $6, registro_profissional = $7, random = $8, urgente = $9 WHERE id = $10";
  pool.query(
    sql,
    [
      id_paciente,
      id_atendimento,
      data,
      status,
      id_profissional,
      nome_profissional,
      registro_profissional,
      random,
      urgente,
      id
    ], (error, results) => {
      if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    });
});

// excluir pedido de exame laboratorial solicitado.
app.get("/delete_lista_laboratorio/:id", (req, res) => {
  const id = parseInt(req.params.id);
  var sql = "DELETE FROM atendimento_lista_laboratorio WHERE id = $1";
  pool.query(sql, [id], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// ITENS DE EXAMES LABORATORIAIS.
// listar exames laboratoriais solicitados.
app.get("/atendimento_laboratorio/:id_atendimento", (req, res) => {
  const id_atendimento = req.params.id_atendimento;
  var sql = "SELECT * FROM atendimento_laboratorio WHERE id_atendimento = $1";
  pool.query(sql, [id_atendimento], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// listar todos os exames laboratoriais (tela do laboratório).
app.get("/all_laboratorio", (req, res) => {
  var sql = "SELECT * FROM atendimento_laboratorio";
  pool.query(sql, (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// inserir registro de exame laboratorial.
app.post("/insert_laboratorio", (req, res) => {
  const {
    id_paciente,
    id_atendimento,
    data_pedido,
    data_resultado,
    codigo_exame,
    nome_exame,
    material,
    resultado,
    status,
    profissional,
    unidade_medida,
    vref_min,
    vref_max,
    obs,
    random,
    array_campos,
    metodo,
  } = req.body;
  var sql =
    "INSERT INTO atendimento_laboratorio (id_paciente, id_atendimento, data_pedido, data_resultado, codigo_exame, nome_exame, material, resultado, status, profissional, unidade_medida, vref_min, vref_max, obs, random, array_campos, metodo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)";
  pool.query(
    sql,
    [
      id_paciente,
      id_atendimento,
      data_pedido,
      data_resultado,
      codigo_exame,
      nome_exame,
      material,
      resultado,
      status,
      profissional,
      unidade_medida,
      vref_min,
      vref_max,
      obs,
      random,
      array_campos,
      metodo,
    ],
    (error, results) => {
      if (error)
        return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    }
  );
});

// atualizar registro de exame laboratorial.
app.post("/update_laboratorio/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const {
    id_paciente,
    id_atendimento,
    data_pedido,
    data_resultado,
    codigo_exame,
    nome_exame,
    material,
    resultado,
    status,
    profissional,
    unidade_medida,
    vref_min,
    vref_max,
    obs,
    random,
    array_campos,
    metodo,
  } = req.body;
  var sql =
    "UPDATE atendimento_laboratorio SET id_paciente = $1, id_atendimento = $2, data_pedido = $3, data_resultado = $4, codigo_exame = $5, nome_exame = $6, material = $7, resultado = $8, status = $9, profissional = $10, unidade_medida = $11, vref_min = $12, vref_max = $13, obs = $14, random = $15, array_campos =$16, metodo =$17 WHERE id = $18";
  pool.query(
    sql,
    [
      id_paciente,
      id_atendimento,
      data_pedido,
      data_resultado,
      codigo_exame,
      nome_exame,
      material,
      resultado,
      status,
      profissional,
      unidade_medida,
      vref_min,
      vref_max,
      obs,
      random,
      array_campos,
      metodo,
      id
    ], (error, results) => {
      if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    });
});

// excluir exame laboratorial solicitado.
app.get("/delete_laboratorio/:id", (req, res) => {
  const id = parseInt(req.params.id);
  var sql = "DELETE FROM atendimento_laboratorio WHERE id = $1";
  pool.query(sql, [id], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// OPÇÕES DE EXAMES LABORATORIAIS.
// listar todos os registros de opções de exames laboratoriais (tela do laboratório, configurações).
app.get("/opcoes_laboratorio", (req, res) => {
  var sql = "SELECT * FROM opcoes_laboratorio";
  pool.query(sql, (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// inserir registro de opção de laboratório.
app.post("/insert_opcao_laboratorio", (req, res) => {
  const {
    codigo_exame,
    nome_exame,
    material,
    disponivel,
    unidade_medida,
    vref_min,
    vref_max,
    obs,
    arraycampos,
    metodo,
  } = req.body;
  var sql =
    "INSERT INTO opcoes_laboratorio (codigo_exame, nome_exame, material, disponivel, unidade_medida, vref_min, vref_max, obs, array_campos, metodo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)";
  pool.query(
    sql,
    [
      codigo_exame,
      nome_exame,
      material,
      disponivel,
      unidade_medida,
      vref_min,
      vref_max,
      obs,
      arraycampos,
      metodo,
    ],
    (error, results) => {
      if (error)
        return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    }
  );
});

// atualizar registro de exame laboratorial.
app.post("/update_opcao_laboratorio/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const {
    codigo_exame,
    nome_exame,
    material,
    disponivel,
    unidade_medida,
    vref_min,
    vref_max,
    obs,
    arraycampos,
    metodo,
  } = req.body;
  var sql =
    "UPDATE opcoes_laboratorio SET codigo_exame = $1, nome_exame = $2, material = $3, disponivel = $4, unidade_medida = $5, vref_min = $6, vref_max = $7, obs = $8, array_campos = $9, metodo = $10 WHERE id = $11";
  pool.query(
    sql,
    [
      codigo_exame,
      nome_exame,
      material,
      disponivel,
      unidade_medida,
      vref_min,
      vref_max,
      obs,
      arraycampos,
      metodo,
      id
    ], (error, results) => {
      if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    });
});

// excluir exame laboratorial solicitado.
app.get("/delete_opcao_laboratorio/:id", (req, res) => {
  const id = parseInt(req.params.id);
  var sql = "DELETE FROM opcoes_laboratorio WHERE id = $1";
  pool.query(sql, [id], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// DOCUMENTOS ESTRUTURADOS:
// LISTA DE DOCUMENTOS ESTRUTURADOS.
// listar todos os registros de documentos que agrupam campos estruturados.
app.get("/documentos_estruturados/:id_paciente", (req, res) => {
  const id_paciente = parseInt(req.params.id_paciente);
  var sql = "SELECT * FROM atendimento_documentos_estruturados WHERE id_paciente = $1";
  pool.query(sql, [id_paciente], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// inserir registro de documento estruturado.
app.post("/insert_documento_estruturado", (req, res) => {
  const {
    id_paciente,
    id_atendimento,
    data,
    id_usuario,
    status,
    tipodocumento,
    id_profissional,
    conselho,
    nome_profissional
  } = req.body;
  var sql =
    "INSERT INTO atendimento_documentos_estruturados (id_paciente, id_atendimento, data, id_usuario, status, tipodocumento, id_profissional, conselho, nome_profissional) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)";
  pool.query(
    sql,
    [
      id_paciente,
      id_atendimento,
      data,
      id_usuario,
      status,
      tipodocumento,
      id_profissional,
      conselho,
      nome_profissional
    ],
    (error, results) => {
      if (error)
        return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    }
  );
});

// atualizar registro de documento estruturado.
app.post("/update_documento_estruturado/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const {
    id_paciente,
    id_atendimento,
    data,
    id_usuario,
    status,
    tipodocumento,
    id_profissional,
    conselho,
    nome_profissional
  } = req.body;
  var sql =
    "UPDATE atendimento_documentos_estruturados SET id_paciente = $1, id_atendimento = $2, data = $3, id_usuario =$4, status = $5, tipodocumento = $6, id_profissional = $7, conselho = $8, nome_profissional = $9 WHERE id = $10";
  pool.query(
    sql,
    [
      id_paciente,
      id_atendimento,
      data,
      id_usuario,
      status,
      tipodocumento,
      id_profissional,
      conselho,
      nome_profissional,
      id,
    ], (error, results) => {
      if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    });
});

// excluir exame laboratorial solicitado.
app.get("/delete_documento_estruturado/:id", (req, res) => {
  const id = parseInt(req.params.id);
  var sql = "DELETE FROM atendimento_documentos_estruturados WHERE id = $1";
  pool.query(sql, [id], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// CAMPOS ESTRUTURADOS.
app.get("/campos_estruturados/:id_documento", (req, res) => {
  const id_documento = parseInt(req.params.id_documento);
  var sql = "SELECT * FROM atendimento_campos_estruturados WHERE id_documento = $1";
  pool.query(sql, [id_documento], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// inserir registro de campo estruturado.
app.post("/insert_campo_estruturado", (req, res) => {
  const {
    id_documento,
    id_paciente,
    id_atendimento,
    data,
    valor,
    titulo,
    tipo,
    altura,
    largura,
    obrigatorio,
    tipocampo,
    opcoes,
    funcao
  } = req.body;
  var sql =
    "INSERT INTO atendimento_campos_estruturados (id_documento, id_paciente, id_atendimento, data, valor, titulo, tipo, altura, largura, obrigatorio, tipocampo, opcoes, funcao) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)";
  pool.query(
    sql,
    [
      id_documento,
      id_paciente,
      id_atendimento,
      data,
      valor,
      titulo,
      tipo,
      altura,
      largura,
      obrigatorio,
      tipocampo,
      opcoes,
      funcao
    ],
    (error, results) => {
      if (error)
        return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    }
  );
});

// atualizar registro de campo estruturado.
app.post("/update_campo_estruturado/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const {
    id_documento,
    id_paciente,
    id_atendimento,
    data,
    valor,
    titulo,
    tipo,
    altura,
    largura,
    obrigatorio,
    tipocampo,
    opcoes,
    funcao
  } = req.body;
  var sql =
    "UPDATE atendimento_campos_estruturados SET id_documento = $1, id_paciente = $2, id_atendimento = $3, data = $4, valor = $5, titulo  = $6, tipo  = $7, altura  = $8, largura  = $9, obrigatorio  = $10, tipocampo = $11, opcoes = $12, funcao = $13 WHERE id = $14";
  pool.query(
    sql,
    [
      id_documento,
      id_paciente,
      id_atendimento,
      data,
      valor,
      titulo,
      tipo,
      altura,
      largura,
      obrigatorio,
      tipocampo,
      opcoes,
      funcao,
      id
    ], (error, results) => {
      if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    });
});

// excluir campo.
app.get("/delete_campo_estruturado/:id", (req, res) => {
  const id = parseInt(req.params.id);
  var sql = "DELETE FROM atendimento_campos_estruturados WHERE id = $1";
  pool.query(sql, [id], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// ALMOXARIFADO.
// listar todos os registros de itens do almoxarifado.
app.get("/almoxarifado", (req, res) => {
  var sql = "SELECT * FROM almoxarifado";
  pool.query(sql, (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// inserir registro de opção de laboratório.
app.post("/insert_almoxarifado", (req, res) => {
  const {
    categoria,
    codigo_item,
    nome_item,
    qtde_item,
    obs,
    data_entrada,
    codigo_fornecedor,
    cnpj_fornecedor,
    codigo_compra,
    id_setor_origem,
    id_setor_destino,
    liberado,
  } = req.body;
  var sql =
    "INSERT INTO almoxarifado (categoria, codigo_item, nome_item, qtde_item, obs, data_entrada, codigo_fornecedor, cnpj_fornecedor, codigo_compra, id_setor_origem, id_setor_destino, liberado) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)";
  pool.query(
    sql,
    [
      categoria,
      codigo_item,
      nome_item,
      qtde_item,
      obs,
      data_entrada,
      codigo_fornecedor,
      cnpj_fornecedor,
      codigo_compra,
      id_setor_origem,
      id_setor_destino,
      liberado,
    ],
    (error, results) => {
      if (error)
        return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    }
  );
});

// atualizar registro de item do almoxarifado.
app.post("/update_almoxarifado/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const {
    categoria,
    codigo_item,
    nome_item,
    qtde_item,
    obs,
    data_entrada,
    codigo_fornecedor,
    cnpj_fornecedor,
    codigo_compra,
    id_setor_origem,
    id_setor_destino,
    liberado,
  } = req.body;
  var sql =
    "UPDATE almoxarifado SET categoria = $1, codigo_item = $2, nome_item = $3, qtde_item = $4, obs = $5, data_entrada = $6, codigo_fornecedor = $7, cnpj_fornecedor = $8, codigo_compra = $9, id_setor_origem = $10, id_setor_destino = $11, liberado = $12 WHERE id = $13";
  pool.query(
    sql,
    [
      categoria,
      codigo_item,
      nome_item,
      qtde_item,
      obs,
      data_entrada,
      codigo_fornecedor,
      cnpj_fornecedor,
      codigo_compra,
      id_setor_origem,
      id_setor_destino,
      liberado,
      id
    ], (error, results) => {
      if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    });
});

// excluir item de almoxarifado.
app.get("/delete_almoxarifado/:id", (req, res) => {
  const id = parseInt(req.params.id);
  var sql = "DELETE FROM almoxarifado WHERE id = $1";
  pool.query(sql, [id], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// RESULTADOS LABORATORIAIS PARA CLIENTES.
// login.
app.post("/checkpaciente", (req, res) => {
  const { id_paciente } = req.body;
  var sql = "SELECT * FROM paciente WHERE id_paciente = $1";
  pool.query(sql, [id_paciente], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// listar lista de pedidos de exames laboratoriais solicitados para um dado paciente.
app.get("/lista_laboratorio_cliente/:id_paciente", (req, res) => {
  const id_paciente = parseInt(req.params.id_paciente);
  var sql = "SELECT * FROM atendimento_lista_laboratorio WHERE id_paciente = $1";
  pool.query(sql, [id_paciente], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// listar todos os exames laboratoriais de um paciente.
app.post("/laboratorio_cliente", (req, res) => {
  const { id_paciente } = req.body;
  var sql = "SELECT * FROM atendimento_laboratorio WHERE id_paciente = $1";
  pool.query(sql, [id_paciente], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// FATURAMENTO.
// listar todas as contas de faturamento SUS (AIHs).
app.get("/load_aih", (req, res) => {
  var sql = "SELECT * FROM faturamento_sus_aih";
  pool.query(sql, (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// inserir registro de conta de faturamento SUS (AIH).
app.post("/insert_aih", (req, res) => {
  const {
    data_abertura,
    data_fechamento,
    id_paciente,
    nome_paciente,
    id_atendimento,
    numero_aih,
    cartao_sus,
    dn,
    sexo,
    nome_mae,
    nome_responsavel,
    endereco_logradouro,
    endereco_numero,
    endereco_complemento,
    endereco_bairro,
    endereco_cep,
    cod_municipio,
    telefone_paciente,
    nacionalidade,
    cor,
    etnia,
    tipo_documento_paciente,
    numero_documento_paciente,
    tipo_aih,
    apresentacao,
    orgao_emissor,
    proc_solicitado,
    proc_principal,
    mudanca_procedimento,
    modalidade,
    espec_leito,
    cid_principal,
    motivo_encerramento,
    doc_profissional_solicitante,
    doc_profissional_responsavel,
    doc_autorizador,
    data_autorizador,
    aih_anterior,
    aih_posterior,
    cnpj_empregador,
    cnaer,
    vinculo_previdencia,
    cbo_completa,
  } = req.body;
  var sql =
    "INSERT INTO faturamento_sus_aih (data_abertura, data_fechamento, id_paciente, nome_paciente, id_atendimento, numero_aih, cartao_sus, dn, sexo, nome_mae, nome_responsavel, endereco_logradouro, endereco_numero, endereco_complemento, endereco_bairro, endereco_cep, cod_municipio, telefone_paciente, nacionalidade, cor, etnia, tipo_documento_paciente, numero_documento_paciente, tipo_aih, apresentacao, orgao_emissor, proc_solicitado, proc_principal, mudanca_procedimento, modalidade, espec_leito, cid_principal, motivo_encerramento, doc_profissional_solicitante, doc_profissional_responsavel, doc_autorizador, data_autorizador, aih_anterior, aih_posterior, cnpj_empregador, cnaer, vinculo_previdencia, cbo_completa) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43)";
  pool.query(
    sql,
    [
      data_abertura,
      data_fechamento,
      id_paciente,
      nome_paciente,
      id_atendimento,
      numero_aih,
      cartao_sus,
      dn,
      sexo,
      nome_mae,
      nome_responsavel,
      endereco_logradouro,
      endereco_numero,
      endereco_complemento,
      endereco_bairro,
      endereco_cep,
      cod_municipio,
      telefone_paciente,
      nacionalidade,
      cor,
      etnia,
      tipo_documento_paciente,
      numero_documento_paciente,
      tipo_aih,
      apresentacao,
      orgao_emissor,
      proc_solicitado,
      proc_principal,
      mudanca_procedimento,
      modalidade,
      espec_leito,
      cid_principal,
      motivo_encerramento,
      doc_profissional_solicitante,
      doc_profissional_responsavel,
      doc_autorizador,
      data_autorizador,
      aih_anterior,
      aih_posterior,
      cnpj_empregador,
      cnaer,
      vinculo_previdencia,
      cbo_completa,
    ],
    (error, results) => {
      if (error) {
        console.log(error);
        return res.json({ success: false, message: "ERRO DE CONEXÃO. " + error });
      }
      res.send(results);
      return res.json(results);
    }
  );
});

// atualizar registro de conta de faturamento SUS (AIH).
app.post("/update_aih/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const {
    data_abertura,
    data_fechamento,
    id_paciente,
    nome_paciente,
    id_atendimento,
    numero_aih,
    cartao_sus,
    dn,
    sexo,
    nome_mae,
    nome_responsavel,
    endereco_logradouro,
    endereco_numero,
    endereco_complemento,
    endereco_bairro,
    endereco_cep,
    cod_municipio,
    telefone_paciente,
    nacionalidade,
    cor,
    etnia,
    tipo_documento_paciente,
    numero_documento_paciente,
    tipo_aih,
    apresentacao,
    orgao_emissor,
    proc_solicitado,
    proc_principal,
    mudanca_procedimento,
    modalidade,
    espec_leito,
    cid_principal,
    motivo_encerramento,
    doc_profissional_solicitante,
    doc_profissional_responsavel,
    doc_autorizador,
    data_autorizador,
    aih_anterior,
    aih_posterior,
    cnpj_empregador,
    cnaer,
    vinculo_previdencia,
    cbo_completa,
  } = req.body;
  var sql =
    "UPDATE faturamento_sus_aih SET data_abertura = $1, data_fechamento = $2, id_paciente = $3, nome_paciente = $4, id_atendimento = $5, numero_aih = $6, cartao_sus = $7, dn = $8, sexo = $9, nome_mae = $10, nome_responsavel = $11, endereco_logradouro = $12, endereco_numero = $13, endereco_complemento = $14, endereco_bairro = $15, endereco_cep = $16, cod_municipio = $17, telefone_paciente = $18, nacionalidade = $19, cor = $20, etnia = $21, tipo_documento_paciente = $22, numero_documento_paciente = $23, tipo_aih = $24, apresentacao = $25, orgao_emissor = $26, proc_solicitado = $27, proc_principal = $28, mudanca_procedimento = $29, modalidade = $30, espec_leito = $31, cid_principal = $32, motivo_encerramento = $33, doc_profissional_solicitante = $34, doc_profissional_responsavel = $35, doc_autorizador = $36, data_autorizador = $37, aih_anterior = $38, aih_posterior = $39, cnpj_empregador = $40, cnaer = $41, vinculo_previdencia  = $42, cbo_completa  = $43 WHERE id = $44";
  pool.query(
    sql,
    [
      data_abertura,
      data_fechamento,
      id_paciente,
      nome_paciente,
      id_atendimento,
      numero_aih,
      cartao_sus,
      dn,
      sexo,
      nome_mae,
      nome_responsavel,
      endereco_logradouro,
      endereco_numero,
      endereco_complemento,
      endereco_bairro,
      endereco_cep,
      cod_municipio,
      telefone_paciente,
      nacionalidade,
      cor,
      etnia,
      tipo_documento_paciente,
      numero_documento_paciente,
      tipo_aih,
      apresentacao,
      orgao_emissor,
      proc_solicitado,
      proc_principal,
      mudanca_procedimento,
      modalidade,
      espec_leito,
      cid_principal,
      motivo_encerramento,
      doc_profissional_solicitante,
      doc_profissional_responsavel,
      doc_autorizador,
      data_autorizador,
      aih_anterior,
      aih_posterior,
      cnpj_empregador,
      cnaer,
      vinculo_previdencia,
      cbo_completa,
      id
    ], (error, results) => {
      if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    });
});

// excluir registro de conta de faturamento SUS (AIH).
app.get("/delete_aih/:id", (req, res) => {
  const id = parseInt(req.params.id);
  var sql = "DELETE FROM faturamento_sus_aih WHERE id = $1";
  pool.query(sql, [id], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// tabela de códigos de procedimentos de internação do SUS (AIH).
app.get("/load_codigos_aih", (req, res) => {
  var sql = "SELECT * FROM faturamento_sus_tabela_aih";
  pool.query(sql, (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});
