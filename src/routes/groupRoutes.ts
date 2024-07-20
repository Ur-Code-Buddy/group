

// this is rooturl + /group/api/..

import fs from 'fs';
import express, { Request, Response } from 'express';
import upload from '../middlewares/upload'; //multer for file upload
import xlsx from 'xlsx';
const path = require('path');
import { any } from 'zod';

const { exec } = require('child_process');
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
    console.log("Working on file...");
    try {
        if (!req.file) {
            return res.status(400).send({ message: 'No file uploaded' });
        }

        const outputFile : string = req.body.name;

        const inputFilePath = req.file.path;
        // const filepath = path.join(__dirname, `../../output/${inputFilePath}`);
        console.log(`File path: ${__dirname}`);

        // console.log(`File path 123: ${inputFilePath} and output file name: ${outputFile}`);
        const script_relativePath = '../../scripts/md.py';
        const outputfile_relativePth = `../../output/${outputFile}`

// Resolve the absolute path
        const script_absolutePath = path.resolve(__dirname, script_relativePath);
        const outputfile_absolutePath = path.resolve(__dirname, outputfile_relativePth);

        console.log("Absolute path: ", script_absolutePath);

        const command = `python ${script_absolutePath} ${inputFilePath} ${outputfile_absolutePath}`;
        console.log(command);

        // Execute the command
        console.log(" starting execution...");
        const child = exec(command);

        child.stdout?.on('data', (data : any) => {
            console.log(`stdout: ${data}`);
        });

        child.stderr?.on('data', (data : any) => {
            console.error(`stderr: ${data}`);
        });

        child.on('close', (code : any) => {
            if (code === 0) {
                console.log('Python script executed successfully');
                res.status(200).send({ message: 'File uploaded and processed successfully' });
            } else {
                console.error(`Python script exited with code ${code}`);
                res.status(500).send({ message: 'Error processing file with Python script' });
            }

            // Delete the file after processing
            deleteFile(inputFilePath);
        });

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