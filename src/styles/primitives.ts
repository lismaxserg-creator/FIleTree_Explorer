import { Link } from 'react-router-dom';
import styled, { css } from 'styled-components';

export const mutedText = css`
  color: #abc0df;
`;

export const panelStyles = css`
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  background: rgba(7, 15, 28, 0.72);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(16px);
`;

export const primaryControlStyles = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  border: none;
  border-radius: 999px;
  padding: 12px 18px;
  font: inherit;
  font-weight: 600;
  color: #08111e;
  background: linear-gradient(135deg, #91b3ff 0%, #7df3d4 100%);
  cursor: pointer;
`;

export const Panel = styled.section`
  ${panelStyles}
`;

export const CardPanel = styled.div`
  ${panelStyles}
`;

export const Eyebrow = styled.p`
  margin: 0 0 6px;
  font-size: 0.78rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #8ea4c7;
`;

export const Title = styled.h2`
  margin: 0;
  line-height: 1.05;
`;

export const SectionTitle = styled.div`
  margin-bottom: 16px;

  p {
    margin: 10px 0 0;
    ${mutedText}
  }
`;

export const HintText = styled.p`
  margin: 0;
  ${mutedText}
`;

export const EmptyCopy = styled.p`
  margin: 0;
  ${mutedText}
`;

export const PrimaryButton = styled.button`
  ${primaryControlStyles}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const PrimaryLink = styled(Link)`
  ${primaryControlStyles}
`;
