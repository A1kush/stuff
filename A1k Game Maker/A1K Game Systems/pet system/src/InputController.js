// src/InputController.js

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
  }
}

function handleKeyUp(event) {
  if (keys.hasOwnProperty(event.code)) {
    keys[event.code] = false;
    event.preventDefault();
  }
}

export function init() {
  window.addEventListener("keydown", handleKeyDown, true);
  window.addEventListener("keyup", handleKeyUp, true);
  console.log("Input Controller Initialized.");
}

