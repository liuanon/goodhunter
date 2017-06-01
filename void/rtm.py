# -*- coding: utf-8 -*-
from urllib import request


URL = "https://www.rememberthemilk.com/atom/.......<your url>......."


def download_rtm_rss(url, file_path='rtm-rss.xml'):
	request.urlretrieve(url, file_path)
	return True

if __name__ == '__main__':
	download_rtm_rss(URL)
	print("Finish")
