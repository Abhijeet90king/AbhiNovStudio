import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, query, where, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

onAuthStateChanged(auth, (user) => {
    if (user) {
        document.getElementById('userGreeting').textContent = user.displayName || user.email;
        loadProjects(user.uid);
    } else {
        window.location.href = "index.html";
    }
});

document.getElementById('logoutBtn').addEventListener('click', () => signOut(auth));

function loadProjects(uid) {
    const q = query(
        collection(db, "client_projects"),
        where("userId", "==", uid)
    );

    onSnapshot(q, (snapshot) => {
        const list = document.getElementById('projectList');
        list.innerHTML = "";

        if (snapshot.empty) {
            list.innerHTML = `
                <div style="text-align: center; padding: 50px; background: #fff; border-radius: 8px;">
                    <h3 style="color:#2c3e50; margin-bottom:10px;">No Projects Found</h3>
                    <p style="color:#777; margin-bottom:20px;">You haven't requested any custom games or websites yet.</p>
                    <a href="project-request.html" class="btn-submit" style="text-decoration:none; padding: 12px 25px; display:inline-block; width:auto;">Start a Project</a>
                </div>
            `;
            return;
        }

        const projects = [];
        snapshot.forEach(doc => projects.push(doc.data()));
        projects.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));

        projects.forEach(data => {
            const statusClass = data.status.replace(/\s+/g, ''); 

            const tagsHtml = data.tags.length > 0 
                ? data.tags.map(tag => `<span style="background:#e1e5ea; padding:3px 8px; border-radius:15px; font-size:12px; margin-right:5px; margin-bottom:5px; display:inline-block; color:#555;">${tag}</span>`).join("")
                : `<span style="color:#999; font-size:12px;">No tags selected</span>`;

            const card = document.createElement('div');
            card.className = `project-card border-${statusClass}`;
            
            card.innerHTML = `
                <div class="card-header">
                    <div>
                        <div class="project-title">${data.title}</div>
                        <div class="project-type">${data.projectType} Development</div>
                    </div>
                    <span class="badge status-${statusClass}">${data.status}</span>
                </div>
                
                <div class="project-details">
                    <div class="detail-item"><strong>Platform:</strong> ${data.platform}</div>
                    <div class="detail-item"><strong>Budget:</strong> ${data.budget}</div>
                    <div class="detail-item"><strong>Payment:</strong> ${data.paymentMethod}</div>
                    <div class="detail-item"><strong>Date:</strong> ${new Date(data.submittedAt).toLocaleDateString()}</div>
                </div>

                <div style="margin-bottom: 15px;">
                    <strong style="font-size: 0.9rem; color: #2c3e50; display:block; margin-bottom:5px;">Features / Tags:</strong>
                    <div>${tagsHtml}</div>
                </div>

                <p style="font-size: 0.95rem; color: #555; background: #f8f9fa; padding: 15px; border-radius: 6px;">
                    "${data.description}"
                </p>
            `;
            list.appendChild(card);
        });
    });
}

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