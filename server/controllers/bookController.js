
const Book = require("../models/Book");

const getMyBooks = async (req, res) => {
  try {
    const books = await Book.find({
      author_id: req.user.author_id,
    }).sort({ title: 1 });

    return res.status(200).json({
      count: books.length,
      books,
    });
  } catch (error) {
    console.error("Get books error:", error.message);

    return res.status(500).json({
      message: "Failed to fetch books",
    });
  }
};

module.exports = { getMyBooks };
