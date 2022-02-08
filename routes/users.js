const express    = require('express');
const Joi        = require('joi');
const bcrypt     = require('bcrypt');
const User       = require('../models/userModel');
const config     = require('config');
const jwt        = require('jsonwebtoken');
const tokenVerif = require('../middlewares/authToken');
const route      = express.Router();

route.get('/',tokenVerif,(req,res)=>{

    let result = getUsers();

    result.then( us =>{
        res.json({
            valor:us
        })
    }).catch(err => {
        res.status(400).json({
            error: err
        })
    });
});

route.post('/',tokenVerif,(req,res)=>{

    let body = req.body;

    User.findOne({email:body.email},(err,us)=>{
        if(err) return res.status(500).json({error: 'Server error!'});
    
        if(us) return res.status(400).json({mjs:'User already exists!'});
        else{
            const {error,value} = validateUser(body);

            if(!error){
                
                let result = createUser(body);
        
                result.then( us =>{
                    res.json({
                        name:us.name,
                        email:us.email
                    })
                }).catch(err => {
                    res.status(400).json({
                        error: err
                    })
                });
                
            }else{
                res.status(400).json({
                    error: error
                });
            }
        }
    });

});

route.put('/:email',tokenVerif,(req,res)=>{

    let result = updateUser(req.params.email,req.body);

    result.then( us =>{
        res.json({
            name:us.name,
            email:us.email
        });
    }).catch(err => {
        res.status(400).json({
            error: err
        });
    });
});
route.delete('/:email',tokenVerif,(req,res)=>{

    let result = deleteUser(req.params.email);

    result.then( us =>{
        res.json({
            name:us.name,
            email:us.email
        });
    }).catch(err => {
        res.status(400).json({
            error: err
        });
    });
});

async function createUser(body){
    let user = new User({
        email       : body.email,
        name        : body.name,
        password    : bcrypt.hashSync(body.password,10)
    });

    return await user.save();
}

async function updateUser(email,body){
    let user = await User.findOneAndUpdate({email:email},{
        $set:{
            name        : body.name,
            password    : body.password
        }
    },{new:true});
    return user;
}

async function deleteUser(email){
    let user = await User.findOneAndUpdate({email:email},{
        $set:{
            status    : false
        }
    },{new:true});
    return user; 
}

async function getUsers(){
    let users = await User.find({status:true})
                          .select({name:1,email:1});

    return users; 
}


function validateUser(body){

    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        password: Joi.string().alphanum().min(8).required(),
        email: Joi.string().email().required()
    });
    return schema.validate({
            name        : body.name,
            password    : body.password,
            email        : body.email
        });
}


module.exports = route;