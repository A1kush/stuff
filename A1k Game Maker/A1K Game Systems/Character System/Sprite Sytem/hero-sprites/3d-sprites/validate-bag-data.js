/**
 * Validation script for 3D Sprite Templates
 * Ensures all referenced IDs exist in the A1K Bag System
 */

const fs = require('fs');
const path = require('path');

// Paths
const MANIFEST_PATH = path.join(__dirname, 'manifest.json');
const BAG_SYSTEM_PATH = path.join(__dirname, '../../../A1k Bag System');
const GAME_DATA_PATH = path.join(BAG_SYSTEM_PATH, 'game-data.js');
const ALL_MANIFESTS_PATH = path.join(BAG_SYSTEM_PATH, 'all-manifests.json');

// Load manifest
const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));

// Load bag system data
let gameData = {};
let allManifests = {};

try {
    // Read game-data.js and extract GEAR_MANIFEST
    const gameDataContent = fs.readFileSync(GAME_DATA_PATH, 'utf8');
    // Extract GEAR_MANIFEST using regex (basic extraction)
    const gearMatch = gameDataContent.match(/const GEAR_MANIFEST = (\[[\s\S]*?\]);/);
    if (gearMatch) {
        // Evaluate the array (in a real scenario, you'd want a proper parser)
        eval(`gameData.GEAR_MANIFEST = ${gearMatch[1]}`);
    }
} catch (error) {
    console.warn('Could not load game-data.js:', error.message);
}

try {
    allManifests = JSON.parse(fs.readFileSync(ALL_MANIFESTS_PATH, 'utf8'));
} catch (error) {
    console.warn('Could not load all-manifests.json:', error.message);
}

// Collect all referenced IDs
const referencedIds = {
    pets: new Set(),
    vehicles: new Set(),
    spirits: new Set(),
    npcs: new Set(),
    equipment: new Set(),
    aiBots: new Set()
};

manifest.forEach(template => {
    // Pets
    if (template.summons?.pet) referencedIds.pets.add(template.summons.pet);
    template.bundleOptions?.pets?.forEach(pet => referencedIds.pets.add(pet));
    
    // Vehicles
    if (template.summons?.vehicle) referencedIds.vehicles.add(template.summons.vehicle);
    template.bundleOptions?.vehicles?.forEach(vehicle => referencedIds.vehicles.add(vehicle));
    
    // Spirits
    if (template.summons?.spirit) referencedIds.spirits.add(template.summons.spirit);
    template.bundleOptions?.spirits?.forEach(spirit => referencedIds.spirits.add(spirit));
    template.spirits?.forEach(spirit => referencedIds.spirits.add(spirit));
    
    // NPCs
    Object.values(template.npcs || {}).forEach(rankNpcs => {
        rankNpcs.forEach(npc => referencedIds.npcs.add(npc));
    });
    
    // Equipment
    template.equipment?.weapons?.forEach(weapon => {
        referencedIds.equipment.add(weapon.id);
    });
    
    // AI Bots
    template.aiBots?.forEach(bot => referencedIds.aiBots.add(bot));
});

// Validation results
const validationResults = {
    pets: { valid: [], invalid: [] },
    vehicles: { valid: [], invalid: [] },
    spirits: { valid: [], invalid: [] },
    npcs: { valid: [], invalid: [] },
    equipment: { valid: [], invalid: [] },
    aiBots: { valid: [], invalid: [] }
};

// Validate pets
const petManifest = allManifests.assetManifest?.assets?.filter(a => a.id?.startsWith('pet_')) || [];
const petIds = new Set(petManifest.map(p => p.id));
referencedIds.pets.forEach(petId => {
    if (petIds.has(petId)) {
        validationResults.pets.valid.push(petId);
    } else {
        validationResults.pets.invalid.push(petId);
    }
});

// Validate vehicles
const vehicleManifest = allManifests.assetManifest?.assets?.filter(a => a.id?.startsWith('veh_')) || [];
const vehicleIds = new Set(vehicleManifest.map(v => v.id));
referencedIds.vehicles.forEach(vehicleId => {
    if (vehicleIds.has(vehicleId)) {
        validationResults.vehicles.valid.push(vehicleId);
    } else {
        validationResults.vehicles.invalid.push(vehicleId);
    }
});

