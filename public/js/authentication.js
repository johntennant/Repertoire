import {initializeApp} from 'https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js';

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  //...
};

const app = initializeApp(firebaseConfig);


// Get elements from the DOM
const loginForm = document.getElementById("login-form");
const loginBtn = document.getElementById("login-btn");
const signupBtn = document.getElementById("signup-btn");

// Function to handle user sign-up
const signUp = async (email, password) => {
  try {
    const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
    console.log("User signed up:", userCredential.user);
  } catch (error) {
    console.error("Error signing up:", error.message);
  }
};

// Function to handle user login
const logIn = async (email, password) => {
  try {
    const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
    console.log("User logged in:", userCredential.user);
  } catch (error) {
    console.error("Error logging in:", error.message);
  }
};

// Add event listener for login form submission
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  logIn(email, password);
});

// Add event listener for sign-up button click
signupBtn.addEventListener("click", () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  signUp(email, password);
});

// Add event listener for authentication state changes
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    console.log("User is signed in:", user);
    // Perform any actions needed when a user is logged in
    // e.g., update the UI, fetch user-specific data from Firestore, etc.
  } else {
    console.log("No user is signed in.");
    // Perform any actions needed when a user is logged out
    // e.g., update the UI, clear user-specific data from the app, etc.
  }
});
