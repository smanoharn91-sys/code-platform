const express = require('express');
const { createContest, getContests, getContestById } = require('../controllers/contestController');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/create', auth(['admin']), createContest);
router.get('/', getContests);
router.get('/:id', getContestById);

module.exports = router;