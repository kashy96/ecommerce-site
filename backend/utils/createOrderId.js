import { Order } from '../models/orderSchema.js';
import dayjs from 'dayjs';

export const createOrderId = async () => {
  // Format today's date as YYYYMMDD
  const today = dayjs().format('YYYYMMDD');

  // Get today's date range
  const startOfDay = dayjs().startOf('day').toDate();
  const endOfDay = dayjs().endOf('day').toDate();

  // Count existing orders today
  const todayCount = await Order.countDocuments({
    createdAt: { $gte: startOfDay, $lte: endOfDay },
  });

  // Increment count
  const orderNumber = todayCount + 1;

  // Build final order ID
  const orderId = `ORD-${today}-${orderNumber.toString().padStart(3, '0')}`;
  return orderId;
};
