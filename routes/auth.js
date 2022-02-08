const express   = require('express');
const jwt       = require('jsonwebtoken');
const bcrypt    = require('bcrypt');
const config    = require('config');
const User      = require('../models/userModel');
const route     = express.Router();

route.post('/',(req,res)=>{
    User.findOne({email:req.body.email})
        .then(data =>{
            if(data){
                const validPassword = bcrypt.compareSync(req.body.password,data.password);
                if(!validPassword) return res.status(400).json({msj:'Your username or password is incorrect!'});
                else{
                    const jwtoken = jwt.sign({_id:data._id, name:data.name, email:data.email},config.get('configToken.SEED'),{expiresIn: config.get('configToken.expiration')});
                    res.json({
                        user:{
                            name:data.name,
                            email:data.email 
                        },
                        token: jwtoken
                    });
                }
            }else{
                res.status(400).json({
                    msj:'Your username or password is incorrect!'
                });
            }
        })
        .catch(err=>{
            res.status(500).json({
                msj : 'SERVER ERROR: ' + err
            });
        });
});

module.exports = route;