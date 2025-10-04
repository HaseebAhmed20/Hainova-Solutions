// ===================================
// MOBILE DETECTION
// ===================================

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;

// ===================================
// CUSTOM CURSOR (Desktop Only)
// ===================================

if (!isMobile) {
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let followerX = 0;
    let followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        // Smooth cursor movement
        cursorX += (mouseX - cursorX) * 0.3;
        cursorY += (mouseY - cursorY) * 0.3;
        
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        cursorFollower.style.left = followerX + 'px';
        cursorFollower.style.top = followerY + 'px';
        
        requestAnimationFrame(animateCursor);
    }

    animateCursor();

    // Cursor hover effects
    const hoverElements = document.querySelectorAll('a, button, .project-card, .service-card');

    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursorFollower.style.width = '60px';
            cursorFollower.style.height = '60px';
        });
        
        element.addEventListener('mouseleave', () => {
            cursorFollower.style.width = '40px';
            cursorFollower.style.height = '40px';
        });
    });
}

// ===================================
// NAVIGATION
// ===================================

const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu on link click
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Smooth scroll with offset
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// THEME TOGGLE
// ===================================

const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    body.classList.add(savedTheme);
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-theme');
    
    // Save theme preference
    if (body.classList.contains('light-theme')) {
        localStorage.setItem('theme', 'light-theme');
    } else {
        localStorage.removeItem('theme');
    }
});

// ===================================
// THREE.JS HERO ANIMATION
// ===================================

const canvas = document.getElementById('hero-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ 
    canvas, 
    alpha: true, 
    antialias: !isMobile // Disable antialiasing on mobile for better performance
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Create particles (reduce count on mobile)
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = isMobile ? 500 : 1000; // Fewer particles on mobile
const posArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 10;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const particlesMaterial = new THREE.PointsMaterial({
    size: isMobile ? 0.03 : 0.02, // Slightly larger particles on mobile
    color: 0x8b5cf6,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Create geometric shapes (simplified on mobile)
const torusGeometry = new THREE.TorusGeometry(1, 0.3, isMobile ? 8 : 16, isMobile ? 50 : 100);
const torusMaterial = new THREE.MeshStandardMaterial({
    color: 0x667eea,
    wireframe: true,
    transparent: true,
    opacity: 0.3
});
const torus = new THREE.Mesh(torusGeometry, torusMaterial);
torus.position.x = -2;
scene.add(torus);

const sphereGeometry = new THREE.SphereGeometry(0.8, isMobile ? 16 : 32, isMobile ? 16 : 32);
const sphereMaterial = new THREE.MeshStandardMaterial({
    color: 0x06b6d4,
    wireframe: true,
    transparent: true,
    opacity: 0.3
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.x = 2;
sphere.position.y = 1;
scene.add(sphere);

// Lighting
const pointLight = new THREE.PointLight(0x8b5cf6, 2);
pointLight.position.set(2, 3, 4);
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

camera.position.z = 5;

// Mouse movement effect (touch support for mobile)
let mouseXPos = 0;
let mouseYPos = 0;

if (!isMobile) {
    document.addEventListener('mousemove', (e) => {
        mouseXPos = (e.clientX / window.innerWidth) * 2 - 1;
        mouseYPos = -(e.clientY / window.innerHeight) * 2 + 1;
    });
} else {
    // Gyroscope effect for mobile (if available)
    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', (e) => {
            mouseXPos = (e.gamma / 45) || 0; // gamma: left to right tilt (-90 to 90)
            mouseYPos = (e.beta / 90) || 0;  // beta: front to back tilt (-180 to 180)
        });
    }
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Rotate particles
    particlesMesh.rotation.y += 0.001;
    particlesMesh.rotation.x += 0.0005;
    
    // Rotate shapes
    torus.rotation.x += 0.01;
    torus.rotation.y += 0.01;
    
    sphere.rotation.x += 0.005;
    sphere.rotation.y += 0.01;
    
    // Mouse parallax effect
    camera.position.x += (mouseXPos * 0.5 - camera.position.x) * 0.05;
    camera.position.y += (mouseYPos * 0.5 - camera.position.y) * 0.05;
    
    renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// ===================================
// GSAP SCROLL ANIMATIONS
// ===================================

gsap.registerPlugin(ScrollTrigger);

// Animate section headers
gsap.utils.toArray('.section-header').forEach(header => {
    gsap.from(header, {
        scrollTrigger: {
            trigger: header,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });
});

// Animate about cards
gsap.utils.toArray('.about-card').forEach((card, index) => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        },
        y: 100,
        opacity: 0,
        duration: 0.8,
        delay: index * 0.2,
        ease: 'power3.out'
    });
});

