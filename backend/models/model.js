const dotenv = require("dotenv");
const mongoose = require("mongoose");
const validator = require("validator");
dotenv.config({ path: "./config.env" });

const db = process.env.MONGOOSE;
mongoose
  .connect(db)
  .then(() => console.log("cnnected"))
  .catch((err) => console.error("Connection error:", err));

const userschema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "Enter valid email id",
    },
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  animeList: [
    {
      id: { type: Number, required: true },
      image:{type:String, required:true},
      name: { type: String, required: true },
      duration: { type: Number, required: true },
      totalEpisodes: { type: Number, required: true },
      episodesWatched: { type: Number },
      numberofepisodeswatched: { type: Array },
      status: {
        type: String,
        enum: ["Watching", "Completed", "Dropped", "On hold", "Want to Watch"],
        default: "Want to watch",
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
        required: true,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
        required: true,
      },
    },
  ],
  mangaList: [
    {
      id: { type: Number, required: true },
      image:{type:String, required:true},
      name: { type: String, required: true },
      totalChapters: { type: Number },
      chaptersRead: { type: Number },
      numberofchaptersread: { type: Array },
      status: {
        type: String,
        enum: ["Reading", "Completed", "Dropped", "On hold", "Want to Read"],
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
        required: true,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
        required: true,
      },
    },
  ],
});



const User = mongoose.model("Users", userschema);
module.exports = User;
