const express = require("express");
const path = require("path");
const uniqid = require("uniqid");
const router = express.Router();

const { Cobra } = require("../helpers/cobra");

const Book = new Cobra("../data/books.jsdb");

// Get all books
router.get("/search", (req, res) => {
    Book.find()
        .then((book) => {
            res.render("book/search", { book: book });
        })
        .catch((err) => {});
});

// Get books by query which is search over title and query string
router.get("/search/:q", (req, res) => {
    Book.search(req.params.q, ["title", "query"])
        .then((book) => {
            res.render("book/search", { book: book, query: req.params.q });
        })
        .catch((err) => {});
});

// Load Book Add Form
router.get("/add", (req, res) => {
    res.render("book/add");
});

// Show Book Details
router.get("/show/:id", (req, res) => {
    Book.findOne({ _id: req.params.id }).then((book) => {
        res.render("book/show", { book: book });
    });
});

// Edit Book By Id
router.get("/edit/:id", (req, res) => {
    Book.findOne({ _id: req.params.id }).then((book) => {
        res.render("book/edit", { book: book });
    });
});

// Add Book to DB
router.post("/add", (req, res) => {
    const newBook = {
        title: req.body.title,
        authors: req.body.authors.split(","),
        pub: req.body.pub,
        lang: req.body.lang,
        num_pages: req.body.num_pages,
        price: req.body.price,
        edition: req.body.edition,
        isbn: req.body.isbn,
        query: req.body.query,
        cover: "",
        bfile: "",
    };
    if (req.files) {
        for (i in req.files) {
            newBook[i] = uniqid().substring(10, 18) + req.files[i].name;
            let uploadPath = "";
            if (i == "cover") {
                uploadPath = path.join(__dirname, "..", "..", "public", "uploads", "cover");
            }
            if (i == "bfile") {
                uploadPath = path.join(__dirname, "..", "..", "public", "uploads", "files");
            }
            req.files[i]
                .mv(path.join(__dirname, uploadPath) + newBook[i])
                .then(() => {
                    Book.save(newBook).then(() => {
                        res.redirect("/");
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    } else {
        Book.save(newBook)
            .then(() => {
                res.redirect("/");
            })
            .catch((err) => {
                console.log(err);
            });
    }
});

// Update Book By Id
router.put("/edit/:id", (req, res) => {
    Book.findOne({ _id: req.params.id }).then((book) => {
        const options = {
            title: req.body.title,
            authors: req.body.authors.split(","),
            pub: req.body.pub,
            lang: req.body.lang,
            num_pages: req.body.num_pages,
            price: req.body.price,
            edition: req.body.edition,
            isbn: req.body.isbn,
            query: req.body.query,
        };

        if (req.files) {
            for (i in req.files) {
                options[i] = uniqid().substring(10, 18) + req.files[i].name;
                let uploadPath = "";
                if (i == "cover") {
                    uploadPath = path.join(__dirname, "..", "..", "public", "uploads", "cover");
                }
                if (i == "bfile") {
                    uploadPath = path.join(__dirname, "..", "..", "public", "uploads", "files");
                }
                req.files[i]
                    .mv(path.join(__dirname, uploadPath) + options[i])
                    .then(() => {
                        Book.updateOne(book, options).then(() => {
                            res.redirect("/book/search");
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        } else {
            Book.updateOne(book, options).then(() => {
                res.redirect("/book/search");
            });
        }
    });
});

// Delete Book By Id
router.delete("/delete/:id", (req, res) => {
    Book.deleteOne({ _id: req.params.id }).then(() => {
        res.redirect("/book/search");
    });
});

module.exports = router;
