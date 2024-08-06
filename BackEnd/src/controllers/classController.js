const { getClasses } = require('../models/Class');

const getClassesHandler = async (req, res) => {
  try {
    console.log('Recebido pedido para buscar turmas');
    const classes = await getClasses();
    console.log('Turmas encontradas:', classes);
    res.status(200).send(classes);
  } catch (error) {
    console.error('Erro ao buscar turmas:', error);
    res.status(500).send('Erro ao buscar turmas');
  }
};

module.exports = { getClassesHandler };
