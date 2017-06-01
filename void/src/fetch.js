"use strict";

function buildRTMRSSUrl(userName, token){
	const RTMURL = "https://www.rememberthemilk.com/atom";
	return (RTMURL + "/" + userName + "/tok=" + token);
}

function fetchRTMRSS(url, callback){
	let req = d3.xml(url)
		.mimeType("application/atom+xml")
		.header("Access-Control-Allow-Origin", "*");
	
	req.get(callback);
}
