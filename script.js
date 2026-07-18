// Tulip Residences — site interactions
// Covers: mobile nav toggle, header scroll shadow, scroll-reveal animations,
// photo lightbox, and a client-side contact form handler.

document.addEventListener('DOMContentLoaded', function () {

    /* ---------------------------------------------------------
       Mobile nav toggle
    --------------------------------------------------------- */
    var navToggle = document.getElementById('navToggle');
    var mainNav = document.getElementById('mainNav');

    if (navToggle && mainNav) {
        navToggle.addEventListener('click', function () {
            var isOpen = mainNav.classList.toggle('open');
            navToggle.classList.toggle('open', isOpen);
            navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        // Close the menu after a link is tapped (mobile)
        mainNav.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                mainNav.classList.remove('open');
                navToggle.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    /* ---------------------------------------------------------
       Header shadow on scroll
    --------------------------------------------------------- */
    var header = document.getElementById('siteHeader');
    if (header) {
        var onScroll = function () {
            header.classList.toggle('scrolled', window.scrollY > 12);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /* ---------------------------------------------------------
       Scroll-reveal animation
    --------------------------------------------------------- */
    var revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && revealEls.length) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        revealEls.forEach(function (el) {
            observer.observe(el);
        });
    } else {
        revealEls.forEach(function (el) {
            el.classList.add('in-view');
        });
    }

    /* ---------------------------------------------------------
       Photo lightbox (photos.html)
    --------------------------------------------------------- */
    var galleryGrid = document.getElementById('galleryGrid');
    var lightbox = document.getElementById('lightbox');

    if (galleryGrid && lightbox) {
        var images = Array.prototype.map.call(
            galleryGrid.querySelectorAll('img'),
            function (img) { return { src: img.getAttribute('src'), alt: img.getAttribute('alt') }; }
        );
        var lightboxImg = document.getElementById('lightboxImg');
        var closeBtn = document.getElementById('lightboxClose');
        var prevBtn = document.getElementById('lightboxPrev');
        var nextBtn = document.getElementById('lightboxNext');
        var currentIndex = 0;

        function showImage(index) {
            currentIndex = (index + images.length) % images.length;
            lightboxImg.src = images[currentIndex].src;
            lightboxImg.alt = images[currentIndex].alt || '';
        }

        function openLightbox(index) {
            showImage(index);
            lightbox.classList.add('open');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            lightbox.classList.remove('open');
            document.body.style.overflow = '';
        }

        galleryGrid.querySelectorAll('.gallery-item').forEach(function (item, index) {
            item.addEventListener('click', function () { openLightbox(index); });
        });

        closeBtn.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', function () { showImage(currentIndex - 1); });
        nextBtn.addEventListener('click', function () { showImage(currentIndex + 1); });

        lightbox.addEventListener('click', function (e) {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', function (e) {
            if (!lightbox.classList.contains('open')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
            if (e.key === 'ArrowRight') showImage(currentIndex + 1);
        });
    }

    /* ---------------------------------------------------------
       Contact form (contact.html)
       No backend is wired up yet, so this validates the fields
       and hands off to the visitor's email client via mailto:.
       Replace this handler with a fetch() call to your own
       endpoint or a form service (e.g. Formspree) when ready.
    --------------------------------------------------------- */
    var contactForm = document.getElementById('contactForm');
    var formStatus = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            var name = contactForm.name.value.trim();
            var email = contactForm.email.value.trim();
            var phone = contactForm.phone.value.trim();
            var message = contactForm.message.value.trim();

            if (!name || !email || !message) {
                formStatus.textContent = 'Please fill in your name, email and message.';
                formStatus.style.color = '#c0392b';
                return;
            }

            var subject = encodeURIComponent('Enquiry from ' + name + ' — Tulip Residences website');
            var bodyLines = [
                'Name: ' + name,
                'Email: ' + email,
                phone ? 'Phone: ' + phone : null,
                '',
                message
            ].filter(Boolean);
            var body = encodeURIComponent(bodyLines.join('\n'));

            window.location.href = 'mailto:info.tuliphostel@gmail.com?subject=' + subject + '&body=' + body;

            formStatus.style.color = '';
            formStatus.textContent = 'Opening your email app to send this message…';
        });
    }

});
