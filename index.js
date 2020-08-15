//Sets global variables no actually values are set
let cdx, ctx;
let width, height;
let board;
let turn;
let win, winColor;

//when the page fully loads main is called
function main() {
	//creates a variable for the canvas and gets it ready to be drawable
	cdx = document.getElementById("screen");
	ctx = cdx.getContext("2d");

	//creates event listeners for resizing the window and when you click or move on the canvas
	window.addEventListener("resize", resizeWindow);
	cdx.addEventListener("click", screenClicked);
	cdx.addEventListener("mousemove", screenMove);

	//creates variables for the width and height of the window
	width = window.innerWidth;
	height = window.innerHeight;

	//changes the size of the canvas to the full size off the window
	cdx.width = width;
	cdx.height = height;

	//sets board to new board object and calls the changeSize method
	board = new Board();
	board.changeSize();

	//sets turn to true (true is yellow)
	turn = true;

	//sets the win value to false to say there are no winners yet
	win = false;

	//sets the winColor to a default false (true is yellow)
	winColor = false;

	//draws the current state of the board
	draw();
}

//draw function draws everything on the screen
function draw() {
	//fills background to be navy
	if (win) {
		if (winColor) {
			ctx.fillStyle = board.colors[2];
		} else {
			ctx.fillStyle = board.colors[3];
		}
	} else {
		ctx.fillStyle = "navy";
	}

	ctx.fillRect(0, 0, width, height);

	//calls the board draw method
	board.draw();
}

//function to change it to the next turn
function nextTurn() {
	if (turn) {
		turn = false;
	} else {
		turn = true;
	}

	//at the end of each turn it will check if there is a winning set of four
	checkWin();

	//draw the new state of the board
	draw();
}

//when the window is resized it will call this function
function resizeWindow() {
	//resets default sizes
	width = window.innerWidth;
	height = window.innerHeight;
	cdx.width = width;
	cdx.height = height;

	//calls the board changeSize method
	board.changeSize();

	//draws new sized board
	draw();
}

//when the mouse is moved on the screen this function is called with the move event as a parameter
function screenMove(event) {
	//gets the mouse's x and y coords
	let mouseX = event.x;
	let mouseY = event.y;

	//checks to see if the mouse cursor is on the board
	if (mouseX > board.Hoffset && mouseX < board.Hoffset + board.size) {
		if (mouseY > board.Voffset && mouseY < board.Voffset + board.size) {
			//then uses math to see which column it is over
			let handPos = Math.floor((mouseX - board.Hoffset) / (board.size / 7));

			//sets the boards hand to that value
			board.hand = handPos;
		}
	}

	//draws new state of board
	draw();
}

//when the screen is clicked it will call this function with the click event as a parameter
function screenClicked(event) {
	//calls the board addChip method
	board.addChip();
}

//this function checks if there is four in a row
function checkWin() {
	//if there is no winner yet it will check if there are four in a row
	if (!win) {
		//it gets the max bounds on the board
		let xMax = board.chips.length;
		let yMax = board.chips[0].length;

		//it will loop through every chip to check if there is a winner
		for (let xVal = 0; xVal < board.chips.length; xVal++) {
			for (let yVal = 0; yVal < board.chips[0].length; yVal++) {
				//it will then check every possible way the four could be in a row

				//   0+++
				//it checks the edge cases
				if (xVal + 1 < xMax && xVal + 2 < xMax && xVal + 3 < xMax) {
					//then set the chip values up to be sent into the checkChipWin function
					let chipA = board.chips[xVal][yVal];
					let chipB = board.chips[xVal + 1][yVal];
					let chipC = board.chips[xVal + 2][yVal];
					let chipD = board.chips[xVal + 3][yVal];

					//calls the checkChipWin function with the four valid chips
					checkChipsWin(chipA, chipB, chipC, chipD);
				}

				//    0
				//    +
				//    +
				//    +
				if (yVal + 1 < yMax && yVal + 2 < yMax && yVal + 3 < yMax) {
					let chipA = board.chips[xVal][yVal];
					let chipB = board.chips[xVal][yVal + 1];
					let chipC = board.chips[xVal][yVal + 2];
					let chipD = board.chips[xVal][yVal + 3];

					checkChipsWin(chipA, chipB, chipC, chipD);
				}

				//  0
				//   +
				//    +
				//     +
				if (yVal + 1 < yMax && yVal + 2 < yMax && yVal + 3 < yMax && xVal + 1 < xMax && xVal + 2 < xMax && xVal + 3 < xMax) {
					let chipA = board.chips[xVal][yVal];
					let chipB = board.chips[xVal + 1][yVal + 1];
					let chipC = board.chips[xVal + 2][yVal + 2];
					let chipD = board.chips[xVal + 3][yVal + 3];

					checkChipsWin(chipA, chipB, chipC, chipD);
				}

				//     0
				//    +
				//   +
				//  +
				if (yVal + 1 < yMax && yVal + 2 < yMax && yVal + 3 < yMax && xVal - 1 >= 0 && xVal - 2 >= 0 && xVal - 3 >= 0) {
					let chipA = board.chips[xVal][yVal];
					let chipB = board.chips[xVal - 1][yVal + 1];
					let chipC = board.chips[xVal - 2][yVal + 2];
					let chipD = board.chips[xVal - 3][yVal + 3];

					checkChipsWin(chipA, chipB, chipC, chipD);
				}
			}
		}
	}
}

//this function takes the four chips in and checks to see if they are all the same color and they all exist
function checkChipsWin(chipA, chipB, chipC, chipD) {
	//it checks if they are all existing chips
	if (chipA.chip && chipB.chip && chipC.chip && chipD.chip) {
		//it then stores the color of the first chip to be used later
		let chipAColor = chipA.color;

		//it then checks if the other three chips are the same color as the first
		if (chipB.color == chipAColor && chipC.color == chipAColor && chipD.color == chipAColor) {
			//if they are all the same color and existing it will change win to true
			win = true;

			//it will then set the winColor to the chipA color property
			winColor = chipAColor;
		}
	}
}

