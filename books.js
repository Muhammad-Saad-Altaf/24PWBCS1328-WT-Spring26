const express = require("express");
const router = express.Router();
const Book = require("../models/Book"); // ← Path must be exactly this

// GET all books with pagination
router.get("/", async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.author) filter.author = req.query.author;
    if (req.query.genre) filter.genre = req.query.genre;

    const books = await Book.find(filter).skip(skip).limit(limit);
    const total = await Book.countDocuments(filter);

    res.json({
      success: true,
      data: books,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET single book
router.get("/:id", async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      const error = new Error("Book not found");
      error.status = 404;
      return next(error);
    }
    res.json({
      success: true,
      data: book,
    });
  } catch (err) {
    next(err);
  }
});

// POST new book
router.post("/", async (req, res, next) => {
  try {
    const { title, author, genre, price, publishedDate, inStock } = req.body;

    if (!title || !author || price === undefined) {
      const error = new Error("Title, author, and price are required");
      error.status = 400;
      return next(error);
    }

    const book = new Book({
      title,
      author,
      genre,
      price,
      publishedDate,
      inStock,
    });

    await book.save();
    res.status(201).json({
      success: true,
      data: book,
    });
  } catch (err) {
    next(err);
  }
});

// PUT update book
router.put("/:id", async (req, res, next) => {
  try {
    const { title, author, genre, price, publishedDate, inStock } = req.body;

    if (!title || !author || price === undefined) {
      const error = new Error("Title, author, and price are required");
      error.status = 400;
      return next(error);
    }

    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { title, author, genre, price, publishedDate, inStock },
      { new: true, runValidators: true },
    );

    if (!book) {
      const error = new Error("Book not found");
      error.status = 404;
      return next(error);
    }

    res.json({
      success: true,
      data: book,
    });
  } catch (err) {
    next(err);
  }
});

// DELETE book
router.delete("/:id", async (req, res, next) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      const error = new Error("Book not found");
      error.status = 404;
      return next(error);
    }
    res.json({
      success: true,
      message: "Book deleted successfully",
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
