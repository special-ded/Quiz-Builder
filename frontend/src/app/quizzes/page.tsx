'use client';

import {useState, useEffect} from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import {quizAPI, type QuizSummary} from '@/services/api';

export default function QuizList() {
    const [quizzes, setQuizzes] = useState<QuizSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
        try {
            const response = await quizAPI.getAllQuizzes();
            setQuizzes(response.data);
        } catch (error: any) {
            console.error('Error fetching quizzes:', error);
            alert('Error loading quizzes: ' + (error.response?.data?.error || error.message));
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (quizId: string) => {
        if (!confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) {
            return;
        }

        setDeletingId(quizId);
        try {
            await quizAPI.deleteQuiz(quizId);
            setQuizzes(quizzes.filter(quiz => quiz.id !== quizId));
        } catch (error: any) {
            alert('Error deleting quiz: ' + (error.response?.data?.error || error.message));
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="container mx-auto px-4 py-8">
                    <div className="flex justify-center items-center h-64">
                        <div className="text-lg text-gray-600">Loading quizzes...</div>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">All Quizzes</h1>
                    <Link
                        href="/create"
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                        Create New Quiz
                    </Link>
                </div>

                {quizzes.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-lg shadow-sm border">
                        <div className="text-gray-500 text-lg mb-4">No quizzes found.</div>
                        <Link
                            href="/create"
                            className="text-blue-600 hover:text-blue-700 font-semibold text-lg"
                        >
                            Create your first quiz
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {quizzes.map((quiz) => (
                            <div key={quiz.id}
                                 className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                                        {quiz.title}
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        {quiz.questionCount} question{quiz.questionCount !== 1 ? 's' : ''}
                                    </p>
                                    <p className="text-sm text-gray-500 mb-4">
                                        Created: {new Date(quiz.createdAt).toLocaleDateString()}
                                    </p>
                                    <div className="flex justify-between items-center">
                                        <Link
                                            href={`/quizzes/${quiz.id}`}
                                            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                                        >
                                            View Details
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(quiz.id)}
                                            disabled={deletingId === quiz.id}
                                            className="text-red-500 hover:text-red-700 disabled:text-red-300 disabled:cursor-not-allowed text-sm"
                                        >
                                            {deletingId === quiz.id ? 'Deleting...' : 'Delete'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
}