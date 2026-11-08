/**
 * ===================================================================
 * CORPORATE PORTFOLIO JAVASCRIPT - MARIA HAYET PUTHI
 * Lightweight, high-performance script powering:
 * - Refined Role Typing Animation
 * - Intersection Observer for Smooth Section Reveals
 * - Active Navigation Link Tracking
 * - Sticky Navbar Background Transition
 * - Responsive Mobile Drawer
 * - Corporate Form Validation & Toast Feedback
 * - One-Click Clipboard Copy
 * ===================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ===================================================================
     1. TYPING ANIMATION (HERO TAGLINE)
     Clean, professional role cycling
     =================================================================== */
  const initTypingAnimation = () => {
    const textElement = document.getElementById('typingText');
    if (!textElement) return;

    const roles = [
      'Full-Stack Development',
      'AI-Assisted Workflows',
      'Web Application Architecture',
      'CSE @ AIUB'
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    const typeLoop = () => {
      const currentRole = roles[roleIndex];

      if (isDeleting) {
        textElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 45;
      } else {
        textElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 95;
      }

      if (!isDeleting && charIndex === currentRole.length) {
        typingSpeed = 2000; // Pause at complete word
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 400; // Pause before typing next word
      }

      setTimeout(typeLoop, typingSpeed);
    };

    typeLoop();
  };

  /* ===================================================================
     2. INTERSECTION OBSERVER (SCROLL REVEALS & ACTIVE NAV)
     Clean scroll animations and active link tracking
     =================================================================== */
  const initScrollObserver = () => {
    // 2a. Section and Element Reveals
    const revealElements = document.querySelectorAll('.reveal-on-scroll');

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));

    // 2b. Active Navigation Highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const currentId = entry.target.getAttribute('id');

            navLinks.forEach((link) => {
              if (link.getAttribute('href') === `#${currentId}`) {
                link.classList.add('active');
              } else {
                link.classList.remove('active');
              }
            });

            mobileLinks.forEach((link) => {
              if (link.getAttribute('href') === `#${currentId}`) {
                link.classList.add('active');
              } else {
                link.classList.remove('active');
              }
            });
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: '-72px 0px -40% 0px'
      }
    );

    sections.forEach((sec) => navObserver.observe(sec));
  };

  /* ===================================================================
     3. STICKY NAVBAR & SCROLL-TO-TOP BUTTON
     =================================================================== */
  const initNavbarAndScrollTop = () => {
    const navbar = document.getElementById('navbar');
    const scrollTopBtn = document.getElementById('scrollTopBtn');

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;

      // Navbar elevation on scroll
      if (scrollY > 40) {
        navbar?.classList.add('scrolled');
      } else {
        navbar?.classList.remove('scrolled');
      }

      // Scroll-to-top button appearance
      if (scrollY > 350) {
        scrollTopBtn?.classList.add('visible');
      } else {
        scrollTopBtn?.classList.remove('visible');
      }
    });

    if (scrollTopBtn) {
      scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  };

  /* ===================================================================
     4. MOBILE DRAWER NAVIGATION
     =================================================================== */
  const initMobileNavigation = () => {
    const navToggle = document.getElementById('navToggle');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const drawerBackdrop = document.getElementById('drawerBackdrop');
    const closeBtn = document.getElementById('mobileDrawerClose');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (!navToggle || !mobileDrawer) return;

    const openDrawer = () => {
      navToggle.classList.add('open');
      navToggle.setAttribute('aria-expanded', 'true');
      mobileDrawer.classList.add('open');
      drawerBackdrop?.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    const closeDrawer = () => {
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      mobileDrawer.classList.remove('open');
      drawerBackdrop?.classList.remove('active');
      document.body.style.overflow = '';
    };

    navToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.contains('open');
      isOpen ? closeDrawer() : openDrawer();
    });

    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

    mobileLinks.forEach((link) => {
      link.addEventListener('click', closeDrawer);
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
        closeDrawer();
      }
    });
  };

  /* ===================================================================
     5. TOAST NOTIFICATION UTILITY
     =================================================================== */
  let toastTimer = null;
  const showToast = (message, iconClass = 'fa-solid fa-circle-check', duration = 3200) => {
    const toast = document.getElementById('toastNotification');
    const msgEl = document.getElementById('toastMessage');
    const iconEl = document.getElementById('toastIcon');

    if (!toast || !msgEl || !iconEl) return;

    clearTimeout(toastTimer);

    msgEl.textContent = message;
    iconEl.innerHTML = `<i class="${iconClass}"></i>`;

    toast.classList.add('show');

    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  };

  /* ===================================================================
     6. CLIPBOARD COPY BUTTONS
     =================================================================== */
  const initCopyButtons = () => {
    const copyButtons = document.querySelectorAll('.copy-action-btn');

    copyButtons.forEach((btn) => {
      btn.addEventListener('click', async () => {
        const textToCopy = btn.getAttribute('data-copy');
        if (!textToCopy) return;

        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(textToCopy);
          } else {
            const textArea = document.createElement('textarea');
            textArea.value = textToCopy;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
          }

          showToast(`Copied to clipboard: ${textToCopy}`);

          const icon = btn.querySelector('i');
          if (icon) {
            icon.className = 'fa-solid fa-check text-accent';
            setTimeout(() => {
              icon.className = 'fa-regular fa-copy';
            }, 2000);
          }
        } catch (err) {
          showToast('Could not copy automatically.', 'fa-solid fa-triangle-exclamation');
        }
      });
    });
  };

  /* ===================================================================
     7. CONTACT FORM VALIDATION & HANDLING
     =================================================================== */
  const initContactForm = () => {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const nameInput = document.getElementById('contactName');
    const emailInput = document.getElementById('contactEmail');
    const messageInput = document.getElementById('contactMessage');
    const submitBtn = document.getElementById('submitBtn');

    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const messageError = document.getElementById('messageError');

    const validateEmail = (email) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;

      // Validate Name
      if (!nameInput.value.trim()) {
        nameError.textContent = 'Please enter your full name.';
        isValid = false;
      } else {
        nameError.textContent = '';
      }

      // Validate Email
      if (!emailInput.value.trim()) {
        emailError.textContent = 'Please enter your work email.';
        isValid = false;
      } else if (!validateEmail(emailInput.value.trim())) {
        emailError.textContent = 'Please enter a valid email address.';
        isValid = false;
      } else {
        emailError.textContent = '';
      }

      // Validate Message
      if (!messageInput.value.trim()) {
        messageError.textContent = 'Please enter a message.';
        isValid = false;
      } else if (messageInput.value.trim().length < 10) {
        messageError.textContent = 'Message should be at least 10 characters.';
        isValid = false;
      } else {
        messageError.textContent = '';
      }

      if (!isValid) return;

      // Simulate sending
      const originalHtml = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> <span>Sending Message...</span>';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> <span>Message Sent!</span>';

        showToast(
          `Thank you, ${nameInput.value.trim()}! Your message has been received.`,
          'fa-solid fa-circle-check'
        );

        form.reset();

        setTimeout(() => {
          submitBtn.innerHTML = originalHtml;
        }, 3000);
      }, 1100);
    });

    // Real-time clearance of errors on typing
    nameInput.addEventListener('input', () => { if (nameError) nameError.textContent = ''; });
    emailInput.addEventListener('input', () => { if (emailError) emailError.textContent = ''; });
    messageInput.addEventListener('input', () => { if (messageError) messageError.textContent = ''; });
  };

  /* ===================================================================
     8. RESUME DOWNLOAD TRACKING
     =================================================================== */
  const initResumeDownload = () => {
    const downloadBtns = document.querySelectorAll('a[download]');
    downloadBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        showToast('Downloading Maria Hayet Puthi\'s CV...', 'fa-solid fa-file-arrow-down');
      });
    });
  };

  /* ===================================================================
     INITIALIZE ALL MODULES
     =================================================================== */
  initTypingAnimation();
  initScrollObserver();
  initNavbarAndScrollTop();
  initMobileNavigation();
  initCopyButtons();
  initContactForm();
  initResumeDownload();
});
