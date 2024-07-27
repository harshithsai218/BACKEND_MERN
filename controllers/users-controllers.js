const { validationResult } = require("express-validator");

const HttpError = require('../models/http-error');
const User = require('../models/user');


const getUsers = async (req,res,next)=>{
    let users;
    try{ users = await User.find({},'-password');}
    catch(err){
        const error = new HttpError('Fetching user failed ,please try again', 500);
    }
    res.json({users:users.map(user=> user.toObject({getters:true}))});
};

const Signup = async (req,res,next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        console.log(errors);
        return next( new HttpError('invalid inputs passed, please check your data',422));   
    }
    const {name,email,password}=req.body;
    
    let existingUser
    try{
     existingUser = await User.findOne({email:email});
    }catch(err){
        const error = new HttpError('signing up failed,please try again',500);
        return next(error)
    }

    if(existingUser)
    {
        const error = new HttpError('user already exists,please login instead',422);
        return next(error);
    }

    const createdUser =new User({
        name,
        email,
        image:req.file.path,
        password,
        places:[]
    });

    try {
        await createdUser.save();
    } catch (err) {
        const error = new HttpError('Signing Up failed, please try again.', 500);
        return next(error);
    }

    res.status(201).json({user: createdUser.toObject({getters:true})});
};

const login = async (req,res,next)=>{
    
    const {email,password}=req.body;

    let existingUser
    try{
     existingUser = await User.findOne({email:email});
    }catch(err){
        const error = new HttpError('Logging failed,please try again',500);
        return next(error)
    }

    if(!existingUser || existingUser.password !== password){
        const error=new HttpError(
            'Invalid credentials , please try again',
            401
        );
        return next(error);
    }
    
    res.json({message:'Logged in!',user:existingUser.toObject({getters:true})});
};




exports.getUsers=getUsers;
exports.Signup=Signup;
exports.login=login;