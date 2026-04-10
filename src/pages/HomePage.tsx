/**
 * HomePage component - the main import page for loading file tree data.
 * Allows users to paste JSON or upload a file to import a nested file tree structure.
 * Validates the input and saves it to localStorage for exploration.
 */
import { ReactElement, useMemo, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import type { FileTreeNode } from '../types';
import { saveTree } from '../utils/storage';
import { validateTreeNode } from '../utils/tree';
import styled from 'styled-components';
import { Eyebrow, HintText, Panel, PrimaryButton, Title, mutedText } from '../styles/primitives';

const Clue = styled(Panel)`
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 28px;
  padding: 28px;

  @media (max-width: 920px) {
    grid-template-columns: 1fr;
  }
`;

const ClueCopy = styled.div`
  h2 {
    margin: 0;
    line-height: 1.05;
  }
`;

const Lead = styled.p`
  ${mutedText}
`;

const ImportForm = styled.form`
  display: grid;
  gap: 14px;
`;

const Dropzone = styled.label`
  display: grid;
  gap: 8px;
  padding: 18px;
  border-radius: 18px;
  border: 1px dashed rgba(152, 178, 255, 0.35);
  background: rgba(255, 255, 255, 0.03);
  cursor: pointer;
`;

const HiddenInput = styled.input`
  display: none;
`;

const JsonInput = styled.textarea`
  width: 100%;
  min-height: 320px;
  padding: 16px;
  resize: vertical;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 18px;
  background: rgba(3, 9, 18, 0.84);
  color: #eff4ff;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  line-height: 1.5;
`;

const ErrorText = styled.p`
  margin: 0;
  color: #ff9bb2;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
`;

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
    if (!file) {
      return;
    }

    const text = await file.text();

    setValue(text);
  }

  return (
    <Clue>
      <ClueCopy>
        <Eyebrow>Paste or upload JSON</Eyebrow>
        <Title>Import a nested file tree and start exploring immediately.</Title>
        <Lead>
          The app stores the imported tree locally so you can refresh, search, and open detail pages
          without losing context.
        </Lead>
      </ClueCopy>

      <ImportForm onSubmit={handleSubmit}>
        <Dropzone>
          <HiddenInput
            type="file"
            accept="application/json,.json"
            onChange={(event) => void handleFile(event.target.files?.[0] || null)}
          />
          <span>Upload a JSON file</span>
        </Dropzone>

        <JsonInput
          value={value}
          onChange={(event) => setValue(event.target.value)}
          spellCheck={false}
          placeholder="Paste JSON structure here"
          aria-label="JSON input"
        />

        {error ? <ErrorText>{error}</ErrorText> : <HintText>Sample structure is prefilled to speed up testing.</HintText>}

        <Actions>
          <PrimaryButton type="submit" disabled={!canSubmit}>
            Load tree
          </PrimaryButton>
        </Actions>
      </ImportForm>
    </Clue>
  );
}
