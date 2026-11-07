/**
 * ===================================================================
 * PORTFOLIO JAVASCRIPT - MARIA HAYET PUTHI
 * High-performance, clean, modular script powering:
 * - HTML5 Particle Canvas Background
 * - Typing Animation (Full-Stack Developer, AI Enthusiast, etc.)
 * - 3D Tilt Effect on Project Cards
 * - Intersection Observer for Scroll Reveals & Active Nav Highlighting
 * - Sticky Navbar & Circular Scroll-to-Top Progress
 * - Responsive Mobile Navigation Drawer
 * - Form Validation & Toast Notification System
 * - Interactive Clipboard Copy
 * ===================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ===================================================================
     1. TYPING ANIMATION EFFECT
     Cycles through specified roles with dynamic typing and backspacing
     =================================================================== */
  const initTypingAnimation = () => {
    const textElement = document.getElementById('typingText');
    if (!textElement) return;

    const words = [
      'Full-Stack Developer',
      'AI Enthusiast',
      'Problem Solver',
      'CSE Student'
    ];

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    const typeCycle = () => {
      const currentWord = words[wordIndex];

      if (isDeleting) {
        textElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
      } else {
        textElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 110;
      }

      // If word is completely typed out
      if (!isDeleting && charIndex === currentWord.length) {
        // Pause at full word
        typingSpeed = 1800;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        // Word cleared, move to next
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        typingSpeed = 400;
      }

      setTimeout(typeCycle, typingSpeed);
    };

    typeCycle();
  };

  /* ===================================================================
     2. INTERACTIVE HTML5 PARTICLE CANVAS (HERO BACKGROUND)
     Floating neon particles connecting with radiant lines
     =================================================================== */
  const initParticleCanvas = () => {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse interaction coordinates
    const mouse = {
      x: null,
      y: null,
      radius: 120
    };

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    // Handle canvas resizing
    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      createParticles();
    };
    window.addEventListener('resize', onResize);

    // Particle Class
    const neonColors = ['#00f0ff', '#b829ff', '#ff2e93'];

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2.2 + 0.8;
        this.speedX = (Math.random() - 0.5) * 0.75;
        this.speedY = (Math.random() - 0.5) * 0.75;
        this.color = neonColors[Math.floor(Math.random() * neonColors.length)];
        this.alpha = Math.random() * 0.6 + 0.2;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce on boundary
        if (this.x < 0 || this.x > width) this.speedX = -this.speedX;
        if (this.y < 0 || this.y > height) this.speedY = -this.speedY;

        // Mouse avoidance/attraction subtle response
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const distance = Math.hypot(dx, dy);

          if (distance < mouse.radius) {
            const angle = Math.atan2(dy, dx);
            const force = (mouse.radius - distance) / mouse.radius;
            this.x -= Math.cos(angle) * force * 1.5;
            this.y -= Math.sin(angle) * force * 1.5;
          }
        }
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    const createParticles = () => {
      particles = [];
      // Adjust density for mobile vs desktop
      const count = width < 768 ? 35 : 75;
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    };

    const connectParticles = () => {
      const maxDistance = 110;
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const dist = Math.hypot(dx, dy);

          if (dist < maxDistance) {
            const opacity = (1 - dist / maxDistance) * 0.22;
            ctx.save();
            ctx.strokeStyle = '#00f0ff';
            ctx.globalAlpha = opacity;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
            ctx.restore();
          }
        }
      }
    };

    const animateParticles = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      connectParticles();

      animationFrameId = requestAnimationFrame(animateParticles);
    };

    createParticles();
    animateParticles();
  };

  /* ===================================================================
     3. AMBIENT CURSOR GLOW (LERP FOLLOWER)
     Smooth tracking of the user's cursor for futuristic ambiance
     =================================================================== */
  const initCursorGlow = () => {
    const glow = document.getElementById('cursorGlow');
    if (!glow || window.innerWidth <= 991) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;

    window.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    });

    const render = () => {
      // Linear interpolation (lerp) for smooth glide
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;
      glow.style.transform = `translate(${currentX}px, ${currentY}px) translate(-50%, -50%)`;
      requestAnimationFrame(render);
    };

    render();
  };

  /* ===================================================================
     4. 3D TILT EFFECT ON PROJECT CARDS
     Calculates card coordinates and dynamically creates 3D tilt & sheen
     =================================================================== */
  const initTiltCards = () => {
    // Only enable on pointer-fine devices (desktops/laptops)
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const cards = document.querySelectorAll('[data-tilt]');

    cards.forEach((card) => {
      let bounds = null;

      const onMouseEnter = () => {
        bounds = card.getBoundingClientRect();
      };

      const onMouseMove = (e) => {
        if (!bounds) bounds = card.getBoundingClientRect();

        const mouseX = e.clientX - bounds.left;
        const mouseY = e.clientY - bounds.top;

        const xPct = mouseX / bounds.width;
        const yPct = mouseY / bounds.height;

        // Max tilt degree
        const maxTilt = 8;
        const tiltX = (0.5 - yPct) * maxTilt;
        const tiltY = (xPct - 0.5) * maxTilt;

        card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;

        // Update sheen position
        card.style.setProperty('--mouse-x', `${xPct * 100}%`);
        card.style.setProperty('--mouse-y', `${yPct * 100}%`);
      };

      const onMouseLeave = () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        bounds = null;
      };

      card.addEventListener('mouseenter', onMouseEnter);
      card.addEventListener('mousemove', onMouseMove);
      card.addEventListener('mouseleave', onMouseLeave);
    });
  };

  /* ===================================================================
     5. INTERSECTION OBSERVER (SCROLL ANIMATIONS & ACTIVE NAV LINK)
     Reveals sections gracefully and highlights current navbar link
     =================================================================== */
  const initScrollObserver = () => {
    // 1. Reveal Elements
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
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));

    // 2. Active Navigation Highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const currentId = entry.target.getAttribute('id');

            // Update Desktop Nav
            navLinks.forEach((link) => {
              if (link.getAttribute('href') === `#${currentId}`) {
                link.classList.add('active');
              } else {
                link.classList.remove('active');
              }
            });

            // Update Mobile Nav
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
        threshold: 0.35,
        rootMargin: '-70px 0px -40% 0px'
      }
    );

    sections.forEach((sec) => navObserver.observe(sec));
  };

  /* ===================================================================
     6. NAVBAR SCROLL EFFECT & SCROLL-TO-TOP BUTTON WITH PROGRESS RING
     =================================================================== */
  const initNavbarAndScrollTop = () => {
    const navbar = document.getElementById('navbar');
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    const circle = document.querySelector('.progress-ring-circle');

    let circumference = 0;
    if (circle) {
      const radius = circle.r.baseVal.value;
      circumference = 2 * Math.PI * radius;
      circle.style.strokeDasharray = `${circumference} ${circumference}`;
      circle.style.strokeDashoffset = `${circumference}`;
    }

    const setProgress = (percent) => {
      if (!circle) return;
      const offset = circumference - (percent / 100) * circumference;
      circle.style.strokeDashoffset = offset;
    };

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

      // Navbar frosted density
      if (scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }

      // Scroll-to-top button visibility & circular progress
      if (scrollY > 350) {
        scrollTopBtn.classList.add('visible');
        setProgress(scrollPercent);
      } else {
        scrollTopBtn.classList.remove('visible');
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
     7. MOBILE DRAWER NAVIGATION
     Smooth hamburger toggle with backdrop and accessibility
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
      drawerBackdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    const closeDrawer = () => {
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      mobileDrawer.classList.remove('open');
      drawerBackdrop.classList.remove('active');
      document.body.style.overflow = '';
    };

    navToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.contains('open');
      isOpen ? closeDrawer() : openDrawer();
    });

    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

    // Close on clicking any mobile navigation link
    mobileLinks.forEach((link) => {
      link.addEventListener('click', closeDrawer);
    });

    // Close on Escape key press
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('open')) {
        closeDrawer();
      }
    });
  };

  /* ===================================================================
     8. TOAST NOTIFICATION UTILITY
     Reusable lightweight toast alerts
     =================================================================== */
  let toastTimer = null;
  const showToast = (message, iconClass = 'fa-solid fa-circle-check', duration = 3500) => {
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
     9. CLIPBOARD COPY BUTTONS
     Allows instant copying of Email & Phone with feedback
     =================================================================== */
  const initCopyButtons = () => {
    const copyButtons = document.querySelectorAll('.copy-btn');

    copyButtons.forEach((btn) => {
      btn.addEventListener('click', async () => {
        const textToCopy = btn.getAttribute('data-copy');
        if (!textToCopy) return;

        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            await navigator.clipboard.writeText(textToCopy);
          } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = textToCopy;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
          }

          showToast(`Copied to clipboard: ${textToCopy}`, 'fa-solid fa-copy');
          
          // Temporary icon swap
          const icon = btn.querySelector('i');
          if (icon) {
            icon.className = 'fa-solid fa-check text-neon-cyan';
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
     10. CONTACT FORM VALIDATION & HANDLING
     Real-time field validation with custom neon feedback
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
        nameError.textContent = 'Please enter your name.';
        isValid = false;
      } else {
        nameError.textContent = '';
      }

      // Validate Email
      if (!emailInput.value.trim()) {
        emailError.textContent = 'Please enter your email.';
        isValid = false;
      } else if (!validateEmail(emailInput.value.trim())) {
        emailError.textContent = 'Please enter a valid email address.';
        isValid = false;
      } else {
        emailError.textContent = '';
      }

      // Validate Message
      if (!messageInput.value.trim()) {
        messageError.textContent = 'Please enter your message.';
        isValid = false;
      } else if (messageInput.value.trim().length < 10) {
        messageError.textContent = 'Message should be at least 10 characters long.';
        isValid = false;
      } else {
        messageError.textContent = '';
      }

      if (!isValid) return;

      // Simulate sending with button loader
      const originalBtnHtml = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> <span>Sending...</span>';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> <span>Message Sent!</span>';

        showToast(
          `Thank you, ${nameInput.value.trim()}! Your message has been received.`,
          'fa-solid fa-paper-plane'
        );

        form.reset();

        setTimeout(() => {
          submitBtn.innerHTML = originalBtnHtml;
        }, 3000);
      }, 1200);
    });

    // Clear error on input
    nameInput.addEventListener('input', () => { if (nameError) nameError.textContent = ''; });
    emailInput.addEventListener('input', () => { if (emailError) emailError.textContent = ''; });
    messageInput.addEventListener('input', () => { if (messageError) messageError.textContent = ''; });
  };

  /* ===================================================================
     11. RESUME DOWNLOAD TRACKING
     Notify user when CV download starts
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
     12. ANIMATED AUDIO WAVEFORM LINES (SAMSUNG ONE UI MEDIA BAR)
     Reusable sine waveform progress line on canvas with glowing thumb
     =================================================================== */
  const initWaveLine = (canvas, options = {}) => {
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const {
      height = 40,
      colors = ['#00f0ff', '#b829ff', '#ff2e93'],
      dimColors = ['rgba(0, 240, 255, 0.22)', 'rgba(184, 41, 255, 0.22)', 'rgba(255, 46, 147, 0.22)'],
      speed = 1.0,
      thumbMode = 'scroll', // 'scroll' | 'loop'
      loopDuration = 5000,
      isSmall = false
    } = options;

    let animFrameId = null;
    let isVisible = false;
    let phase = 0;
    let width = 0;
    let dpr = 1;
    let loopStartTime = performance.now();

    // 3 Layered sine waves with varying frequency, speed, amplitude, and opacity
    const layers = [
      {
        freq: isSmall ? 0.038 : 0.016,
        speed: 0.032 * speed,
        amp: isSmall ? 4.5 : 11,
        alpha: 0.9,
        lineWidth: isSmall ? 1.6 : 2.2,
        phaseOffset: 0
      },
      {
        freq: isSmall ? 0.058 : 0.026,
        speed: 0.022 * speed,
        amp: isSmall ? 3 : 6.5,
        alpha: 0.5,
        lineWidth: isSmall ? 1.2 : 1.6,
        phaseOffset: Math.PI * 0.5
      },
      {
        freq: isSmall ? 0.082 : 0.036,
        speed: 0.045 * speed,
        amp: isSmall ? 1.8 : 3.8,
        alpha: 0.35,
        lineWidth: isSmall ? 0.9 : 1.2,
        phaseOffset: Math.PI * 1.1
      }
    ];

    let brightGradient = null;
    let dimGradient = null;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      if (!width) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      // Rebuild matching linear gradients across canvas width
      brightGradient = ctx.createLinearGradient(0, 0, width, 0);
      dimGradient = ctx.createLinearGradient(0, 0, width, 0);

      const step = 1 / (colors.length - 1);
      colors.forEach((col, idx) => {
        brightGradient.addColorStop(Math.min(idx * step, 1), col);
      });
      dimColors.forEach((col, idx) => {
        dimGradient.addColorStop(Math.min(idx * step, 1), col);
      });

      drawFrame(performance.now());
    };

    const getThumbProgress = (currentTime) => {
      if (thumbMode === 'scroll') {
        const scrollY = window.scrollY || document.documentElement.scrollTop;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        if (maxScroll <= 0) return 0.5;
        return Math.min(Math.max(scrollY / maxScroll, 0), 1);
      } else {
        const elapsed = (currentTime - loopStartTime) % loopDuration;
        return elapsed / loopDuration;
      }
    };

    const drawFrame = (timestamp) => {
      if (!width || !height) return;

      ctx.clearRect(0, 0, width, height);

      const centerY = height / 2;
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Advance phase for continuous left-to-right wave flow
      if (!reducedMotion) {
        phase += 0.02 * speed;
      }

      const thumbProgress = getThumbProgress(timestamp);
      const thumbX = thumbProgress * width;

      // Primary wave vertical displacement at thumb position for natural riding
      const primaryLayer = layers[0];
      const normThumb = width > 0 ? thumbX / width : 0;
      const thumbEnvelope = Math.sin(Math.PI * normThumb);
      const thumbWaveOffset = reducedMotion
        ? 0
        : Math.sin(thumbX * primaryLayer.freq - phase * primaryLayer.speed * 60 + primaryLayer.phaseOffset) *
          primaryLayer.amp *
          thumbEnvelope;
      const thumbY = centerY + thumbWaveOffset;

      // 1. Draw Base Audio Track Line (Behind thumb = glowing; Ahead of thumb = dim & thin)
      if (thumbX > 0) {
        ctx.save();
        ctx.strokeStyle = brightGradient || colors[0];
        ctx.lineWidth = isSmall ? 1.8 : 2.4;
        ctx.shadowColor = colors[0];
        ctx.shadowBlur = isSmall ? 8 : 12;
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        ctx.lineTo(thumbX, centerY);
        ctx.stroke();
        ctx.restore();
      }

      if (thumbX < width) {
        ctx.save();
        ctx.strokeStyle = dimGradient || dimColors[0];
        ctx.lineWidth = isSmall ? 1.0 : 1.2;
        ctx.beginPath();
        ctx.moveTo(thumbX, centerY);
        ctx.lineTo(width, centerY);
        ctx.stroke();
        ctx.restore();
      }

      // 2. Draw 2-3 Layered Semi-Transparent Sine Waves
      if (!reducedMotion) {
        const stepX = isSmall ? 2 : 2.5;

        layers.forEach((layer) => {
          const wavePhase = -phase * layer.speed * 60 + layer.phaseOffset;

          // 2a. Played Portion of Wave (0 -> thumbX): Bright, glowing, animated
          if (thumbX > 0) {
            ctx.save();
            ctx.globalAlpha = layer.alpha;
            ctx.strokeStyle = brightGradient || colors[0];
            ctx.lineWidth = layer.lineWidth;
            ctx.shadowColor = colors[1] || colors[0];
            ctx.shadowBlur = isSmall ? 6 : 10;
            ctx.beginPath();

            for (let x = 0; x <= thumbX; x += stepX) {
              const normX = x / width;
              const envelope = Math.sin(Math.PI * normX); // Envelope: 0 at ends, 1 in middle
              const y = centerY + Math.sin(x * layer.freq + wavePhase) * layer.amp * envelope;
              if (x === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }
            ctx.lineTo(thumbX, thumbY);
            ctx.stroke();
            ctx.restore();
          }

          // 2b. Unplayed Portion of Wave (thumbX -> width): Dimmer, subtle, unplayed track
          if (thumbX < width) {
            ctx.save();
            ctx.globalAlpha = layer.alpha * 0.32;
            ctx.strokeStyle = dimGradient || dimColors[0];
            ctx.lineWidth = Math.max(layer.lineWidth * 0.7, 0.8);
            ctx.beginPath();
            ctx.moveTo(thumbX, thumbY);

            for (let x = thumbX + stepX; x <= width; x += stepX) {
              const normX = x / width;
              const envelope = Math.sin(Math.PI * normX);
              const y = centerY + Math.sin(x * layer.freq + wavePhase) * (layer.amp * 0.4) * envelope;
              ctx.lineTo(x, y);
            }
            ctx.lineTo(width, centerY);
            ctx.stroke();
            ctx.restore();
          }
        });
      }

      // 3. Draw Media Player Glowing Thumb (Samsung One UI Inspired)
      // 3a. Outer Pink/Magenta Glow Ring
      ctx.save();
      const haloRadius = isSmall ? 5 : 7.5;
      ctx.strokeStyle = colors[colors.length - 1]; // Neon pink / purple
      ctx.lineWidth = isSmall ? 1.6 : 2.2;
      ctx.shadowColor = colors[colors.length - 1];
      ctx.shadowBlur = isSmall ? 10 : 16;
      ctx.beginPath();
      ctx.arc(thumbX, thumbY, haloRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // 3b. Outer Cyan Secondary Ring
      ctx.save();
      ctx.strokeStyle = colors[0]; // Electric blue
      ctx.lineWidth = 1;
      ctx.shadowColor = colors[0];
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(thumbX, thumbY, haloRadius + 1.6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // 3c. Inner Solid Center (White / Light-Pink Glow Core)
      ctx.save();
      const centerRadius = isSmall ? 2.5 : 3.8;
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(thumbX, thumbY, centerRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const animate = (timestamp) => {
      if (!isVisible) return;
      drawFrame(timestamp);
      animFrameId = requestAnimationFrame(animate);
    };

    const start = () => {
      if (!isVisible) {
        isVisible = true;
        if (!animFrameId) {
          animFrameId = requestAnimationFrame(animate);
        }
      }
    };

    const stop = () => {
      isVisible = false;
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
        animFrameId = null;
      }
    };

    // Reduced motion preference listener
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addEventListener('change', () => {
      if (mediaQuery.matches) {
        stop();
        drawFrame(performance.now());
      } else if (isVisible) {
        start();
      }
    });

    // Window resize handling
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', () => {
      if (thumbMode === 'scroll' && isVisible) {
        // Redraw immediately on scroll for instant responsiveness
        drawFrame(performance.now());
      }
    }, { passive: true });

    // Initial setup
    resize();

    return { start, stop, resize };
  };

  const initFooterWaveforms = () => {
    const topCanvas = document.getElementById('footerTopWaveCanvas');
    const bottomCanvas = document.getElementById('footerBottomWaveCanvas');
    const footer = document.getElementById('footer') || document.querySelector('.footer');

    if (!topCanvas && !bottomCanvas) return;

    // 1. Full-width top waveform line (Scroll-progress thumb, Cyan -> Purple -> Pink)
    const topWave = topCanvas
      ? initWaveLine(topCanvas, {
          height: 40,
          colors: ['#00f0ff', '#b829ff', '#ff2e93'],
          dimColors: ['rgba(0, 240, 255, 0.22)', 'rgba(184, 41, 255, 0.22)', 'rgba(255, 46, 147, 0.22)'],
          speed: 1.0,
          thumbMode: 'scroll',
          isSmall: false
        })
      : null;

    // 2. Small copyright underline waveform (Continuous loop thumb, Teal/Cyan -> Purple)
    const bottomWave = bottomCanvas
      ? initWaveLine(bottomCanvas, {
          height: 20,
          colors: ['#00f0ff', '#b829ff'],
          dimColors: ['rgba(0, 240, 255, 0.22)', 'rgba(184, 41, 255, 0.22)'],
          speed: 1.25,
          thumbMode: 'loop',
          loopDuration: 5200,
          isSmall: true
        })
      : null;

    if (!footer) {
      topWave?.start();
      bottomWave?.start();
      return;
    }

    // IntersectionObserver: Only runs requestAnimationFrame when footer is visible
    const footerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            topWave?.start();
            bottomWave?.start();
          } else {
            topWave?.stop();
            bottomWave?.stop();
          }
        });
      },
      {
        rootMargin: '100px 0px 100px 0px',
        threshold: 0
      }
    );

    footerObserver.observe(footer);
  };

  /* ===================================================================
     13. VERTICAL TIMELINE WAVE ANIMATION (EDUCATION & JOURNEY STAND LINE)
     Vertical sine waveform with glowing energy bead and scroll tracking
     =================================================================== */
  const initTimelineWaveform = () => {
    const canvas = document.getElementById('timelineWaveCanvas');
    const container = document.getElementById('timelineContainer');
    const section = document.getElementById('education');

    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    let animFrameId = null;
    let isVisible = false;
    let phase = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // 3 Layered sine waves flowing vertically
    const layers = [
      {
        freq: 0.014,
        speed: 0.026,
        amp: 7.5,
        alpha: 0.9,
        lineWidth: 2.2,
        phaseOffset: 0
      },
      {
        freq: 0.024,
        speed: -0.02,
        amp: 4.8,
        alpha: 0.52,
        lineWidth: 1.5,
        phaseOffset: Math.PI * 0.5
      },
      {
        freq: 0.038,
        speed: 0.038,
        amp: 3.0,
        alpha: 0.35,
        lineWidth: 1.0,
        phaseOffset: Math.PI * 1.1
      }
    ];

    let brightGradient = null;
    let dimGradient = null;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const parentRect = canvas.parentElement.getBoundingClientRect();

      width = parentRect.width || 44;
      height = rect.height || container.offsetHeight;

      if (!width || !height) return;

      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      // Vertical Linear Gradient (Cyan -> Purple -> Pink)
      brightGradient = ctx.createLinearGradient(0, 0, 0, height);
      brightGradient.addColorStop(0.0, '#00f0ff');
      brightGradient.addColorStop(0.5, '#b829ff');
      brightGradient.addColorStop(1.0, '#ff2e93');

      dimGradient = ctx.createLinearGradient(0, 0, 0, height);
      dimGradient.addColorStop(0.0, 'rgba(0, 240, 255, 0.22)');
      dimGradient.addColorStop(0.5, 'rgba(184, 41, 255, 0.22)');
      dimGradient.addColorStop(1.0, 'rgba(255, 46, 147, 0.22)');

      drawFrame();
    };

    const getTimelineProgress = () => {
      const rect = container.getBoundingClientRect();
      const winHeight = window.innerHeight;
      const totalDist = rect.height + winHeight * 0.3;
      const traveled = winHeight * 0.65 - rect.top;
      if (totalDist <= 0) return 0.5;
      return Math.min(Math.max(traveled / totalDist, 0), 1);
    };

    const getTaper = (y) => {
      const norm = height > 0 ? y / height : 0;
      if (norm < 0.05) {
        return Math.sin((norm / 0.05) * Math.PI * 0.5);
      } else if (norm > 0.95) {
        return Math.sin(((1 - norm) / 0.05) * Math.PI * 0.5);
      }
      return 1;
    };

    const drawFrame = () => {
      if (!width || !height) return;

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (!reducedMotion) {
        phase += 0.02;
      }

      const progress = getTimelineProgress();
      const beadY = progress * height;

      // Primary wave horizontal offset at bead position for smooth riding
      const primaryLayer = layers[0];
      const beadWaveX = reducedMotion
        ? 0
        : Math.sin(beadY * primaryLayer.freq - phase * primaryLayer.speed * 60 + primaryLayer.phaseOffset) *
          primaryLayer.amp *
          getTaper(beadY);
      const beadX = centerX + beadWaveX;

      // Color at bead position for glowing thumb
      const beadColor = progress < 0.5 ? '#00f0ff' : progress < 0.85 ? '#b829ff' : '#ff2e93';

      // 1. Central Baseline Track Line
      // Played segment (0 -> beadY): glowing bright line
      if (beadY > 0) {
        ctx.save();
        ctx.strokeStyle = brightGradient || '#00f0ff';
        ctx.lineWidth = 2.4;
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(centerX, 0);
        ctx.lineTo(centerX, beadY);
        ctx.stroke();
        ctx.restore();
      }

      // Unplayed segment (beadY -> height): dim, thin line
      if (beadY < height) {
        ctx.save();
        ctx.strokeStyle = dimGradient || 'rgba(0, 240, 255, 0.22)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(centerX, beadY);
        ctx.lineTo(centerX, height);
        ctx.stroke();
        ctx.restore();
      }

      // 2. Layered Vertical Sine Waves
      if (!reducedMotion) {
        const stepY = 2.5;

        layers.forEach((layer) => {
          const wavePhase = -phase * layer.speed * 60 + layer.phaseOffset;

          // 2a. Played Portion of Wave (0 -> beadY)
          if (beadY > 0) {
            ctx.save();
            ctx.globalAlpha = layer.alpha;
            ctx.strokeStyle = brightGradient || '#00f0ff';
            ctx.lineWidth = layer.lineWidth;
            ctx.shadowColor = '#b829ff';
            ctx.shadowBlur = 8;
            ctx.beginPath();

            for (let y = 0; y <= beadY; y += stepY) {
              const taper = getTaper(y);
              const x = centerX + Math.sin(y * layer.freq + wavePhase) * layer.amp * taper;
              if (y === 0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
            }
            ctx.lineTo(beadX, beadY);
            ctx.stroke();
            ctx.restore();
          }

          // 2b. Unplayed Portion of Wave (beadY -> height)
          if (beadY < height) {
            ctx.save();
            ctx.globalAlpha = layer.alpha * 0.32;
            ctx.strokeStyle = dimGradient || 'rgba(0, 240, 255, 0.22)';
            ctx.lineWidth = Math.max(layer.lineWidth * 0.7, 0.8);
            ctx.beginPath();
            ctx.moveTo(beadX, beadY);

            for (let y = beadY + stepY; y <= height; y += stepY) {
              const taper = getTaper(y);
              const x = centerX + Math.sin(y * layer.freq + wavePhase) * (layer.amp * 0.42) * taper;
              ctx.lineTo(x, y);
            }
            ctx.lineTo(centerX, height);
            ctx.stroke();
            ctx.restore();
          }
        });
      }

      // 3. Glowing Energy Bead / Progress Indicator
      // 3a. Outer Glow Ring
      ctx.save();
      ctx.strokeStyle = beadColor;
      ctx.lineWidth = 2.2;
      ctx.shadowColor = beadColor;
      ctx.shadowBlur = 16;
      ctx.beginPath();
      ctx.arc(beadX, beadY, 7.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // 3b. Outer Secondary Ring (Cyan)
      ctx.save();
      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 1;
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(beadX, beadY, 9.2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // 3c. Inner Bright Core
      ctx.save();
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(beadX, beadY, 3.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const animate = () => {
      if (!isVisible) return;
      drawFrame();
      animFrameId = requestAnimationFrame(animate);
    };

    const start = () => {
      if (!isVisible) {
        isVisible = true;
        if (!animFrameId) {
          animFrameId = requestAnimationFrame(animate);
        }
      }
    };

    const stop = () => {
      isVisible = false;
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
        animFrameId = null;
      }
    };

    // Reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addEventListener('change', () => {
      if (mediaQuery.matches) {
        stop();
        drawFrame();
      } else if (isVisible) {
        start();
      }
    });

    // Window events
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', () => {
      if (isVisible) {
        drawFrame();
      }
    }, { passive: true });

    // IntersectionObserver: Only animates when Education section is visible
    if (section) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              start();
            } else {
              stop();
            }
          });
        },
        { rootMargin: '100px 0px 100px 0px', threshold: 0 }
      );
      observer.observe(section);
    } else {
      start();
    }

    // Initial setup
    resize();
  };

  /* ===================================================================
     14. FLANKING VERTICAL WAVE STANDS (LEFT & RIGHT SITE RUNNERS)
     Continuous animated neon waveforms with page scroll-tracking beads
     =================================================================== */
  const initSideStandsWaveforms = () => {
    if (window.innerWidth <= 768) return;

    const leftCanvas = document.getElementById('leftStandWaveCanvas');
    const rightCanvas = document.getElementById('rightStandWaveCanvas');

    if (!leftCanvas && !rightCanvas) return;

    const setupStand = (canvas, isRight = false) => {
      if (!canvas) return null;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      let animId = null;
      let phase = isRight ? Math.PI : 0;
      let width = 0;
      let height = 0;
      let dpr = 1;

      // 3 Layered vertical sine waves
      const layers = [
        {
          freq: 0.012,
          speed: (isRight ? -0.022 : 0.024),
          amp: 5.5,
          alpha: 0.9,
          lineWidth: 2.0,
          phaseOffset: isRight ? Math.PI * 0.7 : 0
        },
        {
          freq: 0.022,
          speed: (isRight ? 0.018 : -0.019),
          amp: 3.8,
          alpha: 0.5,
          lineWidth: 1.4,
          phaseOffset: isRight ? Math.PI * 0.3 : Math.PI * 0.5
        },
        {
          freq: 0.035,
          speed: (isRight ? -0.032 : 0.035),
          amp: 2.2,
          alpha: 0.35,
          lineWidth: 1.0,
          phaseOffset: isRight ? Math.PI * 1.2 : Math.PI * 1.1
        }
      ];

      const colors = isRight
        ? ['#ff2e93', '#b829ff', '#00f0ff']
        : ['#00f0ff', '#b829ff', '#ff2e93'];

      const dimColors = isRight
        ? ['rgba(255, 46, 147, 0.22)', 'rgba(184, 41, 255, 0.22)', 'rgba(0, 240, 255, 0.22)']
        : ['rgba(0, 240, 255, 0.22)', 'rgba(184, 41, 255, 0.22)', 'rgba(255, 46, 147, 0.22)'];

      let brightGrad = null;
      let dimGrad = null;

      const resize = () => {
        if (window.innerWidth <= 768) return;
        const rect = canvas.getBoundingClientRect();
        width = rect.width || 28;
        height = window.innerHeight;

        dpr = Math.min(window.devicePixelRatio || 1, 2);

        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);

        brightGrad = ctx.createLinearGradient(0, 0, 0, height);
        dimGrad = ctx.createLinearGradient(0, 0, 0, height);

        brightGrad.addColorStop(0.0, colors[0]);
        brightGrad.addColorStop(0.5, colors[1]);
        brightGrad.addColorStop(1.0, colors[2]);

        dimGrad.addColorStop(0.0, dimColors[0]);
        dimGrad.addColorStop(0.5, dimColors[1]);
        dimGrad.addColorStop(1.0, dimColors[2]);

        drawFrame();
      };

      const getScrollProgress = () => {
        const scrollY = window.scrollY || document.documentElement.scrollTop;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        if (maxScroll <= 0) return 0.5;
        return Math.min(Math.max(scrollY / maxScroll, 0), 1);
      };

      const drawFrame = () => {
        if (!width || !height || window.innerWidth <= 768) return;

        ctx.clearRect(0, 0, width, height);

        const centerX = width / 2;
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (!reducedMotion) {
          phase += 0.02;
        }

        const progress = getScrollProgress();
        const beadY = progress * height;

        const primaryLayer = layers[0];
        const beadWaveX = reducedMotion
          ? 0
          : Math.sin(beadY * primaryLayer.freq - phase * primaryLayer.speed * 60 + primaryLayer.phaseOffset) *
            primaryLayer.amp;
        const beadX = centerX + beadWaveX;

        const beadColor = progress < 0.5 ? colors[0] : progress < 0.85 ? colors[1] : colors[2];

        // 1. Center Track Line (Above bead: glowing; Below bead: dim)
        if (beadY > 0) {
          ctx.save();
          ctx.strokeStyle = brightGrad || colors[0];
          ctx.lineWidth = 2.2;
          ctx.shadowColor = colors[0];
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.moveTo(centerX, 0);
          ctx.lineTo(centerX, beadY);
          ctx.stroke();
          ctx.restore();
        }

        if (beadY < height) {
          ctx.save();
          ctx.strokeStyle = dimGrad || dimColors[0];
          ctx.lineWidth = 1.1;
          ctx.beginPath();
          ctx.moveTo(centerX, beadY);
          ctx.lineTo(centerX, height);
          ctx.stroke();
          ctx.restore();
        }

        // 2. Layered Vertical Waves
        if (!reducedMotion) {
          const stepY = 3;

          layers.forEach((layer) => {
            const wavePhase = -phase * layer.speed * 60 + layer.phaseOffset;

            // Played portion of wave (0 -> beadY)
            if (beadY > 0) {
              ctx.save();
              ctx.globalAlpha = layer.alpha;
              ctx.strokeStyle = brightGrad || colors[0];
              ctx.lineWidth = layer.lineWidth;
              ctx.shadowColor = colors[1];
              ctx.shadowBlur = 8;
              ctx.beginPath();

              for (let y = 0; y <= beadY; y += stepY) {
                const x = centerX + Math.sin(y * layer.freq + wavePhase) * layer.amp;
                if (y === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
              }
              ctx.lineTo(beadX, beadY);
              ctx.stroke();
              ctx.restore();
            }

            // Unplayed portion of wave (beadY -> height)
            if (beadY < height) {
              ctx.save();
              ctx.globalAlpha = layer.alpha * 0.3;
              ctx.strokeStyle = dimGrad || dimColors[0];
              ctx.lineWidth = Math.max(layer.lineWidth * 0.7, 0.8);
              ctx.beginPath();
              ctx.moveTo(beadX, beadY);

              for (let y = beadY + stepY; y <= height; y += stepY) {
                const x = centerX + Math.sin(y * layer.freq + wavePhase) * (layer.amp * 0.45);
                ctx.lineTo(x, y);
              }
              ctx.lineTo(centerX, height);
              ctx.stroke();
              ctx.restore();
            }
          });
        }

        // 3. Glowing Scroll-Tracker Bead
        // 3a. Outer Glow Ring
        ctx.save();
        ctx.strokeStyle = beadColor;
        ctx.lineWidth = 2.0;
        ctx.shadowColor = beadColor;
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.arc(beadX, beadY, 6.5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        // 3b. Secondary Accent Ring
        ctx.save();
        ctx.strokeStyle = isRight ? '#00f0ff' : '#ff2e93';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(beadX, beadY, 8.2, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        // 3c. Inner Solid Core
        ctx.save();
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(beadX, beadY, 3.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      };

      const animate = () => {
        drawFrame();
        animId = requestAnimationFrame(animate);
      };

      window.addEventListener('resize', resize);
      window.addEventListener('scroll', () => {
        drawFrame();
      }, { passive: true });

      resize();

      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        animId = requestAnimationFrame(animate);
      }

      return { resize, drawFrame };
    };

    setupStand(leftCanvas, false);
    setupStand(rightCanvas, true);
  };

  /* ===================================================================
     15. INTERACTIVE AVATAR 3D PERSPECTIVE PARALLAX
     Subtle dynamic tilt responsive to cursor in the hero section
     =================================================================== */
  const initAvatarInteractive = () => {
    const frame = document.getElementById('avatarNeonFrame');
    const hero = document.getElementById('hero');

    if (!frame || !hero || window.matchMedia('(pointer: coarse)').matches) return;

    hero.addEventListener('mousemove', (e) => {
      const rect = frame.getBoundingClientRect();
      const frameCenterX = rect.left + rect.width / 2;
      const frameCenterY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - frameCenterX) / (window.innerWidth / 2);
      const deltaY = (e.clientY - frameCenterY) / (window.innerHeight / 2);

      const tiltX = -deltaY * 9;
      const tiltY = deltaX * 9;

      frame.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    });

    hero.addEventListener('mouseleave', () => {
      frame.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
    });
  };

  /* ===================================================================
     INITIALIZE ALL MODULES
     =================================================================== */
  initTypingAnimation();
  initParticleCanvas();
  initCursorGlow();
  initTiltCards();
  initScrollObserver();
  initNavbarAndScrollTop();
  initMobileNavigation();
  initCopyButtons();
  initContactForm();
  initResumeDownload();
  initFooterWaveforms();
  initTimelineWaveform();
  initSideStandsWaveforms();
  initAvatarInteractive();
});

