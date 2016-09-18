(function(){
	var view = {
		makeGrid: function(){
			var cInfo = document.getElementById('tbl');

			//throw error if table is not found
			if (!cInfo){
				console.error('There is no table element!');
				return;
			}

			var rows = 25;
			var cols = 25;
			var tableString= "";

			for (var i=1; i<=rows; i++){
				// var trow = document.createElement('tr');
				tableString+= "<tr>";
				for (var k=1; k<=cols; k++){
					// var tcol = document.createElement('td');
					tableString+= "<td id= '" + i + "_"+ k + "' class= 'dead'></td>";
					// tcol.setAttribute('id', i +'_' + k);
					// tcol.setAttribute('class', 'dead');
					// trow.appendChild(tcol);
				}
				// cInfo.appendChild(trow);
				tableString+= "</tr>";
			}
			cInfo.innerHTML= tableString;
		}
	}

	view.makeGrid();
})();