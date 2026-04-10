import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  :root {
    color-scheme: dark;
    font-family:
      Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background:
      radial-gradient(circle at top left, rgba(64, 102, 255, 0.24), transparent 28%),
      radial-gradient(circle at top right, rgba(0, 193, 157, 0.16), transparent 24%),
      linear-gradient(180deg, #07111f 0%, #091423 45%, #08101b 100%);
    color: #edf3ff;
  }

  * {
    box-sizing: border-box;
  }

  html,
  body,
  #root {
    min-height: 100%;
    margin: 0;
  }

  body {
    min-height: 100vh;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  code {
    padding: 0.15rem 0.4rem;
    border-radius: 0.4rem;
    background: rgba(255, 255, 255, 0.08);
  }
`;

export default GlobalStyles;
