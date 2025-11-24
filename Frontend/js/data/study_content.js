// data/study_content.js
/**
 * Study Content Database - Index File
 * 
 * This file aggregates all individual philosopher study content files.
 * Each philosopher has their own file in the study_content/ directory.
 * 
 * To add a new philosopher:
 * 1. Create a new file in study_content/ (use _template.js as a guide)
 * 2. Import it here
 * 3. Add it to the STUDY_CONTENT_DATA object with the philosopher's ID as the key
 */

// Import individual philosopher content files
import { talesContent } from './study_content/tales.js';

/**
 * Database of Study Content.
 * Contains detailed articles, quizzes, and comics for each philosopher.
 * @type {Object.<string, {
 *   realImage: string,
 *   totalPages: number,
 *   tableOfContents: Object.<number, string>,
 *   pages: Object.<string, string>,
 *   quiz: Array<{question: string, options: string[], answer: string}>,
 *   comic: string[]
 * }>}
 */
export const STUDY_CONTENT_DATA = {
    // Pre-Socratic Philosophers
    '21': talesContent,  // Tales de Mileto

    // Add more philosophers here as you create their content files:
    // '22': anaximandroContent,  // Anaximandro
    // '23': anaximenes Content,   // Anaxímenes
    // '1': socratesContent,       // Sócrates
    // '2': plataoContent,         // Platão
    // '3': aristotelesContent,    // Aristóteles
    // ... etc
};