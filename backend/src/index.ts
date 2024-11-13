import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import cors from "cors";
import { Jimp } from "jimp";

const app = express();
app.use(express.json());
const PORT = 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e4);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

const options = {
  fit: "box" as "box",
  color: false,
  width: 60,
};

app.post(
  "/upload",
  upload.single("image"),
  async (req: Request, res: Response) => {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded." });
      return;
    }

    // req.file.path
    try {
      const image = await Jimp.read(req.file.path);

      // also can apply any filter as image is removed after that
      image
      .gaussian(1)
      .quantize({
        colors: 10,
        colorDistanceFormula: "euclidean",
        imageQuantization: 'riemersma',
        paletteQuantization: 'neuquant'
      })

      const buffer = await image.getBuffer("image/jpeg", {
        quality: 50,
      });
      // delete file
      fs.rm(req.file.path, (call) => {})
      res.set("Content-Type", "image/png");
      res.send(buffer);
    } catch (err) {
      console.error("Error applying filter:", err);
    }
  }
);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
