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
  