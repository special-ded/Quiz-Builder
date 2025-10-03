import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import quizRoutes from './routes/quizRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/quizzes', quizRoutes);

app.get('/health', (req, res) => {
    res.json({status: 'OK', message: 'Quiz Builder API is running'});
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});