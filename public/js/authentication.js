import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";
import { buildUsersOpeningsUI,removeAllButtons } from "./userDataInteractions.js";
import { createDefaultOpeningsForNewUser } from "./manageOpenings.js";
const app = window.app;
const auth = getAuth(app);
 
// Get elements from the DOM
const loginForm = document.getElementById("login-form");
const loginBtn = document.getElementById("login-btn");
const signupBtn = document.getElementById("signup-btn");
const logoutBtn = document.getElementById("logout-btn");
//const getUserDataBtn = document.getElementById("get-user-data-btn");

// Function to handle user sign-up
const signUp = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("User signed up:", userCredential.user);
    await createDefaultOpeningsForNewUser(userCredential.user.uid);
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

// // :::: Moved to index.html ::::
// // Add event listener for authentication state changes 
// onAuthStateChanged(auth, (user) => {

//   const logoutButton = document.getElementById("logout-btn");
//   const manageOpeningsContainer = document.getElementById("manage-openings-container");

//   if (user) { // User is signed in
//     console.log("User is signed in:", user);

//     // Hide the login form
//     loginContainer.style.display = "none";
//     // loginForm.style.display = "none";
//     // Show the logout button
//     logoutButton.style.display = "block";
//     // Get the user data and make the buttons. 
//     buildUsersOpeningsUI(user.uid);
//     // Show the import and remove buttons
//     manageOpeningsContainer.style.display = "block";


//   } else { // User is signed out or there is no user signed in
//     console.log("No user is signed in.");
//     // Hide the manage openings container
//     manageOpeningsContainer.style.display = "none";
//     // Remove all buttons
//     removeAllButtons();

//     // Hide the logout button
//     logoutButton.style.display = "none";
//     // Show the login form
//     loginContainer.style.display = "block";
//     // loginForm.style.display = "block";
//     // Clear the login form
//     loginForm.reset();
//   }
// });

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

