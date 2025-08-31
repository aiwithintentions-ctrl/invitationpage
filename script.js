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
  scale: screenWidth < 480 ? 0.15 : 0.2,
  rotation: 10,
  ease: "power1.inOut",
  repeat: -1,
  yoyo: true,
  onUpdate: () => {
    if(screenWidth < 480) return; // skip fumes on tiny screens
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

const bgAudio = document.getElementById('bg-audio');
let playCount = 0;

// Wait until the page is loaded
window.addEventListener('load', () => {
  // Try to play the audio
  bgAudio.play().catch(() => {
    console.log("Autoplay blocked. Tap anywhere to start.");
    
    // Fallback for mobile devices
    const startAudio = () => {
      bgAudio.play();
      document.removeEventListener('click', startAudio);
    };
    document.addEventListener('click', startAudio);
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

// Scroll to the target section when page loads
function smoothScrollTo(elementId, duration = 1000) {
  const target = document.querySelector(elementId);
  if (!target) return;

  const startPosition = window.pageYOffset;
  const targetPosition = target.getBoundingClientRect().top + startPosition;
  const distance = targetPosition - startPosition;
  const interval = 10; // 10ms per step
  const steps = duration / interval;
  let stepCount = 0;

  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  function scrollStep() {
    stepCount++;
    const progress = stepCount / steps;
    const easedProgress = easeInOutQuad(progress);
    window.scrollTo(0, startPosition + distance * easedProgress);

    if (stepCount < steps) {
      setTimeout(scrollStep, interval);
    }
  }

  scrollStep(); // start scrolling
}

window.onload = function() {
  smoothScrollTo('circle-dp', 1000); // scrolls to #focusSection in 1 second
};


