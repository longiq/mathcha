import { StoreProvider } from './core/store';
import { Layout } from './layout/Layout';
import 'katex/dist/katex.min.css';

export default function App() {
  return (
    <StoreProvider>
      <Layout />
    </StoreProvider>
  );
}
