
gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

// Screen dimensions
const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

// Gallery tiles animation
gsap.fromTo(".gallery-tile",
  {
    y: 100,
    opacity: 0,
    scale: 0.85,
    rotationX: -20,
    rotationY: 0
  },
  {
    y: 0,
    opacity: 1,
    scale: 1,
    rotationX: 0,
    rotationY: 180,
    duration: 2,
    stagger: { each: 0.5, from: "edges", grid: "auto" },
    ease: "expo.out",
    repeat: -1,
    yoyo: true,
    onRepeat: () => {
      gsap.to(".gallery-tile", {
        rotationY: gsap.utils.random(160, 200),
        rotationX: gsap.utils.random(-10, 10),
        scale: gsap.utils.random(0.98, 1.02),
        duration: 1,
        ease: "power1.inOut"
      });
    }
  }
);

// Tintin Fairy motion path
const fairyPath = [
  {x: -50, y: screenHeight * 0.2},
  {x: screenWidth * 0.25, y: screenHeight * 0.15},
  {x: screenWidth * 0.5, y: screenHeight * 0.25},
  {x: screenWidth * 0.75, y: screenHeight * 0.18},
  {x: screenWidth + 100, y: screenHeight * 0.2}
];

gsap.to("#tintin-fairy", {
  duration: 12,
  motionPath: { path: fairyPath, curviness: 1.2 },
  scale: screenWidth < 280 ? 0.15 : 0.2,
  rotation: 10,
  ease: "power1.inOut",
  repeat: -1,
  yoyo: true,
  onUpdate: () => {
    if(screenWidth < 280) return; // skip fumes on tiny screens
    const fairy = document.querySelector("#tintin-fairy");
    const fumes = document.createElement("div");
    fumes.className = "green-fume";
    fumes.style.position = "absolute";
    fumes.style.width = "10px";
    fumes.style.height = "10px";
    fumes.style.borderRadius = "50%";
    fumes.style.background = "radial-gradient(circle, rgba(0,255,0,0.8), rgba(0,255,0,0))";
    fumes.style.boxShadow = "0 0 10px 2px rgba(0,255,0,0.5), 0 0 20px 4px rgba(0,255,0,0.3)";
    fumes.style.left = `${fairy.getBoundingClientRect().left}px`;
    fumes.style.top = `${fairy.getBoundingClientRect().top}px`;
    document.body.appendChild(fumes);

    gsap.to(fumes, { opacity: 0, scale: 2, duration: 1, onComplete: () => fumes.remove() });
  }
});


function moveFairy() {
  const fairy = document.querySelector("#fairy1");
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  // pick a random target position
  const x = Math.random() * screenWidth;
  const y = Math.random() * screenHeight;

  gsap.to(fairy, {
    x: x,
    y: y,
    duration: Math.random() * 6 + 4, // 4–10 sec per move
    ease: "power1.inOut",
    onComplete: moveFairy, // when done, go somewhere else
    onUpdate: () => {
      if (screenWidth < 280) return; // skip sparkles on tiny screens

      // Occasionally spawn subtle sparkles
      if (Math.random() > 0.3) return;

      const fumes = document.createElement("div");
      fumes.className = "green-fume";

      // Random sparkle properties
      const size = Math.random() * 6 + 4; // 4–10px
      const driftX = (Math.random() - 0.5) * 20;
      const driftY = Math.random() * 15;
      const opacity = Math.random() * 0.4 + 0.2;

      fumes.style.position = "absolute";
      fumes.style.width = `${size}px`;
      fumes.style.height = `${size}px`;
      fumes.style.borderRadius = "50%";
      fumes.style.pointerEvents = "none";

      const greenShade = `rgba(0, ${180 + Math.floor(Math.random() * 50)}, 0, ${opacity})`;
      const silverShade = `rgba(${180 + Math.floor(Math.random() * 60)}, ${180 + Math.floor(Math.random() * 60)}, ${180 + Math.floor(Math.random() * 60)}, ${opacity})`;

      fumes.style.background = `radial-gradient(circle, ${greenShade} 30%, ${silverShade} 100%)`;
      fumes.style.boxShadow = `
        0 0 ${Math.random() * 5 + 3}px 1px ${greenShade},
        0 0 ${Math.random() * 8 + 5}px 2px ${silverShade}
      `;

      // Position at fairy’s current position
      const rect = fairy.getBoundingClientRect();
      fumes.style.left = `${rect.left + rect.width / 2}px`;
      fumes.style.top = `${rect.top + rect.height / 2}px`;

      document.body.appendChild(fumes);

      gsap.to(fumes, {
        opacity: 0,
        x: driftX,
        y: -driftY,
        scale: Math.random() * 0.8 + 0.8,
        duration: Math.random() * 1.8 + 1.2,
        ease: "sine.out",
        onComplete: () => fumes.remove()
      });
    }
  });
}

