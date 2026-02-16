import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, 
    GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { 
    getFirestore, doc, setDoc, getDocs, collection, query, where 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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

// --- DOM Elements ---
const authModal = document.getElementById('auth-modal');
const openAuthBtn = document.getElementById('open-auth-btn');
const closeBtn = document.querySelector('.close-modal');
const tabLogin = document.getElementById('tab-login');
const tabSignup = document.getElementById('tab-signup');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const googleBtn = document.getElementById('google-btn');

const authLoggedOut = document.getElementById('auth-logged-out');
const authLoggedIn = document.getElementById('auth-logged-in');
const userGreeting = document.getElementById('user-greeting');
const logoutBtn = document.getElementById('logout-btn');

// --- Mobile Sidebar Logic ---
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const sidebarMenu = document.getElementById('sidebar-menu');
const closeSidebarBtn = document.getElementById('close-sidebar-btn');
const sidebarOverlay = document.getElementById('sidebar-overlay');

const openSidebar = () => {
    sidebarMenu.classList.add('open');
    sidebarOverlay.classList.add('show');
};

const closeSidebar = () => {
    sidebarMenu.classList.remove('open');
    sidebarOverlay.classList.remove('show');
};

mobileMenuBtn.addEventListener('click', openSidebar);
closeSidebarBtn.addEventListener('click', closeSidebar);
sidebarOverlay.addEventListener('click', closeSidebar);

// Close the sidebar when any link is clicked
document.querySelectorAll('.nav-tabs a').forEach(link => {
    link.addEventListener('click', closeSidebar);
});

// --- Modal Logic ---
const toggleModal = (show) => {
    if (show) {
        authModal.classList.remove('hidden');
        closeSidebar(); 
    } else {
        authModal.classList.add('hidden');
    }
};

openAuthBtn.addEventListener('click', () => toggleModal(true));
closeBtn.addEventListener('click', () => toggleModal(false));

tabLogin.addEventListener('click', () => {
    tabLogin.classList.add('active');
    tabSignup.classList.remove('active');
    loginForm.classList.remove('hidden');
    signupForm.classList.add('hidden');
});

tabSignup.addEventListener('click', () => {
    tabSignup.classList.add('active');
    tabLogin.classList.remove('active');
    signupForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
});

// --- Firebase Auth & Firestore Logic ---
const saveUserToFirestore = async (user, additionalData = {}) => {
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        createdAt: new Date().toISOString(),
        ...additionalData
    }, { merge: true });
};

// Signup
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('signup-username').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const errorEl = document.getElementById('signup-error');
    
    try {
        errorEl.classList.add('hidden');
        const q = query(collection(db, "users"), where("username", "==", username));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            throw new Error("Username is already taken.");
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await saveUserToFirestore(userCredential.user, { username: username });
        
        signupForm.reset();
        toggleModal(false);
    } catch (error) {
        errorEl.textContent = error.message;
        errorEl.classList.remove('hidden');
    }
});

// Login (Username or Email)
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const identifier = document.getElementById('login-id').value.trim(); 
    const password = document.getElementById('login-password').value;
    const errorEl = document.getElementById('login-error');
    
    try {
        errorEl.classList.add('hidden');
        let loginEmail = identifier;

        if (!identifier.includes('@')) {
            const q = query(collection(db, "users"), where("username", "==", identifier));
            const querySnapshot = await getDocs(q);
            
            if (querySnapshot.empty) {
                throw new Error("Username not found.");
            }
            loginEmail = querySnapshot.docs[0].data().email;
        }

        await signInWithEmailAndPassword(auth, loginEmail, password);
        loginForm.reset();
        toggleModal(false);
    } catch (error) {
        errorEl.textContent = "Invalid credentials. Please try again.";
        errorEl.classList.remove('hidden');
    }
});

// Google Login
googleBtn.addEventListener('click', async () => {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        await saveUserToFirestore(result.user, { 
            username: result.user.displayName.replace(/\s+/g, '').toLowerCase() + Math.floor(Math.random() * 1000)
        });
        toggleModal(false);
    } catch (error) {
        console.error("Google Auth Error:", error);
    }
});

// State Listener
onAuthStateChanged(auth, (user) => {
    if (user) {
        authLoggedOut.classList.add('hidden');
        authLoggedIn.classList.remove('hidden');
        userGreeting.textContent = `Welcome, ${user.displayName || user.email.split('@')[0]}`;
    } else {
        authLoggedOut.classList.remove('hidden');
        authLoggedIn.classList.add('hidden');
    }
});

// Logout
logoutBtn.addEventListener('click', () => {
    signOut(auth);
});