const mongoose = require('mongoose');

// A fixed vocabulary keeps analytics simple: each mood maps to a numeric
// score (1-5) so trends can be averaged and charted without guesswork.
const MOOD_SCALE = {
  awful: 1,
  low: 2,
  okay: 3,
  good: 4,
  great: 5,
};

const MoodSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    mood: {
      type: String,
      required: [true, 'Mood is required'],
      enum: {
        values: Object.keys(MOOD_SCALE),
        message: 'Mood must be one of: awful, low, okay, good, great',
      },
    },
    score: {
      type: Number,
      min: 1,
      max: 5,
    },
    note: {
      type: String,
      trim: true,
      maxlength: [280, 'Note cannot exceed 280 characters'],
      default: '',
    },
    // Calendar-day the mood belongs to (midnight, local server time),
    // used to enforce "one mood entry per day" and simplify grouping.
    date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// Automatically derive the numeric score from the mood label.
MoodSchema.pre('validate', function setScore(next) {
  if (this.mood) this.score = MOOD_SCALE[this.mood];
  next();
});

// One mood entry per user per calendar day.
MoodSchema.index({ user: 1, date: 1 }, { unique: true });

MoodSchema.statics.MOOD_SCALE = MOOD_SCALE;

module.exports = mongoose.model('Mood', MoodSchema);
