// Hamburger Menu Toggle
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".ul");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navLinks.classList.toggle("active");
});
// typing text
const lines = [
  "Het!, I'm Makuochi \nA Fullstack Developer.",
  "I build fast, responsive web experiences.",
  "Feel free to explore about tech with me",
];

const typeSpeed = 100; // milliseconds per character
const startDelay = 500; // delay before typing starts
const betweenDelay = 550; // pause between line 1 and line 2
const loop = false; // set to true to loop forever
const clearOnLoop = true; // when looping, clear both lines before restarting

const el1 = document.getElementById("l1");
const el2 = document.getElementById("l2");

async function typeText(el, text) {
  el.classList.add("caret");
  el.textContent = "";
  for (let i = 0; i < text.length; i++) {
    el.textContent += text[i];
    await new Promise((r) => setTimeout(r, typeSpeed));
  }
  el.classList.remove("caret");
}

async function run() {
  await new Promise((r) => setTimeout(r, startDelay));
  await typeText(el1, lines[0] || "");
  await new Promise((r) => setTimeout(r, betweenDelay));
  await typeText(el2, lines[1] || "");

  if (loop) {
    await new Promise((r) => setTimeout(r, 1200));
    if (clearOnLoop) {
      el1.textContent = "";
      el2.textContent = "";
    }
    run();
  }
}
run();

//fade animation
const sections = document.querySelectorAll(".container > div:not(.hero)");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // fade in children
        const children = entry.target.querySelectorAll(":scope > *");
        children.forEach((child, i) => {
          child.style.transitionDelay = `${i * 0.5}s`; // stagger effect
          child.classList.add("child-show");
        });

        observer.unobserve(entry.target); // reveal once
      }
    });
  },
  { threshold: 0.3 }
);

sections.forEach((sec) => observer.observe(sec));

//skills
window.addEventListener("load", () => {
  document.querySelectorAll(".skill-fill").forEach((bar) => {
    const width = bar.getAttribute("data-width");
    bar.style.width = width;
  });
});

// Review System
class ReviewSystem {
  constructor() {
    this.reviews = JSON.parse(localStorage.getItem("portfolioReviews")) || [];
    this.init();
  }

  init() {
    this.setupStarRating();
    this.setupForm();
    this.displayReviews();
    this.showEmptyState();
  }

  setupStarRating() {
    const stars = document.querySelectorAll(".star");
    const ratingValue = document.getElementById("ratingValue");

    stars.forEach((star, index) => {
      star.addEventListener("click", () => {
        const rating = index + 1;
        ratingValue.value = rating;

        // Update visual state
        stars.forEach((s, i) => {
          if (i < rating) {
            s.classList.add("active");
          } else {
            s.classList.remove("active");
          }
        });
      });

      star.addEventListener("mouseover", () => {
        const rating = index + 1;
        stars.forEach((s, i) => {
          if (i < rating) {
            s.style.filter = "grayscale(0%)";
            s.style.transform = "scale(1.2)";
          } else {
            s.style.filter = "grayscale(100%)";
            s.style.transform = "scale(1)";
          }
        });
      });

      star.addEventListener("mouseleave", () => {
        stars.forEach((s, i) => {
          const currentRating = parseInt(ratingValue.value);
          if (i < currentRating) {
            s.style.filter = "grayscale(0%)";
            s.style.transform = "scale(1.2)";
          } else {
            s.style.filter = "grayscale(100%)";
            s.style.transform = "scale(1)";
          }
        });
      });
    });
  }

