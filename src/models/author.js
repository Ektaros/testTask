export default (sequelize, DataTypes) => {
  const Author = sequelize.define('author', {
    name: {
      type: DataTypes.STRING,
      unique: true,
    },
    age: DataTypes.INTEGER,
  });

  return Author;
};
