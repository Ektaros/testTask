import redis  from 'redis';

import models from './models'
const op = models.Sequelize.Op;
const REDIS_PORT = 16379;

const client = redis.createClient(REDIS_PORT);

client.on('error', (err) => {
    console.log("Error " + err);
});

models.sequelize.sync({}).then(() => {
    setInterval(() => {
        models.Book.findAll({
            group: ['authorId'],
            attributes: ['authorId', [models.sequelize.fn('COUNT', 'id'), 'book_count']],
            where: {
                pages: {
                    [op.gt]: 200
                }
            },
            order: [['count', 'DESC']],
            limit: 5
        }).then(data =>{
            let authorIds = [];
            data.forEach((item)=>{
                authorIds.push(item.dataValues.authorId);
            })
            models.Author.findAll({
                attributes:['id','name','age'],
                where: {
                    id:{
                        [op.in]:authorIds
                    }
                },
            }).then(data => {
                let authors = [];
                data.forEach((item)=>{
                    authors.push(item.dataValues);
                })
                authors.sort((a,b) =>{
                    return authorIds.indexOf(a.id) - authorIds.indexOf(b.id);
                })
                console.log(authors);
                client.set('top5',JSON.stringify(authors));


            })
        })
    },60000)
})
