# NPC and Enemy System

This project provides a robust system for managing NPCs (Non-Playable Characters) and enemies in HTML games. It includes a ranking system that categorizes characters into various ranks, allowing for easy integration into any game.

## Features

- **Entity Management**: Create, update, and remove NPCs and enemies with the `EntityManager`.
- **Ranking System**: Assign and manage ranks for NPCs and enemies, including methods for upgrading and downgrading ranks.
- **Game Integration**: Easily integrate the NPC and enemy system into your existing HTML game with the `GameIntegration` module.
- **Customizable Entities**: Define custom NPCs and enemies with unique properties and behaviors.
- **Sprite Management**: Load and manage sprite assets for visual representation of entities.

## Project Structure

- **src/core**: Contains core functionalities for entity management and game integration.
- **src/entities**: Defines the base `Entity` class and specific classes for `NPC` and `Enemy`.
- **src/ranks**: Manages the ranking system, including configuration and tier definitions.
- **src/catalog**: JSON files that catalog entities and their ranks.
- **src/utils**: Utility functions for sprite loading and data validation.
- **public/sprites/entities**: Directory for sprite images used in the game.
- **examples**: Demonstration HTML files showcasing integration and usage of the system.

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd npc-enemy-system
   ```
3. Install dependencies:
   ```
   npm install
   ```

## Usage

To use the NPC and enemy system in your game, follow these steps:

1. Import the necessary modules from the `src` directory.
2. Initialize the `EntityManager` and `RankSystem`.
3. Create NPCs and enemies using the provided classes.
4. Integrate the system into your game loop using the `GameIntegration` module.

## Examples

Refer to the `examples` directory for integration demos and showcases of various NPCs and enemies.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.