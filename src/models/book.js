export default (sequelize, DataTypes) => {
    const Book = sequelize.define('book', {
        title: DataTypes.STRING,
        pages: DataTypes.INTEGER,
    });

    Book.associate = (models) => {
        Book.belongsTo(models.Author, {
            foreignKey: 'authorId',
        });
    };

    return Book;
};
