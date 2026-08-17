const Journal = require('../models/Journal');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

// @desc    Get all journal entries for the logged-in user (newest first)
// @route   GET /api/journals
// @access  Private
const getJournals = asyncHandler(async (req, res) => {
  const { limit } = req.query;

  let query = Journal.find({ user: req.user._id }).sort({ createdAt: -1 });
  if (limit) query = query.limit(Number(limit));

  const journals = await query;
  res.status(200).json({ success: true, count: journals.length, journals });
});

// @desc    Get a single journal entry by id
// @route   GET /api/journals/:id
// @access  Private
const getJournal = asyncHandler(async (req, res) => {
  const journal = await findOwnedJournalOr404(req.params.id, req.user._id);
  res.status(200).json({ success: true, journal });
});

// @desc    Create a new journal entry
// @route   POST /api/journals
// @access  Private
const createJournal = asyncHandler(async (req, res) => {
  const { title, content, mood } = req.body;

  const journal = await Journal.create({
    user: req.user._id,
    title,
    content,
    mood: mood || null,
  });

  res.status(201).json({ success: true, journal });
});

// @desc    Update a journal entry
// @route   PUT /api/journals/:id
// @access  Private
const updateJournal = asyncHandler(async (req, res) => {
  const journal = await findOwnedJournalOr404(req.params.id, req.user._id);

  const { title, content, mood } = req.body;
  if (title !== undefined) journal.title = title;
  if (content !== undefined) journal.content = content;
  if (mood !== undefined) journal.mood = mood;

  await journal.save();
  res.status(200).json({ success: true, journal });
});

// @desc    Delete a journal entry
// @route   DELETE /api/journals/:id
// @access  Private
const deleteJournal = asyncHandler(async (req, res) => {
  const journal = await findOwnedJournalOr404(req.params.id, req.user._id);
  await journal.deleteOne();
  res.status(200).json({ success: true, message: 'Journal entry deleted' });
});

// Shared helper: fetches a journal and verifies the requester owns it.
// Centralizing this keeps the "users can only touch their own data" rule
// enforced in exactly one place instead of duplicated in every handler.
async function findOwnedJournalOr404(id, userId) {
  const journal = await Journal.findById(id);
  if (!journal) throw new ApiError(404, 'Journal entry not found');
  if (journal.user.toString() !== userId.toString()) {
    throw new ApiError(403, 'Not authorized to access this journal entry');
  }
  return journal;
}

module.exports = { getJournals, getJournal, createJournal, updateJournal, deleteJournal };
