// ========== CURSOR ==========
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');

document.addEventListener('mousemove', (e) => {
  if (cursor) { cursor.style.left = e.clientX + 'px'; cursor.style.top = e.clientY + 'px'; }
  if (cursorFollower) {
    setTimeout(() => {
      cursorFollower.style.left = e.clientX + 'px';
      cursorFollower.style.top = e.clientY + 'px';
    }, 80);
  }
});

// ========== NAVBAR ==========
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
});

// ========== MOBILE MENU ==========
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
if (menuBtn) {
  menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });
}

// Close mobile menu on link click
document.querySelectorAll('.mobile-menu a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
});

// ========== TYPEWRITER ==========
const words = ['Modern Websites 🌐', 'REST APIs ⚡', 'Full Stack Apps 🚀', 'Creative UIs 🎨'];
let wordIndex = 0, charIndex = 0, isDeleting = false;
const typeEl = document.getElementById('typewriter');

function type() {
  if (!typeEl) return;
  const word = words[wordIndex];
  if (isDeleting) {
    typeEl.textContent = word.substring(0, charIndex--);
    if (charIndex < 0) { isDeleting = false; wordIndex = (wordIndex + 1) % words.length; setTimeout(type, 500); return; }
  } else {
    typeEl.textContent = word.substring(0, charIndex++);
    if (charIndex > word.length) { isDeleting = true; setTimeout(type, 1500); return; }
  }
  setTimeout(type, isDeleting ? 60 : 100);
}
type();

// ========== SCROLL REVEAL ==========
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => entry.target.classList.add('visible'), delay);
    }
  });
}, { threshold: 0.1 });
reveals.forEach(el => observer.observe(el));

// ========== ACTIVE NAV LINK ==========
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 200) current = section.getAttribute('id');
  });
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) link.classList.add('active');
  });
});

// ========== AI CHAT ==========
const chatInput = document.getElementById('chatInput');
const chatMessages = document.getElementById('chatMessages');
const sendBtn = document.getElementById('sendBtn');

function appendMessage(text, isUser = false) {
  const div = document.createElement('div');
  div.className = `chat-msg ${isUser ? 'chat-msg-user' : 'chat-msg-ai'}`;
  div.innerHTML = `
    ${!isUser ? '<div class="chat-avatar-sm">AI</div>' : ''}
    <div class="chat-bubble">${text}</div>
    ${isUser ? '<div class="chat-avatar-sm chat-avatar-user">You</div>' : ''}
  `;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTyping() {
  const div = document.createElement('div');
  div.className = 'chat-msg chat-msg-ai';
  div.id = 'typingIndicator';
  div.innerHTML = `
    <div class="chat-avatar-sm">AI</div>
    <div class="chat-bubble typing-dots"><span></span><span></span><span></span></div>
  `;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTyping() {
  const typing = document.getElementById('typingIndicator');
  if (typing) typing.remove();
}

async function sendMessage() {
  if (!chatInput) return;
  const message = chatInput.value.trim();
  if (!message) return;

  chatInput.value = '';
  chatInput.disabled = true;
  if (sendBtn) sendBtn.disabled = true;

  appendMessage(message, true);
  showTyping();

  try {
    const response = await fetch('http://localhost:5000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });

    const data = await response.json();
    removeTyping();

    if (data.reply) {
      appendMessage(data.reply);
    } else {
      appendMessage('Sorry, kuch problem ho gayi. Dobara try karo! 😊');
    }
  } catch (err) {
    removeTyping();
    appendMessage('Server se connect nahi ho pa raha. Backend chal raha hai? 🔌');
  }

  chatInput.disabled = false;
  if (sendBtn) sendBtn.disabled = false;
  chatInput.focus();
}

// Send on button click
if (sendBtn) sendBtn.addEventListener('click', sendMessage);

// Send on Enter key
if (chatInput) {
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
}
