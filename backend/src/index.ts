import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { config } from "dotenv"
import cors from "cors";
import { Jimp } from "jimp";

config()
const app = express();
app.use(express.json());
const PORT = 3000;
app.use(cors());

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

app.get("/", (req, res) => {
  res.send("ok!")
})

app.post(
  "/upload",
  upload.single("image"),
  async (req: Request, res: Response) => {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded." });
      return;
    }

    try {
      const image = await Jimp.read(req.file.path);
      image
      .dither()
      .resize({w: 600})
      .quantize({
        colors: 12,
        colorDistanceFormula: 'euclidean',
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
  console.log(`Server is running on PORT:${PORT}`);
});
