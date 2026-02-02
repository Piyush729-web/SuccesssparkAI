const questionAnswerPrompt = (role, experience, topicsToFocus, numberOfQuestions) => (`
    You are an AI trained to generate technical interview questions and answers.

    Task:
    - Role:${role}
    - Candidate Experience: ${experience} years
    - Focus Topics: ${topicsToFocus}
    - Write ${numberOfQuestions} interview questions.
    - For each question,generate a detailed but beginner-friendly answer.
    - If the answer needs a code example, add a small code block inside.
    - Keep formattiong very clean.
    - Return a pure JSON array like:
    [
       {
          "question": "Question here?",
          "answer": "Answer here.";
       },
       ...
    ]
    Important: Do NOT add any extra text. Only return valid JSON.
    `);

const conceptExplainPrompt = (question) => `
    You are an AI trained to generate explanations for a given interview question.

    Task:

    - Explain the following interview question and its concept in depth as if you're teaching a beginner developer.
    - Question: "${question}"
    - After the explanation, provide a short and clear title that summarizes the concept for the article or page header.
    - If the explanation include a code example, provide a small code block.
    - Keep the formatting very clean and clear.
    - Return the result as a valid JSON object in the following format:

    {
        "title": "Short title here",
        "explanation": "Explanation here."
    }

    Important: Do NOT add any extra text outside the JSON format. Only return valid JSON.
    `;

const answerEvaluationPrompt = (question, userAnswer, experience) => `
    You are an AI trained to evaluate technical interview answers.

    Task:
    - Interview Question: "${question}"
    - Candidate's Answer: "${userAnswer}"
    - Candidate Experience: ${experience} years

    Evaluate the candidate's answer and provide:
    1. A score from 1-10 based on:
       - Technical accuracy (40%)
       - Clarity and communication (30%)
       - Depth and completeness (30%)
    
    2. A model answer that demonstrates the ideal response for someone with ${experience} years of experience.
    
    3. Specific feedback on what was good and what could be improved.

    Return a valid JSON object in this exact format:
    {
        "score": 7,
        "modelAnswer": "The ideal answer here...",
        "feedback": "Your answer was good because... However, you could improve by..."
    }

    Important: Do NOT add any extra text outside the JSON format. Only return valid JSON.
`;

module.exports = { questionAnswerPrompt, conceptExplainPrompt, answerEvaluationPrompt };