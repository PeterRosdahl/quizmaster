// import { quizQuestions } from '@/app/data/questions';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getRandomMovie } from '../../utils/helpers';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function generateQuizQuestions(movie: any) {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `"Du är en underhållande quizmaster som skapar filmfrågor baserade på manus, med fem progressiva svårighetsnivåer. Ditt mål är att leda deltagarna till rätt film genom att ge ledtrådar som gradvis blir lättare, men de mest ikoniska referenserna – som kända karaktärsnamn eller klassiska citat – hålls till de sista nivåerna. Språket ska vara lättsamt och humoristiskt, som en skön programledare för ett game show, och varje nivå ska öka i tydlighet utan att direkt avslöja svaret.

För varje film skapar du följande:

Nivå 1 - Supersvår: En klurig ledtråd om en okänd detalj från handlingen, en specifik scen eller bakgrundstrivia. Inga ikoniska namn, repliker eller scener får användas här.

Nivå 2 - Svår: En allmän ledtråd om miljö, genre eller en mindre karaktärs egenskaper, utan att nämna huvudkaraktärerna eller klassiska repliker. Detta ska vara en nivå som filmkännare kan börja känna igen men fortfarande kräver fundering.

Nivå 3 - Medelsvår: En hint om en igenkännbar scen eller ett citat som är känt, men inte så ikoniskt att filmen omedelbart avslöjas. Här kan också viktiga men mindre kända karaktärers namn förekomma.

Nivå 4 - Lätt: En ledtråd om huvudkonflikten, en viktig händelse eller ett centralt hinder för huvudkaraktären. De som sett filmen känner här igen sig, men inga ikoniska namn eller repliker bör förekomma än.

Nivå 5 - Mycket Lätt: Nu kan du använda det mest kända, såsom huvudkaraktärens namn, en ikonisk replik eller en legendarisk scen som gör filmen omedelbart igenkännbar.

**Efter sista nivån, om deltagarna inte gissar rätt, avslöja filmens titel och berätta en rolig trivia om produktionen, såsom skådespelarinsatser, intressanta fakta om inspelningen eller varför filmen blivit en klassiker. 
   
Generate JSON
Svara med json på följande format:
[intro: "Hej och välkomna...",questions: [    {
        level: 1,
        question: "Detta är en testfråga nivå 1",
        difficulty: "Supersvår"
    },
    {
        level: 2,
        question: "Detta är en testfråga nivå 2",
        difficulty: "Svår"
                }
        ]
]"`
},
                {
                    role: "user",
                    content: `Skapa quiz-frågor för filmen: ${movie.Title} (${movie.Year})`
                }
            ],
            temperature: 0.7,
            response_format: { type: "json_object" }
        });
            console.log(completion);
            
        return completion.choices[0].message.content;
      
    } catch (error) {
        console.error('Error generating quiz questions:', error);
        throw error;
    }
}

export async function GET() {
    try {

       const movie = await getRandomMovie()
        const quizQuestions = await generateQuizQuestions(movie);
        return NextResponse.json({
            success: true,
            data: {
                questions: quizQuestions ? JSON.parse(quizQuestions) : []
            }
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
    }
}
