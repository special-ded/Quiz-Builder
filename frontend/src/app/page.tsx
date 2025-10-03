import Link from 'next/link';

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="container mx-auto px-4 py-16">
                <div className="text-center">
                    <h1 className="text-5xl font-bold text-gray-900 mb-6">
                        Quiz Builder
                    </h1>
                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        Create custom quizzes with different question types.
                        Build, manage, and share your quizzes with ease.
                    </p>
                    <div className="flex justify-center gap-4 flex-wrap">
                        <Link
                            href="/quizzes"
                            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        >
                            Browse Quizzes
                        </Link>
                        <Link
                            href="/create"
                            className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                        >
                            Create New Quiz
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}