class Unit {
    constructor(x, y, isPlayer) {
        this.x = x;
        this.y = y;
        this.type = null;
        this.img = null;
        this.isPlayer = isPlayer;
        if (this.isPlayer) {
            this.color = "blue";
        }
        else {
            this.color = "red";
        }

        this.cost = 250;
        this.maxSquadSize = 100;
        this.squadSize = 100;
        this.frontLine = 25;
        this.isAlive = true;

        this.blockRate = 0.75;
        this.attackRate = 2;
        this.attackRange = [1, 1];
        this.nonLethalRate = 0.1;
        this.forcedLethalRate = 0.0;
        this.movement = 1;
        this.charge = 0;
        this.chargeRate = 1;
        this.maxCharge = 0;
    }

    findTarget(enemyUnits) {
        let target = [];
        for (let i = 0; i < enemyUnits.length; i++) {
            let distance = Math.abs(this.x - enemyUnits[i].x) + Math.abs(this.y - enemyUnits[i].y);
            if (distance <= this.attackRange[1] && distance >= this.attackRange[0]) {
                target.push(enemyUnits[i]);
            }
        }
        return target;
    }

    attack(target, playerUnits, curCharge) {
        let damages = 0;
        for (let i = 0; i < Math.min(this.frontLine, this.squadSize); i++) {
            for (let j = 0; j < this.attackRate; j++) {
                let effectiveBlockRate = target.blockRate;
                effectiveBlockRate /= target.isSurrounded(playerUnits)
                effectiveBlockRate -= this.forcedLethalRate
                if (Math.random() > effectiveBlockRate) {
                    if (Math.random() > this.nonLethalRate) {
                        damages += 1;
                    }
                }
            }
        }
        target.squadSize -= damages + curCharge;
        this.charge = 0

        if (target.squadSize <= 0) {
            target.isAlive = false;
        }
    }

    isSurrounded(playerUnits) {
        let numSurrounded = 0
        for (let i = 0; i < playerUnits.length; i++) {
            if (Math.abs(this.x - playerUnits[i].x) + Math.abs(this.y - playerUnits[i].y) <= 1) {
                numSurrounded += 1
            }
        }
        if (numSurrounded === 0) {
            numSurrounded = 1
        }
        else if (numSurrounded === 1) {
            numSurrounded = 3
        }
        else if (numSurrounded === 2) {
            numSurrounded = 6
        }
        else if (numSurrounded === 3) {
            numSurrounded = 12

        }
        return numSurrounded
    }

    move(x, y) {
        let curCharge = this.charge + Math.abs(this.x - x) + Math.abs(this.y - y) * this.chargeRate
        if (curCharge > this.maxCharge) {
            curCharge = this.maxCharge;
        }

        this.x = x
        this.y = y
        return curCharge
    }
}

class Infantry extends Unit {
    constructor(x, y, isPlayer) {
        super(x, y, isPlayer);
        this.type = "infantry";
        this.cost = 1500;
        this.maxSquadSize = 1000;
        this.squadSize = 1000;
        this.frontLine = 250;

        this.blockRate = 0.6;
        this.attackRate = 2;
        this.attackRange = [1, 1];
        this.nonLethalRate = 0.2;
        this.forcedLethalRate = 0.0;
        this.movement = 2;
        this.charge = 0;
        this.chargeRate = 5;
        this.maxCharge = 100;
    }
}

class Cavalry extends Unit {
    constructor(x, y, isPlayer) {
        super(x, y, isPlayer);
        this.type = "cavalry";
        this.cost = 2000;
        this.maxSquadSize = 400;
        this.squadSize = 400;
        this.frontLine = 200;
        this.isAlive = true;

        this.blockRate = 0.3;
        this.attackRate = 2;
        this.attackRange = [1, 1];
        this.nonLethalRate = 0.25;
        this.movement = 4;
        this.charge = 25;
        this.chargeRate = 50;
        this.maxCharge = 200;
    }
}

class Archer extends Unit {
    constructor(x, y, isPlayer) {
        super(x, y, isPlayer);
        this.type = "archer";
        this.cost = 1000;
        this.maxSquadSize = 500;
        this.squadSize = 500;
        this.frontLine = 500;

        this.blockRate = 0.15;
        this.attackRate = 1;
        this.attackRange = [2, 4];
        this.nonLethalRate = 0.5;
        this.movement = 2;
        this.charge = 0;
        this.chargeRate = 0;
    }
}

class Siege extends Unit {
    constructor(x, y, isPlayer) {
        super(x, y, isPlayer);
        this.type = "siege";
        this.cost = 1500;
        this.maxSquadSize = 300;
        this.squadSize = 300;
        this.frontLine = 300;

        this.blockRate = 0;
        this.attackRate = 1;
        this.attackRange = [3, 10];
        this.nonLethalRate = 0.1;
        this.forcedLethalRate = 0.2;
        this.movement = 1;
        this.charge = 0;
        this.chargeRate = 0;
    }
}

// Elite Classes
class Legion extends Infantry {
    constructor(x, y, isPlayer) {
        super(x, y, isPlayer);
        this.type = "legion";
        this.cost = 2500;
        this.maxSquadSize = 1000;
        this.squadSize = 1000;
        this.frontLine = 300;

        this.blockRate = 0.8;
        this.attackRate = 2;
        this.attackRange = [1, 1];
        this.nonLethalRate = 0.1;
        this.forcedLethalRate = 0.15;
        this.movement = 2;
        this.charge = 0;
        this.chargeRate = 25;
        this.maxCharge = 250;
    }
}

class Armored extends Infantry {
    constructor(x, y, isPlayer) {
        super(x, y, isPlayer);
        this.type = "armored";
        this.cost = 3000;
        this.maxSquadSize = 500;
        this.squadSize = 500;
        this.frontLine = 300;

        this.blockRate = 1.5;
        this.attackRate = 1;
        this.attackRange = [1, 1];
        this.nonLethalRate = 0.1;
        this.forcedLethalRate = 0.0;
        this.movement = 1;
        this.charge = 0;
        this.chargeRate = 0;
    }
}

class Knight extends Cavalry {
    constructor(x, y, isPlayer) {
        super(x, y, isPlayer);
        this.type = "knight";
        this.cost = 3000;
        this.maxSquadSize = 500;
        this.squadSize = 500;
        this.frontLine = 300;

        this.blockRate = 0.4;
        this.attackRate = 2;
        this.attackRange = [1, 1];
        this.nonLethalRate = 0.15;
        this.movement = 4;
        this.charge = 50;
        this.chargeRate = 100;
        this.maxCharge = 400;
    }
}

class elephant extends Cavalry {
    constructor(x, y, isPlayer) {
        super(x, y, isPlayer);
        this.type = "elephant";
        this.cost = 3000;
        this.maxSquadSize = 100;
        this.squadSize = 100;
        this.frontLine = 50;

        this.blockRate = 0.1;
        this.attackRate = 1;
        this.attackRange = [1, 1];
        this.nonLethalRate = 0.1;
        this.movement = 3;
        this.charge = 0;
        this.chargeRate = 200;
        this.maxCharge = 400;
    }
}

class Crossbow extends Archer {
    constructor(x, y, isPlayer) {
        super(x, y, isPlayer);
        this.type = "crossbow";
        this.cost = 2000;
        this.maxSquadSize = 500;
        this.squadSize = 500;
        this.frontLine = 500;

        this.blockRate = 0.1;
        this.attackRate = 1;
        this.attackRange = [2, 5];
        this.nonLethalRate = 0.2;
        this.movement = 2;
        this.charge = 0;
        this.chargeRate = 0;
    }
}