  setupForm() {
    const form = document.getElementById("reviewForm");
    const submitBtn = document.getElementById("submitBtn");
    const loadingSpinner = document.getElementById("loadingSpinner");
    const successMessage = document.getElementById("successMessage");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const reviewData = {
        name: formData.get("reviewerName").trim(),
        rating: parseInt(formData.get("rating")),
        message: formData.get("message").trim(),
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        timestamp: Date.now(),
      };

      // Validation
      if (!this.validateReview(reviewData)) {
        return;
      }

      // Show loading state
      submitBtn.style.display = "none";
      loadingSpinner.style.display = "inline-block";

      // Simulate API delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Add review
      this.addReview(reviewData);

      // Hide loading and show success
      loadingSpinner.style.display = "none";
      submitBtn.style.display = "inline-block";
      successMessage.style.display = "block";

      // Reset form
      form.reset();
      document.getElementById("ratingValue").value = "0";
      document.querySelectorAll(".star").forEach((star) => {
        star.classList.remove("active");
        star.style.filter = "grayscale(100%)";
        star.style.transform = "scale(1)";
      });

      // Hide success message after 5 seconds
      setTimeout(() => {
        successMessage.style.display = "none";
      }, 5000);

      // Refresh reviews display
      this.displayReviews();
      this.showEmptyState();
    });
  }

  validateReview(review) {
    if (!review.name) {
      this.showError("Please enter your name");
      return false;
    }

    if (review.rating === 0) {
      this.showError("Please select a rating");
      return false;
    }

    if (!review.message) {
      this.showError("Please write a review message");
      return false;
    }

    if (review.message.length < 10) {
      this.showError("Review message must be at least 10 characters long");
      return false;
    }

    return true;
  }

  showError(message) {
    // Create or update error message
    let errorDiv = document.getElementById("errorMessage");
    if (!errorDiv) {
      errorDiv = document.createElement("div");
      errorDiv.id = "errorMessage";
      errorDiv.style.cssText = `
        background: linear-gradient(45deg, #ff0000, #ff6b6b);
        color: white;
        padding: 15px;
        border-radius: 10px;
        text-align: center;
        margin-top: 1rem;
        animation: errorShake 0.5s ease-out;
      `;
      document.querySelector(".review-form-section").appendChild(errorDiv);
    }

    errorDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
    errorDiv.style.display = "block";

    // Hide error after 5 seconds
    setTimeout(() => {
      errorDiv.style.display = "none";
    }, 5000);
  }

  addReview(review) {
    this.reviews.unshift(review); // Add to beginning of array
    localStorage.setItem("portfolioReviews", JSON.stringify(this.reviews));
  }

  displayReviews() {
    const container = document.getElementById("reviewsContainer");
    container.innerHTML = "";

    this.reviews.forEach((review, index) => {
      const reviewCard = this.createReviewCard(review, index);
      container.appendChild(reviewCard);
    });
  }

  createReviewCard(review, index) {
    const card = document.createElement("div");
    card.className = "review-card";
    card.style.animationDelay = `${index * 0.1}s`;

    const stars = "⭐".repeat(review.rating);

    card.innerHTML = `
      <div class="review-header">
        <div>
          <div class="reviewer-name">${this.escapeHtml(review.name)}</div>
          <div class="review-rating">${stars}</div>
        </div>
        <div class="review-date">${review.date}</div>
      </div>
      <div class="review-text">"${this.escapeHtml(review.message)}"</div>
    `;

    return card;
  }

  escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  showEmptyState() {
    const emptyDiv = document.getElementById("emptyReviews");
    const container = document.getElementById("reviewsContainer");

    if (this.reviews.length === 0) {
      emptyDiv.style.display = "block";
      container.style.display = "none";
    } else {
      emptyDiv.style.display = "none";
      container.style.display = "flex";
    }
  }
}

// Initialize Review System when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new ReviewSystem();
});
// localStorage.clear();
new QRCode(document.getElementById("qrcode"), {
  text: "I just want to take a moment to sincerely\n thank you for trusting us and \ngiving us the opportunity to serve you.\n Your support and partnership mean a lot,\n and it motivates us to keep delivering our very best.\n We truly appreciate you and look \nforward to many more successes together.\n Thank you!” ",
  width: 100,
  height: 100,
  colorDark: "#000000",
  colorLight: "#ffffff",
  correctLevel: QRCode.CorrectLevel.H,
});



