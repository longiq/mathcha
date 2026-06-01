import { TopBar } from './TopBar';
import { FormatToolbar } from '../toolbar/FormatToolbar';
import { SymbolPanel } from '../toolbar/SymbolPanel';
import { Editor } from '../editor/Editor';
import { useStore } from '../core/store';

export function Layout() {
  const { state } = useStore();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <TopBar />
      <FormatToolbar />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Editor />
        {state.symbolPanelOpen && <SymbolPanel />}
      </div>
    </div>
  );
}
