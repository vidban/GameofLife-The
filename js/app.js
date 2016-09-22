var model = {

	initializeGridSize: function(rows,cols){
		this.rows = rows;
		this.cols = cols;
		this.grid1 =  new Array(rows);
		this.grid2 =  new Array(rows);
		this.initializeGrid();
	},
	
	
	// initializes 2 grid arrays for game play
	initializeGrid: function(){
		for (var i=0; i<this.rows; i++){
			this.grid1[i] = new Array(this.cols);
			this.grid2[i] = new Array(this.cols);
		}

		for (var k =0; k<this.rows; k++){
			for (var i=0; i<this.cols; i++){
				this.grid1[k][i] = 0;
				this.grid2[k][i] = 0;
			}
		}
	},

	// resets both the grids at beginning of game play
	resetGrid: function(){
		for (var k =0; k<this.rows; k++){
			for (var i=0; i<this.cols; i++){
				this.grid1[k][i] = 0;
				var cellId = k+ "_" + i;
				view.updateView(this.grid1[k][i], cellId);
			}
		}
	},

	// to manually change cell to live or dead
	manuallyChangeState: function(row, col, cName){
		if (cName == 'dead'){
			this.grid1[row][col] = 0;
		}else {
			this.grid1[row][col] = 1;
		}
	},

	
	//starts game
	startGame: function() {

		for (var i=0; i<this.rows; i++){
			for (var j = 0; j<this.cols; j++){
				console.log('game started');
				this.applyRules(i,j);
			}
		}
		//copyAndResetGrid;
		for (var i=0; i<this.rows; i++){
			for (var j = 0; j<this.cols; j++){
				this.grid1[i][j] = this.grid2[i][j];
				this.grid2[i][j] = 0;
			}
		}

		//stop game if grid is empty
		var c=0;
		for (var i=0; i<this.rows; i++){
			for (var j = 0; j<this.cols; j++){
				if (this.grid1[i][j] == 0){
					c++;
				}
			}
		}

		if (c == this.rows*this.cols){
			clearTimeout(this.timer);
			controller.clearButtonHandler();
			return;
		}


		//update view
		for (var i=0; i<this.rows; i++){
			for (var j = 0; j<this.cols; j++){
				var cellId = i+ "_" + j;
				view.updateView(this.grid1[i][j], cellId);
				
			}
		}																																	
	


		this.timer = setTimeout((this.startGame).bind(this), 100);

	},

	pauseGame: function(){
		clearTimeout(this.timer);
	},


	// RULES
	// Any live cell with fewer than two live neighbours dies, as if caused by under-population.
	// Any live cell with two or three live neighbours lives on to the next generation.
	// Any live cell with more than three live neighbours dies, as if by overcrowding.
	// Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
	applyRules: function(row,col) {
		var numNeighbors = this.countNeighbors(row,col);
		 if (this.grid1[row][col] == 1) {
	        if (numNeighbors < 2) {
	            this.grid2[row][col] = 0;
	        } else if (numNeighbors == 2 || numNeighbors == 3) {
	            this.grid2[row][col] = 1;																							

	        } else if (numNeighbors > 3) {
	            this.grid2[row][col] = 0;
	        }
	    } else if (this.grid1[row][col] == 0) {
	        if (numNeighbors == 3) {
	            this.grid2[row][col] = 1;
	        }
	    }

	},

	// count the neighbors of the cell that are alive
	countNeighbors: function(row,col){
		var count = 0;
		if (row-1 >= 0){
			if (this.grid1[row-1][col] == 1) count++;
		}
		if (row-1>= 0 && col-1 >= 0){
			if (this.grid1[row-1][col-1] == 1) count++;
		}
		if (row-1 >= 0 && col+1 < this.cols) {
	        if (this.grid1[row-1][col+1] == 1) count++;
	    }
	    if (col-1 >= 0) {
	        if (this.grid1[row][col-1] == 1) count++;
	    }
	    if (col+1 < this.cols) {
	        if (this.grid1[row][col+1] == 1) count++;
	    }
	    if (row+1 < this.rows) {
	        if (this.grid1[row+1][col] == 1) count++;
	    }
	    if (row+1 < this.rows && col-1 >= 0) {
	        if (this.grid1[row+1][col-1] == 1) count++;
	    }
	    if (row+1 < this.rows && col+1 < this.cols) {
	        if (this.grid1[row+1][col+1] == 1) count++;
	    }
	    return count;

	},

	randomPattern: function(){
		var r;
		var cellID;
		for (var i=0; i<this.rows; i++){
			for (var j=0; j<this.cols; j++){
				r = Math.floor(Math.random()*2);
				cellId = i+ "_" + j;
				this.grid1[i][j] = r;
				view.updateView(r, cellId);
			}
		}
	}



};		

var controller = {

	// controls state of game play based on start button click
	startButtonHandler: function(self){
		var timer;
		var whatItSays = self.innerHTML;
		if (whatItSays == 'Start'){
			self.innerHTML = 'Pause';
			model.startGame();
		} else if (whatItSays == 'Pause') {
			self.innerHTML = 'Continue';
			model.pauseGame();
		} else {
			self.innerHTML = 'Pause';
			model.startGame();
		}

	},

	//Starts a new game
	newGame: function(){
		view.drawGrid();
	},

	//clears and initializes a new  grid on pressing the clear button
	clearButtonHandler: function(){
		model.resetGrid();
		document.getElementById('start').innerHTML = 'Start Again?';

	},

	generateRandomPattern: function() {
		model.randomPattern();
	}

};

var view = {

	// draws the grid on screen
	drawGrid: function(){
		var cInfo = document.getElementById('tbl');
		this.playing = false;

		//throw error if table is not found
		if (!cInfo){
			console.error('There is no table element!');
			return;
		}

		var rows = 30;
		var cols = 30;
		model.initializeGridSize(rows,cols);

		var tableString= "";

		for (var i=0; i<rows; i++){
			// var trow = document.createElement('tr');
			tableString+= "<tr>";
			for (var k=0; k<cols; k++){
				// var tcol = document.createElement('td');
				tableString+= "<td id= '" + i + "_"+ k + "' class= 'dead' onclick='view.cellClicked(this)'></td>";
				// tcol.setAttribute('id', i +'_' + k);
				// tcol.setAttribute('class', 'dead');
				// trow.appendChild(tcol);
			}
			// cInfo.appendChild(trow);
			tableString+= "</tr>";
		}
		
		cInfo.innerHTML= tableString;
	},

	// controls manual cell clicks																							

	cellClicked: function(self){
		var rowcol = self.id.split("_");
		var row = rowcol[0];
		var col = rowcol[1];

		$(self).toggleClass('dead alive');
		var cName = self.className;
		
		model.manuallyChangeState(row,col,cName);
	},

	updateView: function(cell, cellId) {
		if (cell == 1) {
			document.getElementById(cellId).className = 'alive';
		} else {
			document.getElementById(cellId).className = 'dead';
		}
	}


};

controller.newGame();
