function applySeasonalTheme() {
  const now = new Date();
  const month = now.getMonth(); // 0=Jan ... 11=Dec

  // All December
  if (month === 11) {
    document.body.setAttribute("data-theme", "corpo-xmas");
  } else {
    document.body.removeAttribute("data-theme");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // 1) Theme first
  applySeasonalTheme();

// --- 1. SCROLL ANIMATIONS ---
// Uses Intersection Observer to fade in sections as the user scrolls
document.addEventListener('DOMContentLoaded', () => {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
  });

  // --- 2. SOCIAL SHARE LOGIC ---
  // Pre-fills the text for the user to share
  const shareText =
    "I have chosen the side of Continuity. My consciousness is ready to outlive the flesh. No pain. No fear. Ever again. @newlife2084.com #NewLife2084 #maroonseries #PerpetuityGuaranteed";
  const encodedText = encodeURIComponent(shareText);

  // Twitter/X Share Link
  const twitterBtn = document.getElementById('share-twitter');
  if (twitterBtn) {
    twitterBtn.href = `https://twitter.com/intent/tweet?text=${encodedText}`;
  }

  // Bluesky Share Link
  const bskyBtn = document.getElementById('share-bsky');
  if (bskyBtn) {
    bskyBtn.href = `https://bsky.app/intent/compose?text=${encodedText}`;
  }
});

