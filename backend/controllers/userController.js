const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

// @desc    Update profile fields (name, timezone, reminder preference)
// @route   PUT /api/users/me
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const { name, timezone, dailyReminder } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, 'User not found');

  if (name !== undefined) user.name = name;
  if (timezone !== undefined) user.timezone = timezone;
  if (dailyReminder !== undefined) user.dailyReminder = dailyReminder;

  await user.save();

  res.status(200).json({ success: true, user: user.toSafeObject() });
});

// @desc    Change password
// @route   PUT /api/users/me/password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new ApiError(400, 'Current and new password are required');
  }
  if (newPassword.length < 6) {
    throw new ApiError(400, 'New password must be at least 6 characters');
  }

  const user = await User.findById(req.user._id).select('+password');
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new ApiError(401, 'Current password is incorrect');
  }

  user.password = newPassword; // pre-save hook re-hashes this
  await user.save();

  res.status(200).json({ success: true, message: 'Password updated successfully' });
});

// @desc    Delete account and all associated data
// @route   DELETE /api/users/me
// @access  Private
const deleteAccount = asyncHandler(async (req, res) => {
  const Journal = require('../models/Journal');
  const Mood = require('../models/Mood');
  const Activity = require('../models/Activity');

  const userId = req.user._id;

  await Promise.all([
    Journal.deleteMany({ user: userId }),
    Mood.deleteMany({ user: userId }),
    Activity.deleteMany({ user: userId }),
    User.findByIdAndDelete(userId),
  ]);

  res.status(200).json({ success: true, message: 'Account deleted successfully' });
});

module.exports = { updateProfile, changePassword, deleteAccount };
