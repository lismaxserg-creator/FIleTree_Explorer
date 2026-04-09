
import type { ReactElement } from 'react'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import TreePage from './pages/TreePage'
import NodePage from './pages/NodePage'

function App(): ReactElement {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/tree" element={<TreePage />} />
      <Route path="/tree/*" element={<NodePage />} />
    </Routes>
  )
}

export default App