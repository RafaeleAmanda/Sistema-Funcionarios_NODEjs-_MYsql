const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 3000;
const urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(bodyParser.json());

const perfilDoUsuario = 'administrador'; // Ou 'usuario'

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Modelo Funcionario
const Funcionario = require('./models/funcionario'); // Certifique-se de fornecer o caminho correto

app.use(express.static('Frontend'));


// Rota para renderizar a página de listar funcionários
app.get('/listarfuncionarios', async (req, res) => {
  try {
    const funcionarios = await Funcionario.findAll();
    res.render('listarfuncionarios', { funcionarios });
  } catch (error) {
    console.error('Erro ao buscar funcionários:', error);
    res.status(500).send('Erro interno do servidor');
  }
});
// Rota para processar os dados do formulário de edição e atualizar o funcionário
app.post('/atualizarfuncionario/:id', urlencodedParser, async (req, res) => {
  try {
    const funcionarioId = req.params.id;
    const { nome, cargo, departamento, email } = req.body;

    const rowsUpdated = await Funcionario.update(
      {
        nome,
        cargo,
        departamento,
        email,
      },
      {
        where: {
          id: funcionarioId,
        },
      }
    );

    if (rowsUpdated > 0) {
      // Redireciona para a lista de funcionários após a atualização bem-sucedida
      res.redirect('/listarfuncionarios');
    } else {
      res.status(404).send("<br>Funcionário não encontrado.</b>");
    }
  } catch (error) {
    console.error('Erro ao realizar a atualização de um funcionário:', error);
    res.send("<br> Erro ao alterar funcionário!" + error + "</br>");
  }
});

// Rota para criar um novo funcionário
app.post('/criarfuncionarios', urlencodedParser, async (req, res) => {
  try {
    const { nome, cargo, departamento, email } = req.body;

    // Valide se todas as propriedades estão presentes no corpo da solicitação
    if (!nome || !cargo || !departamento || !email) {
      return res.status(400).json({ error: 'Campos obrigatórios ausentes' });
    }

    const novoFuncionario = await Funcionario.create({ nome, cargo, departamento, email });

    console.log('Funcionário criado com sucesso:', novoFuncionario.toJSON());

    res.status(201).json(novoFuncionario);
  } catch (error) {
    // Verifica se o erro é de validação e trata de maneira específica
    if (error.name === 'SequelizeValidationError') {
      const validationErrors = error.errors.map((error) => ({
        field: error.path,
        message: error.message,
      }));
      res.status(400).json({ error: 'Erro de validação', validationErrors });
    } else {
      console.error('Erro ao criar funcionário:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
});



// Rota para renderizar a página de edição de funcionário
app.get('/editarfuncionario', async (req, res) => {
  try {
    const funcionarioId = req.query.id; // Use req.query para obter parâmetros da string de consulta
    const funcionario = await Funcionario.findByPk(funcionarioId);

    if (!funcionario) {
      res.status(404).json({ error: 'Funcionário não encontrado' });
      return;
    }

    res.render('editarfuncionario', { funcionario });
  } catch (error) {
    console.error('Erro ao buscar funcionário para edição:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});



// Rota para excluir um funcionário
app.post('/excluirfuncionario/:id', async (req, res) => {
  try {
    const funcionarioId = req.params.id;

    const funcionario = await Funcionario.findByPk(funcionarioId);

    if (!funcionario) {
      res.status(404).json({ error: 'Funcionário não encontrado' });
      return;
    }

    await funcionario.destroy();
    res.redirect('/listarfuncionarios'); // Redireciona para a lista de funcionários após a exclusão
  } catch (error) {
    console.error('Erro ao excluir funcionário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/administrador', (req, res) => {
  res.render('administrador');
});


app.get('/usuario', (req, res) => {
  res.render('usuario');
});

app.get('/home', (req, res) => {
  res.render('home');
});


app.listen(port, () => {
  console.log(`Esta aplicação está escutando a porta ${port}`);
});


