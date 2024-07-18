const mongoose = require('mongoose');
const express =require("express");
const bodyParser = require("body-parser");

const HttpError=require("./models/http-error");
const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");

const app=express();

app.use(bodyParser.json())

app.use('/api/places',placesRoutes);

app.use('/api/users',usersRoutes);

app.use((req,res,next)=>{
    const error=new HttpError("Could not find this route.",404);
    throw error;
  });
  
  app.use((error, req, res, next) => {
    if (res.headerSent) {
      return next(error);
    }
    res.status(error.code||500); 
    res.json({message:error.message||'An Unknown error occured'});
});

mongoose
    .connect('mongodb+srv://MERN:141312@mern.qepcug5.mongodb.net/mern_main?retryWrites=true&w=majority&appName=MERN')
    .then(()=>{
        app.listen(5000);
    })
    .catch(err => {
      console.log(err);
    });
  