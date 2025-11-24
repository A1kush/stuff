class Entity {
    constructor(id, position) {
        this.id = id;
        this.position = position; // { x: number, y: number }
    }

    move(newPosition) {
        this.position = newPosition;
    }

    interact(otherEntity) {
        // Logic for interaction with another entity
    }
}

export default Entity;