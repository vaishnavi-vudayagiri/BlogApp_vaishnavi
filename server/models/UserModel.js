import {Schema,model} from 'mongoose'

const userSchema=new Schema({
    firstName:{
        type:String,
        required:[true,"First name is required"],
    },
    lastName:{
        type:String
    },
    email:{
        type:String,
        required:[true,"email is required"],
        unique:[true,"email already taken"]
    },
    password:{
        type:String,
        required:[true,"password is required"],
        minLength:[6,"Min length of password should be 6"]
    },
    role:{
        type:String,
enum:["USER","AUTHOR","ADMIN"],
required:[true,"{Value} is an Invalid role"]
    },
    profileImageUrl:{
        type:String
 },
isUserActive:{
    type:Boolean,
    default:true
} },
    {
timestamps:true,
versionKey:false,
strict:"throw"
    });

    //create model
    export const UserModel=model("user",userSchema);