const express   = require('express');
const mongoose  = require('mongoose');
const users     = require('./routes/users');
const auth      = require('./routes/auth');
const config    = require('config');
const courses   = require('./routes/courses');
const app       = express();

mongoose.connect(config.get('configDB.HOST'))
    .then(()=>console.log('Connected to MongoDB!'))
    .catch((err)=> console.log('Cannot connect to MongoDB :(',err));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use('/api/users',users);
app.use('/api/courses',courses);
app.use('/api/auth',auth);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log('Listening on port ' + port));