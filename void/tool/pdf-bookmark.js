'use strict';

// 前提：PDF必须有目录元数据
// 用于 FireFox PDF 网页阅读器
// 导出 json 格式目录
// 命令行中粘贴代码, 运行 copy(getFirefoxBookmark())
// 在文本编辑器中粘贴结果, 保存

function getFirefoxBookmark(){
	var outline = PDFViewerApplication.pdfOutlineViewer.outline;

	function getSubItemsTitle(items){
		var _ret = [];
		for (var _i in items){
			_ret.push(getItemTitle(items[_i]));
		}
		return _ret;
	}

	function getItemTitle(item){
		var subTitles = [];
		if(item.hasOwnProperty('items')){
			subTitles = getSubItemsTitle(item.items);
		}
		return {'name': item.title, 'children': subTitles};
	}

	var ret = [];
	for (var i in outline){
		ret.push(getItemTitle(outline[i]));
	}
	return ret;
}
