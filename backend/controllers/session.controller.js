const Session=require("../models/session.model.js");
const Question=require("../models/question.model.js");


exports.createSession = async(req,res) => {
    try{
        const {role, experience,description, topicToFocus, questions}=req.body;
        const userId = req.user?._id;
        const session = await Session.create({
            user:userId,
            role,
            experience,
            topicToFocus:topicToFocus,
            description
        });
        // Validate questions is an array
        if (!Array.isArray(questions)) {
            return res.status(400).json({ success: false, message: "Questions must be an array" });
        }
        const questionDocs = await Promise.all(
            questions.map(async (q) => {
                if (!q.question || !q.answer) {
                    throw new Error("Each question must have both 'question' and 'answer' fields");
                }
                const question = await Question.create({
                    session: session._id,
                    question: q.question,
                    answer: q.answer,
                });
                return question._id;
            })
        );
        

        session.questions = questionDocs;
        await session.save();

        return res.status(201).json({success:true,session});

    }catch(error){
        res.status(500).json({success:false , message:"server Error"});
    }
};


exports.getMySession =async(req,res)=>{
    try{
        const sessions = await Session.find({user:req.user.id})
        .sort({createdAt:-1})
        .populate("questions");
        res.status(200).json(sessions);

    }catch(error){
        res.status(500).json({success:false , message:"server Error"});
    }
};

exports.getSessionById =async(req,res)=>{
    try{
        const session = await Session.findById(req.params.id)
        .populate({
            path:"questions",
        options:{sort:{isPinned:-1,createdAt:1}},
    })
    .exec();
    
    if(!session){
        return  res.status(404).json({success:false,message:"Session not found"});
    }
    res.status(200).json({success:true,session});


    }catch(error){
        res.status(500).json({success:false , message:"server Error"});
    }
};

exports.deleteSession =async(req,res)=>{
    try{
        const session =await Session.findById(req.params.id);

        if(!session)
        {
            return res.status(404).json({message:"Session not found"});
        }

        //check the user owns this session 
        if(session.user.toString() !== req.user.id)
        {
            return res.status(401).json({message:"Not authorized to delet this session"});
        }

        //delet all question linked to session
        await Question.deleteMany({session:session._id});

        //then delete the session
        await session.deleteOne(); 

        res.status(200).json({message:"Session deleted successfully"});
    }catch(error){
        res.status(500).json({success:false , message:"server Error"});
    }
};