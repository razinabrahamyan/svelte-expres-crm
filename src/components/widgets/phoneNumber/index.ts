import type { Display } from '../types';
import type { PhoneNumber_Field, PhoneNumber_Params } from './types';

let widget = ({
	// Accept parameters from collection
	title,
	icon,
	placeholder,
	required,
	display
}: PhoneNumber_Params) => {
	if (!display) display = (data: any, field: any, entry: any) => data;

	let field = { schema: {}, title, icon, placeholder, required, display } as PhoneNumber_Field;

	field.schema[title] = 'string';

	field.widget = async () => {
		// @ts-ignore
		return (await import('./PhoneNumber.svelte')).default;
	};
	return field;
};

export default widget;
