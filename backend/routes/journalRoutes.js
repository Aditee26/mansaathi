const express = require('express');
const { body } = require('express-validator');
const {
  getJournals,
  getJournal,
  createJournal,
  updateJournal,
  deleteJournal,
} = require('../controllers/journalController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getJournals)
  .post(
    [body('content').trim().notEmpty().withMessage('Journal content cannot be empty')],
    validate,
    createJournal
  );

router
  .route('/:id')
  .get(getJournal)
  .put(updateJournal)
  .delete(deleteJournal);

module.exports = router;
