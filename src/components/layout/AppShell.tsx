import { useEditorStore } from '../../store/editorStore';
import { TopBar } from './TopBar';
import { SymbolSidebar } from '../sidebar/SymbolSidebar';
import { Notebook } from '../notebook/Notebook';

export function AppShell() {
  const sidebarOpen = useEditorStore(s => s.sidebarOpen);

  return (
    <div className="flex flex-col h-screen bg-gray-950 overflow-hidden">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        {sidebarOpen && (
          <div className="w-52 flex-shrink-0 overflow-hidden">
            <SymbolSidebar />
          </div>
        )}
        <div className="flex-1 overflow-y-auto">
          <Notebook />
        </div>
      </div>
    </div>
  );
}
