// monaco imports
import * as monaco from 'monaco-editor';
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

// gun-js imports
import GUN from 'gun';

monaco.languages.register({
    id: 'python',
    extensions: ['.py'],
    aliases: ['python', 'py', 'PYTHON']
});

// initialize vanilla monaco editor
const editor = monaco.editor.create(document.getElementById('editor') as HTMLElement, {
    model: monaco.editor.createModel('', 'python', monaco.Uri.parse('inmemory://model.py')),
    glyphMargin: true,
});

var gun = GUN(['http://localhost:8080', 'http://localhost:8000/gun']);
var holster = gun.get('code-monte');
var wasItFiredByMe = false;

editor.onDidChangeModelContent((e) => {
    wasItFiredByMe = true
    const value = editor.getValue();
    console.log(value);
    holster.put({ 'code': value });
});


holster.on((data) => {
    if (wasItFiredByMe) {
        wasItFiredByMe = false;
        return;
    }
    console.log('realtime ==> ', data['code']);
    editor.setValue(data['code']);
});

// hotkey binds
document.addEventListener('keydown', (input) => {
    // Ctrl + h = auto format code
    if ((input.metaKey || input.ctrlKey) && input.key == 'h') {
        editor.getAction('editor.action.formatDocument').run();
    }
});

// install monaco-languageclient services
MonacoServices.install(monaco);

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
