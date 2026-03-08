const express = require('express');
const router = express.Router();
const {
    createSession,
    generateQuestion,
    evaluateAnswer,
    completeSession,
    getSessionResults,
    getInterviewHistory,
} = require('../controllers/interviewController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/session', createSession);
router.post('/generate-question', generateQuestion);
router.post('/evaluate-answer', evaluateAnswer);
router.put('/session/:id/complete', completeSession);
router.get('/session/:id/results', getSessionResults);
router.get('/history', getInterviewHistory);

module.exports = router;
