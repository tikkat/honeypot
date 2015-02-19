var mongoose = require('mongoose');

var SubmissionSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'Applicant' },
  challenge: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge' }
});

mongoose.model('Submission', SubmissionSchema);