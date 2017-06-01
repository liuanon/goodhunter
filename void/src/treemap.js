'use strict';

function getNodeSize(d){
	let match = d.id.match(/size=P?T?(.+?)&/);
	let ret = null;
	if (match != null){
		ret = match[1];
	}
	ret = ret == "null" ? null : ret;
	return ret;
}


function getNodeCls(d){
	let match = d.id.match(/cls=(\d)&?/);
	let ret = null;
	if (match != null){
		ret = match[1];
	}
	return ret;
}


function getNodeTitle(d){
	let lastIndex = d.id.lastIndexOf("###");
	lastIndex = lastIndex == -1 ? d.id.length : lastIndex;

 	// return d.parent.id + "->" + d.id.substring(0, lastIndex); 
 	return d.id.substring(0,lastIndex);
}


function sumByNodeCls(d){
	let params = d.params || {};
	let ret = params.cls || 3;
	ret = Math.abs(ret - 3);

	return ret;
}


function sumByNodeEstimate(d){
	// can NOT handle data larger hour
	let params = d.params || {};
	let estimate = params.size || "0";
	// estimate.replace("pt", "");
	
	// default = 45 Mins
	let ret = 45;
	if (estimate.search("M") != -1){
		ret = Number(estimate.match(/(\d+)/)[1]);
	}
	else if(estimate.search("H") != -1){
		ret = Number(estimate.match(/(\d+)/)[1]) * 60;
	}
	return ret;
}


function TreeMap(option) {
	// option: w, h
	this.selectionId = "chart-treemap";

	let width = option.w;
	let height = option.h;

	let idParser = function(d){
		let ret = d.name;
		if (d.params != null){
			ret = ret + "###";
			for (let i in d.params){
				ret = ret + "&" + i + "=" + d.params[i];
			}
		}
		return ret;
	}

	let stratify = d3.stratify()
		.parentId(function(d) { return d.parent; })
		.id(idParser);

	// let g = svg.append("g")
		// .attr("id", this.selectionId);
	// this.g = g;
	this.stratify = stratify;

	let fader = function(color) { return d3.interpolateRgb(color, "#fff")(0.6); };
    let color = d3.scaleOrdinal(d3.schemeCategory20.map(fader));

	let treemap = d3.treemap()
    	// .tile(d3.treemapResquarify)
	    .size([width, height])
	    .round(true)
	    .padding(1);

	this.setData = function(jsonData){
		let _root = stratify(jsonData)
			.sum(sumByNodeEstimate)
			.sort(function(a, b) { return b.height - a.height || b.value - a.value; });
		treemap(_root);

	 	let node = d3.select(".main-chart")
	 		.selectAll(".node")
	 		.data(_root.leaves())
		    .enter()
		    .append("div")
		    .attr("class", function(d){ return "node" + " cls-" + getNodeCls(d); })
			.style("left", function(d) { return d.x0 + "px"; })
			.style("top", function(d) { return d.y0 + "px"; })
			.style("width", function(d) { return d.x1 - d.x0 + "px"; })
			.style("height", function(d) { return d.y1 - d.y0 + "px"; })
			.style("background", function(d) { return color(d.parent.id); });
	      	// .attr("transform", function(d) { return "translate(" + d.x0 + "," + d.y0 + ")"; });

		// node.append("rect")
		//       .attr("id", getNodeNum)
		//       .attr("width", function(d) { return d.x1 - d.x0; })
		//       .attr("height", function(d) { return d.y1 - d.y0; })
		//       .attr("fill", function(d) { return color(d.parent.id); });

     	node.append("div")
     		// .attr("class",function(d){ return "node-label" + " cls-" + getNodeCls(d); })
     		.attr("class", "node-label")
      		.text(getNodeTitle);

      	node.append("div")
      		.attr("class", "node-parent-label")
      		.text(function(d){ return d.parent.id; });

      	node.append("div")
      		.attr("class", "node-estimate")
      		.text(getNodeSize);
	};
}
