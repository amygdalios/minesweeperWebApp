# Minesweeper Web App

A web-based Minesweeper game built as a university project. This project implements the classic Minesweeper game in a browser using modern web technologies.

## Features
- Classic Minesweeper gameplay
- Interactive UI with responsive design
- Left-click to reveal a cell
- Right-click to flag a mine
- Automatically reveals empty adjacent cells
- Timer and mine counter

## Technologies Used
- HTML, CSS, JavaScript

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/amygdalios/minesweeperWebApp.git
   ```
2. Navigate to the project directory:
   ```sh
   cd minesweeperWebApp
   ```
3. Open `index.html` in a web browser or use a local development server:
   ```sh
   python -m http.server 8000  # For Python users
   ```
   Then visit `http://localhost:8000` in your browser.

## How to Play
1. Click on a cell to reveal it.
2. Right-click to flag a suspected mine.
3. Numbers indicate how many mines are adjacent.
4. Win by revealing all non-mine cells.
5. Lose by clicking on a mine!

## Screenshots
![Minesweeper Screenshot](screenshot.png)

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
