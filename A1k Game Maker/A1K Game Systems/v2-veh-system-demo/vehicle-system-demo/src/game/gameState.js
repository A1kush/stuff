// src/game/gameState.js

/**
 * Simplified game state for the vehicle + pet system demo.
 * This is the single source of truth for the demo's state.
 */
export let gameState = {
  // Core Loop
  running: true,
  time: 0,
  dt: 0,
  animTime: 0,

  // World & Camera
  world: {
    width: 2000,
    groundY: 460,
  },
  camera: {
    x: 0,
    y: 0,
    targetX: 0,
    smoothness: 0.1,
  },

  // Player
  players: [
    {
      id: "player1",
      name: "Player",
      x: 200,
      y: 460,
      vx: 0,
      vy: 0,
      hp: 100,
      hpMax: 100,
      isRiding: false,

      // Physics Properties
      acceleration: 1200,
      friction: 0.9,
      jumpForce: 600,
      gravity: 2000,
      maxJumps: 2,
      jumpCount: 0,
      grounded: true,
    },
  ],
  leader: 0,

  // Entities
  pets: [],
  vehicles: [],
};

