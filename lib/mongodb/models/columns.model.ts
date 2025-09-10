// models/Column.js
import mongoose from 'mongoose'

const ColumnSchema = new mongoose.Schema({
	board_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true },
	title: { type: String, required: true },
	sort_order: { type: Number, default: 0 },
	user_email: { type: String, required: true },
}, {
	timestamps: true
})

export default mongoose.models.Column || mongoose.model('Column', ColumnSchema)
