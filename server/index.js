const express = require('express'); 
const mongoose = require('mongoose');
const routes = require('./routes');
const cors = require('cors');
require('dotenv/config');
const app = express();

app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(routes);

mongoose.connect(process.env.DB_CONNECTION, (err) =>{
    if(err){
        console.log("There was an error connecting to MongoDB");
    } else {
        console.log("Connection Successful");
    }
})

const PORT = process.env.PORT || 80; 

app.listen(PORT, () => console.log(`Sever has started on port: ${PORT}`)); 
