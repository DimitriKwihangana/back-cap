const Test = require('../models/Tests'); 
const { sendBatchTestingNotification } = require('../utils/EmailServise'); // Adjust path as needed

// Create a new test batch
const createTest = async (req, res) => {
    try {
        const { batchId, supplier, date, userId, userName, laboratoryEmail } = req.body;

        // Validate required fields
        if (!batchId || !supplier || !date || !userId || !userName || !laboratoryEmail) {
            return res.status(400).json({
                success: false,
                message: 'All required fields must be provided'
            });
        }

        // Create new test document
        const newTest = new Test({
            batchId,
            supplier,
            date,
            userId,
            userName,
            laboratoryEmail
        });

        // Save to database
        const savedTest = await newTest.save();

        // Send email notification to laboratory
        await sendBatchTestingNotification(laboratoryEmail, userName, batchId, supplier, date);

        res.status(201).json({
            success: true,
            message: 'Test batch created successfully and laboratory notified',
            data: savedTest
        });

    } catch (error) {
        console.error('Error creating test batch:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to create test batch',
            error: error.message
        });
    }
};

// Get all tests
const getAllTests = async (req, res) => {
    try {
        const tests = await Test.find().sort({ date: -1 });
        
        res.status(200).json({
            success: true,
            count: tests.length,
            data: tests
        });
    } catch (error) {
        console.error('Error fetching tests:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch tests',
            error: error.message
        });
    }
};

// Get test by ID
const getTestById = async (req, res) => {
    try {
        const test = await Test.findById(req.params.id);
        
        if (!test) {
            return res.status(404).json({
                success: false,
                message: 'Test not found'
            });
        }

        res.status(200).json({
            success: true,
            data: test
        });
    } catch (error) {
        console.error('Error fetching test:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch test',
            error: error.message
        });
    }
};

// Get tests by user ID
const getTestsByUserId = async (req, res) => {
    try {
        const tests = await Test.find({ userId: req.params.userId }).sort({ date: -1 });
        
        res.status(200).json({
            success: true,
            count: tests.length,
            data: tests
        });
    } catch (error) {
        console.error('Error fetching user tests:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user tests',
            error: error.message
        });
    }
};

// Update test by ID
const updateTest = async (req, res) => {
    try {
        const updatedTest = await Test.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedTest) {
            return res.status(404).json({
                success: false,
                message: 'Test not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Test updated successfully',
            data: updatedTest
        });
    } catch (error) {
        console.error('Error updating test:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to update test',
            error: error.message
        });
    }
};

// Delete test by ID
const deleteTest = async (req, res) => {
    try {
        const deletedTest = await Test.findByIdAndDelete(req.params.id);

        if (!deletedTest) {
            return res.status(404).json({
                success: false,
                message: 'Test not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Test deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting test:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to delete test',
            error: error.message
        });
    }
};

module.exports = {
    createTest,
    getAllTests,
    getTestById,
    getTestsByUserId,
    updateTest,
    deleteTest
};