// Validate spirits (placeholder - may need actual spirit system)
referencedIds.spirits.forEach(spiritId => {
    // For now, mark as valid if it follows the pattern
    if (spiritId.startsWith('spirit_')) {
        validationResults.spirits.valid.push(spiritId);
    } else {
        validationResults.spirits.invalid.push(spiritId);
    }
});

// Validate NPCs (placeholder - may need actual NPC system)
referencedIds.npcs.forEach(npcId => {
    // For now, mark as valid if it follows the pattern
    if (npcId.startsWith('npc_')) {
        validationResults.npcs.valid.push(npcId);
    } else {
        validationResults.npcs.invalid.push(npcId);
    }
});

// Validate equipment
const equipmentIds = new Set();
if (gameData.GEAR_MANIFEST) {
    gameData.GEAR_MANIFEST.forEach(gear => {
        if (gear.id) equipmentIds.add(gear.id);
    });
}
referencedIds.equipment.forEach(equipId => {
    if (equipmentIds.has(equipId)) {
        validationResults.equipment.valid.push(equipId);
    } else {
        validationResults.equipment.invalid.push(equipId);
    }
});

// Validate AI bots (placeholder - may need actual robot system)
referencedIds.aiBots.forEach(botId => {
    // For now, mark as valid if it follows the pattern
    if (botId.startsWith('robot_')) {
        validationResults.aiBots.valid.push(botId);
    } else {
        validationResults.aiBots.invalid.push(botId);
    }
});

// Print results
console.log('=== 3D Sprite Template Validation Results ===\n');

console.log(`Pets: ${validationResults.pets.valid.length} valid, ${validationResults.pets.invalid.length} invalid`);
if (validationResults.pets.invalid.length > 0) {
    console.log('  Invalid:', validationResults.pets.invalid.join(', '));
}

console.log(`\nVehicles: ${validationResults.vehicles.valid.length} valid, ${validationResults.vehicles.invalid.length} invalid`);
if (validationResults.vehicles.invalid.length > 0) {
    console.log('  Invalid:', validationResults.vehicles.invalid.join(', '));
}

console.log(`\nSpirits: ${validationResults.spirits.valid.length} valid, ${validationResults.spirits.invalid.length} invalid`);
if (validationResults.spirits.invalid.length > 0) {
    console.log('  Invalid:', validationResults.spirits.invalid.join(', '));
}

console.log(`\nNPCs: ${validationResults.npcs.valid.length} valid, ${validationResults.npcs.invalid.length} invalid`);
if (validationResults.npcs.invalid.length > 0) {
    console.log('  Invalid:', validationResults.npcs.invalid.join(', '));
}

console.log(`\nEquipment: ${validationResults.equipment.valid.length} valid, ${validationResults.equipment.invalid.length} invalid`);
if (validationResults.equipment.invalid.length > 0) {
    console.log('  Invalid:', validationResults.equipment.invalid.join(', '));
}

console.log(`\nAI Bots: ${validationResults.aiBots.valid.length} valid, ${validationResults.aiBots.invalid.length} invalid`);
if (validationResults.aiBots.invalid.length > 0) {
    console.log('  Invalid:', validationResults.aiBots.invalid.join(', '));
}

// Summary
const totalInvalid = 
    validationResults.pets.invalid.length +
    validationResults.vehicles.invalid.length +
    validationResults.spirits.invalid.length +
    validationResults.npcs.invalid.length +
    validationResults.equipment.invalid.length +
    validationResults.aiBots.invalid.length;

console.log(`\n=== Summary ===`);
console.log(`Total invalid references: ${totalInvalid}`);

if (totalInvalid === 0) {
    console.log('✅ All referenced IDs are valid!');
    process.exit(0);
} else {
    console.log('⚠️  Some referenced IDs may need to be added to the bag system.');
    process.exit(1);
}

