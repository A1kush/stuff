# Lightweight Bag System

A production-ready, standalone Inventory/Bag system for HTML5 games. 
Designed to be lightweight, modular, and easily integrated.

## Features

*   **Standalone:** Zero dependencies (other than Google Fonts, which are optional).
*   **Theme:** Futuristic "Glassmorphism" UI with neon accents.
*   **Core Functions:**
    *   **Inventory Grid:** Auto-resizing grid with rarity coloring.
    *   **Equipment System:** 6-slot equipment management (Head, Chest, Legs, Main Hand, Off Hand, Trinket).
    *   **Item Actions:** Equip, Unequip, Use (Consumables), Open (Boxes), Drop.
    *   **Filtering:** Filter by item type (Weapon, Armor, etc.).
    *   **Sorting:** Auto-sort by type and rarity.
*   **Responsive:** Centered modal design.

## How to Use

1.  **Drop into your project:** Copy the `lightweight_bag_system` folder.
2.  **Include the files:**
    ```html
    <link rel="stylesheet" href="css/style.css">
    <!-- ... inside body ... -->
    <script src="js/bag-data.js"></script>
    <script src="js/bag-ui.js"></script>
    <script src="js/main.js"></script>
    ```
3.  **Customize Data:**
    *   Edit `js/bag-data.js` to change `INITIAL_STATE` or `MOCK_ITEMS` to match your game's item structure.
    *   The system expects items to have `id`, `name`, `type`, `rarity`, `icon` (emoji or image URL), and optional `stats`.

## Customization

*   **Styles:** Modify `css/style.css`. The `:root` variables allow quick color changes.
*   **Logic:** `BagData` handles state, `BagUI` handles rendering. They are separated to allow you to swap the UI or Data layer if needed.

## Controls

*   **Open/Close:** Click the button or press **'B'**.
*   **Interactions:** Click items to select, then use buttons in the details panel. Click equipped slots to unequip.
