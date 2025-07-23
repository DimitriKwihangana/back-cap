const express = require('express');
const router = express.Router();
const {
    createTest,
    getAllTests,
    getTestById,
    getTestsByUserId,
    updateTest,
    deleteTest
} = require('../controllers/TestController'); 


router.post('/', createTest);
router.get('/', getAllTests);
router.get('/:id', getTestById);
router.get('/user/:userId', getTestsByUserId);
router.put('/:id', updateTest);
router.delete('/:id', deleteTest);

module.exports = router;