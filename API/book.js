const Router = require("express").Router();

const BookModel = require("../schema/book");
const AuthorModel = require("../schema/author");

//get Routes

// Route    - /book
// Des      - To get all books
// Access   - Public
// Method   - GET
// Params   - none
// Body     - none

Router.get("/",async (req,res)=>{
    const getAllBooks = await BookModel.find();
    return res.json({book: getAllBooks});
});

// Route    - /book/:bookID
// Des      - To get a book based on ISBN
// Access   - Public
// Method   - GET
// Params   - bookID
// Body     - none

Router.get("/:bookID",async (req,res)=>{
    const getSpecificBook = await BookModel.findOne({ISBN: req.params.bookID});
    if(!getSpecificBook){
        return res.json({error:`No book found at the ISBN of ${req.params.bookID}`});
    }
    return res.json({book: getSpecificBook});
});

// Route    - /book/c/:category
// Des      - to get a list of books based on category
// Access   - Public
// Method   - GET
// Params   - category
// Body     - none

Router.get("/c/:category", async (req,res)=>{
    const getSpecificBook = await BookModel.find({category: req.params.category});
    if(!getSpecificBook){
        return res.json({error: `No book found at the category of ${req.params.category}`});
    }
    return res.json({book: getSpecificBook});
});

// Route    - /book/a/:author
// Des      - to get a list of books based on author
// Access   - Public
// Method   - GET
// Params   - author
// Body     - none

Router.get("/a/:author", async (req,res)=>{
    const {author} = req.params; 
    const getSpecificBook = await BookModel.find({authors : parseInt(author)});
    if(!getSpecificBook){
        return res.json({error: `No book found for the author ${author}`});
    }
    return res.json({book: getSpecificBook});
});

//Post Route

// Route    - /book/new
// Des      - To add a new Book
// Access   - Public
// Method   - POST
// Params   - none
// Body     - new book details

Router.post("/new",async (req,res) => {
    try{
        const {newBook} = req.body;
        await BookModel.create(newBook);
        return res.json({message: 'Book added to the Database'});
    }
    catch(error){
        return res.json({error: error});
    }
});

//Put Routes

// Route    - /book/updateTitle/:isbn
// Des      - update a title of a book
// Access   - Public
// Method   - PUT
// Params   - isbn
// Body     - bookTitle

Router.put("/updateTitle/:isbn", async(req,res)=>{
    const {title} = req.body;
    const updateBook = await BookModel.findOneAndUpdate(
        {
            ISBN:req.params.isbn,
        },
        {
            title: title,
        },
        {
            new:true,
        }
    );

    return res.json({book: updateBook});
});

// Route    - /book/updateAuthor/:isbn
// Des      - update/add new author of a book
// Access   - Public
// Method   - PUT
// Params   - isbn
// Body     - book author

Router.put("/updateAuthor/:isbn",async (req,res)=>{
    const {newAuthor} = req.body;
    const {isbn} = req.params;
    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN : isbn,
        },
        {
            $addToSet : {
                authors : parseInt(newAuthor),
            },
        },
        {
            new : true
        }
    );
    const updatedAuthor = await AuthorModel.findOneAndUpdate(
        {
            id: parseInt(newAuthor),
        },
        {
            $addToSet : {
                books :isbn,
            }
        },
        {
            new : true
        }
    );
    return res.json({
        book: updatedBook,
        author: updatedAuthor,
        message: "New author was added successfully"
    });
});

//Delete Route

// Route    - /book/delete/:isbn
// Des      - delete a book
// Access   - Public
// Method   - DELETE
// Params   - isbn
// Body     - none

Router.delete("/delete/:isbn", async (req,res)=>{
    const {isbn} = req.params;
    const updateBookDatabase = await BookModel.findOneAndDelete({
        ISBN : isbn
    });
    return res.json({
        book: updateBookDatabase,
        message: `${isbn} deleted successfully`
    });
});

// Route    - /book/delete/author/:isbn/:id
// Des      - delete an author from a book
// Access   - Public
// Method   - DELETE
// Params   - isbn,id
// Body     - none

Router.delete("/delete/author/:isbn/:id",async (req,res)=>{
    const {isbn,id}=req.params;
    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN : isbn,
        },
        {
            $pull : {
                authors : parseInt(id),
            }
        },
        {
            new: true
        }
    );
    const updatedAuthor = await AuthorModel.findOneAndUpdate(
        {
            id: parseInt(id),
        },
        {
            $pull : {
                books : isbn,
            }
        },
        {
            new: true
        }
    );
    
    return res.json({book: updatedBook, author: updatedAuthor});
});

module.exports = Router;