//this set of stuff allows us to listen to which keys on the keyboard are being pressed and logs in in the map array as boolean values
let map = [];
onkeydown = onkeyup = function (e) {
	e = e || event;
	map[e.keyCode] = e.type == "keydown";

	//if the space bar is pressed it will clear the board
	if (map[32]) {
		//a new board object is created (kinda a cheaty way of doing that)
		board = new Board();
		board.changeSize();

		//it will reset the win value to false
		win = false;

		//draws new board
		draw();
	}

	//when the left arrow is pressed and the hand is greater than 0 it will move the hand left
	if (map[37] && board.hand > 0) {
		//subtracting a value from the board hand is equivalent to moving it left
		board.hand--;

		//draws new board
		draw();
	}

	//when the right arrow is pressed and the hand is less than 6 it will move the hand right
	if (map[39] && board.hand < 6) {
		//adding values to the board hand will make it move right
		board.hand++;

		//draws new state
		draw();
	}

	//when the down arrow is pressed it will call the addChip method
	if (map[40]) {
		board.addChip();
	}
};

//this is a custom Board object and is where the bulk of the code is
class Board {
	constructor() {
		//these are the default values for the boards position and size on the screen
		this.size = 0;
		this.Voffset = 0;
		this.Hoffset = 0;

		//this is array to hold all the chips on the board
		this.chips = [];

		//this property holds the value of where the hand is
		this.hand = 3;

		//these are the colors used on the board
		this.colors = ["blue", "aliceblue", "#ffff1a", "#ff4d4d", "royalblue"];

		//when the board is created it will set up a 2d array for the chips and will give them a default value
		for (let xVal = 0; xVal < 7; xVal++) {
			//this makes it a 2d array
			this.chips[xVal] = [];
			for (let yVal = 0; yVal < 6; yVal++) {
				//this sets the default value to a custom object that has no chip in the space and a color of yellow (true is yellow)
				this.chips[xVal][yVal] = { chip: false, color: true };
			}
		}

		//this will adjust the size values of the board when called
		this.changeSize = function () {
			//this will check which dimension of the board is smaller and will center the board on the larger of the two values
			if (width > height) {
				//if the height is smaller than the width it will create a square based on that height
				this.size = height;

				//it will the find the correct offsets to center it in the middle of the screen
				this.Hoffset = width / 2 - height / 2;
			} else if (width < height) {
				this.size = width;
				this.Voffset = height / 2 - width / 2;
			} else {
				//if it is a square no offset is necessary and the default value of zero will remain unchanged
				this.size = width;
			}
		};

		//this will add a chip to the board if its able to
		this.addChip = function () {
			//this lets us know if a chip has been added
			let chipAdded = false;

			//it will loop through the y values to see where the lowest spot it can place a chip
			//(0, 0) in the 2d array is the top left corner
			for (let yVal = this.chips[0].length - 1; yVal >= 0; yVal--) {
				//if the spot has no chip and no chip has been added it will add a chip
				if (!this.chips[this.hand][yVal].chip && !chipAdded) {
					//it will set the chip to true saying that there is a chip there now
					this.chips[this.hand][yVal].chip = true;

					//it will set that chips color to the color of the turn
					this.chips[this.hand][yVal].color = turn;

					//it will the change chipAdded to true when a chip is added
					chipAdded = true;
				}
			}

			//if a chip has been added it will go to the next turn
			if (chipAdded) {
				nextTurn();
			}
		};

		//this method will draw the board and the chips in it
		this.draw = function () {
			//this will color the background of the board to the first color in the colors array
			ctx.fillStyle = this.colors[0];
			ctx.fillRect(this.Hoffset, this.Voffset, this.size, this.size);

			//depending on the turn it will change the color of the hand accordingly
			if (turn) {
				ctx.fillStyle = this.colors[2];
			} else {
				ctx.fillStyle = this.colors[3];
			}
			//this draw the hand rectangle
			ctx.fillRect(this.Hoffset + this.hand * (this.size / 7) + this.size / 100, this.Voffset + this.size / 30, this.size / 8, this.size / 20);

			//this will loop through every chip to draw them
			for (let xVal = 0; xVal < this.chips.length; xVal++) {
				for (let yVal = 0; yVal < this.chips[0].length; yVal++) {
					//this math will figure out the center of each chips location
					let xCenter = this.Hoffset + xVal * (this.size / 7);
					let yCenter = this.Voffset + (yVal + 0.75) * (this.size / 7); //it raises it up slightly to make it look better (0.75 should be a 1)

					//this sets the radius of the chip
					let radius = this.size / 14;

					//if there is a chip it will color it based on its color property otherwise it will make the space look blank
					if (this.chips[xVal][yVal].chip) {
						if (this.chips[xVal][yVal].color) {
							ctx.fillStyle = this.colors[2];
						} else {
							ctx.fillStyle = this.colors[3];
						}
					} else {
						ctx.fillStyle = this.colors[1];
					}

					//the stroke on each space is the same
					ctx.strokeStyle = this.colors[4];

					//sets the line with to be defined by the size so when the window is made small it doesn't look funny
					ctx.lineWidth = this.size / 120;

					//draws a circle for each chip
					ctx.beginPath();
					ctx.arc(xCenter + radius, yCenter + radius, radius * 0.9, 0, 2 * Math.PI); //a little margin is added (0.9 should not be there)
					ctx.fill();
					ctx.stroke();
				}
			}
		};
	}
}
