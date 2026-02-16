import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// TODO: Paste your exact Firebase Config Here
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Auth Check for Navbar
onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById('userGreeting').textContent = user.displayName || user.email;
    } else {
        // Legal pages public ho sakti hain, isliye agar logged out hai toh hum usko bahar nahi nikalenge.
        // Bas navbar update kar denge.
        document.getElementById('userGreeting').textContent = "Guest";
        document.getElementById('logoutBtn').textContent = "Log In";
        
        document.getElementById('logoutBtn').addEventListener('click', () => {
            window.location.href = "index.html";
        });
    }
});

// Regular Logout Logic (If user is logged in)
document.getElementById('logoutBtn').addEventListener('click', () => {
    if(auth.currentUser) {
        signOut(auth).then(() => window.location.href = "index.html");
    }
});

// --- TAB SWITCHING LOGIC ---
// Make openTab function globally available so HTML onclick="" can find it
window.openTab = function(tabName) {
    // 1. Hide all tab contents
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => {
        content.classList.remove('active-content');
    });

    // 2. Remove active class from all buttons
    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
    });

    // 3. Show the selected tab content
    document.getElementById(tabName).classList.add('active-content');

    // 4. Highlight the clicked button
    // Find the button that called this function by checking its onclick attribute
    const clickedBtn = Array.from(buttons).find(btn => btn.getAttribute('onclick') === `openTab('${tabName}')`);
    if(clickedBtn) {
        clickedBtn.classList.add('active');
    }
};