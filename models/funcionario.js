
const Sequelize = require('sequelize'); // Importa a biblioteca Sequelize
const sequelize = new Sequelize('bdfuncionario', 'root', 'rafa123', {
  host: 'localhost',
  dialect: 'mysql'
});

//  modelo Funcionario
const Funcionario = sequelize.define('funcionario', {
  nome: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  cargo: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  departamento: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
});

// criar a tabela
Funcionario.sync()
  .then(() => {
    console.log('Tabela funcionario sincronizada com sucesso.');
  })
  .catch((error) => {
    console.error('Erro ao sincronizar tabela funcionario:', error);
  });

module.exports = Funcionario;
