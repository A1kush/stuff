export function validateEntityData(entityData) {
    if (!entityData.id || typeof entityData.id !== 'string') {
        throw new Error('Invalid entity ID: ID must be a non-empty string.');
    }
    if (!entityData.name || typeof entityData.name !== 'string') {
        throw new Error('Invalid entity name: Name must be a non-empty string.');
    }
    if (!entityData.rank || typeof entityData.rank !== 'string') {
        throw new Error('Invalid entity rank: Rank must be a non-empty string.');
    }
    if (entityData.type !== 'NPC' && entityData.type !== 'Enemy') {
        throw new Error('Invalid entity type: Type must be either "NPC" or "Enemy".');
    }
    // Additional validations can be added here as needed
}

export function validateRank(rank) {
    const validRanks = ['C rank NPC', 'C rank villain', 'C rank slayer', 'C rank hunter'];
    if (!validRanks.includes(rank)) {
        throw new Error(`Invalid rank: ${rank} is not a recognized rank.`);
    }
}