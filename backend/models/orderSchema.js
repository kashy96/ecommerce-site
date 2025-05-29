import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
    orderId: {
      type: String,
      required: true,
      unique: true
    },
    sessionId: {
      type: String,
      required: true,
      unique: true
    },
    customerInfo: {
      name: String,
      email: String,
      address: String,
      city: String,
      postalCode: String,
      country: String
    },
    items: [{
      id: String,
      name: String,
      price: Number,
      quantity: Number
    }],
    totalAmount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'fulfilled', 'cancelled'],
      default: 'pending'
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: {
      type: Date,
      default: Date.now
    }
  });

export const Order =  mongoose.model("Order", OrderSchema);