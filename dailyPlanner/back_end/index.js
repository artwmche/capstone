const express = require("express");
let cors = require('cors');
let bodyParser = require('body-parser');
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
const PORT=8080;

let app_routes = require('./routes/app_routes').router;
let func_sms = require('./routes/app_routes').checkEventSMS;

// Tell the app to use our 'user_routes' module to handle any HTTP requests that start with '/api/users'
app.use('/dailyPlanner',app_routes);



app.listen(PORT,()=>{
    //func_sms();
    setInterval(func_sms,(60 * 1000));
    console.log(`server listening on port ${PORT}`);
});