// Start the fairy movement
moveFairy();


// Invite details fade in
gsap.to(".invite-details p", {
  opacity: 1,
  duration: 1.2,
  stagger: 0.25,
  ease: "power2.inOut"
});

// Glitter for bottom half top
function createGlitter() {
  const glitterContainer = document.getElementById("bottom-glitter");
  for (let i = 0; i < 25; i++) {
    const glitter = document.createElement("div");
    glitter.className = "glitter";
    glitter.style.left = `${Math.random() * window.innerWidth}px`;
    glitter.style.top = `${Math.random() * 50}px`;
    glitterContainer.appendChild(glitter);

    gsap.to(glitter, {
      y: "+=50",
      x: "+=" + gsap.utils.random(-20, 20),
      opacity: 0,
      scale: gsap.utils.random(0.5, 1.5),
      duration: gsap.utils.random(2, 4),
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: Math.random() * 2
    });
  }
}
createGlitter();

// Countdown timer
const eventDate = new Date("January 31, 2026 18:00:00").getTime();
function updateCountdown() {
  const now = new Date().getTime();
  const distance = eventDate - now;
  if (distance < 0) return;
  const days = Math.floor(distance / (1000*60*60*24));
  const hours = Math.floor((distance % (1000*60*60*24)) / (1000*60*60));
  const minutes = Math.floor((distance % (1000*60*60)) / (1000*60));
  const seconds = Math.floor((distance % (1000*60)) / 1000);
  document.getElementById("days").textContent = String(days).padStart(2,"0");
  document.getElementById("hours").textContent = String(hours).padStart(2,"0");
  document.getElementById("minutes").textContent = String(minutes).padStart(2,"0");
  document.getElementById("seconds").textContent = String(seconds).padStart(2,"0");
}
setInterval(updateCountdown, 1000);
updateCountdown();

// --- Collapsible invite details ---
const dpContainer = document.querySelector(".dp-container");
const inviteDetails = document.querySelector(".invite-details");
dpContainer.addEventListener("click", () => {
  inviteDetails.classList.toggle("collapsed");
  dpContainer.classList.toggle("expanded");
  // scroll into view when expanded
  if(!inviteDetails.classList.contains("collapsed")) {
    inviteDetails.scrollIntoView({ behavior: "smooth", block: "start" });
  }
});

// DP click toggle invite
const dp = document.querySelector(".circle-dp");
const invite = document.querySelector(".invite-details");

dp.addEventListener("click", () => {
  invite.classList.toggle("expanded");
});
dp.addEventListener("click", () => {
  invite.classList.toggle("expanded");
  dp.classList.toggle("expanded");
});

window.addEventListener('DOMContentLoaded', () => {
  const bgAudio = document.getElementById("bg-audio");
  const toggleBtn = document.getElementById("musicToggle");

  if (!bgAudio || !toggleBtn) {
    console.error("Audio or toggle button element not found!");
    return; // Stop if elements are missing
  }

  // Try autoplay on load
  bgAudio.play().catch(() => {
    console.log("Autoplay blocked. Tap to start.");

    // Fallback for mobile devices: play on first click anywhere
    const startAudio = () => {
      bgAudio.play();
      document.removeEventListener('click', startAudio);
    };
    document.addEventListener('click', startAudio);
  });

  // Toggle play/pause
  toggleBtn.addEventListener("click", () => {
    if (bgAudio.paused) {
      bgAudio.play();
      toggleBtn.textContent = "⏸️";
    } else {
      bgAudio.pause();
      toggleBtn.textContent = "▶️";
    }
  });
});



// No repeat needed, so no 'ended' listener


const collapsibles = document.querySelectorAll(".collapsible");

