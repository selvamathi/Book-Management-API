require("dotenv").config();
const express=require("express");
const mongoose = require("mongoose");

//API

const Book = require('./API/book');
const Author = require('./API/author');
const Publication = require('./API/publication');

mongoose.connect(process.env.MONGO_URI,{
   useNewUrlParser : true,
   useUnifiedTopology : true,
   useFindAndModify : false,
   useCreateIndex : true 
})
.then(() => console.log("Connection Established!"))
.catch((error)=>{
    console.log(error)
});

const OurApp=express();
OurApp.use(express.json());

//MicroServices

OurApp.use("/book",Book);
OurApp.use("/author",Author);
OurApp.use("/publication",Publication);

OurApp.get("/",(req,res)=>{
    res.json({message:"Server is working!!!"});
});

OurApp.listen(4049,()=>{
    console.log("Server started");
});