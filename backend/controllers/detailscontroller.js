import User from "../models/model.js";
import jwt from "jsonwebtoken";

const secretkey = process.env.SECRETKEY;


export const getname = async (req, res) => {
  try {
    const token = req.headers["authorization"];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, secretkey);

    // Use decoded.id (matches JWT from both Google & manual login)
    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ name: user.name, image: user.image });
  } catch (error) {
    res.status(401).json({ message: error.message || "Unauthorized" });
  }
};

export const animepost = async (req, res) => {
  try {
    const token = req.headers["authorization"];
    const decoded = jwt.verify(token, secretkey);
    const user = await User.findById(decoded.id);
    const id = req.body.id;
    const image = req.body.image;
    const name = req.body.name;
    const duration = req.body.duration;
    const totalEpisodes = req.body.totalEpisodes;
    const status = req.body.status;
    const createdAt = req.body.createdAt;
    const updatedAt = req.body.updatedAt || new Date().toISOString();

    user.animeList.push({
      id,
      image,
      name,
      duration,
      totalEpisodes,
      status,
      createdAt,
      updatedAt,
    });

    await user.save();

    res
      .status(200)
      .json({ message: "manga added successfully", mangaList: user.mangaList });
  } catch (error) {
    console.error("Error adding manga details:", error);
    res.status(400).json({ message: error.message });
  }
};

export const mangapost = async (req, res) => {
  try {
    const token = req.headers["authorization"];
    const decoded = jwt.verify(token, secretkey);

    const user = await User.findById(decoded.id);
    const id = req.body.id;
    const image = req.body.image;
    const name = req.body.name;
    const totalChapters = req.body.totalChapters;
    const status = req.body.status;
    const createdAt = req.body.createdAt;
    const updatedAt = req.body.updatedAt || new Date().toISOString();

    user.mangaList.push({
      id,
      image,
      name,
      totalChapters,
      status,
      createdAt,
      updatedAt,
    });

    await user.save();

    res
      .status(200)
      .json({ message: "manga added successfully", mangaList: user.mangaList });
  } catch (error) {
    console.error("Error adding manga details:", error);
    res.status(400).json({ message: error.message });
  }
};
export const animechange = async (req, res) => {
  try {
    const token = req.headers["authorization"];
    const decoded = jwt.verify(token, secretkey);
    const user = await User.findById(decoded.id);

    const { id, status, episodeswatched, updatedAt, numberofepisodeswatched } =
      req.body;

    const anime = user.animeList.find((a) => a.id === id);
    if (!anime) {
      return res
        .status(404)
        .json({ message: "anime not found in user's list" });
    }

    anime.status = status;
    anime.updatedAt = updatedAt;

    if (status === "Completed") {
      anime.numberofepisodeswatched = Array.from(
        { length: anime.totalEpisodes },
        (_, i) => i + 1
      );
      anime.episodesWatched = anime.totalEpisodes; // ✅ FIXED HERE
    } else {
      anime.numberofepisodeswatched = numberofepisodeswatched || [];
      anime.episodesWatched = episodeswatched;
    }

    await user.save();

    return res
      .status(200)
      .json({ message: "anime updated", animeList: user.animeList });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const mangachange = async (req, res) => {
  try {
    const token = req.headers["authorization"];
    const decoded = jwt.verify(token, secretkey);
    const user = await User.findById(decoded.id);

    const { id, status, chaptersRead, updatedAt, numberofchaptersread } =
      req.body;

    const manga = user.mangaList.find((a) => a.id === id);
    if (!manga) {
      return res
        .status(404)
        .json({ message: "manga not found in user's list" });
    }

    manga.status = status;
    manga.chaptersRead = chaptersRead;
    manga.updatedAt = updatedAt;
    manga.numberofchaptersread = numberofchaptersread || [];

    await user.save();

    return res
      .status(200)
      .json({ message: "manga updated", mangaList: user.mangaList });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getanimedetails = async (req, res) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, secretkey);
    const user = await User.findById(decoded.id);
    const animeId = req.query.id;

    const animeItem = user.animeList.find((item) => item.id == animeId);
    if (!animeItem) {
      return res.status(404).json({ message: "anime not found in user list" });
    }

    if (animeItem.numberofepisodeswatched.length === animeItem.totalEpisodes) {
      animeItem.status = "Completed";
    }
    if (
      animeItem.status === "Completed" &&
      animeItem.numberofepisodeswatched.length !== animeItem.totalEpisodes
    ) {
      animeItem.numberofepisodeswatched = Array.from(
        { length: animeItem.totalEpisodes },
        (_, i) => i + 1
      );
    }
    const details = {
      numberofepisodeswatched: animeItem.numberofepisodeswatched || [],
      status: animeItem.status,
      durationwatched:
        (animeItem.episodesWatched || 0) * (animeItem.duration || 0),
    };

    return res.json({ details });
  } catch (err) {
    return res.status(500).json({ message: "Invalid token or server error" });
  }
};

export const getmangadetails = async (req, res) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, secretkey);
    const user = await User.findById(decoded.id);
    const mangaId = req.query.id;
    const mangaItem = user.mangaList.find((item) => item.id == mangaId);

    if (!mangaItem) {
      return res.status(404).json({ message: "manga not found in user list" });
    }
    if (mangaItem.numberofchaptersread.length === mangaItem.totalChapters) {
      mangaItem.status = "Completed";
    }
    if (
      mangaItem.status === "Completed" &&
      mangaItem.numberofchaptersread.length !== mangaItem.totalChapters
    ) {
      mangaItem.numberofchaptersread = Array.from(
        { length: mangaItem.totalChapters },
        (_, i) => i + 1
      );
    }
    const details = {
      numberofchaptersread: mangaItem.numberofchaptersread || [],
      status: mangaItem.status,
    };

    return res.json({ details });
  } catch (err) {
    return res.status(500).json({ message: "Invalid token or server error" });
  }
};

export const getuseranimes = async (req, res) => {
  const token = req.headers["authorization"];
  if (token) {
    const decoded = jwt.verify(token, secretkey);
    const user = await User.findById(decoded.id);
    console.log(user.animeList);
    console.log(user.mangaList);
  }
};

export const getuserdetails = async (req, res) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ message: "No token provided" });
  try {
    const decoded = jwt.verify(token, secretkey);
    const user = await User.findById(decoded.id);
    const animedetails = user.animeList;
    const mangadetails = user.mangaList;
    res
      .status(200)
      .json({ animedetails: animedetails, mangadetails: mangadetails });
  } catch (error) {}
};
