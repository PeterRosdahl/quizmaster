'use client';

import React, { useState, useEffect } from 'react';
import styles from './QuizMain.module.scss';

interface Question {
    level: number;
    question: string;
    difficulty: string;
}

interface Quiz {
    questions: Question[];
    intro: string;

}
interface ApiResponse {
    success: boolean;
    data?: {
        quiz: Quiz;
    };
    error?: string;
}

export default function QuizMain() {
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchQuestions = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch('/api/questions');
            const rawText = await response.text();
            let data: ApiResponse;
            try {
                data = JSON.parse(rawText);
            } catch (e) {
                console.error('Failed to parse JSON:', e);
                throw new Error('Invalid JSON response from server');
            }
            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch questions');
            }
            
            console.log(data?.data);
            if (!data.success || !data.data?.quiz) {
                
                throw new Error('Invalid response format');
            }

            setQuiz(data.data.quiz);
        } catch (error: any) {
            console.error('Failed to fetch questions:', error);
            setError(error.message || 'Failed to load questions');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, []);

    if (isLoading) {
        return <div className={styles.container}>Laddar frågor...</div>;
    }

    if (error) {
        return <div className={styles.error}>Error: {error}</div>;
    }

    return (
        <div className={styles.container}>
            <h1>Quiz</h1>
            {quiz && quiz.questions.length > 0 ? (
                <div className={styles.questions}>
                    {quiz.questions.map((question, index) => (
                        <div key={index} className={styles.question}>
                            <h3>Nivå {question.level} ({question.difficulty})</h3>
                            <p>{question.question}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Inga frågor tillgängliga</p>
            )}
        </div>
    );
}