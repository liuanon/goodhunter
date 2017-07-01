# -*- coding: utf-8 -*-
from argparse import ArgumentParser
from path import Path
import json


def get_single_path_file_map(path):
	# child node

	ret = {'name': str(path.name), 'children': []}

	if path.isfile():
		return ret

	list_dir = path.listdir()
	if len(list_dir) == 0:
		return ret

	for i in list_dir:
		ret['children'].append(get_single_path_file_map(i))

	return ret


def get_file_map(path):
	# ret = [{'name': ..., 'children': [...]}, ...]
	# root node

	ret = []
	p = Path(path)
	if not p.exists() or p.isfile(): return False

	list_dir = p.listdir()
	for i in list_dir:
		ret.append(get_single_path_file_map(i))

	return {'name': str(p.name), 'children': ret}


def save_to_json(ret, output_path):
	with open(output_path, 'w') as fp:
		json.dump(ret, fp)


if __name__ == '__main__':
	parser = ArgumentParser(usage='python filemap.py -i file_path -o [output_path]')
	parser.add_argument("-i", "--input",
		help="eg: D:/Git/void/void/tool DO NOT add quote")
	parser.add_argument("-o", "--output", default="../output.json",
		help="defalut=./output.json")

	args = parser.parse_args()
	input_path = str(args.input)

	ret = get_file_map(input_path)
	if ret is False:
		print("Invaild file path, maybe not exist or that is file, path=%s" % input_path)
		raise Exception("Invalid file path")

	save_to_json(ret, args.output)

	print("Finish")
