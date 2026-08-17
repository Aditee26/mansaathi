const Mood = require('../models/Mood');
const Journal = require('../models/Journal');
const Activity = require('../models/Activity');
const asyncHandler = require('../utils/asyncHandler');

const toDayStart = (input) => {
  const d = input ? new Date(input) : new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

// @desc    Single aggregated payload for the dashboard, so the frontend
//          doesn't have to fire off four separate requests on load.
// @route   GET /api/dashboard
// @access  Private
const getDashboard = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const today = toDayStart();

  const weekAgo = toDayStart();
  weekAgo.setDate(weekAgo.getDate() - 6);

  const [todayMood, recentMoods, recentJournals, weekActivities] = await Promise.all([
    Mood.findOne({ user: userId, date: today }),
    Mood.find({ user: userId, date: { $gte: weekAgo } }).sort({ date: 1 }),
    Journal.find({ user: userId }).sort({ createdAt: -1 }).limit(3),
    Activity.find({ user: userId, date: { $gte: weekAgo }, completed: true }),
  ]);

  const moodTrend = recentMoods.map((m) => ({
    date: m.date.toISOString().slice(0, 10),
    mood: m.mood,
    score: m.score,
  }));

  const weeklyAverage =
    recentMoods.length > 0
      ? Number(
          (recentMoods.reduce((sum, m) => sum + m.score, 0) / recentMoods.length).toFixed(2)
        )
      : null;

  const activityMinutes = weekActivities.reduce((sum, a) => sum + (a.duration || 0), 0);

  res.status(200).json({
    success: true,
    greetingName: req.user.name,
    todayMood: todayMood || null,
    moodTrend,
    weeklyAverage,
    recentJournals,
    weeklySummary: {
      activitiesCompleted: weekActivities.length,
      activityMinutes,
      moodEntriesLogged: recentMoods.length,
      daysInPeriod: 7,
    },
  });
});

module.exports = { getDashboard };
