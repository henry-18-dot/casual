import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { HomePage } from '../routes/HomePage';
import { ImportPage } from '../routes/ImportPage';
import { MorphemePage } from '../routes/MorphemePage';
import { NotebookDetailPage } from '../routes/NotebookDetailPage';
import { NotebookListPage } from '../routes/NotebookListPage';
import { useAppStore } from '../stores/useAppStore';

export function App() {
  const settings = useAppStore((s) => s.settings);
  return (
    <div data-theme={settings.theme} data-accent={settings.accent} data-font={settings.fontSize}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/import" element={<ImportPage />} />
          <Route path="/notebooks" element={<NotebookListPage />} />
          <Route path="/notebooks/:sessionId" element={<NotebookDetailPage />} />
          <Route path="/morphemes" element={<MorphemePage />} />
          <Route path="/morphemes/prefixes" element={<MorphemePage />} />
          <Route path="/morphemes/roots" element={<MorphemePage />} />
          <Route path="/morphemes/suffixes" element={<MorphemePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </div>
  );
}
