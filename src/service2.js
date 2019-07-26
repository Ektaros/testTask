import amqp from 'amqplib/callback_api'
import models from './models'

import {queueAuthor, queueBook} from './MQservice'

const CONNECTION_URL = 'amqp://tuchhmpz:SRgw2vW5s51Kl7Az6FG8-J4j0Sqli4Sd@bear.rmq.cloudamqp.com/tuchhmpz';


models.sequelize.sync({}).then(() => {
    amqp.connect(CONNECTION_URL, (err, connection) => {
        connection.createChannel((err, channel) => {
            channel.consume(queueAuthor, (msg) => {
                const author = JSON.parse(msg.content);
                models.Author.create(author).then(res => {

                    console.log(res.dataValues);
                }).catch(err => {
                    console.log('\nError:', err.parent.detail);
                });
                console.log(author);
                },{ noAck: true }
            );

            channel.consume(queueBook, (msg) => {
                const book = JSON.parse(msg.content)
                models.Book.create(book).then(res => {
                    console.log(res.dataValues);
                }).catch(err => {
                    console.log('\nError:', err.parent.detail);
                });
                console.log(book);

                },{ noAck: true }
            );
        });
    });
});
