import { promises as fs } from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

export interface Movie {
    Rank: string;
    Title: string;
    Genre: string;
    Description: string;
    Director: string;
    Actors: string;
    Year: string;
    Runtime: string;
    Rating: string;
    Votes: string;
    Revenue: string;
    Metascore: string;
}

export async function getRandomMovie(): Promise<Movie> {
    try {
        // Använd process.cwd() för att få rätt sökväg
        const csvPath = path.join(process.cwd(), 'data', 'movies.csv');
        console.log('Reading CSV from:', csvPath); // Debug logging

        const fileContent = await fs.readFile(csvPath, 'utf-8');
        console.log('File content loaded'); // Debug logging

        const records = parse(fileContent, {
            columns: true,
            skip_empty_lines: true,
            delimiter: ',',
            // Hantera citerade fält korrekt
            quote: '"'
        }) as Movie[];

        console.log('Found movies:', records.length); // Debug logging

        const randomIndex = Math.floor(Math.random() * records.length);
        return records[randomIndex];
    } catch (error) {
        console.error('Error in getRandomMovie:', error);
        throw new Error('Failed to get random movie: ' + (error as Error).message);
    }
}