import { StrictMode } from 'react'
import { flushSync } from 'react-dom'
import { createRoot } from 'react-dom/client'
import './styles.css'
import App from './App'

const root = createRoot(document.getElementById('root')!)
// Mount before native history restoration measures the document.
flushSync(() => {
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
