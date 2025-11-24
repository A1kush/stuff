// src/game/InputController.js

// Input state
export const keys = {
  ArrowLeft: false,
  ArrowRight: false,
  ArrowUp: false,
};

function handleKeyDown(event) {
  if (keys.hasOwnProperty(event.code)) {
    if (event.repeat) return;
    keys[event.code] = true;
    event.preventDefault();
  } else if (event.key === "v" || event.key === "V") {
    // Bridge player intent to the vehicle manager without coupling other systems.
    if (window.vehicleManager) {
      window.vehicleManager.toggleSpawn();
    }
    event.preventDefault();
  } else if (event.key === "e" || event.key === "E") {
    // Boarding logic must flip state symmetrically so riding status never desynchronises.
    if (window.vehicleManager) {
      if (window.vehicleManager.isPlayerRiding) {
        window.vehicleManager.unboard();
      } else {
        window.vehicleManager.attemptBoard();
      }
    }
    event.preventDefault();
  }
}

function handleKeyUp(event) {
  if (keys.hasOwnProperty(event.code)) {
    keys[event.code] = false;
    event.preventDefault();
  }
}

/**
 * Initializes the input controller by attaching event listeners.
 * This should be called once when the game starts.
 */
export function init() {
  window.addEventListener("keydown", handleKeyDown, true);
  window.addEventListener("keyup", handleKeyUp, true);
  console.log("Input Controller Initialized.");
}

