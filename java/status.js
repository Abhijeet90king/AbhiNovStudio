import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

const statusCard = document.getElementById('statusCard');

// Auth Check & Fetch Data
onAuthStateChanged(auth, async (user) => {
    if (user) {
        document.getElementById('userGreeting').textContent = `Hello, ${user.displayName || user.email}`;
        fetchApplicationStatus(user.uid);
    } else {
        window.location.href = "index.html";
    }
});

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => signOut(auth).then(() => window.location.href = "index.html"));

// Fetch Application Status from Firestore
async function fetchApplicationStatus(uid) {
    try {
        const docRef = doc(db, "applyforms", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            const currentStatus = data.status; // Pending, Interview, Accepted, Rejected

            // Determine custom message based on admin status
            let message = "";
            if(currentStatus === "Pending") message = "Your application has been received and is currently under review by our team. Please check back later.";
            if(currentStatus === "Interview") message = "Congratulations! We would like to schedule an interview with you. Please check your Discord or Email for further instructions.";
            if(currentStatus === "Accepted") message = "Welcome to the team! You have been accepted to AbhiNov Studio. We will contact you shortly with onboarding details.";
            if(currentStatus === "Rejected") message = "Thank you for applying. Unfortunately, we will not be moving forward with your application at this time. We encourage you to apply again in the future.";

            // Inject HTML to show the status
            statusCard.innerHTML = `
                <h2 style="text-align:center; color:#2c3e50; margin-bottom: 5px;">Role: ${data.role}</h2>
                <p style="text-align:center; color:#7f8c8d; font-size: 0.9rem; margin-bottom: 20px;">Applied on: ${new Date(data.appliedAt).toLocaleDateString()}</p>
                
                <div class="status-display">
                    <span class="status-badge status-${currentStatus}">${currentStatus}</span>
                </div>
                
                <p class="status-message">${message}</p>
                
                <div style="border-top: 1px solid #eee; padding-top: 20px; font-size: 0.95rem; line-height: 1.8;">
                    <p><strong>Name:</strong> ${data.fullName}</p>
                    <p><strong>Discord:</strong> ${data.discordId}</p>
                    <p><strong>Email:</strong> ${data.email}</p>
                    <p><strong>Phone:</strong> ${data.phone}</p>
                </div>
            `;
        } else {
            // User hasn't applied yet
            statusCard.innerHTML = `
                <div style="text-align: center;">
                    <h2 style="color: #2c3e50; margin-bottom: 15px;">No Application Found</h2>
                    <p style="color: #555; margin-bottom: 25px;">It looks like you haven't submitted an application to join AbhiNov Studio yet.</p>
                    <a href="apply.html" class="btn-submit" style="display:inline-block; width:auto; padding: 12px 30px; text-decoration:none;">Apply Now</a>
                </div>
            `;
        }
    } catch (error) {
        statusCard.innerHTML = `<p style="text-align:center; color:red;">Error fetching status: ${error.message}</p>`;
    }
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