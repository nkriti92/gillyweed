var svgs;
var config = {
    databaseURL: "https://longtextapplication.firebaseio.com/"
  };
firebase.initializeApp(config);
// Get a reference to the database service
var database = firebase.database();
firebase.database().ref().on('value', function(snapshot) {
	//alert(snapshot.val().uniqueID);
	data = snapshot.val();
	  // d3.json(snapshot.val(), function(data) {
	    //console.log(data.uniqueID);
	    //read data from json and convert to array
	    var array = [];
	    var resolutions = [];
	    for (var i =0; i<data.uniqueID; i++) {
	    	if (data["_"+i]) {
	    		array.push(data["_"+i]);
		    	var resolution = ""+data["_"+i].width+"x"+data["_"+i].height;
		    	if (resolutions.indexOf(resolution) == -1) {
		    		resolutions.push(resolution);
		    	}
	    	}
	    }
	    //console.log(array);
	    DrawScreens(resolutions);
	    DrawSwipes(array, resolutions);
	    // svgContainer.attr("width", array[0].width).attr("height", array[0].height);
	// });

	function DrawScreens(resolutions)
	{

		svgs = d3.select("body").select("#screens").selectAll("svg")
			.data(resolutions)
			.enter()
			.append("div")
			.attr("class", "containers");
		svgs.append("h3").text(function(d) {return "Resolution: "+d;});
		svgs.append("svg")
			.attr("id", function(d) {return "R"+d;})
			.attr("width", function(d) {
				// var array = d.split("x");
				// return array[0];
				return ""+350;
			})
			.attr("height", function(d) {
				var array = d.split("x");
				// return array[1];
				var myScale = d3.scaleLinear()
				  .domain([0, parseInt(array[0])])
				  .range([0, 350]);
				return ""+myScale(parseInt(array[1]));
			});
	}
	// var svgContainer = d3.select("body").append("svg")
	// 	.attr("width", 1000)
	// 	.attr("height", 600)
	// 	.style("border", "dashed grey 1px");

	function DrawSwipes(data, resolutions) {
		var object = {};
		for (var i =0; i<resolutions.length; i++) {
			object[resolutions[i]] = [];
		}
		for (var i = 0; i<data.length; i++) {
			object[""+data[i].width+"x"+data[i].height].push(data[i]);
		}
		for (var i=0; i<resolutions.length; i++) {
			DrawSwipe(object[resolutions[i]], resolutions[i]);
		}
	}
	function DrawSwipe(data, resolution) {
		var a = resolution.split("x");
		var myScale = d3.scaleLinear()
				  .domain([0, parseInt(a[0])])
				  .range([0, 350]);
		var lines = d3.select("#R"+resolution).selectAll("polyline")
			.data(data)
			.enter()
			.append("polyline")
			.attr("points", function (d) {
				var pointString = "";
				pointString+=myScale(d.start.x)+','+myScale(d.start.y)+" "
				for (var i = 0; i<d.coordinates.length; i++) {
					pointString+=myScale(d.coordinates[i].x)+','+myScale(d.coordinates[i].y)+" ";
				}
				return pointString;
			})
			.style("stroke", function(d) {
				if (d.hand == "rightThumb") {
					return "green";
				}
				else if (d.hand == "leftThumb") {
					return "red";
				}
				else if (d.hand == "leftIndex") {
					return "blue";
				}
				else {
					return "yellow";
				}
			})
			.style("stroke-width", "1")
			.style("fill", "none");
	}





});
