const express = require("express");
const authcontroller = require("../controllers/authcontroller");
const detailscontroller = require("../controllers/detailscontroller");
const userrouter= express.Router()

userrouter.route("/signin").post(authcontroller.signup)
userrouter.route("/login").post(authcontroller.login)
userrouter.route("/getname").get(detailscontroller.getname)
userrouter.route("/google").get(authcontroller.googlelogin)

userrouter.route("/animepost").post(detailscontroller.animepost)
userrouter.route("/mangapost").post(detailscontroller.mangapost)

userrouter.route("/animechanges").patch(detailscontroller.animechange)
userrouter.route("/mangachanges").patch(detailscontroller.mangachange)

userrouter.route("/getanimedetails").get(detailscontroller.getanimedetails)
userrouter.route("/getmangadetails").get(detailscontroller.getmangadetails)

userrouter.route("/user-details").get(detailscontroller.getuserdetails)
module.exports = userrouter