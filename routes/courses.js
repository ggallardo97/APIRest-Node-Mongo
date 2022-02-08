const express       = require('express');
const Course        = require('../models/courseModel');
const tokenVerif    = require('../middlewares/authToken');
const route         = express.Router();

route.get('/',tokenVerif,(req,res)=>{
    
    let result = getCourses();

    result.then( us =>{
        res.json({
            value:us
        })
    }).catch(err => {
        res.status(400).json({
            error: err
        })
    });
});

route.post('/',tokenVerif,(req,res)=>{

    let result = createCourse(req);

    result.then( us =>{
        res.json({
            value: us
        })
    }).catch(err => {
        res.status(400).json({
            error: err
        })
    });
});

route.put('/:id',tokenVerif,(req,res)=>{

    let result = updateCourse(req.params.id,req.body);

    result.then( us =>{
        res.json({
            value:us
        });
    }).catch(err => {
        res.status(400).json({
            error: err
        });
    });
});
route.delete('/:id',tokenVerif,(req,res)=>{

    let result = deleteCourse(req.params.id);

    result.then( us =>{
        res.json({
            value:us
        });
    }).catch(err => {
        res.status(400).json({
            error: err
        });
    });
});

async function createCourse(req){
    let course = new Course({
        title       : req.body.title,
        author      : req.user._id
    });

    return await course.save();
}

async function updateCourse(id,body){
    let course = await Course.findByIdAndUpdate(id,{
        $set:{
            title       : body.title,
            author      : body.author,
            students    : body.students
        }
    },{new:true});
    return course;
}

async function deleteCourse(id){
    let course = await Course.findByIdAndUpdate(id,{
        $set:{
            published : false
        }
    },{new:true});
    return course; 
}

async function getCourses(){
    let courses = await Course.find({published:true})
                              .populate('author','name');
                              //.sort({title: 1});

    return courses; 
}

module.exports = route;