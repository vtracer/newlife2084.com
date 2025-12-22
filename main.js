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
    "I have chosen the side of Continuity. My consciousness is ready for the Silicon Prairie. No pain. No fear. Ever again. @NewLifeTech #NewLife2084 #PerpetuityGuaranteed";
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