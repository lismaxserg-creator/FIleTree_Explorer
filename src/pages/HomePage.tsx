import { ReactElement, useMemo, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import type { FileTreeNode } from '../types';
import { saveTree } from '../utils/storage';
import { validateTreeNode } from '../utils/tree';

const SAMPLE_JSON = JSON.stringify(
  {
    name: 'root',
    type: 'folder',
    children: [
      {
        name: 'src',
        type: 'folder',
        children: [
          { name: 'index.ts', type: 'file', size: 1024 },
          {
            name: 'components',
            type: 'folder',
            children: [{ name: 'Button.tsx', type: 'file', size: 512 }],
          },
        ],
      },
      { name: 'package.json', type: 'file', size: 300 },
    ],
  },
  null,
  2,
);

export default function HomePage(): ReactElement {
  const navigate = useNavigate();
  const [value, setValue] = useState(SAMPLE_JSON);
  const [error, setError] = useState<string | null>(null);
  const canSubmit = useMemo(() => value.trim().length > 0, [value]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const parsed = validateTreeNode(JSON.parse(value)) as FileTreeNode;
      saveTree(parsed);
      setError(null);
      navigate('/tree');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Failed to parse JSON.');
    }
  }

  async function handleFile(file: File | null) {
    if (!file) return;
    const text = await file.text();
    setValue(text);
  }

  return (
    <section className="panel hero">
      <div className="hero-copy">
        <p className="eyebrow">Paste or upload JSON</p>
        <h2>Import a nested file tree and start exploring immediately.</h2>
        <p className="lead">
          The app stores the imported tree locally so you can refresh, search, and open detail pages
          without losing context.
        </p>
      </div>

      <form className="import-form" onSubmit={handleSubmit}>
        <label className="dropzone">
          <input
            type="file"
            accept="application/json,.json"
            onChange={(event) => void handleFile(event.target.files?.[0] ?? null)}
          />
          <span>Upload a JSON file</span>
          <small>Or paste JSON directly below</small>
        </label>

        <textarea
          className="json-input"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          spellCheck={false}
          aria-label="JSON input"
        />

        {error ? <p className="error">{error}</p> : <p className="hint">Sample structure is prefilled to speed up testing.</p>}

        <div className="actions">
          <button type="submit" className="primary" disabled={!canSubmit}>
            Load tree
          </button>
        </div>
      </form>
    </section>
  );
}
