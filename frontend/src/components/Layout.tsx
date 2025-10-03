'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';

export default function Layout({children}: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center h-16">
                        <Link href="/" className="text-xl font-bold text-blue-600">
                            Quiz Builder
                        </Link>
                        <div className="flex space-x-4">
                            <Link
                                href="/"
                                className={`px-3 py-2 rounded-md text-sm font-medium ${
                                    pathname === '/'
                                        ? 'text-blue-600 bg-blue-50'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                Home
                            </Link>
                            <Link
                                href="/quizzes"
                                className={`px-3 py-2 rounded-md text-sm font-medium ${
                                    pathname === '/quizzes'
                                        ? 'text-blue-600 bg-blue-50'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                All Quizzes
                            </Link>
                            <Link
                                href="/create"
                                className={`px-3 py-2 rounded-md text-sm font-medium ${
                                    pathname === '/create'
                                        ? 'text-blue-600 bg-blue-50'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                Create Quiz
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <main>{children}</main>
        </div>
    );
}