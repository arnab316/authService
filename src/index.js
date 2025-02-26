const express = require('express');
const bodyParser = require('body-parser');
const {PORT} = require('./config/server-config')
const apiRoutes = require('./router/index')
const app = express();

const startAndStop = async()=>{
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
   app.use('/api', apiRoutes);
    app.listen(PORT, ()=>{
        console.log(`movie auth service running on port ${PORT}`);
    })

}

startAndStop();