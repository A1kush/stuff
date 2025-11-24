class Enemy extends Entity {
    constructor(id, position, health, attackPower, rank) {
        super(id, position);
        this.health = health;
        this.attackPower = attackPower;
        this.rank = rank;
    }

    attack(target) {
        if (target) {
            target.takeDamage(this.attackPower);
        }
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.die();
        }
    }

    die() {
        console.log(`Enemy ${this.id} has been defeated.`);
        // Additional logic for enemy death can be added here
    }

    getRank() {
        return this.rank;
    }

    setRank(newRank) {
        this.rank = newRank;
    }
}