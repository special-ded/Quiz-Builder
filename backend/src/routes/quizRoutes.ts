import express from 'express';
import {
    createQuiz,
    getAllQuizzes,
    getQuizById,
    deleteQuiz
} from '../controllers/quizController';

const router = express.Router();

router.post('/', createQuiz);
router.get('/', getAllQuizzes);
router.get('/:id', getQuizById);
router.delete('/:id', deleteQuiz);

export default router;