// show a temporary message for basic user feedback
export function showTemporaryMessage(message, duration = 6000) {
    const messageElement = document.createElement("div");
    messageElement.textContent = message;
    messageElement.style.position = "fixed";
    messageElement.style.bottom = "20px";
    messageElement.style.left = "50%";
    messageElement.style.transform = "translateX(-50%)";
    messageElement.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    messageElement.style.color = "white";
    messageElement.style.padding = "10px 20px";
    messageElement.style.borderRadius = "5px";
    messageElement.style.zIndex = 1000;
  
    document.body.appendChild(messageElement);
  
    setTimeout(() => {
      document.body.removeChild(messageElement);
    }, duration);
  }
  
// This function is called when the user clicks the "Show ReadMe" button
export async function toggleReadMe() {
  const readmeButton = document.getElementById("toggle-readme-btn");
  const readmeContent = document.getElementById("readme-content");

  // If the readme is currently displayed, hide it
  if (readmeContent.style.display !== "none") {
    readmeContent.style.display = "none";
    readmeButton.textContent = "Show Read Me";
    return;
  }

  // Fetch the readme text
  const response = await fetch('./ReadMe.html');
  const text = await response.text();

  // Display the readme text
  readmeContent.innerHTML = text;
  readmeContent.style.display = 'block';

  // Update the button text
  readmeButton.textContent = 'Hide Read Me';
}


document.getElementById('toggle-readme-btn').addEventListener('click', toggleReadMe);
