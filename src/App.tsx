import './App.css'
import { useEffect, useState } from 'react'
import CredentialsForm from './components/CredentialsForm/CredentialsForm'
import Chat from './components/Chat/Chat'
import { getStateInstance } from './services/greenApi'


type Theme = 'light' | 'dark'

function App() {
  const [idInstance, setInstanceId] = useState('')
  const [apiTokenInstance, setApiToken] = useState('')
  const [apiUrl, setApiUrl] = useState('')
  const [error, setError] = useState('')
  const [isConnected, setIsConnected] = useState(false)
  const [theme, setTheme] = useState<Theme>(() => {
  const savedTheme = localStorage.getItem('theme')

  return savedTheme === 'dark' ? 'dark' : 'light'
})

useEffect(() => {
  document.documentElement.dataset.theme = theme
  localStorage.setItem('theme', theme)
}, [theme])

function toggleTheme() {
  setTheme((prevTheme) =>
    prevTheme === 'light' ? 'dark' : 'light'
  )
}

function handleDisconnect() {
  setIsConnected(false)
  setInstanceId('')
  setApiToken('')
  setApiUrl('')
  setError('')
}

async function handleConnect() {
  if (!idInstance.trim() || !apiTokenInstance.trim() || !apiUrl.trim()) {
    setError('Пожалуйста, заполните все поля')
    return
  }

  try {
    const result = await getStateInstance({
      idInstance,
      apiTokenInstance,
      apiUrl,
    })

    if (result.stateInstance === 'authorized') {
      setError('')
      setIsConnected(true)
      return
    }

    setError(`Инстанс не авторизован: ${result.stateInstance}`)
  } catch (error) {
    setError(
      error instanceof Error
        ? error.message
        : 'Ошибка подключения к GREEN-API'
    )
  }
}

  return (
    
  <div className={isConnected ? 'app app--chat' : 'app app--auth'}>
    {!isConnected ? (
      <div className="auth-card">
        <button
          className="theme-toggle auth-theme-toggle"
          onClick={toggleTheme}
          aria-label="Переключить тему"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        <div className="auth-logo">MAX</div>
        <h1>GREEN-API Chat</h1>

        <CredentialsForm
          idInstance={idInstance}
          apiTokenInstance={apiTokenInstance}
          setInstanceId={setInstanceId}
          setApiToken={setApiToken}
          setApiUrl={setApiUrl}
          apiUrl={apiUrl}
          handleConnect={handleConnect}
          setError={setError}
        />

        {error && <p className="error">{error}</p>}
      </div>
    ) : (
      <Chat
        apiUrl={apiUrl}
        idInstance={idInstance}
        apiTokenInstance={apiTokenInstance}
        theme={theme}
        toggleTheme={toggleTheme}
        onDisconnect={handleDisconnect}
      />
    )}
  </div>

  )
}

export default App
