import { sendResponse } from "../utils/responseFormatter.js";
import { Order } from "../models/orderSchema.js";
import nodemailer from 'nodemailer';
import { createOrderId } from "../utils/createOrderId.js";

var transport = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

// Email template function
const generateOrderEmail = (customerInfo, orderId, items, totalAmount) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #f8f8f8; padding: 10px; text-align: center; }
          .item { margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Order Confirmation</h2>
          </div>
          <p>Dear ${customerInfo.name},</p>
          <p>Your order <strong>#${orderId}</strong> has been successfully placed.</p>
          <h3>Order Details:</h3>
          <ul>
            ${items
              .map(
                (item) => `<li class="item">${item.name} - Quantity: ${item.quantity} - Price: $${item.price.toFixed(2)}</li>`
              )
              .join('')}
          </ul>
          <p><strong>Total Amount:</strong> $${totalAmount.toFixed(2)}</p>
          <p>We will notify you once your order is processed.</p>
          <p>Best regards,<br>Kashif khan enterprises</p>
        </div>
      </body>
    </html>
  `;
};

export const createOrder = async (req, res) => {
    try {
        const { sessionId, customerInfo, items, status, totalAmount } = req.body;
        
        // Generate orderId using utility
        const orderId = await createOrderId();

        const newOrder = new Order({
          orderId,
          sessionId,
          customerInfo,
          items,
          status,
          totalAmount
        });
    
        await newOrder.save();
        
        // Send order confirmation email
        await transport.sendMail({
            from: process.env.EMAIL_FROM,
            to: customerInfo.email,
            subject: `Order Confirmation - Order #${orderId}`,
            html: generateOrderEmail(customerInfo, orderId, items, totalAmount),
        });

    console.log(`Order ${orderId} created, email sent to ${customerInfo.email}`);

        return sendResponse(res, 201, {
            success: true, 
            orderId
        });
      } catch (error) {
        console.error('Error creating order:', error);
        return sendResponse(res, 500, {
            message: error.message
        });
      }

}

export const order = async (req, res) => {
    try {
        const order = await Order.findOne({ sessionId: req.params.sessionId });
        
        if (!order) {
            return sendResponse(res, 404, {
                message: "Order not found",
            });
        }
        return sendResponse(res, 200, {
            order
        });
    } catch (error) {
        console.error('Error retrieving order:', error);
        return sendResponse(res, 500, {
            message: error.message
        });
    }
}

export const updateOrder = async (req, res) => {
    try {
        const { status } = req.body;
        
        const order = await Order.findOneAndUpdate(
          { orderId: req.params.orderId },
          { status, updatedAt: Date.now() },
          { new: true }
        );
        
        if (!order) {
            return sendResponse(res, 404, {
                message: "Order not found",
                error: error.message,
            });
        }
        
        // If the order is marked as paid, send confirmation email
        // if (status === 'paid') {
        //   await sendOrderConfirmationEmail(order);
        // }
        
        return sendResponse(res, 200, { order });
      } catch (error) {
        console.error('Error updating order:', error);
        return sendResponse(res, 500, {
            message: error.message
        });
      }
}

export const allOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        return sendResponse(res, 200, { orders });
    } catch (error) {
        console.error('Error retrieving orders:', error);
        return sendResponse(res, 500, { message: error.message });
    }
    
}