// Animate service cards
gsap.utils.toArray('.service-card').forEach((card, index) => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        },
        scale: 0.8,
        opacity: 0,
        duration: 0.8,
        delay: index * 0.15,
        ease: 'back.out(1.7)'
    });
});

// Animate project cards
gsap.utils.toArray('.project-card').forEach((card, index) => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        },
        x: index % 2 === 0 ? -100 : 100,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    });
});

// Animate comparison cards
gsap.utils.toArray('.comparison-card').forEach((card, index) => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        },
        y: 80,
        opacity: 0,
        duration: 0.8,
        delay: index * 0.1,
        ease: 'power3.out'
    });
});

// Animate timeline items
gsap.utils.toArray('.timeline-item').forEach((item, index) => {
    const isOdd = index % 2 === 0;
    
    gsap.from(item.querySelector('.timeline-content'), {
        scrollTrigger: {
            trigger: item,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        },
        x: isOdd ? -100 : 100,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    });
    
    gsap.from(item.querySelector('.timeline-marker'), {
        scrollTrigger: {
            trigger: item,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        },
        scale: 0,
        opacity: 0,
        duration: 0.5,
        ease: 'back.out(1.7)'
    });
});

// Animate contact section
gsap.from('.contact-form-container', {
    scrollTrigger: {
        trigger: '.contact-section',
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse'
    },
    x: -100,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
});

gsap.from('.contact-info', {
    scrollTrigger: {
        trigger: '.contact-section',
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse'
    },
    x: 100,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
});

// ===================================
// PROJECT TABS
// ===================================

const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetTab = button.getAttribute('data-tab');
        
        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked button and corresponding content
        button.classList.add('active');
        document.getElementById(targetTab).classList.add('active');
    });
});

// ===================================
// MAGNETIC BUTTON EFFECT (Desktop Only)
// ===================================

if (!isMobile) {
    const magneticButtons = document.querySelectorAll('.magnetic-btn');

    magneticButtons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            button.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translate(0, 0)';
        });
    });
}

// ===================================
// CONTACT FORM
// ===================================

const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // Show success message (you can integrate with a backend here)
    alert('Thank you for your message! We will get back to you soon.');
    
    // Reset form
    contactForm.reset();
});

// ===================================
// NEWSLETTER FORM
// ===================================

const newsletterForm = document.querySelector('.newsletter-form');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = newsletterForm.querySelector('input[type="email"]').value;
        
        // Show success message (you can integrate with a backend here)
        alert(`Thank you for subscribing with ${email}!`);
        
        // Reset form
        newsletterForm.reset();
    });
}

// ===================================
// PARALLAX EFFECT ON SCROLL
// ===================================

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    // Parallax effect for intro section
    const introContent = document.querySelector('.intro-content');
    if (introContent) {
        introContent.style.transform = `translateY(${scrolled * 0.5}px)`;
        introContent.style.opacity = 1 - scrolled / 700;
    }
});

// ===================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ===================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe all animated elements
document.querySelectorAll('.about-card, .service-card, .project-card, .comparison-card').forEach(el => {
    observer.observe(el);
});

// ===================================
// LOADING ANIMATION
// ===================================

window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// ===================================
// SMOOTH SCROLL REVEAL
// ===================================

const revealElements = document.querySelectorAll('.contact-card');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
        }
    });
}, { threshold: 0.1 });

revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    revealObserver.observe(el);
});

