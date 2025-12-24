/**
 * Email Service using Resend
 * 
 * Handles sending transactional emails like order confirmations
 */

import { Resend } from 'resend';

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// Your domain for emails - update this when you verify your domain in Resend
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Summit Bullion <onboarding@resend.dev>';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://summitbullion.com';

interface OrderItem {
  name: string;
  quantity: number;
  pricing: {
    finalPrice: number;
  };
  totalPrice: number;
  image?: string;
}

interface OrderConfirmationData {
  orderId: string;
  customerEmail: string;
  customerName?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  shippingAddress?: {
    addressee?: string;
    addr1?: string;
    addr2?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
}

/**
 * Send order confirmation email to customer
 */
export async function sendOrderConfirmationEmail(data: OrderConfirmationData): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('📧 Sending order confirmation email to:', data.customerEmail);

    const { orderId, customerEmail, customerName, items, subtotal, deliveryFee, total, shippingAddress } = data;

    // Generate order items HTML
    const itemsHtml = items.map(item => `
      <tr>
        <td style="padding: 16px 0; border-bottom: 1px solid #e5e5e5;">
          <div style="font-weight: 600; color: #141722; font-size: 14px;">${item.name}</div>
          <div style="color: #7c7c7c; font-size: 13px; margin-top: 4px;">Qty: ${item.quantity} × $${item.pricing.finalPrice.toFixed(2)}</div>
        </td>
        <td style="padding: 16px 0; border-bottom: 1px solid #e5e5e5; text-align: right; font-weight: 600; color: #141722;">
          $${item.totalPrice.toFixed(2)}
        </td>
      </tr>
    `).join('');

    // Generate shipping address HTML
    const shippingHtml = shippingAddress ? `
      <div style="margin-top: 24px; padding: 16px; background-color: #f9f9f9; border-radius: 8px;">
        <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #141722;">Shipping To:</h3>
        <p style="margin: 0; color: #7c7c7c; font-size: 14px; line-height: 1.5;">
          ${shippingAddress.addressee || 'Customer'}<br>
          ${shippingAddress.addr1 || ''}<br>
          ${shippingAddress.addr2 ? shippingAddress.addr2 + '<br>' : ''}
          ${shippingAddress.city || ''}, ${shippingAddress.state || ''} ${shippingAddress.zip || ''}
        </p>
      </div>
    ` : '';

    // Build the email HTML
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #141722 0%, #2a2f3d 100%); padding: 32px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffc633; font-size: 28px; font-weight: 700;">Summit Bullion</h1>
              <p style="margin: 8px 0 0 0; color: #efe9e0; font-size: 14px;">Premium Precious Metals</p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px;">
              <!-- Success Icon -->
              <div style="text-align: center; margin-bottom: 24px;">
                <div style="display: inline-block; width: 64px; height: 64px; background: linear-gradient(135deg, #FFF0C1 0%, #FFB546 100%); border-radius: 50%; line-height: 64px; font-size: 28px;">
                  ✓
                </div>
              </div>

              <!-- Thank You Message -->
              <h2 style="margin: 0 0 8px 0; text-align: center; color: #141722; font-size: 24px; font-weight: 700;">
                Thank You for Your Order!
              </h2>
              <p style="margin: 0 0 32px 0; text-align: center; color: #7c7c7c; font-size: 16px;">
                Hi ${customerName || 'there'}, we've received your order and it's being processed.
              </p>

              <!-- Order Number -->
              <div style="background-color: #fcf8f1; border-radius: 8px; padding: 16px; margin-bottom: 24px; text-align: center;">
                <span style="color: #7c7c7c; font-size: 13px;">Order Number</span>
                <div style="color: #141722; font-size: 18px; font-weight: 700; font-family: monospace; margin-top: 4px;">
                  #${orderId.slice(-8).toUpperCase()}
                </div>
              </div>

              <!-- Order Items -->
              <h3 style="margin: 0 0 16px 0; color: #141722; font-size: 16px; font-weight: 600;">Order Details</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                ${itemsHtml}
              </table>

              <!-- Order Summary -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="padding: 8px 0; color: #7c7c7c; font-size: 14px;">Subtotal</td>
                  <td style="padding: 8px 0; text-align: right; color: #141722; font-size: 14px;">$${subtotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #7c7c7c; font-size: 14px;">Shipping & Handling</td>
                  <td style="padding: 8px 0; text-align: right; color: #141722; font-size: 14px;">$${deliveryFee.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding: 16px 0 0 0; color: #141722; font-size: 18px; font-weight: 700; border-top: 2px solid #141722;">Total</td>
                  <td style="padding: 16px 0 0 0; text-align: right; color: #141722; font-size: 18px; font-weight: 700; border-top: 2px solid #141722;">$${total.toFixed(2)}</td>
                </tr>
              </table>

              ${shippingHtml}

              <!-- CTA Button -->
              <div style="text-align: center; margin-top: 32px;">
                <a href="${BASE_URL}/orders" style="display: inline-block; background: linear-gradient(135deg, #FFF0C1 0%, #FFB546 100%); color: #141722; text-decoration: none; padding: 16px 32px; border-radius: 42px; font-weight: 600; font-size: 14px; text-transform: uppercase;">
                  View Your Orders
                </a>
              </div>

              <!-- Info Text -->
              <p style="margin: 32px 0 0 0; text-align: center; color: #7c7c7c; font-size: 13px; line-height: 1.6;">
                You'll receive another email with tracking information once your order ships.
                <br>Questions? Reply to this email or visit our support page.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9f9f9; padding: 24px 40px; text-align: center; border-top: 1px solid #e5e5e5;">
              <p style="margin: 0 0 8px 0; color: #7c7c7c; font-size: 12px;">
                © ${new Date().getFullYear()} Summit Bullion. All rights reserved.
              </p>
              <p style="margin: 0; color: #7c7c7c; font-size: 12px;">
                <a href="${BASE_URL}" style="color: #ffc633; text-decoration: none;">summitbullion.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    // Send the email
    const { data: emailData, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: customerEmail,
      subject: `Order Confirmed! #${orderId.slice(-8).toUpperCase()} - Summit Bullion`,
      html: emailHtml,
    });

    if (error) {
      console.error('❌ Resend error:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Order confirmation email sent:', emailData?.id);
    return { success: true };

  } catch (error) {
    console.error('❌ Failed to send order confirmation email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Send a test email (for debugging)
 */
export async function sendTestEmail(to: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Test Email from Summit Bullion',
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h1 style="color: #ffc633;">Summit Bullion</h1>
          <p>This is a test email to verify your email configuration is working.</p>
          <p>If you received this, your Resend integration is set up correctly! 🎉</p>
        </div>
      `,
    });

    if (error) {
      console.error('❌ Test email error:', error);
      return { success: false, error: error.message };
    }

    console.log('✅ Test email sent:', data?.id);
    return { success: true };

  } catch (error) {
    console.error('❌ Failed to send test email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}
