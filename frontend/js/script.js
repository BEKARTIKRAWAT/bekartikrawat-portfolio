// ===== CUSTOM CURSOR =====
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  cursorFollower.style.left = followerX + 'px';
  cursorFollower.style.top = followerY + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();

document.querySelectorAll('a, button, .skill-card, .project-card, .contact-card').forEach(el => {
  el.addEventListener('mouseenter', () => cursorFollower.classList.add('hovering'));
  el.addEventListener('mouseleave', () => cursorFollower.classList.remove('hovering'));
});

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  const sections = document.querySelectorAll('section[id]');
  sections.forEach(section => {
    const top = section.offsetTop - 100;
    const bottom = top + section.offsetHeight;
    const id = section.getAttribute('id');
    if (window.scrollY >= top && window.scrollY < bottom) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + id) link.classList.add('active');
      });
    }
  });
});

// ===== MOBILE MENU =====
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
menuBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
  const icon = menuBtn.querySelector('i');
  icon.className = mobileMenu.classList.contains('hidden') ? 'fas fa-bars text-xl' : 'fas fa-times text-xl';
});
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
    menuBtn.querySelector('i').className = 'fas fa-bars text-xl';
  });
});

// ===== TYPEWRITER =====
const words = [
  'Modern Web Apps 🌐',
  'REST APIs 🔌',
  'Full Stack Solutions 🚀',
  'Beautiful UIs 🎨',
  'MongoDB Databases 🍃',
  'Express Backends ⚡'
];
let wordIndex = 0, charIndex = 0, isDeleting = false;
const typeEl = document.getElementById('typewriter');

function type() {
  const currentWord = words[wordIndex];
  if (isDeleting) {
    typeEl.textContent = currentWord.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typeEl.textContent = currentWord.substring(0, charIndex + 1);
    charIndex++;
  }
  if (!isDeleting && charIndex === currentWord.length) {
    setTimeout(() => isDeleting = true, 1800);
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
  }
  setTimeout(type, isDeleting ? 60 : 100);
}
type();

// ===== SCROLL REVEAL =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
        const bar = entry.target.querySelector('.skill-fill');
        if (bar) {
          const width = bar.style.width;
          bar.style.width = '0';
          setTimeout(() => bar.style.width = width, 100);
        }
      }, parseInt(delay));
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ===== CHAT =====
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');

function getTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function addMessage(text, isUser = false) {
  const msg = document.createElement('div');
  msg.className = `chat-msg ${isUser ? 'user' : ''}`;
  if (isUser) {
    msg.innerHTML = `
      <div class="msg-bubble user-bubble">
        <p>${text}</p>
        <span class="msg-time">${getTime()}</span>
      </div>`;
  } else {
    msg.innerHTML = `
      <div class="msg-avatar-small">AI</div>
      <div class="msg-bubble bot-bubble">
        <p>${text}</p>
        <span class="msg-time">${getTime()}</span>
      </div>`;
  }
  chatMessages.appendChild(msg);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTyping() {
  const typing = document.createElement('div');
  typing.className = 'chat-msg';
  typing.id = 'typingIndicator';
  typing.innerHTML = `
    <div class="msg-avatar-small">AI</div>
    <div class="msg-bubble bot-bubble">
      <div class="typing-indicator">
        <span></span><span></span><span></span>
      </div>
    </div>`;
  chatMessages.appendChild(typing);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTyping() {
  const typing = document.getElementById('typingIndicator');
  if (typing) typing.remove();
}

async function sendMessage() {
  const message = chatInput.value.trim();
  if (!message) return;
  addMessage(message, true);
  chatInput.value = '';
  sendBtn.disabled = true;
  showTyping();
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    const data = await response.json();
    removeTyping();
    if (data.reply) {
      addMessage(data.reply);
    } else {
      addMessage("Sorry, I couldn't get a response right now. Try again! 🙏");
    }
  } catch (err) {
    removeTyping();
    addMessage("Oops! Something went wrong. Please try again later. 😅");
  }
  sendBtn.disabled = false;
  chatInput.focus();
}

sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ===== PAGE LOAD =====
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  setTimeout(() => document.body.style.opacity = '1', 100);
});

console.log('%c🚀 Kartik Rawat Portfolio', 'color: #6366f1; font-size: 20px; font-weight: bold;');
console.log('%c@bekartikrawat | kartikrawat1333@gmail.com', 'color: #8b5cf6; font-size: 14px;');