// src/gameState.js

export let gameState = {
  running: true,
  time: 0,
  dt: 0,
  animTime: 0,

  world: {
    width: 1200,
    groundY: 460,
  },
  camera: {
    x: 0,
    y: 0,
  },

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
      grounded: true,
    },
  ],
  leader: 0,

  pets: [],
};

