class NPC extends Entity {
    constructor(name, rank) {
        super();
        this.name = name;
        this.rank = rank;
    }

    interact() {
        console.log(`${this.name} interacts with the player.`);
    }

    getRank() {
        return this.rank;
    }

    setRank(newRank) {
        this.rank = newRank;
    }
}