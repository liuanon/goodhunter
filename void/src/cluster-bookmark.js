'use strict';

function project(x, y) {
  var angle = (x - 90) / 180 * Math.PI, radius = y;
  return [radius * Math.cos(angle), radius * Math.sin(angle)];
}

function Cluster(svg, option) {
	// option : w, h
	// data : name, parent
	this.selectionId = "chart-cluster";
	
	let rx = option.w / 2;
	let ry = option.h / 2;

	let g = svg.append("g")
		.attr("id", this.selectionId)
		.attr("transform", "translate(" + rx + "," + ry + ")");
	
	let cluster = d3.cluster()
		.size([360, ry-120]);

	this.g = g;

	this.setData = function (jsonData){
		let _root = d3.hierarchy(jsonData);
			// .sort(function(a, b) { return (a.height - b.height) || a.id.localeCompare(b.id); });
		cluster(_root);

		let link = g.selectAll(".link")
			.data(_root.descendants().slice(1))
	    	.enter().append("path")
	      	.attr("class", "link")
	      	.attr("d", function(d) {
	        	return "M" + project(d.x, d.y)
		            + "C" + project(d.x, (d.y + d.parent.y) / 2)
		            + " " + project(d.parent.x, (d.y + d.parent.y) / 2)
		            + " " + project(d.parent.x, d.parent.y);
		      });

	  	let node = g.selectAll(".node")
		    .data(_root.descendants())
		    .enter().append("g")
	      	.attr("class", function(d) { 
	      		return "node" + (d.children ? " node--internal" : " node--leaf") + 
	      		" depth-" + d.depth; 
	      	})
	      	.attr("transform", function(d) { return "translate(" + project(d.x, d.y) + ")"; });

	  	node.append("circle")
	      	.attr("r", 2.5);

	  	node.append("text")
	      	.attr("dy", ".31em")
	      	.attr("x", function(d) { return d.x < 180 === !d.children ? 6 : -6; })
    		.style("text-anchor", function(d) { return d.x < 180 === !d.children ? "start" : "end"; })
		    .attr("transform", function(d) { return "rotate(" + (d.x < 180 ? d.x - 90 : d.x + 90) + ")"; })
		    .attr("class", "node")
		    .text(function(d) { return d.data.name; });
			};
}
