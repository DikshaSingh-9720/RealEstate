const nodemailer = require('nodemailer');

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  const transportConfig = {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  };

  // For development, you might want to use a service like Ethereal Email
  if (process.env.NODE_ENV === 'development' && !process.env.EMAIL_USER) {
    console.warn('Email credentials not configured. Using test account.');
    // You could set up Ethereal test account here
  }

  return nodemailer.createTransporter(transportConfig);
};

// Email templates
const templates = {
  welcome: (data) => ({
    subject: 'Welcome to Agricultural Land Marketplace - Verify Your Email',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Agricultural Land Marketplace</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #22c55e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; padding: 20px; color: #666; font-size: 14px; }
          .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">🌾 Agricultural Land Marketplace</div>
          <h1>Welcome, ${data.name}!</h1>
        </div>
        <div class="content">
          <h2>Thank you for joining our farming community!</h2>
          <p>We're excited to have you as part of our agricultural land marketplace platform. To get started, please verify your email address by clicking the button below:</p>
          
          <div style="text-align: center;">
            <a href="${data.verificationURL}" class="button">Verify Email Address</a>
          </div>
          
          <p>Once verified, you'll be able to:</p>
          <ul>
            <li>🏡 List your agricultural land for sale or lease</li>
            <li>🔍 Search for farmland in your preferred locations</li>
            <li>💬 Connect with verified farmers and buyers</li>
            <li>📊 Access market insights and pricing data</li>
            <li>🌱 Join our community of agricultural professionals</li>
          </ul>
          
          <p>If you didn't create an account with us, please ignore this email.</p>
          
          <p>If you're having trouble clicking the button, copy and paste this URL into your browser:</p>
          <p style="word-break: break-all; color: #22c55e;">${data.verificationURL}</p>
        </div>
        <div class="footer">
          <p>This email was sent from Agricultural Land Marketplace</p>
          <p>© 2024 Agricultural Land Marketplace. All rights reserved.</p>
        </div>
      </body>
      </html>
    `,
    text: `
      Welcome to Agricultural Land Marketplace!
      
      Hi ${data.name},
      
      Thank you for joining our farming community! To get started, please verify your email address by visiting:
      ${data.verificationURL}
      
      Once verified, you'll be able to list your agricultural land, search for farmland, and connect with our community.
      
      If you didn't create an account with us, please ignore this email.
      
      Best regards,
      Agricultural Land Marketplace Team
    `
  }),

  emailVerification: (data) => ({
    subject: 'Verify Your Email - Agricultural Land Marketplace',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #22c55e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; padding: 20px; color: #666; font-size: 14px; }
          .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">🌾 Agricultural Land Marketplace</div>
          <h1>Email Verification</h1>
        </div>
        <div class="content">
          <h2>Hi ${data.name},</h2>
          <p>Please verify your email address to complete your account setup:</p>
          
          <div style="text-align: center;">
            <a href="${data.verificationURL}" class="button">Verify Email Address</a>
          </div>
          
          <p>This verification link will expire in 24 hours.</p>
          
          <p>If you didn't request this verification, please ignore this email.</p>
          
          <p>If you're having trouble clicking the button, copy and paste this URL into your browser:</p>
          <p style="word-break: break-all; color: #22c55e;">${data.verificationURL}</p>
        </div>
        <div class="footer">
          <p>© 2024 Agricultural Land Marketplace. All rights reserved.</p>
        </div>
      </body>
      </html>
    `,
    text: `
      Email Verification - Agricultural Land Marketplace
      
      Hi ${data.name},
      
      Please verify your email address to complete your account setup:
      ${data.verificationURL}
      
      This verification link will expire in 24 hours.
      
      If you didn't request this verification, please ignore this email.
      
      Best regards,
      Agricultural Land Marketplace Team
    `
  }),

  passwordReset: (data) => ({
    subject: 'Password Reset - Agricultural Land Marketplace',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #ef4444; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; padding: 20px; color: #666; font-size: 14px; }
          .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
          .warning { background: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 6px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">🌾 Agricultural Land Marketplace</div>
          <h1>Password Reset Request</h1>
        </div>
        <div class="content">
          <h2>Hi ${data.name},</h2>
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          
          <div style="text-align: center;">
            <a href="${data.resetURL}" class="button">Reset Password</a>
          </div>
          
          <div class="warning">
            <p><strong>⚠️ Security Notice:</strong></p>
            <ul>
              <li>This password reset link will expire in 30 minutes</li>
              <li>If you didn't request this reset, please ignore this email</li>
              <li>For security, we recommend using a strong, unique password</li>
            </ul>
          </div>
          
          <p>If you're having trouble clicking the button, copy and paste this URL into your browser:</p>
          <p style="word-break: break-all; color: #ef4444;">${data.resetURL}</p>
        </div>
        <div class="footer">
          <p>© 2024 Agricultural Land Marketplace. All rights reserved.</p>
        </div>
      </body>
      </html>
    `,
    text: `
      Password Reset - Agricultural Land Marketplace
      
      Hi ${data.name},
      
      We received a request to reset your password. Visit this link to create a new password:
      ${data.resetURL}
      
      This password reset link will expire in 30 minutes.
      
      If you didn't request this reset, please ignore this email.
      
      Best regards,
      Agricultural Land Marketplace Team
    `
  }),

  landApproved: (data) => ({
    subject: 'Your Land Listing Has Been Approved! 🎉',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Land Listing Approved</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #22c55e; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; padding: 20px; color: #666; font-size: 14px; }
          .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
          .land-info { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #22c55e; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">🌾 Agricultural Land Marketplace</div>
          <h1>Congratulations! 🎉</h1>
        </div>
        <div class="content">
          <h2>Your land listing has been approved!</h2>
          <p>Hi ${data.farmerName},</p>
          <p>Great news! Your land listing has been reviewed and approved by our team. It's now live on our marketplace and visible to potential buyers and lessees.</p>
          
          <div class="land-info">
            <h3>📍 ${data.landTitle}</h3>
            <p><strong>Location:</strong> ${data.location}</p>
            <p><strong>Size:</strong> ${data.area} acres</p>
            <p><strong>Price:</strong> ₹${data.price}</p>
          </div>
          
          <div style="text-align: center;">
            <a href="${data.landURL}" class="button">View Your Listing</a>
          </div>
          
          <p><strong>What's next?</strong></p>
          <ul>
            <li>📞 Respond promptly to inquiries from interested parties</li>
            <li>📸 Keep your photos and description up to date</li>
            <li>💬 Use our messaging system to communicate securely</li>
            <li>📊 Monitor your listing's performance in your dashboard</li>
          </ul>
          
          ${data.adminComments ? `<p><strong>Admin Note:</strong> ${data.adminComments}</p>` : ''}
        </div>
        <div class="footer">
          <p>© 2024 Agricultural Land Marketplace. All rights reserved.</p>
        </div>
      </body>
      </html>
    `
  }),

  landRejected: (data) => ({
    subject: 'Land Listing Requires Updates',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Land Listing Update Required</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; padding: 20px; color: #666; font-size: 14px; }
          .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
          .feedback { background: #fef3c7; border: 1px solid #fbbf24; padding: 15px; border-radius: 6px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">🌾 Agricultural Land Marketplace</div>
          <h1>Listing Update Required</h1>
        </div>
        <div class="content">
          <h2>Hi ${data.farmerName},</h2>
          <p>Thank you for submitting your land listing. Our team has reviewed it and found that some updates are needed before it can be published on our marketplace.</p>
          
          <div class="feedback">
            <h3>📝 Required Updates:</h3>
            <p>${data.adminComments}</p>
          </div>
          
          <p>Don't worry - this is a common part of our quality assurance process to ensure all listings meet our high standards and provide the best experience for potential buyers.</p>
          
          <div style="text-align: center;">
            <a href="${data.editURL}" class="button">Update Your Listing</a>
          </div>
          
          <p><strong>Next Steps:</strong></p>
          <ol>
            <li>Review the feedback above</li>
            <li>Update your listing with the requested information</li>
            <li>Resubmit for review</li>
            <li>We'll review it again within 24 hours</li>
          </ol>
          
          <p>If you have any questions about the feedback, please don't hesitate to contact our support team.</p>
        </div>
        <div class="footer">
          <p>© 2024 Agricultural Land Marketplace. All rights reserved.</p>
        </div>
      </body>
      </html>
    `
  }),

  inquiryReceived: (data) => ({
    subject: `New Inquiry for Your Land: ${data.landTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Land Inquiry</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; padding: 20px; color: #666; font-size: 14px; }
          .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
          .inquiry-info { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #3b82f6; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">🌾 Agricultural Land Marketplace</div>
          <h1>New Inquiry! 📩</h1>
        </div>
        <div class="content">
          <h2>You have a new inquiry!</h2>
          <p>Hi ${data.farmerName},</p>
          <p>Someone is interested in your land listing and has sent you an inquiry. Here are the details:</p>
          
          <div class="inquiry-info">
            <h3>📍 ${data.landTitle}</h3>
            <p><strong>From:</strong> ${data.inquirerName}</p>
            <p><strong>Subject:</strong> ${data.subject}</p>
            <p><strong>Message:</strong></p>
            <p style="font-style: italic;">"${data.message}"</p>
            <p><strong>Contact Method:</strong> ${data.contactMethod}</p>
            ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ''}
          </div>
          
          <div style="text-align: center;">
            <a href="${data.inquiryURL}" class="button">View & Respond</a>
          </div>
          
          <p><strong>💡 Tips for responding:</strong></p>
          <ul>
            <li>Respond within 24 hours for better engagement</li>
            <li>Be clear about availability for site visits</li>
            <li>Share additional details if requested</li>
            <li>Use our secure messaging system for initial communication</li>
          </ul>
        </div>
        <div class="footer">
          <p>© 2024 Agricultural Land Marketplace. All rights reserved.</p>
        </div>
      </body>
      </html>
    `
  })
};

// Main send email function
exports.sendEmail = async ({ email, subject, template, data, html, text }) => {
  try {
    const transporter = createTransporter();

    // Test connection
    if (process.env.NODE_ENV === 'production') {
      await transporter.verify();
    }

    let emailContent = {};

    if (template && templates[template]) {
      emailContent = templates[template](data);
    } else if (html || text) {
      emailContent = { subject, html, text };
    } else {
      throw new Error('Either template or html/text content must be provided');
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Agricultural Land Marketplace <noreply@farmland.com>',
      to: email,
      subject: emailContent.subject || subject,
      html: emailContent.html,
      text: emailContent.text,
    };

    const result = await transporter.sendMail(mailOptions);
    
    console.log('Email sent successfully:', {
      to: email,
      subject: emailContent.subject || subject,
      messageId: result.messageId
    });

    return {
      success: true,
      messageId: result.messageId
    };
  } catch (error) {
    console.error('Email send error:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

// Bulk email function
exports.sendBulkEmail = async (emails) => {
  const results = [];
  
  for (const emailConfig of emails) {
    try {
      const result = await exports.sendEmail(emailConfig);
      results.push({ success: true, email: emailConfig.email, ...result });
    } catch (error) {
      results.push({ 
        success: false, 
        email: emailConfig.email, 
        error: error.message 
      });
    }
  }
  
  return results;
};

// Email validation helper
exports.isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};