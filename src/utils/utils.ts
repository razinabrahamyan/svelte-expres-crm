export let DB = {};

export let fieldsToSchema = (fields: Array<any>) => {
	let schema: any = {};
	for (let field of fields) {
		schema = { ...schema, ...field.schema };
	}
	delete schema.widget;
	return schema;
};

import axios from 'axios';
import fs from 'fs';
import schemas from '../collections';
import type { Schema } from '../collections/types';
import env from '../../env';
export function saveFiles(req: any) {
	let files: any = {};
	let schema = schemas.find((schema) => schema.name === req.params.endpoint);
	let _files = (req.files as Array<Express.Multer.File>) || [];
	for (let file of _files) {
		let { buffer, fieldname, ...meta } = file;
		files[fieldname as keyof typeof files] = meta;
		let path = _findFieldByTitle(schema, fieldname).path;

		if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true });

		fs.writeFileSync(path + '/' + meta.originalname, buffer);
	}
	return files;
}
function _findFieldByTitle(schema: any, fieldname: string, found = { val: false }): any {
	for (let field of schema.fields) {
		if (field.title == fieldname) {
			console.log(field);
			found.val = true;

			return field;
		} else if (field.fields.length > 0) {
			return _findFieldByTitle(field, fieldname, found);
		}
	}
	if (!found) {
		throw new Error('FIELD NOT FOUND');
	}
}

export function parse(obj: any) {
	for (let key in obj) {
		try {
			if (Array.isArray(obj[key])) {
				for (let index of obj[key]) {
					obj[key][index] = JSON.parse(obj[key][index]);
				}
			} else {
				obj[key] = JSON.parse(obj[key]);
			}
		} catch (e) {}

		if (typeof obj[key] != 'string') {
			parse(obj[key]);
		}
	}
	return obj;
}

export async function findById(id: string, collection: Schema) {
	if (!id || !collection) return;
	return (
		await axios.get(`${env.HOST}:${env.PORT}/api/findById?collection=${collection.name}&id=${id}`)
	).data;
}

export async function find(query: object, collection: Schema) {
	let _query = JSON.stringify(query);
	return (
		await axios.get(
			`${env.HOST}:${env.PORT}/api/find?collection=${collection.name}&query=${_query}`
		)
	).data;
}

export const config = {
	headers: {
		'Content-Type': 'multipart/form-data'
	}
};

export function format(
	value: Array<{
		label?: string;
		text: string;
		labelColor?: string;
		textColor?: string;
		newLine?: boolean;
	}>
) {
	let html = '';
	for (let item of value) {
		let htmlTag = item.newLine ? 'p' : 'span';
		html += ` <${htmlTag} style=color:${
			item.textColor
		} class=dark:text-white text-black> <span class=dark:text-white text-black style=color:${
			item.labelColor
		}> ${item.label ? item.label + ':' : ''} </span> ${item.text}</${htmlTag}>`;
	}
	return html;
}

export function flattenData(data: any, language: string) {
	if (!data) return [];
	return Object.keys(data).reduce((acc: any, x) => {
		acc[x] =
			typeof data[x] != 'string' && data[x] !== null
				? data[x][language] || data[x][env.LANGUAGE]
				: data[x];

		return acc;
	}, {});
}

// Replaces the locale slug in a URL.
//
// If the `full` argument is set to `true`, the full URL is returned as a string.
// e.g. https://mywebsite.com/en/blog/article-1 => https://mywebsite.com/de/blog/article-1
//
// Otherwise (default) the URL relative to the base is returned.
// e.g. https://mywebsite.com/en/blog/article-1 => /de/blog/article-1
export const replaceLocaleInUrl = (url: URL, locale: string, full = false): string => {
	const [, , ...rest] = url.pathname.split('/');
	const new_pathname = `/${[locale, ...rest].join('/')}`;
	if (!full) {
		return `${new_pathname}${url.search}`;
	}
	const newUrl = new URL(url.toString());
	newUrl.pathname = new_pathname;
	return newUrl.toString();
};
