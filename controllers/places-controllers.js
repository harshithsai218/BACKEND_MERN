const uuid = require('uuid').v4
const {validationResult}=require("express-validator");
const HttpError = require("../models/http-error")
const location = require("../util/location");

let DUMMY_PLACES = [
    {
        id : 'p1',
        title : 'Charminar',//17.3615467,78.3922627,12z
        descrpition : 'Placed in old city',
        location : {
            lat : 17.3615467,
            long : 78.3922627
        },
        address : 'Charminar, Charminar Rd, Char Kaman, Ghansi Bazaar, Hyderabad, Telangana 500002',
        creater : 'u1'
    }
];


const getPlaceById= (req,res,next)=>{
    const userId = req.params.pid;

    const place = DUMMY_PLACES.find(p=>{
        return p.id===userId;
    });

    if(!place){
        throw new HttpError('Could not find a place for the provided id.',404);
    }

    res.json({place});
};


const getPlacesByUserId =(req,res,next)=>{
    const userId = req.params.uid;

    const places = DUMMY_PLACES.filter(p=>{
        return p.creater===userId;
    });

    if(!places || places.length===0){
        return next (new HttpError('Could not find a places for the provided user id.',404));
    }
    
    res.json({places});
};

const createPlace=async(req,res,next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        console.log(errors);
        next(new HttpError('invalid inputs passed, please check your data',422));   
    }
    const {title,descrpition,address,creater} = req.body;
    let coordinates;
    try{
         coordinates = await location(address);    
    }
    catch(error){
        return next(error);
    }
    const createdPlace = {
        id : uuid(),
        title,
        descrpition,
        location: coordinates,
        address,
        creater
    };

    DUMMY_PLACES.push(createdPlace);

    res.status(201).json({place: createdPlace})
};

const updatePlace = (req,res,next)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        console.log(errors);
        throw new HttpError('invalid inputs passed, please check your data',422);   
    }
    const {title,descrpition} = req.body;
    const placeId = req.params.pid;


    const updatePlace={ ...DUMMY_PLACES.find(p=>p.id===placeId)};
    const placeIndex=DUMMY_PLACES.findIndex(p=>p.id===placeId)
    updatePlace.title=title;
    updatePlace.descrpition=descrpition;


    DUMMY_PLACES[placeIndex]= updatePlace;
    res.status(200).json({place: updatePlace}); 
};
const deletePlace = (req,res,next)=>{
    const placeId=req.params.pid;
    if(!DUMMY_PLACES.find(p=>p.id===placeId)){
        throw new HttpError('Could not find a place for that id',404); 
    }
    DUMMY_PLACES=DUMMY_PLACES.filter(p => p.id !==placeId);
    res.status(200).json({message:"Deleted Place."})
};

exports.getPlaceById =getPlaceById;
exports.getPlacesByUserId=getPlacesByUserId;
exports.createPlace=createPlace;
exports.updatePlace=updatePlace;
exports.deletePlace=deletePlace;