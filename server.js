//import 
import express, { response } from 'express';
import mongoose from 'mongoose';
import Messages from './dbMessages.js';
import Pusher from 'pusher';

//app config
const app = express();
const port = process.env.PORT || 9000;
const pusher = new Pusher({
  appId: "1368306",
  key: "4d9de3ba41c27bc1e1f1",
  secret: "7122508dafb7354b4558",
  cluster: "ap2",
  useTLS: true
});

//middlewares
app.use(express.json);
app.use((req,res,next) => {
    res.setHeader("Access-Control-Allow-Origin",'*')
    res.setHeader("Access-Control-Allow-Headers",'*')
    next()
});
//??

//DB config
const connection_url = "mongodb+srv://Praveen_Rao:fyJHHWj2k0tvzTLl@cluster0.5y0q4.mongodb.net/whatsappdb?retryWrites=true&w=majority";
mongoose.connect(connection_url);

const db = mongoose.connection;
db.once('open', () => {
    console.log("DB is connected")
    const msgCollection = db.collection('messagecontent')
    const changeStream = msgCollection.watch()
    changeStream.on('change',(change) => {
        console.log(change)

        if(change.operationType === 'insert') {
            const messageDetails = change.fullDocument
            pusher.trigger('messages','inserted', {
                name: messageDetails.user,
                message:  messageDetails.message,
                timestamp: messageDetails.timestamp,
                received: messageDetails.received
            })
        } else{
            console.log("Error triggering Pusher")
        }
    })
});

//API routes
app.get('/',(req,res) => res.status(200).send("Hello World"))

app.get('/messages/sync', (req, res) => {
    Messages.find((err,data) => {
        if(err){
            res.status(500).send(err)
        } else{
            res.status(200).send(data)
        }
    })
})

app.post('/messages/new', (req,res) => {
    const dbMessage = req.body

    Messages.create(dbMessage,(err,data) => {
        if(err){
            res.status(500).send(err)
        }
        else{
            res.status(201).send(`New message created /n ${data}`)
        }
    })
})


//Listener
app.listen(port, () => console.log(`Listening in localhost:${port}`))