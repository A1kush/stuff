// VehicleController.js - Board/unboard mechanics and vehicle physics

export class VehicleController {
  constructor() {
    this.boardingAnimDuration = 500; // ms
  }

  // Board a vehicle with animation
  boardVehicle(player, vehicle, animTime) {
    if (vehicle.rider || player.isRiding) return false;

    // Infinite Horizon: Missy's Bat-Van opens bag system UI
    if (vehicle.data && vehicle.data.isMobileBase) {
      // Open bag system UI when entering Bat-Van
      if (window.bagSystem && typeof window.bagSystem.openBag === 'function') {
        window.bagSystem.openBag();
      } else if (window.A1KBagSystem && typeof window.A1KBagSystem.open === 'function') {
        window.A1KBagSystem.open();
      }
    }

    // Start boarding animation
    player.boardingVehicle = vehicle;
    player.boardingStartTime = animTime;
    player.boardingProgress = 0;
    
    // Store original position
    player.boardingStartX = player.x;
    player.boardingStartY = player.y;
    
    return true;
  }

  // Update boarding animation
  updateBoarding(player, animTime, dt) {
    if (!player.boardingVehicle) return;

    const elapsed = animTime - player.boardingStartTime;
    player.boardingProgress = Math.min(1, elapsed / this.boardingAnimDuration);

    // Smooth easing function
    const easeProgress = this.easeInOutCubic(player.boardingProgress);

    // Interpolate position to vehicle
    const targetX = player.boardingVehicle.x;
    const targetY = player.boardingVehicle.y;
    
    player.x = player.boardingStartX + (targetX - player.boardingStartX) * easeProgress;
    player.y = player.boardingStartY + (targetY - player.boardingStartY) * easeProgress;

    // Complete boarding
    if (player.boardingProgress >= 1) {
      player.isRiding = true;
      player.ridingVehicle = player.boardingVehicle;
      player.boardingVehicle.rider = player;
      
      // Clean up boarding state
      player.boardingVehicle = null;
      player.boardingProgress = 0;
      
      // Transfer momentum
      player.vx = 0;
      player.vy = 0;
    }
  }

  // Unboard a vehicle with animation
  unboardVehicle(player, vehicle, animTime) {
    if (!player.isRiding || !vehicle.rider) return false;

    // Start unboarding animation
    player.unboardingVehicle = vehicle;
    player.unboardingStartTime = animTime;
    player.unboardingProgress = 0;
    
    // Store positions
    player.unboardingStartX = vehicle.x;
    player.unboardingStartY = vehicle.y;
    player.unboardingTargetX = vehicle.x + (player.facingLeft ? -40 : 40);
    player.unboardingTargetY = vehicle.y;
    
    // Clear riding state immediately
    player.isRiding = false;
    vehicle.rider = null;
    
    return true;
  }

  // Update unboarding animation
  updateUnboarding(player, animTime, dt) {
    if (!player.unboardingVehicle) return;

    const elapsed = animTime - player.unboardingStartTime;
    player.unboardingProgress = Math.min(1, elapsed / this.boardingAnimDuration);

    const easeProgress = this.easeInOutCubic(player.unboardingProgress);

    // Jump off animation
    const jumpArc = Math.sin(player.unboardingProgress * Math.PI) * 20;
    
    player.x = player.unboardingStartX + 
               (player.unboardingTargetX - player.unboardingStartX) * easeProgress;
    player.y = player.unboardingStartY + 
               (player.unboardingTargetY - player.unboardingStartY) * easeProgress - 
               jumpArc;

    // Complete unboarding
    if (player.unboardingProgress >= 1) {
      player.ridingVehicle = null;
      player.unboardingVehicle = null;
      player.unboardingProgress = 0;
      
      // Reset to ground
      player.vy = 0;
    }
  }

  // Update vehicle physics
  updateVehicle(vehicle, inputKeys, dt, groundY) {
    if (!vehicle) return;

    const vehicleData = vehicle.data;

    if (vehicle.rider) {
      // Player is controlling the vehicle
      const targetVx = (inputKeys.ArrowRight ? 1 : 0) - (inputKeys.ArrowLeft ? 1 : 0);
      
      // Infinite Horizon: A1 Super-Speed Toggle (T key)
      let currentAcceleration = vehicleData.acceleration;
      let currentMaxSpeed = vehicleData.maxSpeed * 100;
      
      if (inputKeys.KeyT && window.combatEngine && window.combatEngine.activeCharacter === 'A1' && vehicleData.id === 'bike') {
        // A1 Super-Speed Mode
        currentAcceleration = 2000;
        currentMaxSpeed = 1000;
        
        // Apply speed effects
        if (window.EffectsSystem) {
          window.EffectsSystem.applySpeedEffect(true);
          // Camera tilt based on facing direction
          if (vehicle.facingLeft) {
            window.EffectsSystem.setCameraTilt(10);
          } else {
            window.EffectsSystem.setCameraTilt(-10);
          }
        }
      } else {
        // Normal mode
        if (window.EffectsSystem) {
          window.EffectsSystem.applySpeedEffect(false);
          window.EffectsSystem.setCameraTilt(0);
        }
      }

      vehicle.vx += targetVx * currentAcceleration * dt;
      
      // Apply friction
      if (targetVx === 0) {
        vehicle.vx *= Math.pow(1 - vehicleData.friction, dt * 60);
      }

      // Clamp to max speed
      vehicle.vx = Math.max(-currentMaxSpeed, Math.min(currentMaxSpeed, vehicle.vx));

      // Handle jumping (for ground vehicles)
      if (inputKeys.ArrowUp && vehicle.grounded && vehicle.jumpCount < 2) {
        if (vehicleData.jumpForce > 0) {
          vehicle.vy = -vehicleData.jumpForce;
          vehicle.grounded = false;
          vehicle.jumpCount++;
        }
      }

      // Update facing direction
      if (targetVx !== 0) {
        vehicle.facingLeft = targetVx < 0;
      }
    } else {
      // Vehicle is idle - apply friction
      vehicle.vx *= Math.pow(1 - vehicleData.friction, dt * 60);
    }

    // Apply physics
    vehicle.x += vehicle.vx * dt;
    
    // Gravity for non-hover vehicles
    if (vehicleData.category !== 'hover') {
      vehicle.vy += vehicleData.gravity * dt;
      vehicle.y += vehicle.vy * dt;

      // Ground collision
      if (vehicle.y >= groundY) {
        vehicle.y = groundY;
        vehicle.vy = 0;
        vehicle.grounded = true;
        vehicle.jumpCount = 0;
      } else {
        vehicle.grounded = false;
      }
    } else {
      // Hover vehicles float
      const hoverHeight = groundY - 20;
      const diff = hoverHeight - vehicle.y;
      vehicle.vy = diff * 0.1;
      vehicle.y += vehicle.vy * dt;
    }

    // Update rider position
    if (vehicle.rider) {
      vehicle.rider.x = vehicle.x;
      vehicle.rider.y = vehicle.y;
      vehicle.rider.facingLeft = vehicle.facingLeft;
    }

    // Keep within bounds
    vehicle.x = Math.max(50, Math.min(5950, vehicle.x));
  }

  // Easing function
  easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  // Check if player can interact with vehicle
  canInteract(player, vehicle) {
    const distance = Math.abs(player.x - vehicle.x);
    return distance < 60 && !player.boardingVehicle && !player.unboardingVehicle;
  }
}

