// models/Presentation.js
import mongoose from 'mongoose';

const slideSchema = new mongoose.Schema({
  slideNumber: Number,
  elements: [{
    type: {
      type: String,
      required: true
    },
    content: String,
    style: {
      x: Number,
      y: Number,
      width: Number,
      height: Number,
      color: String,
      backgroundColor: String,
      fontSize: Number,
    }
  }]
});

const presentationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: 'Untitled Presentation'
  },
  slides: [slideSchema],
  lastModified: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export const Presentation = mongoose.model('Presentation', presentationSchema);