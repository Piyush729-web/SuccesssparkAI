const { GoogleGenAI } = require("@google/genai");
const {questionAnswerPrompt, conceptExplainPrompt} = require("../utils/prompts");

const ai = new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY});

const generateInterviewQuestion = async(req,res)=>{
    try{
        const {role, experience, topicsToFocus, numberOfQuestion} = req.body;
        if(!role || !experience || !topicsToFocus || !numberOfQuestion){
            return res.status(400).json({message: "Missing required fields"});
        }

        const prompt = questionAnswerPrompt(role, experience,topicsToFocus,numberOfQuestion);

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        let rawText = response.text;

        const cleanedText = rawText.replace(/^```json\s*/, "") //remove starting ```json
        .replace(/```$/, "") //remove ending ```
        .trim(); //remove extra spaces

        //Now safe to parse
        const data = JSON.parse(cleanedText);

        res.status(200).json(data);

    }catch(error){
        res.status(500).json({
            message:"Failed to generate question",
            error:error.message,
        });
    }
};

const generateConceptExplanation = async(req,res)=>{
    try{
        const {question} =req.body;

        if(!question)
        {
            return res.status(400).json({message:"Missing required feilds"});
        }

        const prompt = conceptExplainPrompt(question);

        const response = await ai.models.generateContent({
            model:"gemini-2.5-flash",
            contents:prompt,
        });

        let rawText = response.text;

        const cleanedText = rawText
           .replace(/^```json\s*/, "") //remove starting ``` json
           .replace(/```$/, "") //remove ending ```
           .trim();  // remove extra space

        //now safe to parse
        const data  = JSON.parse(cleanedText);

        res.status(200).json(data);
    }catch(error){
        res.status(500).json({
            message:"Failed to generate question",
            error:error.message,
        });
    }
};


module.exports = {generateInterviewQuestion , generateConceptExplanation};