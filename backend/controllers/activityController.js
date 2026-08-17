const Activity = require('../models/Activity');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

const toDayStart = (input) => {
  const d = input ? new Date(input) : new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

// @desc    Get activities, optionally limited to the last N days
// @route   GET /api/activities?days=7
// @access  Private
const getActivities = asyncHandler(async (req, res) => {
  const { days } = req.query;
  const query = { user: req.user._id };

  if (days) {
    const since = toDayStart();
    since.setDate(since.getDate() - Number(days));
    query.date = { $gte: since };
  }

  const activities = await Activity.find(query).sort({ date: -1 });
  res.status(200).json({ success: true, count: activities.length, activities });
});

// @desc    Log a new wellness activity
// @route   POST /api/activities
// @access  Private
const createActivity = asyncHandler(async (req, res) => {
  const { type, duration, completed, date, note } = req.body;

  const activity = await Activity.create({
    user: req.user._id,
    type,
    duration: duration || 0,
    completed: completed !== undefined ? completed : true,
    date: toDayStart(date),
    note: note || '',
  });

  res.status(201).json({ success: true, activity });
});

// @desc    Update an activity entry
// @route   PUT /api/activities/:id
// @access  Private
const updateActivity = asyncHandler(async (req, res) => {
  const activity = await findOwnedActivityOr404(req.params.id, req.user._id);

  const { type, duration, completed, note } = req.body;
  if (type !== undefined) activity.type = type;
  if (duration !== undefined) activity.duration = duration;
  if (completed !== undefined) activity.completed = completed;
  if (note !== undefined) activity.note = note;

  await activity.save();
  res.status(200).json({ success: true, activity });
});

// @desc    Delete an activity entry
// @route   DELETE /api/activities/:id
// @access  Private
const deleteActivity = asyncHandler(async (req, res) => {
  const activity = await findOwnedActivityOr404(req.params.id, req.user._id);
  await activity.deleteOne();
  res.status(200).json({ success: true, message: 'Activity deleted' });
});

// @desc    Weekly wellness summary: completed count and minutes by type
// @route   GET /api/activities/summary?days=7
// @access  Private
const getActivitySummary = asyncHandler(async (req, res) => {
  const days = Number(req.query.days) || 7;
  const since = toDayStart();
  since.setDate(since.getDate() - (days - 1));

  const activities = await Activity.find({
    user: req.user._id,
    date: { $gte: since },
    completed: true,
  });

  const byType = {};
  Activity.ACTIVITY_TYPES.forEach((t) => {
    byType[t] = { count: 0, minutes: 0 };
  });

  activities.forEach((a) => {
    if (!byType[a.type]) byType[a.type] = { count: 0, minutes: 0 };
    byType[a.type].count += 1;
    byType[a.type].minutes += a.duration || 0;
  });

  res.status(200).json({
    success: true,
    days,
    totalCompleted: activities.length,
    byType,
  });
});

async function findOwnedActivityOr404(id, userId) {
  const activity = await Activity.findById(id);
  if (!activity) throw new ApiError(404, 'Activity not found');
  if (activity.user.toString() !== userId.toString()) {
    throw new ApiError(403, 'Not authorized to access this activity');
  }
  return activity;
}

module.exports = {
  getActivities,
  createActivity,
  updateActivity,
  deleteActivity,
  getActivitySummary,
};
