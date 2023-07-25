
import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const orderSchema = new mongoose.Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    orderTotal: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    billing: {
        type: String,
        enum: ['cash', 'paypal'],
        default: 'cash'
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    description: {
        type: String,
        default: ''
    },
}, { timestamps: true }, { collection: 'order' });

orderSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Order', orderSchema);