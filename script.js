/* ==========================================================================
   Sastikeyan Interior - Client JavaScript File
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. MOBILE NAVBAR HAMBURGER MENU
  // ==========================================
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      hamburgerBtn.classList.toggle('active');
    });

    // Close menu when clicking navigation links
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburgerBtn.classList.remove('active');
      });
    });
  }

  // ==========================================
  // 2. HEADER TRANSLUCENT SCROLL EFFECT
  // ==========================================
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });


  // ==========================================
  // 3. AUTOMATIC HERO BACKGROUND CAROUSEL
  // ==========================================
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.slider-dots .dot');
  let currentSlide = 0;
  let slideInterval;
  const slideDuration = 4500; // 4.5 seconds auto-cycle

  function showSlide(index) {
    if (slides.length === 0) return;

    // Deactivate current slide
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');

    // Set new current slide index
    currentSlide = (index + slides.length) % slides.length;

    // Activate new slide
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  function startSlideShow() {
    slideInterval = setInterval(() => {
      showSlide(currentSlide + 1);
    }, slideDuration);
  }

  function resetSlideShow() {
    clearInterval(slideInterval);
    startSlideShow();
  }

  // Wire up slide dot indicators
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
      resetSlideShow();
    });
  });

  // Start initial rotation
  if (slides.length > 0) {
    startSlideShow();
  }


  // ==========================================
  // 4. PORTFOLIO GALLERY FILTERS
  // ==========================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  let activeFilter = 'all';

  filterButtons.forEach(btn => {
    // Use both click and touchend for mobile reliability
    const applyFilter = (e) => {
      e.preventDefault();
      // Remove active class from all buttons
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');
      activeFilter = filterValue;

      galleryItems.forEach(item => {
        if (filterValue === 'all' || item.classList.contains(filterValue)) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    };

    btn.addEventListener('click', applyFilter);
  });


  // ==========================================
  // 5. INTERACTIVE LIGHTBOX SYSTEM
  // ==========================================
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTag = document.getElementById('lightboxTag');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const lightboxWhatsApp = document.getElementById('lightboxWhatsApp');

  // Array tracker for standard and currently filtered images
  let visibleItems = [];
  let currentLightboxIndex = 0;

  function updateVisibleItems() {
    visibleItems = Array.from(galleryItems).filter(item => {
      if (activeFilter === 'all') return true;
      return item.classList.contains(activeFilter);
    });
  }

  function openLightbox(item) {
    updateVisibleItems();
    currentLightboxIndex = visibleItems.indexOf(item);

    populateLightbox(item);
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock background scroll
  }

  function populateLightbox(item) {
    const src = item.getAttribute('data-src');
    const title = item.getAttribute('data-title');
    const desc = item.getAttribute('data-desc');
    const cat = item.querySelector('.item-cat').textContent;

    lightboxImg.src = src;
    lightboxImg.alt = title;
    lightboxTag.textContent = cat;
    lightboxTitle.textContent = title;
    lightboxDesc.textContent = desc;

    // Direct WhatsApp enquiry text pre-fill
    const encodedText = encodeURIComponent(`Hi Karthick, I am looking at your Sastikeyan Interior Portfolio and interested to know more about the design: "${title}" (${src}).`);
    lightboxWhatsApp.href = `https://wa.me/919629141957?text=${encodedText}`;
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Unlock background scroll
  }

  // Next / Prev slide in lightbox
  function navigateLightbox(direction) {
    if (visibleItems.length <= 1) return;

    currentLightboxIndex = (currentLightboxIndex + direction + visibleItems.length) % visibleItems.length;
    const nextItem = visibleItems[currentLightboxIndex];
    populateLightbox(nextItem);
  }

  // Click on gallery item to zoom (but not on the Book Now card area)
  galleryItems.forEach(item => {
    item.addEventListener('click', (e) => {
      // If click originated from the details card or the booking button, skip
      if (e.target.closest('.gallery-details-card')) return;
      openLightbox(item);
    });
  });

  if (lightbox) {
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
    lightboxNext.addEventListener('click', () => navigateLightbox(1));

    // Close on overlay clicking
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    // Keyboard controls support
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') navigateLightbox(1);
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
    });
  }


  // ==========================================
  // 6. CONTACT LEAD GENERATION FORM HANDLING
  // ==========================================
  const quoteForm = document.getElementById('quoteForm');
  const formStatus = document.getElementById('formStatus');

  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('fullName').value.trim();
      const phone = document.getElementById('phoneNum').value.trim();
      const email = document.getElementById('emailAddr').value.trim();
      const propType = document.getElementById('propertyType').options[document.getElementById('propertyType').selectedIndex].text;
      const location = document.getElementById('location').value.trim();
      const message = document.getElementById('userMsg').value.trim();

      // Simple Loader validation
      const btn = quoteForm.querySelector('button[type="submit"]');
      const origText = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = `Submitting...`;

      // Simulate API submit delay
      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = origText;

        // Show success status
        formStatus.className = 'form-status success';
        formStatus.textContent = ' Thank you! Your request details have been sent. GP Karthick will call you shortly.';

        // Reset form
        quoteForm.reset();

        // Optionally direct redirect to Whatsapp with filled form data after 1.5 seconds!
        setTimeout(() => {
          const waHeader = `Hello GP Karthick, this is brand enquiry from Sastikeyan Interior Web portal:`;
          const waBody = `\n- Name: ${name}\n- Phone: ${phone}\n- Place: ${location}\n- Service Type: ${propType}\n- Message: ${message}`;
          const finalWAText = encodeURIComponent(waHeader + waBody);
          window.open(`https://wa.me/919629141957?text=${finalWAText}`, '_blank');
        }, 1200);

      }, 1500);
    });
  }


  // ==========================================
  // 7. ACTIVE NAVIGATION ON SCROLL
  // ==========================================
  const sections = document.querySelectorAll('section');
  const navItems = document.querySelectorAll('.nav-menu .nav-link');

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px', // Triggers when section occupies middle panel of screen
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');

        navItems.forEach(item => {
          item.classList.remove('active');
          if (item.getAttribute('href') === `#${id}`) {
            item.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    if (section.getAttribute('id')) {
      observer.observe(section);
    }
  });

  // ==========================================
  // 8. SCROLL REVEAL ANIMATIONS (AOS)
  // ==========================================
  const aosElements = document.querySelectorAll('[data-aos]');

  const aosObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-animate');
        aosObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0, rootMargin: '0px 0px 0px 0px' });

  aosElements.forEach(el => aosObserver.observe(el));

  // Also immediately animate anything already in view
  aosElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      el.classList.add('aos-animate');
    }
  });

  // ==========================================
  // 9. SCROLL PROGRESS BAR
  // ==========================================
  const scrollProgress = document.getElementById('scrollProgress');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = progress + '%';
  });

  // ==========================================
  // 10. BACK TO TOP BUTTON
  // ==========================================
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ==========================================
  // 11. TESTIMONIAL CAROUSEL
  // ==========================================
  const testimonialTrack = document.getElementById('testimonialTrack');
  const testimonialSlides = testimonialTrack ? testimonialTrack.querySelectorAll('.testimonial-slide') : [];
  const testimonialDots = document.querySelectorAll('.testimonial-dot');
  const testimonialPrev = document.getElementById('testimonialPrev');
  const testimonialNext = document.getElementById('testimonialNext');
  let currentTestimonial = 0;
  let testimonialInterval;

  function goToTestimonial(index) {
    if (!testimonialTrack || testimonialSlides.length === 0) return;
    currentTestimonial = (index + testimonialSlides.length) % testimonialSlides.length;
    testimonialTrack.style.transform = `translateX(-${currentTestimonial * 100}%)`;

    testimonialDots.forEach(dot => dot.classList.remove('active'));
    if (testimonialDots[currentTestimonial]) {
      testimonialDots[currentTestimonial].classList.add('active');
    }
  }

  function startTestimonialAuto() {
    testimonialInterval = setInterval(() => {
      goToTestimonial(currentTestimonial + 1);
    }, 5000);
  }

  function resetTestimonialAuto() {
    clearInterval(testimonialInterval);
    startTestimonialAuto();
  }

  if (testimonialSlides.length > 0) {
    startTestimonialAuto();

    if (testimonialPrev) {
      testimonialPrev.addEventListener('click', () => {
        goToTestimonial(currentTestimonial - 1);
        resetTestimonialAuto();
      });
    }

    if (testimonialNext) {
      testimonialNext.addEventListener('click', () => {
        goToTestimonial(currentTestimonial + 1);
        resetTestimonialAuto();
      });
    }

    testimonialDots.forEach(dot => {
      dot.addEventListener('click', () => {
        const index = parseInt(dot.getAttribute('data-index'));
        goToTestimonial(index);
        resetTestimonialAuto();
      });
    });
  }

  // ==========================================
  // 12. HERO PARALLAX ON MOUSE MOVE
  // ==========================================
  const hero = document.querySelector('.hero');
  const heroSlider = hero ? hero.querySelector('.hero-slider') : null;

  if (hero && heroSlider && window.innerWidth > 768) {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) - 0.5;
      const y = ((e.clientY - rect.top) / rect.height) - 0.5;
      heroSlider.style.transform = `translate(${x * -15}px, ${y * -10}px) scale(1.05)`;
    });

    hero.addEventListener('mouseleave', () => {
      heroSlider.style.transform = 'translate(0, 0) scale(1.08)';
    });
  }

  // ==========================================
  // 13. 3D TILT EFFECT ON SERVICE CARDS
  // ==========================================
  const tiltCards = document.querySelectorAll('.tilt-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;
      card.style.setProperty('--tilt-x', rotateX + 'deg');
      card.style.setProperty('--tilt-y', rotateY + 'deg');
    });

    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
    });
  });

  // ==========================================
  // 14. IMAGE LAZY LOADING WITH BLUR EFFECT
  // ==========================================
  const lazyImages = document.querySelectorAll('img.lazy-load');

  const imgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.classList.add('loaded');
        imgObserver.unobserve(img);
      }
    });
  }, { rootMargin: '100px' });

  lazyImages.forEach(img => imgObserver.observe(img));

  // ==========================================
  // 15. PAGE LOADER HIDE
  // ==========================================
  const pageLoader = document.getElementById('pageLoader');
  if (pageLoader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        pageLoader.classList.add('hidden');
      }, 500);
    });

    // Fallback: hide after 3 seconds max
    setTimeout(() => {
      if (!pageLoader.classList.contains('hidden')) {
        pageLoader.classList.add('hidden');
      }
    }, 3000);
  }

  // ==========================================
  // 16. SMOOTH SCROLL FOR ANCHOR LINKS
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    });
  });

  // ==========================================
  // 17. MOBILE NAV OVERLAY
  // ==========================================
  const navOverlay = document.getElementById('navOverlay');

  if (hamburgerBtn && navOverlay) {
    hamburgerBtn.addEventListener('click', () => {
      navOverlay.classList.toggle('active');
    });

    navOverlay.addEventListener('click', () => {
      navMenu.classList.remove('active');
      hamburgerBtn.classList.remove('active');
      navOverlay.classList.remove('active');
    });
  }

});
