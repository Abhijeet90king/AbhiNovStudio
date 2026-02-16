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
        loadUserReports(user.uid);
    } else {
        window.location.href = "index.html";
    }
});

document.getElementById('logoutBtn').addEventListener('click', () => {
    signOut(auth).then(() => window.location.href = "index.html");
});

function loadUserReports(uid) {
    const q = query(collection(db, "feedbacks"), where("userId", "==", uid));

    onSnapshot(q, (snapshot) => {
        const reportList = document.getElementById('reportList');
        reportList.innerHTML = ""; 

        if (snapshot.empty) {
            reportList.innerHTML = `
                <div style="text-align: center; padding: 40px; background: #fff; border-radius: 8px;">
                    <h3 style="color:#2c3e50; margin-bottom:10px;">No Reports Found</h3>
                    <p style="color:#777; margin-bottom:20px;">You haven't submitted any feedback yet.</p>
                    <a href="feedback.html" class="btn-submit" style="text-decoration:none; padding: 10px 20px;">Submit Feedback</a>
                </div>
            `;
            return;
        }

        const docsArray = [];
        snapshot.forEach(doc => docsArray.push(doc.data()));
        docsArray.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        docsArray.forEach((data) => {
            const dateStr = new Date(data.createdAt).toLocaleDateString();
            let badgeClass = "badge-pending";
            let badgeText = "Pending";

            if (data.reply && data.reply.trim() !== "") {
                badgeClass = "badge-replied";
                badgeText = "Replied";
            } else if (data.isSeen === true) {
                badgeClass = "badge-seen";
                badgeText = "Seen";
            }

            const card = document.createElement('div');
            card.className = "report-card";

            card.innerHTML = `
                <div class="report-header">
                    <span class="badge ${badgeClass}">${badgeText}</span>
                    <span class="report-date">${dateStr}</span>
                </div>
                
                <p class="report-message">${data.message}</p>
                
                ${(data.reply && data.reply.trim() !== "") ? `
                    <div class="dev-reply-box">
                        <span class="reply-title">Developer Response:</span>
                        <p class="reply-text">${data.reply}</p>
                    </div>
                ` : ""}
            `;

            reportList.appendChild(card);
        });
    }, (error) => {
        console.error("Error fetching live reports:", error);
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