import yaml from 'yaml';
import fs from 'fs';
import path from 'path';

export default function getFileFromLanguage(language: string): unknown {
	let fileName: string;
	switch (language) {
		case 'fr':
			fileName = 'fr.yaml';
			break;
		default:
			fileName = 'en.yaml';
	}
	const filePath = path.resolve(__dirname, fileName);
	const fileContents = fs.readFileSync(filePath, 'utf8');
	return yaml.parse(fileContents);
}
