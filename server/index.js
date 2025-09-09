//creating server
require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
const twilioClient = require('twilio')(accountSid, authToken);

const express = require('express'); 
const cors = require('cors'); 

const authRoutes = require('./routes/auth.js');

const app = express();
const PORT = process.env.PORT || 5000; 


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

app.get('/', (req, res) => {
    res.send('hello!'); 
});

app.post('/', (req, res) => { 
    const { statusMessage, user: sender, type, members } = req.body; 
    
    if(type === 'message.new') {
        members
        .filter(({member}) => user.id !== sender.id)
            .foreach(({user}) => {
                if(!user.online) {
                    twilioClient.messages.create({
                        body: `You have a new message from ${message.user.fullName}: ${statusMessage.text}`,
                        messagingServiceSid: messagingServiceSid,
                        to: user.phoneNumber
                    })
                    .then(() => console.log('Message sent'))
                    .catch((error) => console.log(error));

                };

            });
            return res.status(200).send('Message sent');

    };

    return res.status(200).send('Not a new message request');

});

app.use('/auth',authRoutes)

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)); 