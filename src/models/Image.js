import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

imageSchema.plugin(mongoosePaginate);

export default mongoose.model('Image', imageSchema);
