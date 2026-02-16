// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getAuth, 
    onAuthStateChanged, 
    signOut 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
    getFirestore, 
    doc, 
    getDoc 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCD-0rdfSwXH3EjZizv_MQJJFjsQsKTpxk",
  authDomain: "abhinov-d700f.firebaseapp.com",
  projectId: "abhinov-d700f",
  storageBucket: "abhinov-d700f.firebasestorage.app",
  messagingSenderId: "73593075731",
  appId: "1:73593075731:web:c0bc02a20320ee9640a7e6",
  measurementId: "G-X30RT6B14N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM Elements
const userGreeting = document.getElementById('userGreeting');
const logoutBtn = document.getElementById('logoutBtn');

// 1. Check if user is allowed to view the games page
onAuthStateChanged(auth, async (user) => {
    if (user) {
        try {
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const userData = docSnap.data();
                userGreeting.textContent = `Hello, ${userData.fullName}`;
            } else if (user.displayName) {
                userGreeting.textContent = `Hello, ${user.displayName}`;
            } else {
                userGreeting.textContent = `Hello, User`;
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            userGreeting.textContent = `Hello, ${user.email}`;
        }
    } else {
        // Kick them back to login if they try to access games without logging in
        window.location.href = "index.html";
    }
});

// 2. Logout Functionality
logoutBtn.addEventListener('click', () => {
    signOut(auth).then(() => {
        window.location.href = "index.html";
    }).catch((error) => {
        alert("An error happened during logout: " + error.message);
    });
});

// 3. Smooth Scroll / Fade Animation Logic
document.addEventListener("DOMContentLoaded", () => {
    const faders = document.querySelectorAll('.fade-on-scroll');
    const appearOptions = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };

    const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('appear');
            appearOnScroll.unobserve(entry.target); 
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });
});

// 4. --- MOBILE MENU TOGGLE LOGIC ---
document.addEventListener("DOMContentLoaded", () => {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenuWrapper = document.getElementById('navMenuWrapper');

    if (mobileMenuBtn && navMenuWrapper) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenuWrapper.classList.toggle('active');
        });
    }

    // Auto-close menu when a link is clicked
    const navLinksList = document.querySelectorAll('.nav-links a');
    navLinksList.forEach(link => {
        link.addEventListener('click', () => {
            navMenuWrapper.classList.remove('active');
        });
    });
});