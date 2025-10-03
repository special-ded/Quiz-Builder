import { Request, Response } from 'express';
import prisma from '../db/client';

export const createQuiz = async (req: Request, res: Response) => {
    try {
        const { title, questions } = req.body;

        if (!title || !questions) {
            return res.status(400).json({ error: 'Title and questions are required' });
        }

        const quiz = await prisma.quiz.create({
            data: {
                title: title.trim(),
                questions: {
                    create: questions.map((question: any) => ({
                        text: question.text.trim(),
                        type: question.type,
                        options: {
                            create: question.options.map((option: any) => ({
                                text: option.text.trim(),
                                isCorrect: option.isCorrect
                            }))
                        }
                    }))
                }
            },
            include: {
                questions: {
                    include: {
                        options: true
                    }
                }
            }
        });

        res.status(201).json(quiz);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const getAllQuizzes = async (req: Request, res: Response) => {
    try {
        const quizzes = await prisma.quiz.findMany({
            select: {
                id: true,
                title: true,
                createdAt: true,
                _count: {
                    select: {
                        questions: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        const quizzesWithCount = quizzes.map((quiz: { id: any; title: any; createdAt: any; _count: { questions: any; }; }) => ({
            id: quiz.id,
            title: quiz.title,
            createdAt: quiz.createdAt,
            questionCount: quiz._count.questions
        }));

        res.json(quizzesWithCount);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getQuizById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const quiz = await prisma.quiz.findUnique({
            where: { id },
            include: {
                questions: {
                    include: {
                        options: true
                    }
                }
            }
        });

        if (!quiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }

        res.json(quiz);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteQuiz = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        await prisma.quiz.delete({
            where: { id }
        });

        res.status(204).send();
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};