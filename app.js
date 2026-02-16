// Import the required Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { 
    getFirestore, 
    doc, 
    setDoc 
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

// Initialize Firebase, Auth, and Firestore
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Make toggleForms globally available for the HTML onclick attributes
window.toggleForms = function() {
    document.getElementById('loginBox').classList.toggle('hidden');
    document.getElementById('signupBox').classList.toggle('hidden');
};

// 1. Email validation function
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 2. Handle Normal Sign Up
document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const fullName = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validation Checks
    if (!isValidEmail(email)) {
        return alert("Please enter a valid email address.");
    }
    if (password.length < 8) {
        return alert("Password must be at least 8 characters long.");
    }
    if (password !== confirmPassword) {
        return alert("Passwords do not match!");
    }

    try {
        // Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Save User Data to Firestore (NO PASSWORD SAVED)
        await setDoc(doc(db, "users", user.uid), {
            fullName: fullName,
            email: email,
            authProvider: "Email",
            createdAt: new Date().toISOString()
        });

        alert("Account Created Successfully! Welcome to Abhi Nov Studio.");
        window.location.href = "homepage.html"; // Redirects to the homepage in the same folder

    } catch (error) {
        alert("Signup Error: " + error.message);
    }
});

// 3. Handle Normal Log In
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = "homepage.html"; // Redirects to the homepage in the same folder
    } catch (error) {
        alert("Login Error: Please check your credentials.");
    }
});

// 4. Handle Google Sign In
const googleButtons = document.querySelectorAll('.googleLoginBtn');
googleButtons.forEach(btn => {
    btn.addEventListener('click', async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            // Save/Merge Google user data into Firestore
            await setDoc(doc(db, "users", user.uid), {
                fullName: user.displayName || "Google User",
                email: user.email,
                authProvider: "Google",
                lastLogin: new Date().toISOString()
            }, { merge: true });

            window.location.href = "homepage.html"; // Redirects to the homepage in the same folder

        } catch (error) {
            alert("Google Sign-In Error: " + error.message);
        }
    });
});