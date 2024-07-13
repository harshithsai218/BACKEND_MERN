const mongoose=require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const schema = mongoose.Schema;


const userSchema = new schema({
    name: {type:String,reqired:true},
    email: {type:String,reqired:true,unique:true},
    password: {type:String,reqired:true,minlength:8},
    image: {type:String,reqired:true},
    places: [{type:mongoose.Types.ObjectId,required:true,ref:'Place'}]
});

userSchema.plugin(uniqueValidator);
module.exports=mongoose.model('User',userSchema);