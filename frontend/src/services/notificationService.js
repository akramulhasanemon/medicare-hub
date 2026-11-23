// frontend/src/services/notificationService.js
/**
 * MediCare Hub Notification Service
 * Handles SMS Gateway & Email Dispatch Simulation & Logging
 */

const NOTIFICATIONS_STORAGE_KEY = 'medicare_notifications';

export const getNotificationHistory = () => {
  try {
    return JSON.parse(localStorage.getItem(NOTIFICATIONS_STORAGE_KEY) || '[]');
  } catch (e) {
    console.error('Error loading notification history', e);
    return [];
  }
};

const saveNotification = (notification) => {
  try {
    const history = getNotificationHistory();
    const updated = [notification, ...history].slice(0, 100); // keep last 100
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error saving notification', e);
  }
};

/**
 * Format registration SMS based on user role and details
 */
export const formatRegistrationSMS = (user) => {
  const name = user.name || 'User';
  const id = user.patient_id || user.id || 'N/A';
  const role = user.role || 'patient';

  let roleTitle = 'পেশেন্ট';
  if (role === 'doctor') roleTitle = 'ডাক্তার কনসালট্যান্ট';
  else if (role === 'lab_staff') roleTitle = 'ল্যাব টেকনোলজিস্ট';
  else if (role === 'accountant') roleTitle = 'অ্যাকাউন্টস অফিসার';

  return `[MediCare Hub] স্বাগতম ${name}! আপনার ${roleTitle} একাউন্ট রেজিস্ট্রেশন সফল হয়েছে। আপনার স্থায়ী লগইন আইডি: ${id}। পাসওয়ার্ড ও আইডি দিয়ে পোর্টালে লগইন করুন: medicare-hub.live | জরুরি প্রয়োজনে হটলাইন: 10666`;
};

/**
 * Format registration Email based on user role and details
 */
export const formatRegistrationEmail = (user) => {
  const name = user.name || 'Valued Member';
  const id = user.patient_id || user.id || 'N/A';
  const role = (user.role || 'patient').toUpperCase();
  const phone = user.phone || 'N/A';

  const subject = `Welcome to MediCare Hub - Your Official Registration ID: ${id}`;
  
  const bodyText = `Dear ${name},

Welcome to MediCare Hub Smart Healthcare System! Your account has been registered successfully.

Here are your account access details:
------------------------------------------
• Permanent Login ID: ${id}
• Assigned Role     : ${role}
• Registered Phone  : ${phone}
• Registered Email  : ${user.email}
• Portal Access URL : http://localhost:3000

HOW TO SIGN IN:
1. Open MediCare Hub (or click Sign In).
2. Enter your Permanent ID (${id}) or Email in the ID/Email field.
3. Enter the password you created during registration.

Important: Please keep your ID and password confidential. If you did not create this account, please immediately contact our 24/7 hospital security desk at hotline: 10666 or email support@medicare.com.

Warm regards,
MediCare Hospital Administration & IT Services
Dhanmondi, Dhaka, Bangladesh`;

  return { subject, bodyText };
};

/**
 * Send / Dispatch Registration SMS
 */
export const sendRegistrationSMS = async (user) => {
  const message = formatRegistrationSMS(user);
  const phone = user.phone || '01700000000';
  const timestamp = new Date().toISOString();

  const smsRecord = {
    id: `SMS-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    type: 'sms',
    recipient: phone,
    recipient_name: user.name,
    patient_id: user.patient_id,
    role: user.role,
    title: 'Registration Confirmation SMS',
    message: message,
    status: 'Delivered',
    gateway: 'MediCare Teletalk/Grameenphone SMS Gateway',
    timestamp: timestamp,
    timeFormatted: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  saveNotification(smsRecord);
  console.log(`📱 [SMS Dispatched to ${phone}]: ${message}`);

  return {
    success: true,
    record: smsRecord,
    deliveredAt: timestamp
  };
};

/**
 * Send / Dispatch Registration Email
 */
export const sendRegistrationEmail = async (user) => {
  const { subject, bodyText } = formatRegistrationEmail(user);
  const email = user.email || 'user@example.com';
  const timestamp = new Date().toISOString();

  const emailRecord = {
    id: `EMAIL-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    type: 'email',
    recipient: email,
    recipient_name: user.name,
    patient_id: user.patient_id,
    role: user.role,
    subject: subject,
    body: bodyText,
    status: 'Delivered',
    sender: 'MediCare Hub Hospital <no-reply@medicare-hub.com>',
    timestamp: timestamp,
    timeFormatted: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  saveNotification(emailRecord);
  console.log(`📧 [Email Dispatched to ${email}]: ${subject}`);

  return {
    success: true,
    record: emailRecord,
    deliveredAt: timestamp
  };
};

/**
 * Trigger both SMS and Email simultaneously for a newly registered user
 */
export const dispatchRegistrationNotifications = async (user) => {
  const [smsResult, emailResult] = await Promise.all([
    sendRegistrationSMS(user),
    sendRegistrationEmail(user)
  ]);

  return {
    sms: smsResult,
    email: emailResult,
    dispatched: true
  };
};
