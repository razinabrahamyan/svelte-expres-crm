<script lang="ts">
	//@ts-ignore
	import { RichTextComposer, PlainTextPlugin } from 'svelte-lexical/src/index';
	//@ts-ignore
	import PlaygroundEditorTheme from './PlaygroundEditorTheme';
	import './global.css';

	// let editorState: never[] = [];
	// const json = editorState.toJSON();
	// console.log(json);
</script>

<!-- TODO: save Data to Mongodb -->
<RichTextComposer theme={PlaygroundEditorTheme}>
	<PlainTextPlugin />
</RichTextComposer>
