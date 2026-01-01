import yaml from 'yaml';
import fs from 'fs';
import path from 'path';
import type { FileLanguage } from '../types/fileLanguage';

export default function getFileFromLanguage(language: string): unknown {
	let fileName: string;
	switch (language) {
		case 'fr':
			fileName = 'fr.yml';
			break;
		default:
			fileName = 'en.yml';
	}
	const filePath = path.resolve(__dirname, 'locales', fileName);
	const fileContents = fs.readFileSync(filePath, 'utf8');
	return yaml.parse(fileContents) as FileLanguage;
}
