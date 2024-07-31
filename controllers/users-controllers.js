const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt =require('jsonwebtoken')

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

    let hashedPassword;
    try{ 
       hashedPassword=await bcrypt.hash(password, 12);
    }catch(err){
        const error=new HttpError('Could not create user, please try again',500);
        return next(error)
    }
    const createdUser =new User({
        name,
        email,
        image:req.file.path,
        password:hashedPassword,
        places:[]
    });

    try {
        await createdUser.save();
    } catch (err) {
        const error = new HttpError('Signing Up failed, please try again.', 500);
        return next(error);
    }

    let token;
    try{token = jwt.sign({user:createdUser.id,email:createdUser.email} , 'cant_give', {expiresIn:'1h'});
}catch(err){const error = new HttpError('Signing Up failed, please try again.', 500);
    return next(error);}
    res.status(201).json({user: createdUser.id,email:createdUser.email,token:token});
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

    if(!existingUser ){
        const error=new HttpError(
            'Invalid credentials , please try again',
            401
        );
        return next(error);
    }
    
    let isValidPassword;
    try{isValidPassword = await bcrypt.compare(password,existingUser.password)}
    catch(err){const error=new HttpError('Could not log you in , please check your credential and try again.',500);return next(error);}

    if(!isValidPassword){
        const error=new HttpError('Could not log you in , please check your credential and try again.',401);return next(error); 
    }

    let token;
    try{token = jwt.sign({user:existingUser.id,email:existingUser.email} , 'cant_give', {expiresIn:'1h'});
}catch(err){const error = new HttpError('Logging in failed, please try again.', 500);
    return next(error);}

    res.json({user:existingUser.id,
        email:existingUser.email,
        token:token
    });
};


exports.getUsers=getUsers;
exports.Signup=Signup;
exports.login=login;