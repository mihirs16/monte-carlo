import * as monaco from 'monaco-editor';

monaco.editor.create(document.getElementById('editor') as HTMLElement, {
    value: "print('hello world')",
    language: "python"
});
