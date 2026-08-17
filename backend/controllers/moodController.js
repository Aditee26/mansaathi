const Mood = require('../models/Mood');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

// Normalizes any date (or "today") down to midnight, so mood entries
// are always compared/stored on a clean calendar-day boundary.
const toDayStart = (input) => {
  const d = input ? new Date(input) : new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

// @desc    Get mood entries, optionally limited to the last N days
// @route   GET /api/moods?days=30
// @access  Private
const getMoods = asyncHandler(async (req, res) => {
  const { days } = req.query;
  const query = { user: req.user._id };

  if (days) {
    const since = toDayStart();
    since.setDate(since.getDate() - Number(days));
    query.date = { $gte: since };
  }

  const moods = await Mood.find(query).sort({ date: -1 });
  res.status(200).json({ success: true, count: moods.length, moods });
});

// @desc    Get today's mood entry, if one exists
// @route   GET /api/moods/today
// @access  Private
const getTodayMood = asyncHandler(async (req, res) => {
  const mood = await Mood.findOne({ user: req.user._id, date: toDayStart() });
  res.status(200).json({ success: true, mood: mood || null });
});

// @desc    Create or update today's mood entry (upsert keeps it to one/day)
// @route   POST /api/moods
// @access  Private
const upsertMood = asyncHandler(async (req, res) => {
  const { mood, note, date } = req.body;
  const day = toDayStart(date);

  const updated = await Mood.findOneAndUpdate(
    { user: req.user._id, date: day },
    { mood, note: note || '', date: day },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );

  res.status(200).json({ success: true, mood: updated });
});

// @desc    Delete a mood entry
// @route   DELETE /api/moods/:id
// @access  Private
const deleteMood = asyncHandler(async (req, res) => {
  const mood = await Mood.findById(req.params.id);
  if (!mood) throw new ApiError(404, 'Mood entry not found');
  if (mood.user.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Not authorized to access this mood entry');
  }
  await mood.deleteOne();
  res.status(200).json({ success: true, message: 'Mood entry deleted' });
});

// @desc    Aggregate mood insights for charts (last N days, default 14)
// @route   GET /api/moods/insights?days=14
// @access  Private
const getMoodInsights = asyncHandler(async (req, res) => {
  const days = Number(req.query.days) || 14;
  const since = toDayStart();
  since.setDate(since.getDate() - (days - 1));

  const moods = await Mood.find({
    user: req.user._id,
    date: { $gte: since },
  }).sort({ date: 1 });

  const trend = moods.map((m) => ({
    date: m.date.toISOString().slice(0, 10),
    mood: m.mood,
    score: m.score,
  }));

  const average =
    moods.length > 0
      ? Number((moods.reduce((sum, m) => sum + m.score, 0) / moods.length).toFixed(2))
      : null;

  res.status(200).json({
    success: true,
    days,
    entriesLogged: moods.length,
    average,
    trend,
  });
});

module.exports = { getMoods, getTodayMood, upsertMood, deleteMood, getMoodInsights };