// ===================================
// PARTICLE CURSOR TRAIL
// ===================================

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 5 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.life = 100;
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= 2;
        if (this.size > 0.2) this.size -= 0.1;
    }
    
    draw(ctx) {
        ctx.fillStyle = `rgba(139, 92, 246, ${this.life / 100})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Only create particle trail on desktop
if (window.innerWidth > 768) {
    const particleCanvas = document.createElement('canvas');
    particleCanvas.style.position = 'fixed';
    particleCanvas.style.top = '0';
    particleCanvas.style.left = '0';
    particleCanvas.style.width = '100%';
    particleCanvas.style.height = '100%';
    particleCanvas.style.pointerEvents = 'none';
    particleCanvas.style.zIndex = '9998';
    document.body.appendChild(particleCanvas);
    
    const ctx = particleCanvas.getContext('2d');
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
    
    const particles = [];
    
    document.addEventListener('mousemove', (e) => {
        if (Math.random() > 0.9) {
            particles.push(new Particle(e.clientX, e.clientY));
        }
    });
    
    function animateParticles() {
        ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
        
        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            particles[i].draw(ctx);
            
            if (particles[i].life <= 0) {
                particles.splice(i, 1);
            }
        }
        
        requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
    
    window.addEventListener('resize', () => {
        particleCanvas.width = window.innerWidth;
        particleCanvas.height = window.innerHeight;
    });
}

// ===================================
// SCROLL PROGRESS INDICATOR
// ===================================

const scrollProgress = document.createElement('div');
scrollProgress.style.position = 'fixed';
scrollProgress.style.top = '0';
scrollProgress.style.left = '0';
scrollProgress.style.height = '3px';
scrollProgress.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
scrollProgress.style.zIndex = '10000';
scrollProgress.style.transition = 'width 0.1s ease';
document.body.appendChild(scrollProgress);

window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.pageYOffset / windowHeight) * 100;
    scrollProgress.style.width = scrolled + '%';
});

// ===================================
// PERFORMANCE OPTIMIZATION
// ===================================

// Reduce animations on low-end devices
if (navigator.hardwareConcurrency < 4) {
    document.body.classList.add('reduce-motion');
}

// Pause Three.js animation when tab is not visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations
    } else {
        // Resume animations
    }
});

// ===================================
// MOBILE TOUCH SUPPORT FOR SERVICE CARDS
// ===================================

if (isMobile) {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        let isFlipped = false;
        
        card.addEventListener('click', () => {
            if (!isFlipped) {
                card.querySelector('.service-card-inner').style.transform = 'rotateY(180deg)';
                isFlipped = true;
            } else {
                card.querySelector('.service-card-inner').style.transform = 'rotateY(0deg)';
                isFlipped = false;
            }
        });
    });
}

// ===================================
// SMOOTH SCROLL FOR MOBILE
// ===================================

// Improve scroll performance on mobile
if (isMobile) {
    document.body.style.webkitOverflowScrolling = 'touch';
}

// ===================================
// VIEWPORT HEIGHT FIX FOR MOBILE
// ===================================

// Fix for mobile viewport height (address bar issue)
function setVH() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

setVH();
window.addEventListener('resize', setVH);
window.addEventListener('orientationchange', setVH);

// ===================================
// BINARY RAIN EFFECT (TECH VIBES)
// ===================================

const binaryRain = document.getElementById('binaryRain');

if (binaryRain && !isMobile) {
    const binaryChars = '01';
    const columns = Math.floor(window.innerWidth / 20);
    const drops = [];
    
    // Initialize drops
    for (let i = 0; i < columns; i++) {
        drops[i] = Math.floor(Math.random() * -100);
    }
    
    function drawBinaryRain() {
        let binaryText = '';
        
        for (let i = 0; i < columns; i++) {
            const char = binaryChars[Math.floor(Math.random() * binaryChars.length)];
            const x = i * 20;
            const y = drops[i] * 20;
            
            binaryText += `<span style="position: absolute; left: ${x}px; top: ${y}px;">${char}</span>`;
            
            if (y > window.innerHeight && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
        
        binaryRain.innerHTML = binaryText;
    }
    
    setInterval(drawBinaryRain, 50);
}

// ===================================
// TECH STATS COUNTER
// ===================================

function animateCounter(element, target, duration = 2000) {
    let current = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// ===================================
// CODE TYPING EFFECT
// ===================================

function typeCode(element, code, speed = 50) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < code.length) {
            element.textContent += code.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Apply typing effect to code snippets on scroll
const codeSnippets = document.querySelectorAll('.code-snippet');
const codeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.typed) {
            const originalText = entry.target.textContent;
            typeCode(entry.target, originalText, 30);
            entry.target.dataset.typed = 'true';
        }
    });
}, { threshold: 0.5 });

codeSnippets.forEach(snippet => {
    codeObserver.observe(snippet);
});

// ===================================
// GLITCH EFFECT ON HOVER
// ===================================

const glitchElements = document.querySelectorAll('.logo-text, .section-title');

glitchElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
        element.classList.add('glitch');
        setTimeout(() => {
            element.classList.remove('glitch');
        }, 500);
    });
});

// ===================================
// CONSOLE MESSAGE
// ===================================

console.log('%c Hainova Solutions ', 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-size: 20px; padding: 10px; border-radius: 5px;');
console.log('%c Innovating the Future 🚀 ', 'color: #8b5cf6; font-size: 14px;');
console.log('%c Looking for talented developers? Contact us at info@hainova.com ', 'color: #06b6d4; font-size: 12px;');
console.log('%c < /> Code. Create. Innovate. ', 'color: #f472b6; font-size: 12px; font-family: monospace;');
