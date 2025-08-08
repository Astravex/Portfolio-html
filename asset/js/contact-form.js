/**
 * Contact Form Handler with Popup Notifications
 * Handles EmailJS integration and user feedback
 */

// EmailJS Configuration
const EMAILJS_CONFIG = {
  publicKey: "a_Hk7hZC215NevhRM",
  serviceId: "service_zvq676a",
  templateId: "template_kvz0w1l"
};

// Flag to prevent multiple initializations
let isInitialized = false;

// Initialize EmailJS
function initEmailJS() {
  if (typeof emailjs !== 'undefined') {
    emailjs.init({
      publicKey: EMAILJS_CONFIG.publicKey,
    });
  }
}

// Create popup elements
function createPopupElements() {
  // Remove existing popup elements if they exist
  const existingOverlay = document.getElementById('contact-popup-overlay');
  const existingPopup = document.getElementById('contact-popup');
  
  if (existingOverlay) existingOverlay.remove();
  if (existingPopup) existingPopup.remove();
  
  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'contact-popup-overlay';
  overlay.id = 'contact-popup-overlay';
  document.body.appendChild(overlay);
  
  // Create popup
  const popup = document.createElement('div');
  popup.className = 'contact-popup';
  popup.id = 'contact-popup';
  popup.innerHTML = `
    <div class="contact-popup-icon" id="popup-icon">✓</div>
    <div class="contact-popup-title" id="popup-title">Success!</div>
    <div class="contact-popup-message" id="popup-message">Your message has been sent successfully!</div>
    <button class="contact-popup-close" onclick="closeContactPopup()">Close</button>
  `;
  document.body.appendChild(popup);
}

// Show popup notification
function showContactPopup(type, title, message) {
  const popup = document.getElementById('contact-popup');
  const overlay = document.getElementById('contact-popup-overlay');
  const icon = document.getElementById('popup-icon');
  const popupTitle = document.getElementById('popup-title');
  const popupMessage = document.getElementById('popup-message');
  
  if (!popup || !overlay) return;
  
  // Update popup content
  popupTitle.textContent = title;
  popupMessage.textContent = message;
  
  // Update styling based on type
  popup.className = 'contact-popup ' + type;
  if (type === 'success') {
    icon.textContent = '✓';
    icon.style.color = '#28a745';
  } else {
    icon.textContent = '✕';
    icon.style.color = '#dc3545';
  }
  
  // Show popup and overlay
  overlay.classList.add('show');
  popup.classList.add('show');
  
  // Auto-hide after 5 seconds
  setTimeout(function() {
    closeContactPopup();
  }, 5000);
}

// Close popup notification
function closeContactPopup() {
  const popup = document.getElementById('contact-popup');
  const overlay = document.getElementById('contact-popup-overlay');
  
  if (popup) popup.classList.remove('show');
  if (overlay) overlay.classList.remove('show');
}

// Handle contact form submission
function handleContactFormSubmit(event) {
  event.preventDefault();
  
  const form = event.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  
  // Prevent multiple submissions
  if (submitBtn.disabled) {
    return;
  }
  
  // Show loading state
  submitBtn.innerHTML = '<span class="font-poppins flex-grow-1 text-start">Sending...</span><i class="icon icon-spinner"></i>';
  submitBtn.disabled = true;
  
  // Send email using EmailJS
  emailjs.sendForm(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, form).then(
    () => {
      console.log("SUCCESS!");
      
      // Show success popup
      showContactPopup('success', 'Message Sent!', 'Thank you for your message. I will get back to you soon!');
      
      // Reset form
      form.reset();
      
      // Reset button
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    },
    (error) => {
      console.log("FAILED...", error);
      
      // Show error popup
      showContactPopup('error', 'Error!', 'Sorry, there was an error sending your message. Please try again.');
      
      // Reset button
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  );
}

// Initialize contact form functionality
function initContactForm() {
  // Prevent multiple initializations
  if (isInitialized) {
    console.log('Contact form already initialized');
    return;
  }
  
  // Create popup elements
  createPopupElements();
  
  // Set up contact form event listener
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    // Remove any existing event listeners
    contactForm.removeEventListener("submit", handleContactFormSubmit);
    // Add new event listener
    contactForm.addEventListener("submit", handleContactFormSubmit);
    console.log('Contact form event listener attached');
  }
  
  // Close popup when clicking overlay (only add once)
  if (!document.body.hasAttribute('data-popup-overlay-initialized')) {
    document.addEventListener('click', function(e) {
      if (e.target.id === 'contact-popup-overlay') {
        closeContactPopup();
      }
    });
    document.body.setAttribute('data-popup-overlay-initialized', 'true');
  }
  
  // Mark as initialized
  isInitialized = true;
  console.log('Contact form initialized successfully');
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Initialize EmailJS
  initEmailJS();
  
  // Initialize contact form
  initContactForm();
});

// Export functions for global access
window.showContactPopup = showContactPopup;
window.closeContactPopup = closeContactPopup; 