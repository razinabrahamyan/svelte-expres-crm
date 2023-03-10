import type { Display } from '../types';
import type { Group_Field, Group_Params } from './type';
let widget = ({ title, fields, required, display }: Group_Params) => {
	let field = { schema: {}, title, fields, required, display } as Group_Field;

	field.widget = async () => {
		// @ts-ignore
		return (await import('./Group.svelte')).default;
	};
	return field;
};

export default widget;
