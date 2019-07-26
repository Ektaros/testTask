import Sequelize from 'sequelize';

const sequelize = new Sequelize('test_task', 'E', 'postgres', {
    dialect: 'postgres',
});

const models = {
    Author: sequelize.import('./author'),
    Book: sequelize.import('./book'),
};

Object.keys(models).forEach((modelName) => {
    if ('associate' in models[modelName]) {
        models[modelName].associate(models);
    }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

export default models;
