// Simple contact form handler using Formspree
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { mail, phone, message } = req.body;

    // Validate required fields
    if (!mail || !phone || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(mail)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Use Formspree to send email
    // Replace 'YOUR_FORMSPREE_ENDPOINT' with your actual Formspree endpoint
    const formspreeEndpoint = process.env.FORMSPREE_ENDPOINT || 'https://formspree.io/f/YOUR_FORMSPREE_ENDPOINT';
    
    const formspreeResponse = await fetch(formspreeEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: mail,
        phone: phone,
        message: message,
        _subject: `New Contact Form Submission from ${mail}`,
        _replyto: mail
      })
    });

    if (formspreeResponse.ok) {
      return res.status(200).json({ message: 'Success' });
    } else {
      console.error('Formspree error:', await formspreeResponse.text());
      return res.status(500).json({ error: 'Failed to send email' });
    }

  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 