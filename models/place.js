const mongoose=require('mongoose');

const schema = mongoose.Schema;


const placesSchema = new schema({
    title: {type:String,reqired:true},
    description: {type:String,reqired:true},
    image: {type:String,reqired:true},
    address: {type:String,reqired:true},
    location: {
        lat: {type:Number,reqired:true},
        long: {type:Number,reqired:true},
    },
    creator: {type:mongoose.Types.ObjectId,required:true,ref:'User'}
});

module.exports=mongoose.model('Place',placesSchema);