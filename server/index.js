require('dotenv').config();
const express = require('express'); 
const cors = require('cors'); 
const path = require('path');

const authRoutes = require('./routes/auth.js');

const app = express();
const PORT = process.env.PORT || 5000; 

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

app.use('/auth', authRoutes);

app.use(express.static(path.join(__dirname, '../client/build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.js'));
});

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));