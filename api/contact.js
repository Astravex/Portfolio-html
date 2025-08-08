// Vercel serverless function for contact form
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

    // Validate message length
    if (message.length < 10 || message.length > 2000) {
      return res.status(400).json({ error: 'Message must be between 10 and 2000 characters' });
    }

    // Validate phone length
    if (phone.length < 5 || phone.length > 20) {
      return res.status(400).json({ error: 'Phone number must be between 5 and 20 characters' });
    }

    // Check if EmailJS environment variables are set
    const emailjsServiceId = "service_zvq676a";
    const emailjsTemplateId = "template_kvz0w1l";
    const emailjsUserId = "a_Hk7hZC215NevhRM";

    if (emailjsServiceId && emailjsTemplateId && emailjsUserId) {
      // Use EmailJS
      const emailjsResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: emailjsServiceId,
          template_id: emailjsTemplateId,
          user_id: emailjsUserId,
          template_params: {
            from_email: mail,
            from_phone: phone,
            message: message,
            to_email: 'pierrele0102@gmail.com'
          }
        })
      });

      if (emailjsResponse.ok) {
        return res.status(200).json({ message: 'Success' });
      } else {
        console.error('EmailJS error:', await emailjsResponse.text());
        return res.status(500).json({ error: 'Failed to send email via EmailJS' });
      }
    } else {
      // Check if Formspree endpoint is set
      const formspreeEndpoint = process.env.FORMSPREE_ENDPOINT;
      
      if (formspreeEndpoint && formspreeEndpoint !== 'https://formspree.io/f/YOUR_FORM_ID') {
        // Use Formspree
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
          return res.status(500).json({ error: 'Failed to send email via Formspree' });
        }
      } else {
        // No email service configured
        console.error('No email service configured. Please set up EmailJS or Formspree environment variables.');
        return res.status(500).json({ 
          error: 'Email service not configured. Please check the deployment guide for setup instructions.',
          setup_required: true
        });
      }
    }

  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 