const express = require('express');
const { runCode, getUnlockedProblems } = require('../controllers/codeController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/run', auth(['student', 'admin']), runCode);
router.get('/unlocked/:contestId', auth(['student', 'admin']), getUnlockedProblems);

module.exports = router;