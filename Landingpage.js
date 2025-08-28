// dropdown toggle
const userBtn  = document.getElementById('userBtn');
const userMenu = document.getElementById('userMenu');
userBtn.addEventListener('click', (e)=>{
  e.preventDefault();
  const open = userMenu.style.display === 'block';
  userMenu.style.display = open ? 'none' : 'block';
  userBtn.setAttribute('aria-expanded', String(!open));
});

// close dropdown when clicking outside
document.addEventListener('click', (e)=>{
  if (!userMenu.contains(e.target) && !userBtn.contains(e.target)) {
    userMenu.style.display = 'none';
    userBtn.setAttribute('aria-expanded','false');
  }
});

// open modals
const loginModal = document.getElementById('loginModal');
const regModal   = document.getElementById('registerModal');
document.getElementById('openLogin').addEventListener('click', (e)=>{
  e.preventDefault();
  userMenu.style.display = 'none';
  loginModal.classList.add('open');
});
document.getElementById('openRegister').addEventListener('click', (e)=>{
  e.preventDefault();
  userMenu.style.display = 'none';
  regModal.classList.add('open');
});

// close modals (X or outside click)
document.querySelectorAll('.close-x').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.getElementById(btn.dataset.close).classList.remove('open');
  });
});
[loginModal, regModal].forEach(m=>{
  m.addEventListener('click', (e)=>{
    if (e.target === m) m.classList.remove('open');
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const chatBtn   = document.querySelector(".Chatbtn");
  const chatBody  = document.querySelector(".chatbody");
  const sendBtn   = document.querySelector(".SendBtn");
  const inputBox  = document.querySelector(".InputBox");
  const chatSpace = document.querySelector(".ChatSpace");

  // Toggle panel (uses .active per your CSS)
  chatBtn?.addEventListener("click", () => {
    chatBody.classList.toggle("active");
    if (chatBody.classList.contains("active")) inputBox?.focus();
  });

  // Helper: safe HTML + add bubble
  const esc = (t) => {
    const d = document.createElement("div");
    d.textContent = t;
    return d.innerHTML;
  };
  const addMsg = (text, who = "user") => {
    const div = document.createElement("div");
    div.className = `msg ${who}`;
    div.innerHTML = esc(text).replace(/\n/g, "<br>");
    chatSpace.appendChild(div);
    chatSpace.scrollTop = chatSpace.scrollHeight;
  };

  // Optional typing indicator
  const showTyping = () => {
    const t = document.createElement("div");
    t.className = "typing";
    t.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
    chatSpace.appendChild(t);
    chatSpace.scrollTop = chatSpace.scrollHeight;
    return t;
  };

  const sendMessage = async () => {
    const prompt = (inputBox.value || "").trim();
    if (!prompt) return;

    addMsg(prompt, "user");
    inputBox.value = "";
    inputBox.disabled = true;
    sendBtn.disabled = true;

    const typingEl = showTyping();

    try {
      const res = await fetch("api.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ prompt }),
      });
      if (!res.ok) throw new Error("Server error (" + res.status + ")");

      const data = await res.json();
      const bot = data?.choices?.[0]?.message?.content || "Sorry, no reply.";
      typingEl.remove();
      addMsg(bot, "bot");
    } catch (e) {
      typingEl.remove();
      addMsg("⚠️ " + (e.message || "Network error"), "bot");
    } finally {
      inputBox.disabled = false;
      sendBtn.disabled = false;
      inputBox.focus();
    }
  };

  sendBtn?.addEventListener("click", sendMessage);
  inputBox?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
});

// close chatbot when clicking outside
document.addEventListener("click", (e) => {
  const chatBtn  = document.querySelector(".Chatbtn");
  const chatBody = document.querySelector(".chatbody");

  if (chatBody?.classList.contains("active")) {
    if (!chatBody.contains(e.target) && !chatBtn.contains(e.target)) {
      chatBody.classList.remove("active");
    }
  }
});

