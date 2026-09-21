import { useState } from 'react'
import NewChat from './NewChat'
import { checkAccount, getContactInfo } from '../../services/greenApi'


type ChatProps = {
  apiUrl: string
  idInstance: string
  apiTokenInstance: string
  theme: 'light' | 'dark'
  toggleTheme: () => void
  onDisconnect: () => void
}

export default function Chat({ apiUrl, idInstance, apiTokenInstance, theme, toggleTheme, onDisconnect }: ChatProps) {

    const [phoneNumber, setPhoneNumber] = useState("")
    const [activePhoneNumber, setActivePhoneNumber] = useState('')
    const [error, setError] = useState("")
    const [chatId, setChatId] = useState("")
    const [contactName, setContactName] = useState('')
    const [contactPhone, setContactPhone] = useState('')

    function handleBackToChats() {
        setActivePhoneNumber('')
        setChatId('')
        setContactName('')
        setContactPhone('')
        setError('')
        }

    async function handleCreateChat() {
    if (!phoneNumber.trim()) {
        setError('Пожалуйста, введите номер телефона')
        return
    }

    setError('')

    try {
        const result = await checkAccount({
        apiUrl,
        idInstance,
        apiTokenInstance,
        phoneNumber,
        })

        if (!result.exist) {
        setError('Аккаунт MAX с таким номером не найден')
        return
        }

        

        const contactInfo = await getContactInfo({
        apiUrl,
        idInstance,
        apiTokenInstance,
        chatId: result.chatId})

        setContactName(contactInfo.contactName || contactInfo.name || 'Пользователь MAX')

        setContactPhone(
            contactInfo.phoneNumber !== 0
            ? String(contactInfo.phoneNumber)
            : phoneNumber
        )

        setChatId(result.chatId)
        setActivePhoneNumber(phoneNumber)
    } catch (error) {
        setError(
        error instanceof Error
            ? error.message
            : 'Ошибка проверки аккаунта'
        )
    }
    }

  return (
  <div className={`messenger ${activePhoneNumber && chatId ? 'messenger--active' : ''}`}>
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div className="brand-logo">M</div>
        <span>MAX Chat</span>
        <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Переключить тему"
            >
            {theme === 'light' ? '🌙' : '☀️'}
            </button>
      </div>

      <div className="chat">
        <p className="connection-status">Подключение выполнено</p>

        <label htmlFor="phoneNumber">Новый чат</label>

        <input
          type="text"
          id="phoneNumber"
          placeholder="+7 999 123-45-67"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />

        <button
          className="btn"
          onClick={handleCreateChat}
        >
          Создать чат
        </button>

        {error && <p className="error">{error}</p>}
      </div>
      <button
        className="logout-btn"
        onClick={onDisconnect}
        >
        ← Сменить аккаунт
        </button>
    </aside>

    <main className="chat-panel">
      {activePhoneNumber && chatId ? (
        <NewChat
          key={chatId}
          contactName={contactName}
          contactPhone={contactPhone}
          apiUrl={apiUrl}
          idInstance={idInstance}
          apiTokenInstance={apiTokenInstance}
          chatId={chatId}
          onBack={handleBackToChats}
        />
      ) : (
        <div className="chat-empty">
          <div className="chat-empty__icon">M</div>
          <h2>Выберите чат</h2>
          <p>Введите номер телефона слева</p>
        </div>
      )}
    </main>
  </div>
  )
}
