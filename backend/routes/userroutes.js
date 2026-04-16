import express from "express";
import authcontroller from "../controllers/authcontroller.js";
import detailscontroller from "../controllers/detailscontroller.js";
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
export default userrouter