collapsibles.forEach(button => {
  button.addEventListener("click", function() {
    this.classList.toggle("active");
    const content = this.nextElementSibling;

    // Open/close animation
    if (content.style.maxHeight){
      // Close
      gsap.to(content, { duration: 0.5, opacity: 0, scale: 0.95, onComplete: () => {
        content.style.maxHeight = null;
        content.classList.remove("open");
      }});
    } else {
      // Open
      content.style.maxHeight = content.scrollHeight + "px";
      content.classList.add("open");
      gsap.fromTo(content, 
        { opacity: 0, scale: 0.8 }, 
        { duration: 0.7, opacity: 1, scale: 1, ease: "expo.out" }
      );

      // Glitter burst animation
      const glitterCount = 15;
      for(let i=0;i<glitterCount;i++){
        const glitter = document.createElement("div");
        glitter.className = "glitter-collapsible";
        glitter.style.left = Math.random() * content.offsetWidth + "px";
        glitter.style.top = Math.random() * content.offsetHeight + "px";
        content.appendChild(glitter);

        gsap.to(glitter, {
          y: "-=20",
          x: "+=" + gsap.utils.random(-10,10),
          opacity: 0,
          scale: gsap.utils.random(0.5,1.2),
          duration: gsap.utils.random(1,2),
          ease: "sine.out",
          onComplete: () => glitter.remove()
        });
      }
    }
  });
});

function animateSnakeEvents(containerId) {
  const container = document.getElementById(containerId);
  const events = container.querySelectorAll(".events-list li");

  // Create snake element
  const snake = document.createElement("div");
  snake.className = "snake";
  container.appendChild(snake);

  events.forEach((event, i) => {
    gsap.to(event, {
      duration: 0.6,
      opacity: 1,
      delay: i * 0.6, // stagger for each event
      onStart: () => {
        // Move snake next to current event
        const top = event.offsetTop + event.offsetHeight / 2 - 10;
        gsap.to(snake, { top: top, duration: 0.6, ease: "power1.inOut" });
      }
    });
  });
}

// Call this when collapsible is opened
document.querySelector(".collapsible").addEventListener("click", () => {
  const content = document.getElementById("venue-events");
  if (content.classList.contains("open")) {
    animateSnakeEvents("venue-events");
  }
}); 
// Dress Code Collapsible
const collapsibleDress = document.querySelector(".collapsible2");
collapsibleDress.addEventListener("click", () => {
  collapsibleDress.classList.toggle("active");
  const content = document.getElementById("dress-code");

  if(content.style.maxHeight){
    content.style.maxHeight = null;
    content.style.paddingTop = "0px";
    content.style.paddingBottom = "0px";
  } else {
    content.style.maxHeight = content.scrollHeight + "px";
    content.style.paddingTop = "10px";
    content.style.paddingBottom = "10px";

    const items = content.querySelectorAll("li");
    items.forEach((item, index) => {

      // Create magical sparkle particles
      for(let i=0;i<5;i++){
        const particle = document.createElement("div");
        particle.className = "particle";
        particle.style.left = `${Math.random() * 200}px`;
        particle.style.top = `${Math.random() * 30}px`;
        item.appendChild(particle);

        gsap.to(particle, {
          y: -50,
          x: "+=" + gsap.utils.random(-20,20),
          opacity: 0,
          duration: 1 + Math.random(),
          delay: index * 0.3 + Math.random(),
          onComplete: ()=> particle.remove()
        });
      }

      // Fade-in text
      gsap.to(item, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: index * 0.3,
        ease: "power2.out"
      });
    });
  }
});
// Collapsible3 for Gifts Section
const collapsible3 = document.querySelector(".collapsible3");
collapsible3.addEventListener("click", function() {
  this.classList.toggle("active");
  const content3 = this.nextElementSibling;
  if(content3.style.maxHeight){
    content3.style.maxHeight = null;
    content3.classList.remove("show");
  } else {
    content3.style.maxHeight = content3.scrollHeight + "px";
    content3.classList.add("show");

    // Magical sparkle animation
    gsap.fromTo(content3, 
      {y: -10, opacity: 0}, 
      {y:0, opacity:1, duration: 0.8, ease: "power2.out"}
    );
  }
});
window.onload = function() {
  const container = document.querySelector('.container');
  const topDiv = document.querySelector('.top-half');

  // Check if screen width is mobile
  if (window.innerWidth <= 768) {
    // Move topDiv to the end of container
    container.appendChild(topDiv);
  }
};
// Collapsible behavior for content4
const coll4 = document.querySelectorAll(".collapsible4");
coll4.forEach(btn => {
  btn.addEventListener("click", function() {
    this.classList.toggle("active");
    const content = this.nextElementSibling;
    if (content.style.maxHeight) {
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });
});

// Submit directly to Google Forms without popup
function rsvpSubmit() {
  alert("¡Gracias! Tu RSVP ha sido enviado exitosamente.");
  return true; // allows form to submit directly
}
