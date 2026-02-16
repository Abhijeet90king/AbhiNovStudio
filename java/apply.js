import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCD-0rdfSwXH3EjZizv_MQJJFjsQsKTpxk",
  authDomain: "abhinov-d700f.firebaseapp.com",
  projectId: "abhinov-d700f",
  storageBucket: "abhinov-d700f.firebasestorage.app",
  messagingSenderId: "73593075731",
  appId: "1:73593075731:web:c0bc02a20320ee9640a7e6",
  measurementId: "G-X30RT6B14N"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let currentUser = null;

// Auth check
onAuthStateChanged(auth, async (user) => {
    if (user) {
        currentUser = user;
        document.getElementById('userGreeting').textContent = `Hello, ${user.displayName || user.email}`;
        
        // Check if user already applied
        const existingApp = await getDoc(doc(db, "applyforms", user.uid));
        if(existingApp.exists()) {
            alert("You have already submitted an application. Redirecting to your status page.");
            window.location.href = "status.html";
        }
    } else {
        window.location.href = "index.html"; // Redirect to login if not authenticated
    }
});

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => signOut(auth).then(() => window.location.href = "index.html"));

// Form validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Form Submission
document.getElementById('applyForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const age = parseInt(document.getElementById('appAge').value);
    const email = document.getElementById('appEmail').value.trim();

    if (age < 15) return alert("You must be at least 15 years old to apply.");
    if (!isValidEmail(email)) return alert("Our system detected an invalid email format. Please provide a real email.");

    const btn = document.querySelector('.btn-submit');
    btn.textContent = "Processing...";
    btn.disabled = true;

    const applicationData = {
        fullName: document.getElementById('appFullName').value.trim(),
        age: age,
        discordId: document.getElementById('appDiscord').value.trim(),
        email: email,
        phone: document.getElementById('appCountryCode').value + " " + document.getElementById('appPhone').value.trim(),
        language: document.getElementById('appLang').value,
        role: document.getElementById('appRole').value,
        status: "Pending", 
        appliedAt: new Date().toISOString()
    };

    try {
        await setDoc(doc(db, "applyforms", currentUser.uid), applicationData);
        alert("Application submitted successfully!");
        window.location.href = "status.html"; 
    } catch (error) {
        alert("Error saving application: " + error.message);
        btn.textContent = "Submit Application";
        btn.disabled = false;
    }
});

// --- MOBILE MENU TOGGLE LOGIC ---
document.addEventListener("DOMContentLoaded", () => {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenuWrapper = document.getElementById('navMenuWrapper');

    if (mobileMenuBtn && navMenuWrapper) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenuWrapper.classList.toggle('active');
        });
    }

    const navLinksList = document.querySelectorAll('.nav-links a');
    navLinksList.forEach(link => {
        link.addEventListener('click', () => {
            navMenuWrapper.classList.remove('active');
        });
    });
});