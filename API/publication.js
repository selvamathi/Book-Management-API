const Router = require("express").Router();

const PublicationModel = require("../schema/publication");

//Get Routes

// Route    - /publication
// Des      - to get all publication
// Access   - Public
// Method   - GET
// Params   - none
// Body     - none

Router.get("/",async (req,res)=>{
    const getAllPublications = await PublicationModel.find();
    return res.json({publication: getAllPublications});
});

// Route    - /publication/:publicationID
// Des      - to get specific publication
// Access   - Public
// Method   - GET
// Params   - publicationID
// Body     - none

Router.get("/:publicationID",async (req,res)=>{
    const getSpecificPublication = await PublicationModel.findOne({id: req.params.publicationID});
    if(!getSpecificPublication){
        return res.json({error:`No publication found at the id of ${req.params.publicationID}`});
    }
    return res.json({publication: getSpecificPublication});
});

// Route    - /publication/:bookID
// Des      - to get a list of publication based on a book
// Access   - Public
// Method   - GET
// Params   - bookID
// Body     - none

Router.get("/b/:bookID", async (req,res)=>{
    const {bookID} = req.params;
    const getSpecificPublication = await PublicationModel.findOne({books: bookID});
    if(!getSpecificPublication){
        return res.json({error:`No Publication found at the id of ${req.params.bookID}`});
    }
    return res.json({publication: getSpecificPublication});
});

//Post Route

// Route    - /publication/new
// Des      - To add a new publication
// Access   - Public
// Method   - POST
// Params   - none
// Body     - new publication details

Router.post("/new", async (req,res) => {
    try{
        const {newPublication} = req.body;
        await PublicationModel.create(newPublication);
        return res.json({message: "Publication added to the database"});
       }
        catch(error){
            return res.json({errors: error});
        }
});

//Put Route

// Route    - /publication/updateName/:id
// Des      - update name of a publication
// Access   - Public
// Method   - PUT
// Params   - id
// Body     - publication name


Router.put("/updateName/:id", async (req,res)=>{
    const {newPublicationName} = req.body;
    const {id} = req.params;
    const updatedPublication = await PublicationModel.findOneAndUpdate(
        {
           id: parseInt(id),
        },
        {
           name: newPublicationName, 
        },
        {
            new: true
        }
    );

    return res.json({publication: updatedPublication,
        message: "Name of the publication was updated successfully"
    });
});

// Route    - /publication/updateBooks/:id
// Des      - update/add new author of a book
// Access   - Public
// Method   - PUT
// Params   - id
// Body     - updated publication books

Router.put("/updateBooks/:id", async (req,res)=>{

    const {newBook} = req.body;
    const {id} = req.params;
   
    const updatedPublication = await PublicationModel.findOneAndUpdate(
        {
            id: parseInt(id),
        },
        {
            $addToSet : {
                books :newBook,
            }
        },
        {
            new : true
        }
    );
   
    return res.json({
        publication: updatedPublication,
        message: "Publication books updated successfully"
    });
});

//Delete Routes

// Route    - /publication/delete/:id
// Des      - delete a publication
// Access   - Public
// Method   - DELETE
// Params   - id
// Body     - none

Router.delete("/delete/:id", async (req,res) => {
    const {id} = req.params;
    const updatePublicationDatabase = await PublicationModel.findOneAndDelete({
        id : parseInt(id)
    });
    return res.json({
        publication: updatePublicationDatabase,
        message: `${id} deleted successfully`
    });
});

// Route    - /publication/delete/book/:isbn/:id
// Des      - delete a book from a publication
// Access   - Public
// Method   - DELETE
// Params   - id, isbn
// Body     - none

Router.delete("/delete/book/:isbn/:id", async (req,res)=>{
    const {isbn,id} = req.params;
    const updatedPublication = await PublicationModel.findOneAndUpdate(
        {
            id : parseInt(id),
        },
        {
            $pull : {
                books: isbn,
            }
        },
        {
            new: true
        }
    );
    const updatedBook = await Book.findOneAndUpdate(
        {
            ISBN: isbn,
        },
        {
            $pull : {
                publication : parseInt(id),
            }
        },
        {
            new: true
        }
    );
    
    return res.json({publication: updatedPublication, book: updatedBook});
});

module.exports = Router;