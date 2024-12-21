// Import the necessary Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, push, set, onChildAdded } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAQ-Af3PlYxDo5ggsC4TqPol-UiOUa-rVM",
  authDomain: "chatrom-c7094.firebaseapp.com",
  projectId: "chatrom-c7094",
  storageBucket: "chatrom-c7094.appspot.com",
  messagingSenderId: "233306897624",
  appId: "1:233306897624:web:8b04343bf2f019952c2bad"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// DOM Elements
const loginDiv = document.getElementById("loginDiv");
const channelDiv = document.getElementById("channelDiv");
const chatDiv = document.getElementById("chatDiv");
const loginTokenInput = document.getElementById("loginToken");
const loginButton = document.getElementById("loginButton");
const sendButton = document.getElementById("sendButton");
const messageInput = document.getElementById("messageInput");
const imageInput = document.getElementById("imageInput");
const logoutButton = document.getElementById("logoutButton");
const backButton = document.getElementById("backButton");
const chatContainer = document.getElementById("chat");

const channelButtons = document.querySelectorAll(".channelButton");

// Default profile pictures
const defaultProfilePics = {
  Cheems: "https://preview.redd.it/msn-avatars-of-all-colors-v0-i19z4jwd5uha1.png?width=1024&format=png&auto=webp&s=3c7433ca602ffbf815e65c46a889bafb85134534",
  Ax3l: "https://preview.redd.it/msn-avatars-of-all-colors-v0-wpe4viwd5uha1.png?width=1024&format=png&auto=webp&s=56ab2a2b048c8841b6ba83b76f756b695d7a1eec",
  Carros: "https://preview.redd.it/msn-avatars-of-all-colors-v0-4k4l1oxd5uha1.png?width=1024&format=png&auto=webp&s=9363652eb05af6dcbfa606e30923fed24af1b65d",
  Lui: "https://preview.redd.it/msn-avatars-of-all-colors-v0-kdmrknxd5uha1.png?width=1024&format=png&auto=webp&s=7706fc01bdb28170610d79fa7104e3ecf8b40866"
};

// Tokens for login
const validTokens = ["Cheems", "Ax3l", "Carros", "Lui"];
let currentUser = "";
let profilePicUrl = "";
let currentChannel = "";

// Login functionality
loginButton.addEventListener("click", () => {
  const token = loginTokenInput.value;
  if (validTokens.includes(token)) {
    signInAnonymously(auth)
      .then(() => {
        currentUser = token;
        profilePicUrl = defaultProfilePics[token];
        loginDiv.classList.add("hidden");
        channelDiv.classList.remove("hidden");
      })
      .catch((error) => {
        alert("Error: " + error.message);
      });
  } else {
    alert("Invalid Token");
  }
});

// Logout functionality
logoutButton.addEventListener("click", () => {
  currentUser = "";
  currentChannel = "";
  loginDiv.classList.remove("hidden");
  channelDiv.classList.add("hidden");
  chatDiv.classList.add("hidden");
  chatContainer.innerHTML = ""; // Clear messages
});

// Channel selection functionality
channelButtons.forEach(button => {
  button.addEventListener("click", () => {
    currentChannel = button.getAttribute("data-channel");
    channelDiv.classList.add("hidden");
    chatDiv.classList.remove("hidden");
    chatContainer.innerHTML = ""; // Clear messages
    displayMessages();
  });
});

// Back to channel selection
backButton.addEventListener("click", () => {
  chatDiv.classList.add("hidden");
  channelDiv.classList.remove("hidden");
  chatContainer.innerHTML = ""; // Clear messages
});

// Send message (Text + Image)
sendButton.addEventListener("click", () => {
  const text = messageInput.value;
  const imageUrl = imageInput.value;
  const uniqueId = Math.random().toString(36).substr(2, 9);  // Random unique ID for each message
  
  if (text || imageUrl) {
    const messagesRef = ref(db, `channels/${currentChannel}/messages/`);
    const newMessageRef = push(messagesRef);
    
    set(newMessageRef, {
      messageId: uniqueId,
      username: currentUser,
      text: text || null,
      imageUrl: imageUrl || null,
      profilePic: profilePicUrl
    });
    
    messageInput.value = ''; // Clear the input
    imageInput.value = '';  // Clear image URL input
  }
});

// Display messages from Firebase
function displayMessages() {
  if (!currentChannel) return;
  const messagesRef = ref(db, `channels/${currentChannel}/messages/`);
  onChildAdded(messagesRef, (snapshot) => {
    const message = snapshot.val();
    const messageElement = document.createElement("div");
    messageElement.classList.add("message-container");

    const profilePicElement = document.createElement("img");
    profilePicElement.src = message.profilePic;
    profilePicElement.className = "profile-pic";
    messageElement.appendChild(profilePicElement);
    
    // Display image if available
    if (message.imageUrl) {
      const imageElement = document.createElement("img");
      imageElement.src = message.imageUrl;
      imageElement.style.maxWidth = "300px";
      messageElement.appendChild(imageElement);
    }

    // Display text message
    if (message.text) {
      const messageText = document.createElement("div");
      messageText.classList.add("message-content");
      messageText.textContent = `${message.username}: ${message.text}`;
      messageElement.appendChild(messageText);
    }

    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight; // Scroll to the bottom
  });
}
