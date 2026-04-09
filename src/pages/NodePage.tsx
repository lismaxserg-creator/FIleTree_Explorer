import { ReactElement } from 'react'
import { useParams } from 'react-router-dom'

const NodePage = (): ReactElement => {
  // параметр '*' захватывает всё после /tree/
  const { '*': encodedPath } = useParams()
  const nodePath = encodedPath ? decodeURIComponent(encodedPath) : ''

  return (
    <div>
      <h1>Детали узла</h1>
      <p>Путь: {nodePath || 'корень'}</p>
      {/* Здесь будет детальная информация о файле/папке */}
    </div>
  )
}
export default NodePage