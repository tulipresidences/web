// Tulip Residences — site interactions
// Covers: mobile nav toggle, header scroll shadow, scroll-reveal animations,
// photo lightbox, a client-side contact form handler, and Google Reviews.

/* =============================================================
   GOOGLE REVIEWS — setup (only needed once)

   1. Find your Place ID:
      https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder
      (search "Tulip Residences, Sector 126, Noida" — copy the Place ID shown)

   2. In Google Cloud Console (console.cloud.google.com):
        - Create/select a project and attach a billing account
          (required by Google even though this stays within the free credit).
        - Enable THREE APIs: "Maps JavaScript API", "Places API", and
          "Places API (New)" (search each by name under APIs & Services → Library).
        - Create an API key (APIs & Services → Credentials → Create credentials
          → API key).
        - Restrict the key: under "API restrictions" limit it to the three
          APIs above, and under "Application restrictions" add an HTTP
          referrer restriction for your domain (e.g. tulipresidences.com/*)
          so nobody else can use your key.

   3. Paste your Place ID into GOOGLE_PLACE_ID below.

   4. Open index.html, find the line containing
      "YOUR_GOOGLE_MAPS_API_KEY", and replace it with your real API key.

   Notes:
     - Google only returns up to 5 "most relevant" reviews this way — there's
       no way to show your full review list through this API.
     - Google's terms require showing the "Reviews from Google" attribution
       (already included in index.html) and don't allow permanently storing
       the review text — this fetches fresh on every page load, which is fine.
     - This costs nothing for a small site: Google gives a recurring free
       monthly credit that comfortably covers typical traffic.
============================================================= */
var GOOGLE_PLACE_ID = 'ChIJ7xJRvRDnDDkRHvi5fnLTm34';

async function initGoogleReviews() {
    var grid = document.getElementById('reviewsGrid');
    if (!grid) return; // reviews section isn't on this page

    if (GOOGLE_PLACE_ID === 'YOUR_PLACE_ID_HERE') {
        return; // not configured yet — leave the placeholder message showing
    }
    if (typeof google === 'undefined' || !google.maps) {
        return; // Maps script failed to load (bad/missing API key)
    }

    try {
        var placesLib = await google.maps.importLibrary('places');
        var Place = placesLib.Place;
        var place = new Place({ id: GOOGLE_PLACE_ID });
        await place.fetchFields({ fields: ['reviews', 'rating', 'userRatingCount'] });

        if (!place.reviews || !place.reviews.length) return;

        grid.innerHTML = '';
        place.reviews.slice(0, 6).forEach(function (review) {
            var filled = Math.round(review.rating || 0);
            var stars = '★★★★★'.slice(0, filled) + '☆☆☆☆☆'.slice(0, 5 - filled);

            var card = document.createElement('div');
            card.className = 'review-card';

            var starsEl = document.createElement('div');
            starsEl.className = 'review-stars';
            starsEl.textContent = stars;

            var textEl = document.createElement('p');
            textEl.className = 'review-text';
            textEl.textContent = review.text || '';

            var authorName = (review.authorAttribution && review.authorAttribution.displayName) || 'Google user';
            var authorEl = document.createElement('div');
            authorEl.className = 'review-author';
            authorEl.textContent = authorName + ' · ' + (review.relativePublishTimeDescription || '');

            card.appendChild(starsEl);
            card.appendChild(textEl);
            card.appendChild(authorEl);
            grid.appendChild(card);
        });
    } catch (err) {
        // Leave the placeholder message in place if the request fails
        // (e.g. misconfigured key, API not enabled yet).
        console.error('Google Reviews failed to load:', err);
    }
}
// Exposed globally so the Google Maps script tag's `callback=initGoogleReviews` can call it.
window.initGoogleReviews = initGoogleReviews;

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
       WhatsApp button — only appears after scrolling a bit, so it
       doesn't sit on top of the hero text on first load. Pages
       without a hero (contact, location, photos) show it right away.
    --------------------------------------------------------- */
    var whatsappFab = document.querySelector('.whatsapp-fab');
    if (whatsappFab) {
        if (document.querySelector('.hero')) {
            var onScrollWhatsapp = function () {
                whatsappFab.classList.toggle('visible', window.scrollY > 400);
            };
            window.addEventListener('scroll', onScrollWhatsapp, { passive: true });
            onScrollWhatsapp();
        } else {
            whatsappFab.classList.add('visible');
        }
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
       Submits to Formspree (https://formspree.io) via fetch, so the person
       stays on the page and sees a status message instead of leaving to
       their email app. The form's action/method attributes in contact.html
       point at the same endpoint, as a fallback in case JavaScript fails
       to load (the browser will do a normal form POST + redirect instead).
    --------------------------------------------------------- */
    var contactForm = document.getElementById('contactForm');
    var formStatus = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            var name = contactForm.name.value.trim();
            var email = contactForm.email.value.trim();
            var message = contactForm.message.value.trim();

            if (!name || !email || !message) {
                formStatus.style.color = '#c0392b';
                formStatus.textContent = 'Please fill in your name, email and message.';
                return;
            }

            var submitBtn = contactForm.querySelector('.btn-submit');
            var originalBtnText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending…';
            formStatus.style.color = '';
            formStatus.textContent = '';

            fetch(contactForm.action, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: { 'Accept': 'application/json' }
            })
                .then(function (response) {
                    if (response.ok) {
                        formStatus.style.color = 'var(--leaf)';
                        formStatus.textContent = "Thanks — we've got your message and will be in touch soon.";
                        contactForm.reset();
                    } else {
                        return response.json().then(function (data) {
                            var errorMsg = (data && data.errors && data.errors.map(function (err) { return err.message; }).join(', '))
                                || 'Something went wrong sending that. Please try again, or email us directly.';
                            formStatus.style.color = '#c0392b';
                            formStatus.textContent = errorMsg;
                        });
                    }
                })
                .catch(function () {
                    formStatus.style.color = '#c0392b';
                    formStatus.textContent = 'Could not send — check your connection and try again, or email us directly.';
                })
                .finally(function () {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalBtnText;
                });
        });
    }


});
