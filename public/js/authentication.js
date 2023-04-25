import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";
import { getUserData, getOpeningData } from "./userDataInteractions.js";
const app = window.app;
const auth = getAuth(app);

// Get elements from the DOM
const loginForm = document.getElementById("login-form");
const loginBtn = document.getElementById("login-btn");
const signupBtn = document.getElementById("signup-btn");
const logoutBtn = document.getElementById("logout-btn");
const getUserDataBtn = document.getElementById("get-user-data-btn");

// Function to handle user sign-up
const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("User signed up:", userCredential.user);
  } catch (error) {
    console.error("Error signing up:", error.message);
  }
};

// Function to handle user login
const logIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
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
onAuthStateChanged(auth, (user) => {

  const openingsContainer = document.getElementById("openings-container");

  if (user) { // User is signed in

    console.log("User is signed in:", user);
    
    //Hide the login form
    loginForm.style.display = "none";

  } else { // User is signed out or there is no user signed in

    console.log("No user is signed in.");
    //Show the login form
    loginForm.style.display = "block";
    // Clear the login form
    loginForm.reset();
    // Hide the openings container when a user is logged out
    openingsContainer.style.display = "none";
  }
});

// Function to handle user log out
const logOut = async () => {
  try {
    await auth.signOut();
    console.log("User logged out");
  } catch (error) {
    console.error("Error logging out:", error.message);
  }
};

// Add event listener for log out button click
logoutBtn.addEventListener("click", logOut);

// Add event listener for get user data button click
getUserDataBtn.addEventListener("click", () => {
  const user = auth.currentUser;
  if (user) {
    // const userData = getUserData(user.uid);
    const userData = getOpeningData(user.uid, "openingID");
    console.log("Fetched user data:", userData);
  } else {
    console.log("No user is signed in.");
  }
});
