'use strick';

const RTM_RSS_NULL = "无";


function RTMRSSParser(xmlData){
	// updated; name(title); size(estimate); tags; cls(priority); parent(list); id
	let nodeNameKey = "title";
	let parentNameKey = "列表";

	let rootNodeName = "TODO";

	let entryList = xmlData.documentElement.getElementsByTagName("entry");
	
	let existList = [];
	let ret = [];

	// leaves node
	for (let i in entryList){
		let e = entryList[i];
		if (typeof e != "object"){
			continue;
		}
		let _id = e.getElementsByTagName("id")[0].textContent;
		
		// estimate
		let _size = e.getElementsByClassName("rtm_time_estimate_value")[0].textContent;
		_size = _size == RTM_RSS_NULL ? null : _size;

		// tags 
		let _tags = e.getElementsByClassName("rtm_tags_value")[0].textContent;
		_tags = _tags == RTM_RSS_NULL ? null : _tags;

		// list
		let _list = e.getElementsByClassName("rtm_list_value")[0].textContent;
		if (existList.indexOf(_list) == -1){
			existList.push(_list);
		}

		// title
		let _title = e.getElementsByTagName("title")[0].textContent;
		if (existList.indexOf(_title) > -1){
			_title = "_" + _title + "_";
		}

		ret.push({			
			"name": _title,
			"parent": _list,	
			"params": {
				// "num": i,
				"updated": e.getElementsByTagName("updated")[0].textContent,
				"size": _size,
				"tags": _tags,
				"cls": e.getElementsByClassName("rtm_priority_value")[0].textContent,
			},
		});
	}

	// list node
	for(let i in existList){
		let e = existList[i];
		ret.push({
			"name": e,
			"parent": rootNodeName,
		})
	}

	// root node
	ret.push({
		"name": rootNodeName,
		"parent": null,
	})

	return ret;	
}
