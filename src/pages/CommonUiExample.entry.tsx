import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../styles/tokens.css'
import '../styles/global.css'
import CommonUiExample from './CommonUiExample'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CommonUiExample />
  </StrictMode>,
)
