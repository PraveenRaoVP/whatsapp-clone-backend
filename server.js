//import 
import express from 'express';
import mongoose from 'mongoose';
//app config
const app = express();
const port = process.env.PORT || 9000;

//middlewares

//??

//DB config
const connection_url = "mongodb+srv://Praveen_Rao_V_P:<password>@cluster0.w4zdp.mongodb.net/whatsappdb?retryWrites=true&w=majority"
mongoose.connect(connection_url);

//API routes
app.get('/',(req,res) => res.status(200).send("Hello World"))
app.post('/api/v1/messages/new', (req,res) => {
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
