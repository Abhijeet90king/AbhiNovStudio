import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

let currentUserId = null;

onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUserId = user.uid;
        document.getElementById('userGreeting').textContent = user.displayName || user.email;
    } else {
        window.location.href = "index.html";
    }
});

document.getElementById('logoutBtn').addEventListener('click', () => {
    signOut(auth).then(() => window.location.href = "index.html");
});

document.getElementById('sendBtn').addEventListener('click', async () => {
    const textInput = document.getElementById('feedbackInput').value.trim();
    if (!textInput) return alert("Please type your feedback before sending.");

    const btn = document.getElementById('sendBtn');
    btn.textContent = "Sending...";
    btn.disabled = true;

    try {
        await addDoc(collection(db, "feedbacks"), {
            userId: currentUserId,
            message: textInput,
            isSeen: false,      
            reply: "",          
            createdAt: new Date().toISOString() 
        });

        alert("Feedback successfully sent to the developers!");
        document.getElementById('feedbackInput').value = ""; 
        window.location.href = "feedback-report.html";       

    } catch (error) {
        alert("Error sending feedback: " + error.message);
        btn.textContent = "Submit Feedback";
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