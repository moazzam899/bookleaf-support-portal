
require("dotenv").config();

const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const Author = require("./models/Author");
const Book = require("./models/Book");

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const filePath = path.join(__dirname, "bookleaf_sample_data.json");
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    const authors = data.authors.map((author) => ({
      author_id: author.author_id,
      name: author.name,
      email: author.email,
      phone: author.phone,
      city: author.city,
      joined_date: author.joined_date,
    }));

    const books = data.authors.flatMap((author) =>
      author.books.map((book) => ({
        ...book,
        author_id: author.author_id,
      }))
    );

    // Sirf BookLeaf ke dedicated collections clear hongi.
    await Author.deleteMany({});
    await Book.deleteMany({});

    await Author.insertMany(authors);
    await Book.insertMany(books);

    console.log(`Authors imported: ${authors.length}`);
    console.log(`Books imported: ${books.length}`);
    console.log("BookLeaf sample data imported successfully!");
  } catch (error) {
    console.error("Seeding failed:", error.message);
  } finally {
    await mongoose.disconnect();
  }
};

seedData();
