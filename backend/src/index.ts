import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs"; 
import cors from "cors";
import asciify from "asciify-image";
import { createCanvas } from "canvas";

const app = express();
app.use(express.json());
const PORT = 3000;

app.use(cors({
    origin: "http://localhost:5173"
}));

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
    width: 60
}  

app.post("/upload", upload.single("image"), (req: Request, res: Response): void => {
    if (!req.file) {
        res.status(400).json({ error: "No file uploaded." });
        return;
    }

    asciify(req.file.path, options).then(function (asciified) {
        try {
            //@ts-ignore
            const lines = asciified.split("\n");
            const canvasWidth = lines[0].length*5;
            const canvasHeight = lines.length*10;
            const canvas = createCanvas(canvasWidth, canvasHeight);
            const ctx = canvas.getContext("2d");
        
            ctx.fillStyle = "#000";
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
            ctx.font = "10px Monospace";
            ctx.fillStyle = "#fff";
        
            lines.forEach((line: string, index: number) => {
              ctx.fillText(line, 0, (index+1) * 10);
            });
        
            res.setHeader("Content-Type", "image/png");
            canvas.createPNGStream().pipe(res);
          } catch (error) {
            console.error("Error converting ASCII to image:", error);
            res.status(500).send("Failed to convert ASCII to image");
          }
    }).catch(function (err) {
        res.status(400).json({ error: err });
    });
    

});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
