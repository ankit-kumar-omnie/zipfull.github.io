const express = require("express");
const cors = require("cors");
const multer = require("multer");
const JSZip = require("jszip");
const fs = require("fs");

const app = express();
const port = 3000;

app.use(cors());

const upload = multer({ dest: "uploads/" });

app.post("/convert", upload.array("pdfFiles", 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const zip = new JSZip();
    
    req.files.forEach((file, index) => {
      const pdfBuffer = fs.readFileSync(file.path);
      zip.file(`converted_${index + 1}.pdf`, pdfBuffer);
    });

    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", "attachment; filename=converted.zip");
    res.send(zipBuffer);
  } catch (error) {
    console.error("Error converting PDFs to ZIP:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
