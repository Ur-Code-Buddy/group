import dotenv from 'dotenv';
import express from 'express';
import groupRoutes from './routes/groupRoutes';
import bodyParser from 'body-parser';
import cors from 'cors';

dotenv.config(); 
const app = express();
app.use(cors()); // CORS for all routes
app.use(bodyParser.json());

// MongoDB connection
// mongoose.connect(process.env.MONGODB_URI as string, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

app.use('/group/api', groupRoutes);

app.get('/', (req, res) => {
  res.send('base server is working');
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
