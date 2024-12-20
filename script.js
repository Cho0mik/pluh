// Import the necessary Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, push, set, onChildAdded } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

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

// DOM Elements
const loginDiv = document.getElementById("loginDiv");
const chatDiv = document.getElementById("chatDiv");
const loginTokenInput = document.getElementById("loginToken");
const loginButton = document.getElementById("loginButton");
const sendButton = document.getElementById("sendButton");
const messageInput = document.getElementById("messageInput");
const logoutButton = document.getElementById("logoutButton");
const chatContainer = document.getElementById("chat");

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

// Login functionality
loginButton.addEventListener("click", () => {
  const token = loginTokenInput.value;
  if (validTokens.includes(token)) {
    currentUser = token;
    profilePicUrl = defaultProfilePics[token];
    loginDiv.classList.add("hidden");
    chatDiv.classList.remove("hidden");
    displayMessages();
  } else {
    alert("Invalid Token");
  }
});

// Logout functionality
logoutButton.addEventListener("click", () => {
  currentUser = "";
  loginDiv.classList.remove("hidden");
  chatDiv.classList.add("hidden");
});

// Send message to Firebase
sendButton.addEventListener("click", () => {
  const message = messageInput.value;
  if (message && currentUser) {
    const messagesRef = ref(db, 'messages/');
    const newMessageRef = push(messagesRef);
    set(newMessageRef, {
      username: currentUser,
      text: message,
      profilePic: profilePicUrl
    });
    messageInput.value = ''; // Clear the input
  }
});

// Display messages from Firebase
function displayMessages() {
  const messagesRef = ref(db, 'messages/');
  onChildAdded(messagesRef, (snapshot) => {
    const message = snapshot.val();
    const messageElement = document.createElement("div");
    const profilePicElement = document.createElement("img");
    profilePicElement.src = message.profilePic;
    profilePicElement.className = "profile-pic";
    messageElement.appendChild(profilePicElement);
    messageElement.appendChild(document.createTextNode(`${message.username}: ${message.text}`));
    chatContainer.appendChild(messageElement);
    chatContainer.scrollTop = chatContainer.scrollHeight; // Scroll to the bottom
  });
}
