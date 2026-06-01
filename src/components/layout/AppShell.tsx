import { useEditorStore } from '../../store/editorStore';
import { TopBar } from './TopBar';
import { FormatToolbar } from './FormatToolbar';
import { SymbolSidebar } from '../sidebar/SymbolSidebar';
import { Notebook } from '../notebook/Notebook';

export function AppShell() {
  const sidebarOpen = useEditorStore(s => s.sidebarOpen);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: '#1e1e1e' }}>
      {/* Top bar: logo + title + actions */}
      <TopBar />
      {/* Format toolbar */}
      <FormatToolbar />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left symbol sidebar */}
        {sidebarOpen && (
          <div style={{ width: 220, flexShrink: 0, overflow: 'hidden', borderRight: '1px solid #333', background: '#252526' }}>
            <SymbolSidebar />
          </div>
        )}

        {/* Main editor area — white paper */}
        <div style={{ flex: 1, overflowY: 'auto', background: '#2d2d2d', padding: '24px 0' }}>
          <div style={{
            maxWidth: 860,
            margin: '0 auto',
            minHeight: 'calc(100vh - 120px)',
            background: '#fff',
            boxShadow: '0 2px 16px rgba(0,0,0,0.4)',
            borderRadius: 4,
            overflow: 'hidden',
          }}>
            <Notebook />
          </div>
        </div>
      </div>
    </div>
  );
}
