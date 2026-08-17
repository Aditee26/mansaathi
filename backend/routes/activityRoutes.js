const express = require('express');
const { body } = require('express-validator');
const {
  getActivities,
  createActivity,
  updateActivity,
  deleteActivity,
  getActivitySummary,
} = require('../controllers/activityController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const Activity = require('../models/Activity');

const router = express.Router();

router.use(protect);

router.get('/summary', getActivitySummary);
router
  .route('/')
  .get(getActivities)
  .post(
    [
      body('type')
        .isIn(Activity.ACTIVITY_TYPES)
        .withMessage(`Type must be one of: ${Activity.ACTIVITY_TYPES.join(', ')}`),
    ],
    validate,
    createActivity
  );

router.route('/:id').put(updateActivity).delete(deleteActivity);

module.exports = router;
