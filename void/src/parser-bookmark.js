'use strict';

// parer data from pdf-bookmark.js

function BookmarkParser(jsonData, parentNodeName) {
	// jsonData: [{'title':..., 'subTitles':[...]}, ...]
	let ret = [];

	// for (let i in jsonData){
	// 	let e = jsonData[i];

	// 	ret.push({
	// 		'name': e.title,
	// 		'children': e.subTitles
	// 	});

	return {"name": parentNodeName, "children": jsonData};
}
