
require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Author = require("./models/Author");

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const authors = await Author.find();

    const demoUsers = [
      {
        name: "Admin",
        email: "admin@bookleaf.com",
        password: "Admin@12345",
        role: "admin",
        author_id: null,
      },
      ...authors.map((author) => ({
        name: author.name,
        email: author.email,
        password: "Author@12345",
        role: "author",
        author_id: author.author_id,
      })),
    ];

    for (const userData of demoUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      await User.findOneAndUpdate(
        { email: userData.email },
        { ...userData, password: hashedPassword },
        { upsert: true, new: true, runValidators: true }
      );
    }

    console.log("Demo users created/updated successfully!");
    console.log("Admin: admin@bookleaf.com");
    console.log("Author: priya.sharma@email.com");
    console.log("Demo password for both: use the role-specific password shown in seedUsers.js");
  } catch (error) {
    console.error("User seeding failed:", error.message);
  } finally {
    await mongoose.disconnect();
  }
};

seedUsers();
