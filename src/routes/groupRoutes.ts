

// this is rooturl + /group/api/..

import fs from 'fs';
import express, { Request, Response } from 'express';
import upload from '../middlewares/upload'; //multer for file upload
import xlsx from 'xlsx';
import { any } from 'zod';
const router = express.Router();

router.get("/", (req, res) => {
    res.send("This is the base group route.");
});


async function deleteFile(filePath: string) {
    try {
        await fs.promises.unlink(filePath);
        console.log(`Deleted file: ${filePath}`);
    } catch (error) {
        console.error(`Error deleting file: ${filePath}`, error);
    }
}

router.post('/upload', upload.single('file'), async (req: Request, res: Response) => {
    console.log("Upload hit 2");
    try {
        if (!req.file) {
            return res.status(400).send({ message: 'No file uploaded' });
        }

        //req.file.path is the filepath where the file is stored

        const workbook = xlsx.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(worksheet);

        // Do something with the data
        console.log(data);


        //delete the file after processing
        await deleteFile(req.file.path);

        res.status(200).send({ message: 'File uploaded and processed successfully', data });
    } catch (error) {
        console.error('Error uploading or processing file:', error);
        res.status(500).send({ message: 'Error uploading or processing file', error });
    }
});







//catch all route for 404
router.all("*", (req, res) => {
    res.status(404).send("Route not found.");
});

export default router;