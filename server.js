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
    "Access-Control-Allow-Methods: *",
    "Origin, X-Requested-With, Content-Type, Accept",
    "Access-Control-Allow-Origin: *"
  );
  next();
});
app.use(bodyParser.json({ limit: '500mb' }));
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: '500mb',
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
  user: "postgres",
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
    const almoxarifado = x.map((item) => item.almoxarifado).pop();
    const uf_conselho = x.map((item) => item.uf_conselho).pop();
    const codigo_cbo = x.map((item) => item.codigo_cbo).pop();
    const tarefas = x.map((item) => item.tarefas).pop();
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
      almoxarifado: almoxarifado,
      uf_conselho: uf_conselho,
      codigo_cbo: codigo_cbo,
      tarefas: tarefas,
    });
  });
});

// permitindo o acesso após a autenticação, com entrega de token (JWT).
app.post("/grant", (req, res) => {
  const id = req.body;
  const token = jwt.sign({ id }, process.env.SECRET, {
    // expiresIn: 1800, // expira em 30 minutos.
    expiresIn: 86400, // expira em 24h.
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
    const primeiro_acesso = x.map((item) => item.primeiro_acesso).pop();
    const almoxarifado = x.map((item) => item.almoxarifado).pop();
    const uf_conselho = x.map((item) => item.uf_conselho).pop();
    const codigo_cbo = x.map((item) => item.codigo_cbo).pop();
    const tarefas = x.map((item) => item.tarefas).pop();
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
        primeiro_acesso: primeiro_acesso,
        almoxarifado: almoxarifado,
        uf_conselho: uf_conselho,
        codigo_cbo: codigo_cbo,
        tarefas: tarefas,
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

// atualizar cliente (tempos de consultas e tema).
app.post("/update_cliente/:id_cliente", (req, res) => {
  const id_cliente = parseInt(req.params.id_cliente);
  const {
    nome_unidade,
    cnpj,
    cnes,
    razao_social,
    endereco,
    telefone,
    logo,
    qrcode,
    tempo_consulta_convenio,
    tempo_consulta_particular,
    email,
    tema
  } = req.body;
  var sql =
    "UPDATE cliente_hospital SET nome_cliente = $1, cnpj = $2, cnes = $3, razao_social = $4, endereco = $5, telefone = $6, logo = $7, qrcode = $8, tempo_consulta_convenio = $9, tempo_consulta_particular = $10, email = $11, tema = $12 WHERE id_cliente = $13";
  pool.query(
    sql,
    [
      nome_unidade,
      cnpj,
      cnes,
      razao_social,
      endereco,
      telefone,
      logo,
      qrcode,
      tempo_consulta_convenio,
      tempo_consulta_particular,
      email,
      tema,
      id_cliente
    ],
    (error, results) => {
      if (error)
        return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    }
  );
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
    convenio_nome,
    convenio_codigo,
    convenio_carteira,
    validade_carteira,
    nome_social,
    obs,
    nome_pai_paciente,
  } = req.body;
  var sql =
    "INSERT INTO paciente (nome_paciente, nome_mae_paciente, dn_paciente, antecedentes_pessoais, medicacoes_previas, exames_previos, exames_atuais, tipo_documento, numero_documento, cns, endereco, logradouro, bairro, localidade, uf, cep, telefone, email, nome_responsavel, sexo, nacionalidade, cor, etnia, orgao_emissor, endereco_numero, endereco_complemento, convenio_nome, convenio_codigo, convenio_carteira, validade_carteira, nome_social, obs, nome_pai_paciente) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33)";
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
      convenio_nome,
      convenio_codigo,
      convenio_carteira,
      validade_carteira,
      nome_social,
      obs,
      nome_pai_paciente,
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
    convenio_nome,
    convenio_codigo,
    convenio_carteira,
    validade_carteira,
    nome_social,
    obs,
    nome_pai_paciente,
    foto,
  } = req.body;
  var sql =
    "UPDATE paciente SET nome_paciente = $1, nome_mae_paciente = $2, dn_paciente = $3, antecedentes_pessoais = $4, medicacoes_previas = $5, exames_previos = $6, exames_atuais = $7, tipo_documento = $8, numero_documento = $9, cns = $10, endereco = $11, logradouro = $12, bairro = $13, localidade = $14, uf = $15, cep = $16, telefone = $17, email = $18, nome_responsavel = $19, sexo = $20, nacionalidade = $21, cor = $22, etnia = $23, orgao_emissor = $24, endereco_numero = $25, endereco_complemento = $26, convenio_nome = $27, convenio_codigo = $28, convenio_carteira = $29, validade_carteira = $30, nome_social = $31, obs = $32, nome_pai_paciente = $33, foto = $34 WHERE id_paciente = $35";
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
      convenio_nome,
      convenio_codigo,
      convenio_carteira,
      validade_carteira,
      nome_social,
      obs,
      nome_pai_paciente,
      foto,
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

// listar todos os atendimentos do paciente selecionado.
app.get("/list_atendimentos_profissional/:id_profissional", verifyJWT, (req, res) => {
  const id_profissional = parseInt(req.params.id_profissional);
  var sql =
    "SELECT * FROM atendimento WHERE id_profissional = $1 AND data_termino IS NULL";
  pool.query(sql, [id_profissional], (error, results) => {
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
    id_profissional,
    convenio_id,
    convenio_carteira,
    faturamento_codigo_procedimento,
  } = req.body;
  var sql =
    "INSERT INTO atendimento (data_inicio, data_termino, problemas, id_paciente, id_unidade, nome_paciente, leito, situacao, id_cliente, classificacao, id_profissional, convenio_id, convenio_carteira, faturamento_codigo_procedimento) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)";
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
      id_profissional,
      convenio_id,
      convenio_carteira,
      faturamento_codigo_procedimento,
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
    id_profissional,
    convenio_id,
    convenio_carteira,
    faturamento_codigo_procedimento,
  } = req.body;
  var sql =
    "INSERT INTO atendimento (data_inicio, data_termino, problemas, id_paciente, id_unidade, nome_paciente, leito, situacao, id_cliente, classificacao, id_profissional, convenio_id, convenio_carteira, faturamento_codigo_procedimento) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)";
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
      id_profissional,
      convenio_id,
      convenio_carteira,
      faturamento_codigo_procedimento,
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
    classificacao,
    id_profissional,
    convenio_id,
    convenio_carteira,
    faturamento_codigo_procedimento,
  } = req.body;
  var sql =
    "UPDATE atendimento SET data_inicio = $1, data_termino = $2, problemas = $3, id_paciente = $4, id_unidade = $5, nome_paciente = $6, leito = $7, situacao = $8, id_cliente = $9, classificacao = $10, id_profissional = $11, convenio_id = $12, convenio_carteira = $13, faturamento_codigo_procedimento  = $14 WHERE id_atendimento = $15";
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
      id_profissional,
      convenio_id,
      convenio_carteira,
      faturamento_codigo_procedimento,
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

// listar todas as evoluções do cliente logado.
app.get("/list_evolucoes_cliente/:id_profissional", (req, res) => {
  const id_profissional = parseInt(req.params.id_profissional);
  var sql = "SELECT * FROM atendimento_documentos WHERE id_profissional = $1";
  pool.query(sql, [id_profissional], (error, results) => {
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

app.get("/allatendimentosfull/:cliente", (req, res) => {
  const cliente = parseInt(req.params.cliente);
  var sql =
    "SELECT * FROM atendimento WHERE id_cliente = $1";
  pool.query(sql, [cliente], (error, results) => {
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
    administrativo,
    prontuario,
    primeiro_acesso,
    uf_conselho,
    codigo_cbo,
    tarefas
  } = req.body;
  var sql =
    "INSERT INTO usuarios (nome_usuario, dn_usuario, cpf_usuario, contato_usuario, senha, login, conselho, n_conselho, tipo_usuario, administrativo, prontuario, primeiro_acesso, uf_conselho, codigo_cbo, tarefas) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)";
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
      administrativo,
      prontuario,
      primeiro_acesso,
      uf_conselho,
      codigo_cbo,
      tarefas
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
    administrativo,
    prontuario,
    primeiro_acesso,
    uf_conselho,
    codigo_cbo,
    tarefas
  } = req.body;
  var sql =
    "UPDATE usuarios SET nome_usuario = $1, dn_usuario = $2, cpf_usuario = $3, contato_usuario = $4, senha = $5, login = $6, conselho = $7, n_conselho = $8, tipo_usuario = $9, administrativo = $10, prontuario = $11, primeiro_acesso = $12, uf_conselho = $13, codigo_cbo = $14, tarefas = $15 WHERE id_usuario = $16";
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
      administrativo,
      prontuario,
      primeiro_acesso,
      uf_conselho,
      codigo_cbo,
      tarefas,
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

/*
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
*/

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

app.get("/list_documentos_idpct/:id_paciente", (req, res) => {
  const id_paciente = parseInt(req.params.id_paciente);
  var sql = "SELECT * FROM atendimento_documentos WHERE id_paciente = $1";
  pool.query(sql, [id_paciente], (error, results) => {
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
    base64,
    cms,
  } = req.body;
  var sql =
    "INSERT INTO atendimento_documentos (id_paciente, nome_paciente, id_atendimento, data, texto, status, tipo_documento, profissional, conselho, id_profissional, base64, cms) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)";
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
      base64,
      cms,
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
    id_profissional,
    base64,
    cms,
  } = req.body;
  var sql =
    "UPDATE atendimento_documentos SET id_paciente = $1, nome_paciente = $2, id_atendimento = $3, data = $4, texto = $5, status = $6, tipo_documento = $7, profissional = $8, conselho = $9, id_profissional = $10, base64 = $11, cms = $12 WHERE id = $13";
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
      base64,
      cms,
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

// endpoint para baixar cms de documento assinado eletronicamente.
app.get("/baixar_p7s", async (req, res) => {
  const { id } = req.query;

  // selecionando no banco de dados o documento que armazena o cms.
  var sql = "SELECT * FROM atendimento_documentos WHERE id = $1";
  pool.query(sql, [id], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    console.log(results);
    // criando o documento p7s para retornar ao front via url pública.
    let cms = results.rows.map(item => item.cms).pop();
    const buffer = Buffer.from(cms, "base64");
    res.setHeader("Content-Type", "application/pkcs7-signature");
    res.setHeader("Content-Disposition", `attachment; filename="${id}.p7s"`);
    return res.send(buffer);
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
app.get("/lista_laboratorio_atendimento/:id_atendimento", (req, res) => {
  const id_atendimento = req.params.id_atendimento;
  var sql = "SELECT * FROM atendimento_lista_laboratorio WHERE id_atendimento = $1";
  pool.query(sql, [id_atendimento], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// listar exames laboratoriais solicitados para um dado atendimento.
app.get("/lista_laboratorio/:id_paciente", (req, res) => {
  const id_paciente = req.params.id_paciente;
  var sql = "SELECT * FROM atendimento_lista_laboratorio WHERE id_paciente = $1";
  pool.query(sql, [id_paciente], (error, results) => {
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
    data_pedido,
    justificativa,
  } = req.body;
  var sql =
    "INSERT INTO atendimento_lista_laboratorio (id_paciente, id_atendimento, data, status, id_profissional, nome_profissional, registro_profissional, random, urgente, data_pedido, justificativa) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)";
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
      data_pedido,
      justificativa,
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
    data_pedido,
    justificativa,
  } = req.body;
  var sql =
    "UPDATE atendimento_lista_laboratorio SET id_paciente = $1, id_atendimento = $2, data = $3, status = $4, id_profissional = $5, nome_profissional = $6, registro_profissional = $7, random = $8, urgente = $9, data_pedido = $10, justificativa = $11 WHERE id = $12";
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
      data_pedido,
      justificativa,
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

// listar exames laboratoriais solicitados (pela id do paciente).
app.get("/atendimento_laboratorio_idpaciente/:id_paciente", (req, res) => {
  const id_paciente = req.params.id_paciente;
  var sql = "SELECT * FROM atendimento_laboratorio WHERE id_paciente = $1";
  pool.query(sql, [id_paciente], (error, results) => {
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

// FINANCEIRO
// listar todas os lançamentos financeiros.
app.get("/all_financeiro", (req, res) => {
  var sql = "SELECT * FROM financeiro";
  pool.query(sql, (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// inserir registro de conta de faturamento SUS (AIH).
app.post("/insert_financeiro", (req, res) => {
  const {
    tipo,
    recorrencia,
    pessoa_fisica,
    pessoa_juridica,
    cpf,
    cnpj,
    valor,
    status,
    telefone,
    e_mail,
    observacoes,
    imagem,
    data_vencimento,
    data_recebimento,
    data_pagamento,
  } = req.body;
  var sql =
    "INSERT INTO financeiro (tipo, recorrencia, pessoa_fisica, pessoa_juridica, cpf, cnpj, valor, status, telefone, e_mail, observacoes, imagem, data_vencimento, data_recebimento, data_pagamento) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)";
  pool.query(
    sql,
    [
      tipo,
      recorrencia,
      pessoa_fisica,
      pessoa_juridica,
      cpf,
      cnpj,
      valor,
      status,
      telefone,
      e_mail,
      observacoes,
      imagem,
      data_vencimento,
      data_recebimento,
      data_pagamento,
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

// atualizar registro financeiro.
app.post("/update_financeiro/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const {
    tipo,
    recorrencia,
    pessoa_fisica,
    pessoa_juridica,
    cpf,
    cnpj,
    valor,
    status,
    telefone,
    e_mail,
    observacoes,
    imagem,
    data_vencimento,
    data_recebimento,
    data_pagamento,
  } = req.body;
  var sql =
    "UPDATE financeiro SET tipo = $1, recorrencia = $2, pessoa_fisica = $3, pessoa_juridica = $4, cpf = $5, cnpj = $6, valor = $7, status = $8, telefone = $9, e_mail = $10, observacoes = $11, imagem = $12, data_vencimento = $13, data_recebimento = $14, data_pagamento = $15  WHERE id = $16";
  pool.query(
    sql,
    [
      tipo,
      recorrencia,
      pessoa_fisica,
      pessoa_juridica,
      cpf,
      cnpj,
      valor,
      status,
      telefone,
      e_mail,
      observacoes,
      imagem,
      data_vencimento,
      data_recebimento,
      data_pagamento,
      id
    ], (error, results) => {
      if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    });
});

// excluir registro financeiro.
app.get("/delete_financeiro/:id", (req, res) => {
  const id = parseInt(req.params.id);
  var sql = "DELETE FROM financeiro WHERE id = $1";
  pool.query(sql, [id], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// FATURAMENTO CONVÊNIOS (ANS)
// GUIA TISS CONSULTA

// FATURAMENTO - CADASTRO DE OPERADORAS.
app.get("/all_operadoras", (req, res) => {
  var sql = "SELECT * FROM faturamento_ans_1_operadoras";
  pool.query(sql, (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// inserir registro de operadora de saúde.
app.post("/insert_operadora", (req, res) => {
  const {
    nome_operadora,
    registro_ans,
    telefone,
    email,
    codigo_prestador,
    logo_operadora,
    id_cliente,
  } = req.body;
  var sql =
    "INSERT INTO faturamento_ans_1_operadoras (nome_operadora, registro_ans, telefone, email, codigo_prestador, logo_operadora, id_cliente) VALUES ($1, $2, $3, $4, $5, $6, $7)";
  pool.query(
    sql,
    [
      nome_operadora,
      registro_ans,
      telefone,
      email,
      codigo_prestador,
      logo_operadora,
      id_cliente,
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

// atualizar registro de operadora.
app.post("/update_operadora/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const {
    nome_operadora,
    registro_ans,
    telefone,
    email,
    codigo_prestador,
    logo_operadora,
    id_cliente,
  } = req.body;
  var sql =
    "UPDATE faturamento_ans_1_operadoras SET nome_operadora = $1, registro_ans = $2, telefone = $3, email = $4, codigo_prestador = $5, logo_operadora = $6, id_cliente = $7 WHERE id = $8";
  pool.query(
    sql,
    [
      nome_operadora,
      registro_ans,
      telefone,
      email,
      codigo_prestador,
      logo_operadora,
      id_cliente,
      id
    ], (error, results) => {
      if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    });
});

// excluir registro de operadora.
app.get("/delete_operadora/:id", (req, res) => {
  const id = parseInt(req.params.id);
  var sql = "DELETE FROM faturamento_ans_1_operadoras WHERE id = $1";
  pool.query(sql, [id], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// FATURAMENTO - CADASTRO DE PROCEDIMENTOS PARA AS OPERADORAS (COM VALOR PARA ATENDIMENTO PARTICULAR).
app.get("/all_procedimentos", (req, res) => {
  var sql = "SELECT * FROM faturamento_ans_2_operadoras_x_procedimentos";
  pool.query(sql, (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// inserir registro de procedimento para operadora de saúde.
app.post("/insert_procedimento", (req, res) => {
  const {
    id_operadora,
    nome_operadora,
    tuss_codigo,
    tuss_terminologia,
    tuss_rol_ans,
    tuss_rol_ans_descricao,
    valor,
    fator_aumento,
    fator_reducao,
    valor_absoluto_aumento,
    valor_absoluto_reducao,
    obs,
    id_cliente,
    valor_part
  } = req.body;
  var sql =
    "INSERT INTO faturamento_ans_2_operadoras_x_procedimentos (id_operadora, nome_operadora, tuss_codigo, tuss_terminologia, tuss_rol_ans, tuss_rol_ans_descricao, valor, fator_aumento, fator_reducao, valor_absoluto_aumento, valor_absoluto_reducao, obs, id_cliente, valor_part) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)";
  pool.query(
    sql,
    [
      id_operadora,
      nome_operadora,
      tuss_codigo,
      tuss_terminologia,
      tuss_rol_ans,
      tuss_rol_ans_descricao,
      valor,
      fator_aumento,
      fator_reducao,
      valor_absoluto_aumento,
      valor_absoluto_reducao,
      obs,
      id_cliente,
      valor_part
    ],
    (error, results) => {
      if (error) {
        console.log(error);
        return res.json({ success: false, message: "ERRO DE CONEXÃO. " + error });
      }
      res.send(results);
      // return res.json(results);
    }
  );
});

// atualizar registro de procedimento para operadora de saúde.
app.post("/update_procedimento/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const {
    id_operadora,
    nome_operadora,
    tuss_codigo,
    tuss_terminologia,
    tuss_rol_ans,
    tuss_rol_ans_descricao,
    valor,
    fator_aumento,
    fator_reducao,
    valor_absoluto_aumento,
    valor_absoluto_reducao,
    obs,
    id_cliente,
    valor_part
  } = req.body;
  var sql =
    "UPDATE faturamento_ans_2_operadoras_x_procedimentos SET id_operadora =$1, nome_operadora = $2, tuss_codigo = $3, tuss_terminologia = $4, tuss_rol_ans  = $5, tuss_rol_ans_descricao = $6, valor = $7, fator_aumento = $8, fator_reducao = $9, valor_absoluto_aumento = $10, valor_absoluto_reducao = $11, obs = $12, id_cliente = $13, valor_part = $14 WHERE id = $15";
  pool.query(
    sql,
    [
      id_operadora,
      nome_operadora,
      tuss_codigo,
      tuss_terminologia,
      tuss_rol_ans,
      tuss_rol_ans_descricao,
      valor,
      fator_aumento,
      fator_reducao,
      valor_absoluto_aumento,
      valor_absoluto_reducao,
      obs,
      id_cliente,
      valor_part,
      id
    ], (error, results) => {
      if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    });
});

// excluir registro de operadora.
app.get("/delete_procedimento/:id", (req, res) => {
  const id = parseInt(req.params.id);
  var sql = "DELETE FROM faturamento_ans_2_operadoras_x_procedimentos WHERE id = $1";
  pool.query(sql, [id], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// carregar tabela TUSS.
app.get("/all_tabela_tuss", (req, res) => {
  var sql = "SELECT * FROM faturamento_ans_0_tabela_tuss";
  pool.query(sql, (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// FATURAMENTO - CADASTRO DE GUIAS TISS - CONSULTA.
app.get("/all_guia_consulta", (req, res) => {
  var sql = "SELECT * FROM faturamento_ans_3_guia_consulta";
  pool.query(sql, (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// inserir registro de guia de consulta TISS.
app.post("/insert_guia_consulta", (req, res) => {
  const {
    id_paciente,
    id_atendimento,
    data,
    tipo_guia,
    xml,
    campo1_registro_ans,
    campo2_numero_guia_prestador,
    campo3_numero_guia_operadora,
    campo4_numero_carteira,
    campo5_validade_carteira,
    campo6_atendimento_rn,
    campo26_nome_social,
    campo7_nome_beneficiario,
    campo9_codigo_prestador,
    campo10_nome_prestador,
    campo11_codigo_cnes_prestador,
    campo12_nome_profissional_executante,
    campo13_conselho_profissional,
    campo14_numero_conselho,
    campo15_uf_conselho,
    campo16_codigo_cbo,
    campo17_indicacao_acidente,
    campo27_cobertura_especial,
    campo28_regime_atendimento,
    campo29_saude_ocupacional,
    campo18_data_atendimento,
    campo19_tipo_consulta,
    campo20_tabela,
    campo21_codigo_procedimento,
    campo22_valor_procedimento,
    campo23_observacao_justificativa,
    campo24_assinatura_profissional_executante,
    campo25_assinatura_beneficiario,
  } = req.body;
  var sql =
    "INSERT INTO faturamento_ans_3_guia_consulta (id_paciente, id_atendimento, data, tipo_guia, xml, campo1_registro_ans, campo2_numero_guia_prestador, campo3_numero_guia_operadora, campo4_numero_carteira, campo5_validade_carteira, campo6_atendimento_rn, campo26_nome_social, campo7_nome_beneficiario, campo9_codigo_prestador, campo10_nome_prestador, campo11_codigo_cnes_prestador, campo12_nome_profissional_executante, campo13_conselho_profissional, campo14_numero_conselho, campo15_uf_conselho, campo16_codigo_cbo, campo17_indicacao_acidente, campo27_cobertura_especial, campo28_regime_atendimento, campo29_saude_ocupacional, campo18_data_atendimento, campo19_tipo_consulta, campo20_tabela, campo21_codigo_procedimento, campo22_valor_procedimento, campo23_observacao_justificativa, campo24_assinatura_profissional_executante, campo25_assinatura_beneficiario) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33)";
  pool.query(
    sql,
    [
      id_paciente,
      id_atendimento,
      data,
      tipo_guia,
      xml,
      campo1_registro_ans,
      campo2_numero_guia_prestador,
      campo3_numero_guia_operadora,
      campo4_numero_carteira,
      campo5_validade_carteira,
      campo6_atendimento_rn,
      campo26_nome_social,
      campo7_nome_beneficiario,
      campo9_codigo_prestador,
      campo10_nome_prestador,
      campo11_codigo_cnes_prestador,
      campo12_nome_profissional_executante,
      campo13_conselho_profissional,
      campo14_numero_conselho,
      campo15_uf_conselho,
      campo16_codigo_cbo,
      campo17_indicacao_acidente,
      campo27_cobertura_especial,
      campo28_regime_atendimento,
      campo29_saude_ocupacional,
      campo18_data_atendimento,
      campo19_tipo_consulta,
      campo20_tabela,
      campo21_codigo_procedimento,
      campo22_valor_procedimento,
      campo23_observacao_justificativa,
      campo24_assinatura_profissional_executante,
      campo25_assinatura_beneficiario,
    ],
    (error, results) => {
      if (error)
        return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    }
  );
});

// atualizar registro de guia de consulta TISS.
app.post("/update_guia_consulta/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const {
    id_paciente,
    id_atendimento,
    data,
    tipo_guia,
    xml,
    campo1_registro_ans,
    campo2_numero_guia_prestador,
    campo3_numero_guia_operadora,
    campo4_numero_carteira,
    campo5_validade_carteira,
    campo6_atendimento_rn,
    campo26_nome_social,
    campo7_nome_beneficiario,
    campo9_codigo_prestador,
    campo10_nome_prestador,
    campo11_codigo_cnes_prestador,
    campo12_nome_profissional_executante,
    campo13_conselho_profissional,
    campo14_numero_conselho,
    campo15_uf_conselho,
    campo16_codigo_cbo,
    campo17_indicacao_acidente,
    campo27_cobertura_especial,
    campo28_regime_atendimento,
    campo29_saude_ocupacional,
    campo18_data_atendimento,
    campo19_tipo_consulta,
    campo20_tabela,
    campo21_codigo_procedimento,
    campo22_valor_procedimento,
    campo23_observacao_justificativa,
    campo24_assinatura_profissional_executante,
    campo25_assinatura_beneficiario,
  } = req.body;
  var sql =
    "UPDATE faturamento_ans_3_guia_consulta SET id_paciente =$1, id_atendimento = $2, data = $3, tipo_guia = $4, xml  = $5, campo1_registro_ans = $6, campo2_numero_guia_prestador = $7, campo3_numero_guia_operadora = $8, campo4_numero_carteira = $9, campo5_validade_carteira = $10, campo6_atendimento_rn = $11, campo26_nome_social = $12, campo7_nome_beneficiario = $13, campo9_codigo_prestador = $14, campo10_nome_prestador = $15, campo11_codigo_cnes_prestador = $16, campo12_nome_profissional_executante = $17, campo13_conselho_profissional = $18, campo14_numero_conselho = $19, campo15_uf_conselho = $20, campo16_codigo_cbo = $21, campo17_indicacao_acidente = $22, campo27_cobertura_especial = $23, campo28_regime_atendimento = $24, campo29_saude_ocupacional = $25, campo18_data_atendimento = $26, campo19_tipo_consulta = $27, campo20_tabela = $28, campo21_codigo_procedimento = $29, campo22_valor_procedimento = $30, campo23_observacao_justificativa = $31, campo24_assinatura_profissional_executante = $32, campo25_assinatura_beneficiario = $33 WHERE id = $34";
  pool.query(
    sql,
    [
      id_paciente,
      id_atendimento,
      data,
      tipo_guia,
      xml,
      campo1_registro_ans,
      campo2_numero_guia_prestador,
      campo3_numero_guia_operadora,
      campo4_numero_carteira,
      campo5_validade_carteira,
      campo6_atendimento_rn,
      campo26_nome_social,
      campo7_nome_beneficiario,
      campo9_codigo_prestador,
      campo10_nome_prestador,
      campo11_codigo_cnes_prestador,
      campo12_nome_profissional_executante,
      campo13_conselho_profissional,
      campo14_numero_conselho,
      campo15_uf_conselho,
      campo16_codigo_cbo,
      campo17_indicacao_acidente,
      campo27_cobertura_especial,
      campo28_regime_atendimento,
      campo29_saude_ocupacional,
      campo18_data_atendimento,
      campo19_tipo_consulta,
      campo20_tabela,
      campo21_codigo_procedimento,
      campo22_valor_procedimento,
      campo23_observacao_justificativa,
      campo24_assinatura_profissional_executante,
      campo25_assinatura_beneficiario,
      id
    ], (error, results) => {
      if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    });
});

// excluir registro de guia de consulta TISS.
app.get("/delete_guia_consulta/:id", (req, res) => {
  const id = parseInt(req.params.id);
  var sql = "DELETE FROM faturamento_ans_3_guia_consulta WHERE id = $1";
  pool.query(sql, [id], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// MODELOS DE PEDIDOS DE EXAMES (PROCEDIMENTOS SADT-TISS).
// listar todos os modelos de pacotes de exames.
app.get("/list_modelos_exames", verifyJWT, (req, res) => {
  var sql = "SELECT * FROM modelos_laboratorio";
  pool.query(sql, (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// inserir modelo de pacote de exames..
app.post("/insert_modelo_exame", (req, res) => {
  const {
    profissional,
    random,
    nome_modelo,
  } = req.body;
  var sql =
    "INSERT INTO modelos_laboratorio (profissional, random, nome_modelo) VALUES ($1, $2, $3)";
  pool.query(
    sql,
    [
      profissional,
      random,
      nome_modelo,
    ],
    (error, results) => {
      if (error)
        return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    }
  );
});

// excluir modelo de pacote de exames.
app.get("/delete_modelo_exame/:id", (req, res) => {
  const id = parseInt(req.params.id);
  var sql = "DELETE FROM modelos_laboratorio WHERE id = $1";
  pool.query(sql, [id], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// EXAMES (PROCEDIMENTOS SADT-TISS) REGISTRADOS COMO MODELOS.
// listar todos os modelos de exames.
app.get("/list_modelos_exames_itens", verifyJWT, (req, res) => {
  var sql = "SELECT * FROM modelos_laboratorio_itens";
  pool.query(sql, (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// inserir modelo de pacote de exames..
app.post("/insert_modelo_exame_item", (req, res) => {
  const {
    codigo_exame,
    nome_exame,
    random,
  } = req.body;
  var sql =
    "INSERT INTO modelos_laboratorio_itens (codigo_exame, nome_exame, random) VALUES ($1, $2, $3)";
  pool.query(
    sql,
    [
      codigo_exame,
      nome_exame,
      random,
    ],
    (error, results) => {
      if (error)
        return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    }
  );
});

// excluir modelo de pacote de exames.
app.get("/delete_modelo_exame_item/:id", (req, res) => {
  const id = parseInt(req.params.id);
  var sql = "DELETE FROM modelos_laboratorio_itens WHERE id = $1";
  pool.query(sql, [id], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// AGENDA SEMANAL DE CONSULTAS.
// listar todos os esquemas de agenda.
app.get("/list_agenda", verifyJWT, (req, res) => {
  var sql = "SELECT * FROM usuarios_agenda";
  pool.query(sql, (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// inserir modelo de pacote de exames..
app.post("/insert_usuario_agenda", (req, res) => {
  const {
    id_usuario,
    nome_usuario,
    dia_semana,
    hora_inicio,
    hora_termino,
    id_cliente,
    tag,
  } = req.body;
  var sql =
    "INSERT INTO usuarios_agenda (id_usuario, nome_usuario, dia_semana, hora_inicio, hora_termino, id_cliente, tag) VALUES ($1, $2, $3, $4, $5, $6, $7)";
  pool.query(
    sql,
    [
      id_usuario,
      nome_usuario,
      dia_semana,
      hora_inicio,
      hora_termino,
      id_cliente,
      tag,
    ],
    (error, results) => {
      if (error)
        return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    }
  );
});

// excluir modelo de pacote de exames.
app.get("/delete_usuario_agenda/:id", (req, res) => {
  const id = parseInt(req.params.id);
  var sql = "DELETE FROM usuarios_agenda WHERE id = $1";
  pool.query(sql, [id], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});


// TABELA DE MEDICAMENTOS PARA RECEITA INTELIGENTE
// listar todos os esquemas de agenda.
app.get("/list_medicamentos", (req, res) => {
  var sql = "SELECT * FROM receita_medicamentos";
  pool.query(sql, (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// MODELOS DE ITENS DE RECEITA DOS CLIENTES.
// listar todos os modelos de itens de receita de um cliente.
app.get("/list_modelos_medicamentos/:id_usuario", (req, res) => {
  const id_usuario = parseInt(req.params.id_usuario);
  var sql = "SELECT * FROM receita_modelos_medicamentos WHERE id_usuario = $1";
  pool.query(sql, [id_usuario], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// inserir modelo de item de receita para um cliente.
app.post("/insert_modelo_medicamento", (req, res) => {
  const {
    id_usuario,
    substancia,
    laboratorio,
    produto,
    apresentacao,
    preco1,
    preco2,
    posologia,
    quantidade,
  } = req.body;
  var sql =
    "INSERT INTO receita_modelos_medicamentos (id_usuario, substancia, laboratorio, produto, apresentacao, preco1, preco2, posologia, quantidade) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)";
  pool.query(
    sql,
    [
      id_usuario,
      substancia,
      laboratorio,
      produto,
      apresentacao,
      preco1,
      preco2,
      posologia,
      quantidade,
    ],
    (error, results) => {
      if (error)
        return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    }
  );
});

// atualizar modelo de item de receita.
app.post("/update_modelo_medicamento/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const {
    id_usuario,
    substancia,
    laboratorio,
    produto,
    apresentacao,
    preco1,
    preco2,
    posologia,
    quantidade,
  } = req.body;
  var sql =
    "UPDATE receita_modelos_medicamentos SET id_usuario = $1, substancia = $2, laboratorio = $3, produto = $4, apresentacao = $5, preco1 = $6 preco2 = $7, posologia =$8, quantidade = $9 WHERE id = $10";
  pool.query(
    sql,
    [
      id_usuario,
      substancia,
      laboratorio,
      produto,
      apresentacao,
      preco1,
      preco2,
      posologia,
      quantidade,
      id
    ], (error, results) => {
      if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    });
});

// excluir modelo de item de receita.
app.get("/delete_modelo_medicamento/:id", (req, res) => {
  const id = parseInt(req.params.id);
  var sql = "DELETE FROM receita_modelos_medicamentos WHERE id = $1";
  pool.query(sql, [id], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// ## FATURAMENTO CLÍNICAS ## //
// listar os procedimentos realizados pelo cliente.
app.get("/list_faturamento_clinicas_procedimentos/:id_cliente", (req, res) => {
  const id_cliente = parseInt(req.params.id_cliente);
  var sql = "SELECT * FROM faturamento_clinicas_procedimentos WHERE id_cliente = $1";
  pool.query(sql, [id_cliente], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// inserir procedimento realizado pela clínica.
app.post("/insert_faturamento_clinicas_procedimentos", (req, res) => {
  const {
    id_cliente,
    nome_cliente,
    id_procedimento,
    nome_procedimento,
    codigo_tuss,
    valor_convenio,
    valor_particular
  } = req.body;
  var sql =
    "INSERT INTO faturamento_clinicas_procedimentos (id_cliente, nome_cliente, id_procedimento, nome_procedimento, codigo_tuss, valor_convenio, valor_particular) VALUES ($1, $2, $3, $4, $5, $6, $7)";
  pool.query(
    sql,
    [
      id_cliente,
      nome_cliente,
      id_procedimento,
      nome_procedimento,
      codigo_tuss,
      valor_convenio,
      valor_particular
    ],
    (error, results) => {
      if (error)
        return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    }
  );
});

// atualizar procedimento realizado pela clínica.
app.post("/update_faturamento_clinicas_procedimentos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const {
    id_cliente,
    nome_cliente,
    id_procedimento,
    nome_procedimento,
    codigo_tuss,
    valor_convenio,
    valor_particular
  } = req.body;
  var sql =
    "UPDATE faturamento_clinicas_procedimentos SET id_cliente = $1, nome_cliente = $2, id_procedimento = $3, nome_procedimento = $4, codigo_tuss = $5, valor_convenio = $6, valor_particular = $7 WHERE id = $8";
  pool.query(
    sql,
    [
      id_cliente,
      nome_cliente,
      id_procedimento,
      nome_procedimento,
      codigo_tuss,
      valor_convenio,
      valor_particular,
      id
    ], (error, results) => {
      if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    });
});

// excluir procedimento realizado pela clínica.
app.get("/delete_faturamento_clinicas_procedimentos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  var sql = "DELETE FROM faturamento_clinicas_procedimentos WHERE id = $1";
  pool.query(sql, [id], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// ## AGENDAMENTO DE EXAMES E PROCEDIMENTOS ## //
// listar os exames e procedimentos registrados.
app.get("/list_exames_clinicas/:id_cliente", (req, res) => {
  const id_cliente = parseInt(req.params.id_cliente);
  var sql = "SELECT * FROM atendimento_exames WHERE id_cliente = $1";
  pool.query(sql, [id_cliente], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// inserir procedimento ou exame.
app.post("/insert_exames_clinicas", (req, res) => {
  const {
    id_exame,
    nome_exame,
    codigo_tuss,
    particular,
    convenio,
    codigo_operadora,
    id_paciente,
    nome_paciente,
    dn_paciente,
    id_profissional_executante,
    nome_profissional_executante,
    conselho_profissional_executante,
    n_conselho_profissional_executante,
    status,
    laudohtml,
    id_cliente,
    data_exame,
  } = req.body;
  var sql =
    "INSERT INTO atendimento_exames (id_exame, nome_exame, codigo_tuss, particular, convenio, codigo_operadora, id_paciente, nome_paciente, dn_paciente, id_profissional_executante, nome_profissional_executante, conselho_profissional_executante, n_conselho_profissional_executante, status, laudohtml, id_cliente, data_exame) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)";
  pool.query(
    sql,
    [
      id_exame,
      nome_exame,
      codigo_tuss,
      particular,
      convenio,
      codigo_operadora,
      id_paciente,
      nome_paciente,
      dn_paciente,
      id_profissional_executante,
      nome_profissional_executante,
      conselho_profissional_executante,
      n_conselho_profissional_executante,
      status,
      laudohtml,
      id_cliente,
      data_exame,
    ],
    (error, results) => {
      if (error)
        return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    }
  );
});

// atualizar procedimento ou exame.
app.post("/update_exames_clinicas/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const {
    id_exame,
    nome_exame,
    codigo_tuss,
    particular,
    convenio,
    codigo_operadora,
    id_paciente,
    nome_paciente,
    dn_paciente,
    id_profissional_executante,
    nome_profissional_executante,
    conselho_profissional_executante,
    n_conselho_profissional_executante,
    status,
    laudohtml,
    id_cliente,
    data_exame,
  } = req.body;
  var sql =
    "UPDATE atendimento_exames SET id_exame = $1, nome_exame = $2, codigo_tuss = $3, particular = $4, convenio = $5, codigo_operadora = $6, id_paciente = $7, nome_paciente = $8, dn_paciente = $9, id_profissional_executante = $10, nome_profissional_executante = $11, conselho_profissional_executante = $12, n_conselho_profissional_executante = $13, status = $14, laudohtml = $15, id_cliente = $16, data_exame = $17 WHERE id = $18";
  pool.query(
    sql,
    [
      id_exame,
      nome_exame,
      codigo_tuss,
      particular,
      convenio,
      codigo_operadora,
      id_paciente,
      nome_paciente,
      dn_paciente,
      id_profissional_executante,
      nome_profissional_executante,
      conselho_profissional_executante,
      n_conselho_profissional_executante,
      status,
      laudohtml,
      id_cliente,
      data_exame,
      id
    ], (error, results) => {
      if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    });
});

// excluir procedimento ou exame.
app.get("/delete_exames_clinicas/:id", (req, res) => {
  const id = parseInt(req.params.id);
  var sql = "DELETE FROM atendimento_exames WHERE id = $1";
  pool.query(sql, [id], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// ## AGENDA DE PROFISSIONAIS PARA REALZIAÇÃO DE EXAMES DE IMAGEM/PROCEDIMENTOS ## //
// listar as agendas cadastradas para um cliente.
app.get("/list_agenda_exames/:id_cliente", (req, res) => {
  const id_cliente = parseInt(req.params.id_cliente);
  var sql = "SELECT * FROM usuarios_agenda_exames WHERE id_cliente = $1";
  pool.query(sql, [id_cliente], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// inserir agenda para exame/procedimento.
app.post("/insert_agenda_exame", (req, res) => {
  const {
    id_cliente,
    id_usuario,
    id_nome_usuario,
    exame,
    dia_semana,
    hora_inicio,
    codigo_tuss,
  } = req.body;
  var sql =
    "INSERT INTO usuarios_agenda_exames (id_cliente, id_usuario, id_nome_usuario, exame, dia_semana, hora_inicio, codigo_tuss) VALUES ($1, $2, $3, $4, $5, $6, $7)";
  pool.query(
    sql,
    [
      id_cliente,
      id_usuario,
      id_nome_usuario,
      exame,
      dia_semana,
      hora_inicio,
      codigo_tuss,
    ],
    (error, results) => {
      if (error)
        return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    }
  );
});

// atualizar procedimento ou exame.
app.post("/update_agenda_exame/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const {
    id_cliente,
    id_usuario,
    id_nome_usuario,
    exame,
    dia_semana,
    hora_inicio,
    codigo_tuss,
  } = req.body;
  var sql =
    "UPDATE usuarios_agenda_exames SET id_cliente = $1, id_usuario = $2, id_nome_usuario = $3, exame = $4, dia_semana = $5, hora_inicio = $6, codigo_tuss = $7 WHERE id = $8";
  pool.query(
    sql,
    [
      id_cliente,
      id_usuario,
      id_nome_usuario,
      exame,
      dia_semana,
      hora_inicio,
      codigo_tuss,
      id
    ], (error, results) => {
      if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    });
});

// excluir procedimento ou exame.
app.get("/delete_agenda_exame/:id", (req, res) => {
  const id = parseInt(req.params.id);
  var sql = "DELETE FROM usuarios_agenda_exames WHERE id = $1";
  pool.query(sql, [id], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// ## FATURAMENTO DE ATENDIMENTOS (CONSULTAS), EXAMES E PROCEDIMENTOS ## //
// listar os registros de faturamento.
app.get("/list_faturamento_clinicas/:id_cliente", (req, res) => {
  const id_cliente = parseInt(req.params.id_cliente);
  var sql = "SELECT * FROM faturamento_clinicas WHERE cliente_id = $1";
  pool.query(sql, [id_cliente], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// listar os registros de faturamento de atendimentos (consultas).
app.get("/list_faturamento_clinicas_mes/:id_cliente/:mes", (req, res) => {
  const id_cliente = parseInt(req.params.id_cliente);
  const mes = req.params.mes
  var sql = "SELECT * FROM atendimento WHERE id_cliente = $1 AND TO_CHAR(data_inicio, 'MM-YYYY') = $2";
  pool.query(sql, [id_cliente, mes], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO " + error });
    res.send(results);
  });
});

// listar os registros de faturamento de procedimentos (exames de imagem, procedimentos).
app.get("/list_faturamento_procedimentos_mes/:id_cliente/:mes", (req, res) => {
  const id_cliente = parseInt(req.params.id_cliente);
  const mes = req.params.mes
  var sql = "SELECT * FROM atendimento_exames WHERE id_cliente = $1 AND TO_CHAR(TO_DATE(data_exame, 'DD/MM/YYYY - HH24:MI'), 'MM-YYYY') = $2";
  pool.query(sql, [id_cliente, mes], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO " + error });
    res.send(results);
  });
});

// listar os procedimentos realizados pelo cliente, para um determinado mês.
app.get("/list_faturamento_geral_mes/:id_cliente/:mes", (req, res) => {
  const id_cliente = parseInt(req.params.id_cliente);
  const mes = req.params.mes;
  var sql = "SELECT * FROM faturamento_clinicas WHERE cliente_id = $1 AND TO_CHAR(TO_DATE(data_registro, 'DD/MM/YYYY'), 'MM-YYYY') = $2";
  pool.query(sql, [id_cliente, mes], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO " + error });
    res.send(results);
  });
});

// inserir registro de faturamento.
app.post("/insert_faturamento_clinicas", (req, res) => {
  const {
    cliente_id,
    cliente_nome,
    atendimento_id,
    procedimento_id,
    data_pagamento,
    data_vencimento,
    parcela,
    forma_pagamento,
    status_pagamento,
    valor_pagamento,
    id_operadora,
    codigo_operadora,
    codigo_tuss,
    nome_tuss,
    data_registro,
    xml,
    guia_pdf,
  } = req.body;
  var sql =
    "INSERT INTO faturamento_clinicas (cliente_id, cliente_nome, atendimento_id, procedimento_id, data_pagamento, data_vencimento, parcela, forma_pagamento, status_pagamento, valor_pagamento, id_operadora, codigo_operadora, codigo_tuss, nome_tuss, data_registro, xml, guia_pdf) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)";
  pool.query(
    sql,
    [
      cliente_id,
      cliente_nome,
      atendimento_id,
      procedimento_id,
      data_pagamento,
      data_vencimento,
      parcela,
      forma_pagamento,
      status_pagamento,
      valor_pagamento,
      id_operadora,
      codigo_operadora,
      codigo_tuss,
      nome_tuss,
      data_registro,
      xml,
      guia_pdf,
    ],
    (error, results) => {
      if (error)
        return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    }
  );
});

// atualizar regstro de faturamento.
app.post("/update_faturamento_clinicas/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const {
    cliente_id,
    cliente_nome,
    atendimento_id,
    procedimento_id,
    data_pagamento,
    data_vencimento,
    parcela,
    forma_pagamento,
    status_pagamento,
    valor_pagamento,
    id_operadora,
    codigo_operadora,
    codigo_tuss,
    nome_tuss,
    data_registro,
    xml,
    guia_pdf,
  } = req.body;
  var sql =
    "UPDATE faturamento_clinicas SET cliente_id = $1, cliente_nome = $2, atendimento_id = $3, procedimento_id = $4, data_pagamento = $5, data_vencimento = $6, parcela = $7, forma_pagamento = $8, status_pagamento = $9, valor_pagamento = $10, id_operadora = $11, codigo_operadora = $12, codigo_tuss = $13, nome_tuss = $14, data_registro = $15, xml = $16, guia_pdf = $17 WHERE id = $18";
  pool.query(
    sql,
    [
      cliente_id,
      cliente_nome,
      atendimento_id,
      procedimento_id,
      data_pagamento,
      data_vencimento,
      parcela,
      forma_pagamento,
      status_pagamento,
      valor_pagamento,
      id_operadora,
      codigo_operadora,
      codigo_tuss,
      nome_tuss,
      data_registro,
      xml,
      guia_pdf,
      id
    ], (error, results) => {
      if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    });
});

// excluir faturamento.
app.get("/delete_faturamento_clinicas/:id", (req, res) => {
  const id = parseInt(req.params.id);
  var sql = "DELETE FROM faturamento_clinicas WHERE id = $1";
  pool.query(sql, [id], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// TAGS PARA TIPOS DE CONSULTAS.
// listar todas as tags para um usuário.
app.get("/list_tags_consultas/:id_usuario", (req, res) => {
  const id_usuario = parseInt(req.params.id_usuario);
  var sql =
    "SELECT * FROM cliente_tags_consultas WHERE id_usuario = $1";
  pool.query(sql, [id_usuario], (error, results) => {
    if (error) return res.json({ success: false, message: "ERRO DE CONEXÃO." });
    res.send(results);
  });
});

// inserir tag.
app.post("/insert_tag_consulta", (req, res) => {
  const {
    tag_consulta,
    tag_cor,
    tempo_consulta,
    id_cliente,
    id_usuario,
  } = req.body;
  var sql =
    "INSERT INTO cliente_tags_consultas (tag_consulta, tag_cor, tempo_consulta, id_cliente, id_usuario) VALUES ($1, $2, $3, $4, $5)";
  pool.query(
    sql,
    [
      tag_consulta,
      tag_cor,
      tempo_consulta,
      id_cliente,
      id_usuario,
    ],
    (error, results) => {
      if (error)
        return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    }
  );
});

// atualizar tag.
app.post("/update_tag_consulta/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const {
    tag_consulta,
    tag_cor,
    tempo_consulta,
    id_cliente,
    id_usuario,
  } = req.body;
  var sql =
    "UPDATE cliente_tags_consultas SET tag_consulta = $1, tag_cor = $2, tempo_consulta = $3, id_cliente = $4, id_usuario = $5 WHERE id = $6";
  pool.query(
    sql,
    [
      tag_consulta,
      tag_cor,
      tempo_consulta,
      id_cliente,
      id_usuario,
      id,
    ],
    (error, results) => {
      if (error)
        return res.json({ success: false, message: "ERRO DE CONEXÃO." });
      res.send(results);
    }
  );
});

// excluir tag.
app.get("/delete_tag_consulta/:id", (req, res) => {
  const id = parseInt(req.params.id);
  var sql = "DELETE FROM cliente_tags_consultas WHERE id = $1";
  pool.query(sql, [id], (error, results) => {
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