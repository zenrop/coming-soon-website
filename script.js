/**
 * Zenrop Courier — Coming Soon Landing Page
 * Vanilla JavaScript
 */

(function () {
  'use strict';

  // ==========================================
  // COUNTDOWN TIMER
  // ==========================================

  // Launch date: June 1, 2026 midnight Sri Lanka time (UTC+5:30)
  const LAUNCH_DATE = new Date('2026-06-01T00:00:00+05:30');

  const countdownEls = {
    days: document.getElementById('countdown-days'),
    hours: document.getElementById('countdown-hours'),
    minutes: document.getElementById('countdown-minutes'),
    seconds: document.getElementById('countdown-seconds'),
  };

  function updateCountdown() {
    const now = Date.now();
    const diff = Math.max(0, LAUNCH_DATE.getTime() - now);

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    setCountdownValue(countdownEls.days, days);
    setCountdownValue(countdownEls.hours, hours);
    setCountdownValue(countdownEls.minutes, minutes);
    setCountdownValue(countdownEls.seconds, seconds);
  }

  function setCountdownValue(el, value) {
    const formatted = String(value).padStart(2, '0');
    if (el.textContent !== formatted) {
      el.classList.add('tick');
      el.textContent = formatted;
      el.addEventListener('animationend', function handler() {
        el.classList.remove('tick');
        el.removeEventListener('animationend', handler);
      });
    }
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ==========================================
  // EMAIL SIGNUP FORM
  // ==========================================

  const form = document.getElementById('signup-form');
  const emailInput = document.getElementById('email-input');
  const formMessage = document.getElementById('form-message');
  const toast = document.getElementById('toast');

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const email = emailInput.value.trim();

    // Clear previous state
    emailInput.classList.remove('error');
    formMessage.textContent = '';
    formMessage.className = 'form-message';

    if (!email || !EMAIL_REGEX.test(email)) {
      emailInput.classList.add('error');
      formMessage.textContent = 'Please enter a valid email';
      formMessage.classList.add('error-msg');
      emailInput.focus();
      return;
    }

    // Disable form while submitting
    var submitBtn = form.querySelector('.signup-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    saveToWaitlist(email)
      .then(function (result) {
        if (result.duplicate) {
          formMessage.textContent = "You're already on the list! We'll notify you at launch.";
          formMessage.classList.add('success-msg');
        } else {
          formMessage.textContent = "You're on the list! We'll notify you at launch.";
          formMessage.classList.add('success-msg');
          showToast();
        }
        emailInput.value = '';
      })
      .catch(function () {
        formMessage.textContent = 'Something went wrong. Please try again.';
        formMessage.classList.add('error-msg');
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Notify Me';
      });
  });

  // Save email to Firestore waitlist_subscribers collection
  var db = firebase.firestore();

  function saveToWaitlist(email) {
    var waitlistRef = db.collection('waitlist_subscribers');

    return waitlistRef.add({
      email: email,
      joinedAt: new Date().toISOString(),
      source: 'coming-soon-landing-page',
    }).then(function () {
      return { duplicate: false };
    });
  }

  // Remove error state on input
  emailInput.addEventListener('input', function () {
    if (emailInput.classList.contains('error')) {
      emailInput.classList.remove('error');
      formMessage.textContent = '';
      formMessage.className = 'form-message';
    }
  });

  function showToast() {
    toast.classList.add('show');
    setTimeout(function () {
      toast.classList.remove('show');
    }, 3500);
  }

  // ==========================================
  // CONTACT FORM
  // ==========================================

  var contactForm = document.getElementById('contact-form');
  var contactName = document.getElementById('contact-name');
  var contactEmail = document.getElementById('contact-email');
  var contactSubject = document.getElementById('contact-subject');
  var contactMessage = document.getElementById('contact-message');
  var contactFormMessage = document.getElementById('contact-form-message');

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Clear errors
    [contactName, contactEmail, contactMessage].forEach(function (el) {
      el.classList.remove('error');
    });
    contactFormMessage.textContent = '';
    contactFormMessage.className = 'contact-form-message';

    var name = contactName.value.trim();
    var email = contactEmail.value.trim();
    var subject = contactSubject.value.trim();
    var message = contactMessage.value.trim();
    var hasError = false;

    if (!name) { contactName.classList.add('error'); hasError = true; }
    if (!email || !EMAIL_REGEX.test(email)) { contactEmail.classList.add('error'); hasError = true; }
    if (!message) { contactMessage.classList.add('error'); hasError = true; }

    if (hasError) {
      contactFormMessage.textContent = 'Please fill in all required fields correctly.';
      contactFormMessage.classList.add('error-msg');
      return;
    }

    var submitBtn = contactForm.querySelector('.contact-submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    db.collection('contact_messages').add({
      name: name,
      email: email,
      subject: subject || '(No subject)',
      message: message,
      sentAt: new Date().toISOString(),
    })
    .then(function () {
      contactFormMessage.textContent = 'Message sent! We\'ll get back to you soon.';
      contactFormMessage.classList.add('success-msg');
      contactForm.reset();
    })
    .catch(function () {
      contactFormMessage.textContent = 'Failed to send. Please email us at contact@zenrop.com';
      contactFormMessage.classList.add('error-msg');
    })
    .finally(function () {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    });
  });

  // Clear contact field errors on input
  [contactName, contactEmail, contactMessage].forEach(function (el) {
    el.addEventListener('input', function () {
      el.classList.remove('error');
    });
  });

  // ==========================================
  // SCROLL DOWN INDICATOR
  // ==========================================

  var scrollBtn = document.getElementById('scroll-indicator');
  var featuresSection = document.getElementById('features');

  scrollBtn.addEventListener('click', function () {
    featuresSection.scrollIntoView({ behavior: 'smooth' });
  });

  // ==========================================
  // SCROLL ANIMATIONS (Intersection Observer)
  // ==========================================

  var animateElements = document.querySelectorAll('[data-animate]');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    animateElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show all elements immediately
    animateElements.forEach(function (el) {
      el.classList.add('visible');
    });
  }
})();
