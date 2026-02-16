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

document.getElementById('logoutBtn').addEventListener('click', () => signOut(auth));

// --- DYNAMIC FORM LOGIC ---
const projType = document.getElementById('projType');
const labelTitle = document.getElementById('labelTitle');
const labelDesc = document.getElementById('labelDesc');
const labelTags = document.getElementById('labelTags');
const platformWrapper = document.getElementById('platformWrapper');
const tagsContainer = document.getElementById('tagsContainer');

const gameTags = ["Action", "RPG", "Multiplayer", "Shooter", "Strategy", "Puzzle", "Horror", "Open World"];
const webTags = ["E-Commerce", "Portfolio", "Blog", "Business Panel", "Custom Web App", "Landing Page", "SEO Setup"];
let selectedTags = [];

function loadTags(type) {
    tagsContainer.innerHTML = "";
    selectedTags = []; 
    const tagsArray = type === "Game" ? gameTags : webTags;
    
    tagsArray.forEach(tag => {
        const btn = document.createElement('div');
        btn.className = "tag-btn";
        btn.textContent = tag;
        btn.addEventListener('click', () => {
            btn.classList.toggle('selected');
            if(selectedTags.includes(tag)) {
                selectedTags = selectedTags.filter(t => t !== tag);
            } else {
                selectedTags.push(tag);
            }
        });
        tagsContainer.appendChild(btn);
    });
}

projType.addEventListener('change', (e) => {
    if (e.target.value === "Website") {
        labelTitle.textContent = "Website Name";
        labelDesc.textContent = "Website Requirements";
        labelTags.textContent = "Website Features (Select multiple)";
        platformWrapper.style.display = "none";
        loadTags("Website");
    } else {
        labelTitle.textContent = "Game Title";
        labelDesc.textContent = "Game Description";
        labelTags.textContent = "Game Tags (Select multiple)";
        platformWrapper.style.display = "flex";
        loadTags("Game");
    }
});

loadTags("Game");

// --- SUBMIT LOGIC ---
document.getElementById('projectForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    btn.textContent = "Processing...";
    btn.disabled = true;

    const projectData = {
        userId: currentUserId,
        fullName: document.getElementById('projName').value.trim(),
        projectType: projType.value,
        title: document.getElementById('projTitle').value.trim(),
        email: document.getElementById('projEmail').value.trim(),
        phone: document.getElementById('projPhone').value.trim(),
        platform: projType.value === "Game" ? document.getElementById('projPlatform').value : "Web Browser",
        description: document.getElementById('projDesc').value.trim(),
        budget: document.getElementById('projBudget').value,
        paymentMethod: document.getElementById('projPayment').value,
        tags: selectedTags,
        status: "Pending", 
        submittedAt: new Date().toISOString()
    };

    try {
        await addDoc(collection(db, "client_projects"), projectData);
        alert("Project request submitted successfully! We will review it shortly.");
        window.location.href = "project-status.html";
    } catch (error) {
        alert("Error submitting request: " + error.message);
        btn.textContent = "Submit Project Request";
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