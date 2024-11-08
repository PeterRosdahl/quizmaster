import { checkAnswer, quizQuestions } from '@/app/data/questions';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { questionIndex, answer } = body;

        if (questionIndex === undefined || !answer) {
            return NextResponse.json(
                { error: 'Missing questionIndex or answer' }, 
                { status: 400 }
            );
        }

        const isCorrect = checkAnswer(questionIndex, answer);
        const question = quizQuestions[questionIndex];

        return NextResponse.json({
            isCorrect,
            feedback: isCorrect ? question.feedback : `Tyvärr fel. Rätt svar var: ${question.correctAnswer}`,
        });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to check answer' }, 
            { status: 500 }
        );
    }
}
