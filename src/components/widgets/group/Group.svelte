<script lang="ts">
	import Fields from '@src/components/Fields.svelte';
	import { shape_fields } from '@src/utils/utils_svelte';

	export let field = { title: '', fields: [] };
	export let collection: any;
	export let value: any;

	let _fieldsValue: any = [];
	let fields: any;

	shape_fields(field.fields).then((data) => (fields = data));
</script>

<div class="flex flex-wrap  justify-between">
	<Fields {collection} {fields} bind:fieldsValue={_fieldsValue} {value} />
</div>
