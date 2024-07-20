"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const express_1 = __importDefault(require("express"));
const upload_1 = __importDefault(require("../middlewares/upload")); // multer for file upload
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
const router = express_1.default.Router();
router.get("/", (req, res) => {
    res.send("This is the base group route.");
});
function deleteFile(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield fs_1.default.promises.unlink(filePath);
            console.log(`Deleted file: ${filePath}`);
        }
        catch (error) {
            console.error(`Error deleting file: ${filePath}`, error);
        }
    });
}
router.post('/upload', upload_1.default.single('file'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    console.log("Working on file...");
    try {
        if (!req.file) {
            return res.status(400).send({ message: 'No file uploaded' });
        }
        const outputFile = req.body.name;
        const inputFilePath = req.file.path;
        console.log(`File path: ${__dirname}`);
        const script_relativePath = '../../scripts/md.py';
        const outputfile_relativePth = `../../output/${outputFile}`;
        // Resolve the absolute path
        const script_absolutePath = path_1.default.resolve(__dirname, script_relativePath);
        const outputfile_absolutePath = path_1.default.resolve(__dirname, outputfile_relativePth);
        console.log("Absolute path: ", script_absolutePath);
        const command = `python ${script_absolutePath} ${inputFilePath} ${outputfile_absolutePath}`;
        console.log(command);
        // Execute the command
        console.log("Starting execution...");
        const child = (0, child_process_1.exec)(command);
        (_a = child.stdout) === null || _a === void 0 ? void 0 : _a.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });
        (_b = child.stderr) === null || _b === void 0 ? void 0 : _b.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });
        child.on('close', (code) => {
            if (code === 0) {
                console.log('Python script executed successfully');
                // Construct the URL to the output file
                const fileUrl = `${req.protocol}://${req.get('host')}/output/${outputFile}`;
                res.status(200).send({
                    message: 'File uploaded and processed successfully',
                    fileUrl
                });
            }
            else {
                console.error(`Python script exited with code ${code}`);
                res.status(500).send({ message: 'Error processing file with Python script' });
            }
            // Delete the upload file after processing
            deleteFile(inputFilePath);
        });
    }
    catch (error) {
        console.error('Error uploading or processing file:', error);
        res.status(500).send({ message: 'Error uploading or processing file', error });
    }
}));
// Catch-all route for 404
router.all("*", (req, res) => {
    res.status(404).send("Route not found.");
});
exports.default = router;
