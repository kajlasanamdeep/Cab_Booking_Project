/* importing files */
const connection = require('./connection/connect');
const config = require('./config/config');
const route = require('./route');

/* importing modules */
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

/* setting app middelwares */
const app = express();
const server = require('http').createServer(app);
app.use(cors());
app.set('view engine','hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set('views', path.join(__dirname, '../server/views'));
app.use('/api', route);
app.use('/static',express.static(path.join(__dirname,'../server/public')));
app.get('/',(req,res)=>{
    res.render('Home Page')
});
/* setting connection to mongodb atlas database */

connection.connect().then((connected)=>{
    server.listen(config.PORT,console.log(`App is running`));
    console.log(connected);
}).catch((error)=>{
    console.log("Database Connection Error:",error);
});