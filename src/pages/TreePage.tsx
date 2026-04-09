import { ReactElement } from 'react'

const TreePage = (): ReactElement => {
  return (
    <div>
      <h1>Дерево файлов/папок</h1>
      <ul>
        <li>📁 src</li>
        <li>  📄 App.tsx</li>
        <li>  📁 components</li>
      </ul>
    </div>
  )
}
export default TreePage