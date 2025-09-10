// models/Task.js
import mongoose from 'mongoose'

const TaskSchema = new mongoose.Schema({
	title: { type: String, required: true },
	description: { type: String },
	assignee: { type: String }, // agar Users bo‘lsa -> ObjectId
	due_date: { type: Date },
	priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
	sort_order: { type: Number, default: 0 },
	column_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Column', required: true },
}, {
	timestamps: true
})

export default mongoose.models.Task || mongoose.model('Task', TaskSchema)
