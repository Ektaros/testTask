import express from 'express'
import bodyParser from 'body-parser'
import redis  from 'redis';

import {publishToQueue, queueAuthor, queueBook} from './MQservice'

const app = express();
const PORT = 80;

const REDIS_PORT = 16379;
const client = redis.createClient(REDIS_PORT);


app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json())

app.post('/author', (req, res, next) => {
    const author = {
        name: req.body.name,
        age: req.body.age
    }
    publishToQueue(queueAuthor,author).then( () => {
        res.send({message:`Sended to queue ${queueAuthor}`, author:author})
    }).catch( err => {
        console.log(err);
    })

})

app.post('/book', (req, res, next) => {
    const book = {
        authorId: req.body.authorId,
        title: req.body.title,
        pages: req.body.pages
    }
    publishToQueue(queueBook,book).then( () => {
        res.send({message:`Sended to queue ${queueBook}`, book:book})
    }).catch( err => {
        console.log(err);
    })

})

app.get('/top5', (req, res, next) => {
    client.get('top5', (err ,data) => {
        if (err){
            console.log(err);
            res.send("error");
        }
        if (data){
            res.send(JSON.parse(data)||[]);
        }
    })
})



app.listen(PORT, () => console.log(`Server ready on port ${PORT}!`))
