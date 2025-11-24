class EntityManager {
    private entities: Map<number, Entity> = new Map();
    private nextId: number = 1;

    addEntity(entity: Entity): number {
        const id = this.nextId++;
        entity.setId(id);
        this.entities.set(id, entity);
        return id;
    }

    removeEntity(id: number): boolean {
        return this.entities.delete(id);
    }

    updateEntity(id: number, updatedEntity: Entity): boolean {
        if (this.entities.has(id)) {
            updatedEntity.setId(id);
            this.entities.set(id, updatedEntity);
            return true;
        }
        return false;
    }

    getEntity(id: number): Entity | undefined {
        return this.entities.get(id);
    }

    getAllEntities(): Entity[] {
        return Array.from(this.entities.values());
    }
}