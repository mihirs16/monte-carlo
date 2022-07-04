<script lang="ts">
    // monaco-editor imports
    import type monaco from 'monaco-editor';
    import { onMount } from 'svelte';
    import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
    import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
    import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
    import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
    import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

    // monaco-languageclient imports
    import { 
        MonacoLanguageClient, 
        CloseAction, 
        ErrorAction, 
        MonacoServices, 
        MessageTransports
    } from 'monaco-languageclient';
    import {
        toSocket,
        WebSocketMessageReader,
        WebSocketMessageWriter
    } from 'vscode-ws-jsonrpc';

    let divEl: HTMLDivElement = null;
    let editor: monaco.editor.IStandaloneCodeEditor;
    let Monaco: any;

    onMount(async () => {
        // @ts-ignore
        self.MonacoEnvironment = {
            getWorker: function (_moduleId: any, label: string) {
                if (label === 'json') {
                    return new jsonWorker();
                }
                if (label === 'css' || label === 'scss' || label === 'less') {
                    return new cssWorker();
                }
                if (label === 'html' || label === 'handlebars' || label === 'razor') {
                    return new htmlWorker();
                }
                if (label === 'typescript' || label === 'javascript') {
                    return new tsWorker();
                }
                return new editorWorker();
            }
        };

        Monaco = await import('monaco-editor');
        
        Monaco.languages.register({
            id: 'python',
            extensions: ['py'],
            aliases: ['python', 'py']
        });

        editor = Monaco.editor.create(divEl, {
            model: Monaco.editor.createModel('', 'python', Monaco.Uri.parse('inmemory://model.py')),
            glyphMargin: true
        });
        
        MonacoServices.install();

        // listen to the proxy server (for pyls in this case) 
        const webSocket = new WebSocket('ws://localhost:3000/python');
        webSocket.onopen = () => {
            const socket        = toSocket(webSocket);
            const reader        = new WebSocketMessageReader(socket);
            const writer        = new WebSocketMessageWriter(socket);
            const langClient    = createLangClient({ reader, writer });
            
            langClient.start();
            reader.onClose(() => langClient.stop());
        };
        
        // initialize monaco-languageclient service
        function createLangClient (transports: MessageTransports) {
            return new MonacoLanguageClient({
                name: 'Sample Language Client',
                clientOptions: {
                    documentSelector: ['python'],
                    errorHandler: {
                        error:  () => ({ action: ErrorAction.Continue }),
                        closed: () => ({ action: CloseAction.DoNotRestart })
                    }
                },
                connectionProvider: {
                    get: () => {
                        return Promise.resolve(transports);
                    }
                }
            });
        }

        return () => {
            editor.dispose();
        };
    });
</script>

<div bind:this={divEl} style="height: 90vh" />