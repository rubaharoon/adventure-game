#!/usr/bin/env node
import inquirer from "inquirer";
import chalk from "chalk";

console.log(chalk.bold.rgb(255, 0, 0)(`\n \t\t <<<==================>>>`));
console.log(chalk.bold.rgb(255, 0, 0)(`<<<===========>>> ${chalk.bold.hex(`#00FFFF`)(`Welcome to Adventure Game!`)} <<<===========>>>`));
console.log(chalk.bold.rgb(255, 0, 0)(`\t\t <<<==================>>>\n`));

class Hero {
    name: string;
    health: number;
    energy_drinks: number;

    constructor(name: string) {
        this.name = name;
        this.health = 100;
        this.energy_drinks = 3;
    }

    attack() {
        return Math.floor(Math.random() * 15);
    }

    drinkEnergyDrink() {
        const increaseHealth = 30;
        this.energy_drinks -= 1;
        this.health += increaseHealth;
        console.log(`Your Health increased: +${chalk.bold.green(increaseHealth)}. Total Health: ${chalk.bold.yellow(this.health)}`);
        console.log(`Remaining Energy Drinks: ${chalk.yellow.bold(this.energy_drinks)}`);
    }

    decreaseHealth(attackPower: number) {
        this.health -= attackPower;
        return this.health;
    }
}

class Enemy {
    name: string;
    health: number;

    constructor(name: string) {
        this.name = name;
        this.health = 0;
    }

    setHealthBasedOnType() {
        if (this.name === "Zombie") {
            this.health = 50;
        } else if (this.name === "Dragon") {
            this.health = 70;
        } else if (this.name === "Monster") {
            this.health = 100;
        }
    }

    attack() {
        return Math.floor(Math.random() * 15);
    }

    decreaseHealth(attackPower: number) {
        this.health -= attackPower;
        return this.health;
    }

    showHealth(heroName: string, heroHealth: number, enemyHealth: number) {
        console.log(`${chalk.blue.bold(heroName)} Health: ${chalk.yellow.bold(heroHealth)} | ${chalk.red.bold(this.name)} Health: ${chalk.yellow.bold(enemyHealth)} \n`);

    }
}

async function main() {
    const heroResponse = await inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: chalk.bold.magentaBright("Select your Hero Name:"),
        }
    ]);

    const heroName = new Hero(heroResponse.name);

    const enemyResponse = await inquirer.prompt([
        {
            name: "name",
            type: "list",
            message: chalk.bold.blueBright("Select the enemy you want to fight with:"),
            choices: ["Zombie", "Dragon", "Monster"],
        }
    ]);

    const enemyName = new Enemy(enemyResponse.name);
    enemyName.setHealthBasedOnType();

    console.log(chalk.bold(`\t ${heroName.name} v/s ${enemyName.name}`));
    enemyName.showHealth(heroName.name, heroName.health, enemyName.health);

    while (true) {
        const choice = await inquirer.prompt([
            {
                name: "action",
                type: "list",
                message: chalk.bold.cyanBright("What do you want to do?"),
                choices: ["Attack", "Energy Drink", "Run"],
            }
        ]);

        if (choice.action === "Attack") {
            const playerAttack = heroName.attack();
            const enemyAttack = enemyName.attack();
            enemyName.health = enemyName.decreaseHealth(playerAttack);
            heroName.health = heroName.decreaseHealth(enemyAttack);
            console.log(`${heroName.name} Attack: ${chalk.bold.green(playerAttack)} | ${enemyName.name} Attack: ${chalk.bold.redBright(enemyAttack)}`);
            
            if (enemyName.health > 0 && heroName.health > 0) {
                enemyName.showHealth(heroName.name, heroName.health, enemyName.health);
            }
        }

        if (choice.action === "Energy Drink") {
            console.log(`Energy Drink will boost Health: ${chalk.bold.green("+30")} \nRemaining Energy Drinks: ${chalk.bold.yellow(heroName.energy_drinks)}`);
            const ask = await inquirer.prompt([
                {
                    name: "drink",
                    type: "confirm",
                    message: chalk.bold.red("Do you want to use Energy Drink?"),
                    choices: ["Yes", "No"],
                }
            ]);
            if (ask.drink) {
                heroName.drinkEnergyDrink();
            }
        }

        if (choice.action === "Run") {
            console.log(`${chalk.bold.blue(heroName.name)} ${chalk.bold.red("ran away")}`);
            break;
        }

        if (enemyName.health <= 0) {
            console.log(`\t ${chalk.bold.blue(heroName.name)} ${chalk.greenBright.bold("Wins!")} \n\nYour health is: ${chalk.bold.green(heroName.health)} and ${enemyName.name} health is: ${chalk.bold.red(0)}`);
            console.log(`\tYou Killed ${chalk.red(enemyName.name)}`);
            break;
        }

        if (heroName.health <= 0) {
            console.log(`You loose. ${chalk.bold.red(enemyName.name)} ${chalk.bold.blueBright("Wins!")}`);
            console.log(`Your health is: ${chalk.bold.red(0)} and ${enemyName.name} health is: ${chalk.bold.green(enemyName.health)}`);
            break;
        }
    }
}

main();

    
