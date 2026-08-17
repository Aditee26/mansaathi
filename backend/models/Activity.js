const mongoose = require('mongoose');

// Small, fixed catalog of wellness activities. Keeping this closed
// (rather than free text) makes weekly summaries and charts meaningful.
const ACTIVITY_TYPES = [
  'meditation',
  'exercise',
  'sleep',
  'hydration',
  'gratitude',
  'social-connection',
  'outdoors',
  'reading',
];

const ActivitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: [true, 'Activity type is required'],
      enum: {
        values: ACTIVITY_TYPES,
        message: `Type must be one of: ${ACTIVITY_TYPES.join(', ')}`,
      },
    },
    duration: {
      // Minutes spent, used for effort-based activities (meditation, exercise).
      type: Number,
      min: 0,
      max: 1440,
      default: 0,
    },
    completed: {
      type: Boolean,
      default: true,
    },
    date: {
      type: Date,
      required: true,
    },
    note: {
      type: String,
      trim: true,
      maxlength: [200, 'Note cannot exceed 200 characters'],
      default: '',
    },
  },
  { timestamps: true }
);

ActivitySchema.index({ user: 1, date: -1 });
ActivitySchema.statics.ACTIVITY_TYPES = ACTIVITY_TYPES;

module.exports = mongoose.model('Activity', ActivitySchema);
