"use strict";
// this is rooturl + /group/api/..
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
const upload_1 = __importDefault(require("../middlewares/upload")); //multer for file upload
const xlsx_1 = __importDefault(require("xlsx"));
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
    console.log("Upload hit 2");
    try {
        if (!req.file) {
            return res.status(400).send({ message: 'No file uploaded' });
        }
        const workbook = xlsx_1.default.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = xlsx_1.default.utils.sheet_to_json(worksheet);
        // Do something with the data
        console.log(data);
        yield deleteFile(req.file.path);
        res.status(200).send({ message: 'File uploaded and processed successfully', data });
    }
    catch (error) {
        console.error('Error uploading or processing file:', error);
        res.status(500).send({ message: 'Error uploading or processing file', error });
    }
}));
//catch all route for 404
router.all("*", (req, res) => {
    res.status(404).send("Route not found.");
});
exports.default = router;
