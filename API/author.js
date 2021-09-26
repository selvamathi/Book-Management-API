const Router = require("express").Router();

const AuthorModel = require("../schema/author");

//Get Routes

// Route    - /author
// Des      - to get all authors
// Access   - Public
// Method   - GET
// Params   - none
// Body     - none

Router.get("/", async(req, res) => {
    const getAllAuthors = await AuthorModel.find();
    return res.json({author: getAllAuthors});
});

// Route    - /author/:authorID
// Des      - to get specific author
// Access   - Public
// Method   - GET
// Params   - authorID
// Body     - none

Router.get("/:authorID",async (req,res)=>{
    const getSpecificAuthor = await AuthorModel.findOne({id: req.params.authorID});
    if(!getSpecificAuthor){
        return res.json({error:`No Author found at the id of ${req.params.authorID}`});
    }
    return res.json({author: getSpecificAuthor});
});

// Route    - /author/b/:bookID
// Des      - to get a list of author based on a book
// Access   - Public
// Method   - GET
// Params   - bookID
// Body     - none

Router.get("/b/:bookID", async (req,res)=>{
    const getSpecificAuthor = await AuthorModel.find({books: req.params.bookID});
    if(!getSpecificAuthor){
        return res.json({error: `No author found at the bookID of ${req.params.bookID}`});
    }
    return res.json({author: getSpecificAuthor});
});

//Post Routes

// Route    - /author/new
// Des      - To add a new author
// Access   - Public
// Method   - POST
// Params   - none
// Body     - new author details

Router.post("/new", async (req,res) => {
    try{
     const {newAuthor} = req.body;
     await AuthorModel.find(newAuthor);
     return res.json({message: "Author added to the database"});
    }
     catch(error){
         return res.json({errors: error});
     }
 });

//Put Routes

// Route    - /author/updateName/:id
// Des      - update name of author
// Access   - Public
// Method   - PUT
// Params   - id
// Body     - author name

Router.put("/updateName/:id",async (req,res)=>{
    const {newAuthorName} = req.body;
    const {id} = req.params;
    const updatedAuthor = await AuthorModel.findOneAndUpdate(
        {
           id: parseInt(id),
        },
        {
           name: newAuthorName, 
        },
        {
            new: true
        }
    );

    return res.json({
        author: updatedAuthor,
        message: "Name of the author was updated successfully"
    });
});

//Delete Routes

// Route    - /author/delete/:id
// Des      - delete an author
// Access   - Public
// Method   - DELETE
// Params   - id
// Body     - none


Router.delete("/delete/:id", async (req,res)=>{
    const {id} = req.params;
    const updateAuthorDatabase = await AuthorModel.findOneAndDelete({
        id : parseInt(id)
    });
    return res.json({
        author: updateAuthorDatabase,
        message: `${id} deleted successfully from database`
    });
});

module.exports = Router;
