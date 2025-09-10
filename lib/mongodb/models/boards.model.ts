// models/Board.js
import mongoose from 'mongoose'

const BoardSchema = new mongoose.Schema({
	title: { type: String, required: true },
	description: { type: String },
	color: { type: String, default: 'bg-blue-500' },
	user_email: { type: String, required: true }, // agar Users kolleksiyasi bo‘lsa -> ObjectId
}, {
	timestamps: true
})

export default mongoose.models.Board || mongoose.model('Board', BoardSchema)
