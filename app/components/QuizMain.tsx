'use client';

import React, { useState, useEffect } from 'react';
import styles from './QuizMain.module.scss';
// import styles from '@/styles/components/QuizMain.module.scss';
// import { QuizResponse } from '@/types';

export default function QuizMain() {
    const [quiz, setQuiz] = useState<any | null>(null);
    const [guess, setGuess] = useState('');
    const [currentLevel, setCurrentLevel] = useState(1);
    const [gameOver, setGameOver] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNewQuiz();
    }, []);

    const fetchNewQuiz = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/quiz', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const data = await response.json();
            setQuiz(data);
            setCurrentLevel(1);
            setGameOver(false);
            setGuess('');
        } catch (error) {
            console.error('Fel vid hämtning av quiz:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleGuess = () => {
        if (!quiz) return;

        if (guess.toLowerCase() === quiz.answer.toLowerCase()) {
            setGameOver(true);
            alert(`Grattis! Du klarade det på nivå ${currentLevel}!`);
        } else if (currentLevel >= 10) {
            setGameOver(true);
            alert(`Tyvärr! Rätt svar var: ${quiz.answer}`);
        } else {
            setCurrentLevel(prev => prev + 1);
            setGuess('');
        }
    };

    if (loading) return <div>Laddar quiz...</div>;
    if (!quiz) return <div>Något gick fel...</div>;

    return (
        <div className={styles.container}>
            <h1>Gissa Objektet</h1>
            
            <div className={styles.gameArea}>
                <div className={styles.clue}>
                    Nivå {currentLevel}: {quiz.clues[quiz.clues.length - currentLevel]}
                </div>

                {!gameOver && (
                    <div className={styles.inputArea}>
                        <input
                            type="text"
                            value={guess}
                            onChange={(e) => setGuess(e.target.value)}
                            placeholder="Skriv din gissning här"
                            onKeyPress={(e) => e.key === 'Enter' && handleGuess()}
                        />
                        <button onClick={handleGuess}>Gissa</button>
                    </div>
                )}

                <button 
                    className={styles.newGameButton}
                    onClick={fetchNewQuiz}
                >
                    Nytt Quiz
                </button>
            </div>
        </div>
    );
}