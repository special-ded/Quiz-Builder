import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: API_BASE_URL,
});

export interface Option {
    id?: string;
    text: string;
    isCorrect: boolean;
}

export interface Question {
    id?: string;
    text: string;
    type: 'BOOLEAN' | 'INPUT' | 'CHECKBOX';
    options: Option[];
}

export interface Quiz {
    id: string;
    title: string;
    questions: Question[];
    createdAt: string;
    updatedAt: string;
}

export interface QuizSummary {
    id: string;
    title: string;
    questionCount: number;
    createdAt: string;
}

export const quizAPI = {
    createQuiz: (quizData: { title: string; questions: Question[] }): Promise<{ data: Quiz }> =>
        api.post('/quizzes', quizData),

    getAllQuizzes: (): Promise<{ data: QuizSummary[] }> =>
        api.get('/quizzes'),

    getQuizById: (id: string): Promise<{ data: Quiz }> =>
        api.get(`/quizzes/${id}`),

    deleteQuiz: (id: string): Promise<void> =>
        api.delete(`/quizzes/${id}`),
};