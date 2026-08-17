const mongoose = require('mongoose');

const JournalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
      default: 'Untitled entry',
    },
    content: {
      type: String,
      required: [true, 'Journal content cannot be empty'],
      trim: true,
      maxlength: [10000, 'Entry is too long'],
    },
    mood: {
      // Optional tag connecting a journal entry to how the user felt
      // while writing it, independent of the daily Mood check-in.
      type: String,
      enum: ['awful', 'low', 'okay', 'good', 'great', null],
      default: null,
    },
  },
  { timestamps: true }
);

JournalSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Journal', JournalSchema);
