import { TopBar } from './TopBar';
import { FormatToolbar } from './FormatToolbar';
import { ToolSidebar } from './ToolSidebar';
import { SymbolSidebar } from '../sidebar/SymbolSidebar';
import { DocumentEditor } from '../editor/DocumentEditor';
import { useEditorStore } from '../../store/editorStore';

export function AppShell() {
  const { symbolPanelOpen } = useEditorStore();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#1e1e1e', overflow: 'hidden' }}>
      <TopBar />
      <FormatToolbar />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <ToolSidebar />
        {symbolPanelOpen && <SymbolSidebar />}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 16px' }}>
          <DocumentEditor />
        </div>
      </div>
    </div>
  );
}
