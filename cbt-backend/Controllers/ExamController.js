// const ExamModel = require('../Models/exam.js');
const AnswerModel = require('../Models/answer.js');
const Test = require('../Models/exam.js');


class examController{

    static saveAnswer = async (req, res) => {
        try {
            const { testId, userId, answers } = req.body;

            if (!testId || !userId || !answers) {
                return res.status(400).json({ message: "Invalid request data" });
            }
            let existingAnswer = await Test.findOne({ test: testId, answered_by: userId });
    
            if (!existingAnswer) {
                existingAnswer = new Answer({
                    test: testId,
                    answered_by: userId,
                    answers: {},
                });
            }
            for (const [questionIndex, selectedOption] of Object.entries(answers)) {
                existingAnswer.answers[questionIndex - 1] = selectedOption;
            }
    
            await existingAnswer.save();
    
            res.status(201).json({ message: "Answers saved successfully" });
        } catch (error) {
            console.error("Error saving answers:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
    

    // const Test = require('./testModel'); // Import the Test model

    static addExam = async (req, res) => {
        try {
            const { instructions, sections } = req.body;
            console.log(sections)
    
            const test = new Test({
                instructions,
                sections: sections,
                createdby: "Admin",
                ratings: 0,
                difficulty: "Medium"
            });
    
            const savedTest = await test.save();
            res.status(201).json({
                isSuccessful: true,
                data: savedTest,
            });
        } catch (error) {
            console.error('Error creating test:', error);
            res.status(500).json({
                isSuccessful: false,
                data: error.message || 'Internal server error',
            });
        }
    };
    
    
    static getExams = (req, res) => {
        const { user_id } = req.query; // Assuming you get user_id as a query parameter
    
        Users.findOne({ id: user_id })
            .populate('test.test_id') // Populate the test object with all fields from the Test schema
            .then((user) => {
                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }
    
                // Extract the test IDs from the user document
                const userTestIds = user.test.map(test => test.test_id.toString());
    
                // Find all tests that are not included in the user's test list
                Test.find({ _id: { $nin: userTestIds } })
                    .then((tests) => {
                        res.status(200).json({ tests });
                    })
                    .catch((err) => {
                        console.log(err);
                        res.status(500).json({ message: "Internal server error" });
                    });
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({ message: "Internal server error" });
            });
    };
    
    
    static getOneExam = (req, res) => {
        const { id } = req.params; // Assuming you get the exam ID from request params
    
        Test.findById(id)
            .then((exam) => {
                if (!exam) {
                    return res.status(404).json({ message: "Exam not found" });
                }
    
                res.status(200).json({
                    sections: exam.sections,
                    instructions: exam.instructions,
                    testduration: exam.testduration,
                    // You can include other fields as needed
                });
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({ message: "Internal server error" });
            });
    };

 
}

module.exports = examController;