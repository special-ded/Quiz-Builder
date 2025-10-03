'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import Layout from '@/components/Layout';
import {quizAPI, type Question, type Option} from '@/services/api';

const QUESTION_TYPES = {
    BOOLEAN: 'BOOLEAN',
    INPUT: 'INPUT',
    CHECKBOX: 'CHECKBOX',
} as const;

export default function CreateQuiz() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const addQuestion = (type: 'BOOLEAN' | 'INPUT' | 'CHECKBOX') => {
        const newQuestion: Question = {
            text: '',
            type,
            options: type === QUESTION_TYPES.BOOLEAN
                ? [
                    {text: 'True', isCorrect: false},
                    {text: 'False', isCorrect: false}
                ]
                : type === QUESTION_TYPES.INPUT
                    ? [{text: '', isCorrect: true}]
                    : [
                        {text: '', isCorrect: false},
                        {text: '', isCorrect: false}
                    ]
        };
        setQuestions([...questions, newQuestion]);
    };

    const removeQuestion = (index: number) => {
        setQuestions(questions.filter((_, i) => i !== index));
    };

    const updateQuestion = (index: number, field: keyof Question, value: string) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index] = {...updatedQuestions[index], [field]: value};
        setQuestions(updatedQuestions);
    };

    const updateOption = (questionIndex: number, optionIndex: number, field: keyof Option, value: string | boolean) => {
        const updatedQuestions = [...questions];
        const updatedOptions = [...updatedQuestions[questionIndex].options];
        updatedOptions[optionIndex] = {...updatedOptions[optionIndex], [field]: value};
        updatedQuestions[questionIndex] = {...updatedQuestions[questionIndex], options: updatedOptions};
        setQuestions(updatedQuestions);
    };

    const addOption = (questionIndex: number) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].options.push({text: '', isCorrect: false});
        setQuestions(updatedQuestions);
    };

    const removeOption = (questionIndex: number, optionIndex: number) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].options.splice(optionIndex, 1);
        setQuestions(updatedQuestions);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || questions.length === 0) {
            alert('Please add a title and at least one question');
            return;
        }

        for (const question of questions) {
            if (!question.text.trim()) {
                alert('All questions must have text');
                return;
            }
            for (const option of question.options) {
                if (!option.text.trim()) {
                    alert('All options must have text');
                    return;
                }
            }
        }

        setIsSubmitting(true);
        try {
            await quizAPI.createQuiz({title, questions});
            router.push('/quizzes');
        } catch (error: any) {
            alert('Error creating quiz: ' + (error.response?.data?.error || error.message));
        } finally {
            setIsSubmitting(false);
        }
    };
    console.log(questions)

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8 text-gray-900">Create New Quiz</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Quiz Title *
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter quiz title..."
                            required
                        />
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">Questions</h2>
                            <div className="flex gap-2 flex-wrap">
                                <button
                                    type="button"
                                    onClick={() => addQuestion(QUESTION_TYPES.BOOLEAN)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm"
                                >
                                    Add Boolean
                                </button>
                                <button
                                    type="button"
                                    onClick={() => addQuestion(QUESTION_TYPES.INPUT)}
                                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm"
                                >
                                    Add Input
                                </button>
                                <button
                                    type="button"
                                    onClick={() => addQuestion(QUESTION_TYPES.CHECKBOX)}
                                    className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors text-sm"
                                >
                                    Add Checkbox
                                </button>
                            </div>
                        </div>

                        {questions.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                No questions added yet. Click the buttons above to add questions.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {questions.map((question, questionIndex) => (
                                    <div key={questionIndex} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="font-semibold text-gray-900">
                                                {question.type.charAt(0) + question.type.slice(1).toLowerCase()} Question
                                            </h3>
                                            <button
                                                type="button"
                                                onClick={() => removeQuestion(questionIndex)}
                                                className="text-red-500 hover:text-red-700 text-sm"
                                            >
                                                Remove Question
                                            </button>
                                        </div>

                                        <input
                                            type="text"
                                            placeholder="Enter your question..."
                                            value={question.text}
                                            onChange={(e) => updateQuestion(questionIndex, 'text', e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        />
                                        {question.type === QUESTION_TYPES.BOOLEAN && (
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Select correct answer:
                                                </label>
                                                {question.options.map((option, optionIndex) => (
                                                    <div key={optionIndex}
                                                         className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                                                        <input
                                                            type="radio"
                                                            name={`boolean-${questionIndex}`}
                                                            checked={option.isCorrect}
                                                            onChange={() => {
                                                                const updatedOptions = question.options.map((opt, idx) => ({
                                                                    ...opt,
                                                                    isCorrect: idx === optionIndex
                                                                }));
                                                                const updatedQuestions = [...questions];
                                                                updatedQuestions[questionIndex] = {
                                                                    ...updatedQuestions[questionIndex],
                                                                    options: updatedOptions
                                                                };
                                                                setQuestions(updatedQuestions);
                                                            }}
                                                            className="w-4 h-4 text-blue-600 cursor-pointer"
                                                        />
                                                        <span className="text-gray-700 cursor-pointer"
                                                              onClick={() => {
                                                                  const updatedOptions = question.options.map((opt, idx) => ({
                                                                      ...opt,
                                                                      isCorrect: idx === optionIndex
                                                                  }));

                                                                  const updatedQuestions = [...questions];
                                                                  updatedQuestions[questionIndex] = {
                                                                      ...updatedQuestions[questionIndex],
                                                                      options: updatedOptions
                                                                  };
                                                                  setQuestions(updatedQuestions);
                                                              }}>{option.text}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {question.type === QUESTION_TYPES.INPUT && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Expected answer:
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Enter expected answer..."
                                                    value={question.options[0].text}
                                                    onChange={(e) => updateOption(questionIndex, 0, 'text', e.target.value)}
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                />
                                            </div>
                                        )}

                                        {question.type === QUESTION_TYPES.CHECKBOX && (
                                            <div className="space-y-3">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Options (check all that are correct):
                                                </label>
                                                {question.options.map((option, optionIndex) => (
                                                    <div key={optionIndex}
                                                         className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                                                        <input
                                                            type="checkbox"
                                                            checked={option.isCorrect}
                                                            onChange={(e) => updateOption(questionIndex, optionIndex, 'isCorrect', e.target.checked)}
                                                            className="w-4 h-4 text-blue-600 rounded"
                                                        />
                                                        <input
                                                            type="text"
                                                            placeholder="Option text..."
                                                            value={option.text}
                                                            onChange={(e) => updateOption(questionIndex, optionIndex, 'text', e.target.value)}
                                                            className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                            required
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => removeOption(questionIndex, optionIndex)}
                                                            className="text-red-500 hover:text-red-700 p-1"
                                                            disabled={question.options.length <= 2}
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                ))}
                                                <button
                                                    type="button"
                                                    onClick={() => addOption(questionIndex)}
                                                    className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                                                >
                                                    + Add Option
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting || !title.trim() || questions.length === 0}
                            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                            {isSubmitting ? 'Creating...' : 'Create Quiz'}
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
}