// imports
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

monaco.languages.register({
    id: 'python',
    extensions: ['.py'],
    aliases: ['python', 'py', 'PYTHON']
});

const sampleValue = `
# press Cmd/Ctrl + h to auto-format

x = {  'a':37,'b':42,

'c':927}

y = 'hello ''world'
z = 'hello '+'world'
a = 'hello {}'.format('world')
class foo  (     object  ):
  def f    (self   ):
    return       37*-+2
  def g(self, x,y=42):
      return y
def f  (   a ) :
  return      37+-+a[42-x :  y**3]`;

// initialize vanilla monaco editor
const editor = monaco.editor.create(document.getElementById('editor') as HTMLElement, {
    model: monaco.editor.createModel(sampleValue, 'python', monaco.Uri.parse('inmemory://model.py')),
    glyphMargin: true,
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
