import { ReactElement } from 'react'

const HomePage = (): ReactElement => {
  return (
    <div>
      <h1>Загрузите или вставьте JSON</h1>
      <textarea rows={10} cols={50} placeholder='Вставьте JSON здесь...' />
      <br />
      <button>Загрузить файл</button>
    </div>
  )
}
export default HomePage