import mongoose, { Schema } from 'mongoose'

const messageSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    recipient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
  },
  { timestamps: true },
)

messageSchema.index({ sender: 1, recipient: 1, createdAt: -1 })

export const Message = mongoose.model('Message', messageSchema)