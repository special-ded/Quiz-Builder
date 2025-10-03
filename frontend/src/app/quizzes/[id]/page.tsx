'use client';

import {useParams, useRouter} from 'next/navigation';
import {useState, useEffect} from 'react';
import Layout from '@/components/Layout';
import {quizAPI, type Quiz} from '@/services/api';

export default function QuizDetail() {
    const params = useParams();
    const router = useRouter();
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [loading, setLoading] = useState(true);

    const quizId = params.id as string;

    useEffect(() => {
        if (quizId) {
            fetchQuiz();
        }
    }, [quizId]);

    const fetchQuiz = async () => {
        try {
            const response = await quizAPI.getQuizById(quizId);
            setQuiz(response.data);
        } catch (error: any) {
            console.error('Error fetching quiz:', error);
            if (error.response?.status === 404) {
                alert('Quiz not found');
                router.push('/quizzes');
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="container mx-auto px-4 py-8">
                    <div className="flex justify-center items-center h-64">
                        <div className="text-lg text-gray-600">Loading quiz...</div>
                    </div>
                </div>
            </Layout>
        );
    }

    if (!quiz) {
        return (
            <Layout>
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center py-16">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Quiz Not Found</h1>
                        <button
                            onClick={() => router.push('/quizzes')}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        >
                            Back to Quizzes
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{quiz.title}</h1>
                    <p className="text-gray-600">
                        Created: {new Date(quiz.createdAt).toLocaleDateString()} •
                        Updated: {new Date(quiz.updatedAt).toLocaleDateString()} •
                        {quiz.questions.length} question{quiz.questions.length !== 1 ? 's' : ''}
                    </p>
                </div>

                <div className="space-y-6">
                    {quiz.questions.map((question, index) => (
                        <div key={question.id || `question-${index}`}
                             className="bg-white rounded-lg shadow-sm border p-6">
                            <div className="flex items-start justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Question {index + 1}: {question.text}
                                </h3>
                                <span
                                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                                    {question.type.toLowerCase()}
                                </span>
                            </div>

                            {question.type === 'BOOLEAN' && (
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-gray-700 mb-2">Options:</p>
                                    {question.options.map((option, optIndex) => (
                                        <div key={option.id || `option-${optIndex}`}
                                             className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <input
                                                type="radio"
                                                checked={option.isCorrect}
                                                readOnly
                                                className="w-4 h-4 text-blue-600"
                                            />
                                            <span
                                                className={`font-medium ${option.isCorrect ? 'text-green-600' : 'text-gray-700'}`}>
                                                {option.text}{option.isCorrect && ' ✓ (Correct)'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {question.type === 'INPUT' && (
                                <div>
                                    <p className="text-sm font-medium text-gray-700 mb-2">Expected Answer:</p>
                                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                        <span className="font-medium text-green-800">{question.options[0]?.text}</span>
                                    </div>
                                </div>
                            )}

                            {question.type === 'CHECKBOX' && (
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-gray-700 mb-2">Options:</p>
                                    {question.options.map((option, optIndex) => (
                                        <div key={option.id || `option-${optIndex}`}
                                             className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <input
                                                type="checkbox"
                                                checked={option.isCorrect}
                                                readOnly
                                                className="w-4 h-4 text-blue-600 rounded"
                                            />
                                            <span
                                                className={`font-medium ${option.isCorrect ? 'text-green-600' : 'text-gray-700'}`}>
                        {option.text}{option.isCorrect && ' ✓ (Correct)'}
                      </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-8 flex justify-center">
                    <button
                        onClick={() => router.push('/quizzes')}
                        className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                    >
                        Back to All Quizzes
                    </button>
                </div>
            </div>
        </Layout>
    );
}