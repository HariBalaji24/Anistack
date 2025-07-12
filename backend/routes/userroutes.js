const express = require("express");
const authcontroller = require("../controllers/authcontroller");

const userrouter= express.Router()

userrouter.route("/signin").post(authcontroller.signup)
userrouter.route("/login").post(authcontroller.login)
userrouter.route("/getname").get(authcontroller.getname)

userrouter.route("/animepost").post(authcontroller.animepost)
userrouter.route("/mangapost").post(authcontroller.mangapost)

userrouter.route("/animechanges").patch(authcontroller.animechange)
userrouter.route("/mangachanges").patch(authcontroller.mangachange)

userrouter.route("/getanimedetails").get(authcontroller.getanimedetails)
userrouter.route("/getmangadetails").get(authcontroller.getmangadetails)

userrouter.route("/user-details").get(authcontroller.getuserdetails)
module.exports = userrouter