import amqp from 'amqplib/callback_api'

const CONNECTION_URL = 'amqp://tuchhmpz:SRgw2vW5s51Kl7Az6FG8-J4j0Sqli4Sd@bear.rmq.cloudamqp.com/tuchhmpz';

let channel;
export const queueAuthor = 'test_author';
export const queueBook = 'test_book';

amqp.connect(CONNECTION_URL, (err, connection) => {
    if (err){
        console.log(err);
    }
   connection.createChannel((err, createdChannel) => {
      channel = createdChannel;
      channel.assertQueue(queueBook, {
         durable: false
      });
      channel.assertQueue(queueAuthor, {
         durable: false
      });
   });
});
export const publishToQueue = async (queue, data) => {
   channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)));
}
