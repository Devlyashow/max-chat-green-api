import {useEffect, useState } from 'react'
import {
  sendMessage,
  receiveNotification,
  deleteNotification,
} from '../../services/greenApi'

type Message = {
  id: string
  text: string
  direction: 'outgoing' | 'incoming'
}

type NewChatProps = {
    contactName: string
    contactPhone: string
    apiUrl: string
    idInstance: string
    apiTokenInstance: string
    chatId: string
    onBack: () => void
};

export default function NewChat({contactName, contactPhone, apiUrl, idInstance, apiTokenInstance, chatId, onBack}: NewChatProps) {

    const [messages, setMessages] = useState<Message[]>([])
    const [messageText, setMessageText] = useState('')
    const [error, setError] = useState("")
    const [isSending, setIsSending] = useState(false)
    
// Отправка сообщений
    async function handleSendMessage() {
        if (!messageText.trim()) {
            setError("Пожалуйста, введите сообщение")
            return
        }
        setIsSending(true)
        setError('')

        try {
            const result = await sendMessage({
                idInstance,
                apiTokenInstance,
                apiUrl,
                chatId,
                message: messageText
            })
            setMessages((prevMessages) => [
                ...prevMessages,
                { id: result.idMessage, text: messageText, direction: 'outgoing' }
            ])
            setMessageText("")

        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : 'Ошибка отправки сообщения'
            )
        } finally {
            setIsSending(false)
        }
    }
//Отслеживание входящих
useEffect(() => {
    let isActive = true

  async function pollMessages() {
    while (isActive) {
      try {
        const notification = await receiveNotification({
          apiUrl,
          idInstance,
          apiTokenInstance,
        })
        if (!isActive) {
          break
        }

        if (!notification) {
          continue
        }

        const body = notification.body
        const text = body.messageData?.textMessageData?.textMessage

        if (
          body.typeWebhook === 'incomingMessageReceived' &&
          body.senderData?.chatId === chatId &&
          body.messageData?.typeMessage === 'textMessage' &&
          text
        ) {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              id: body.idMessage ?? crypto.randomUUID(),
              text,
              direction: 'incoming',
            },
          ])
        }

        await deleteNotification({
          apiUrl,
          idInstance,
          apiTokenInstance,
          receiptId: notification.receiptId,
        })
      } catch (error) {
  if (!isActive) {
    break
  }

  setError(
    error instanceof Error
      ? error.message
      : 'Ошибка получения сообщения'
  )

  await new Promise((resolve) =>
    setTimeout(resolve, 2000)
  )

  if (!isActive) {
    break
  }

  continue
}
    }
  }

  pollMessages()

        return () => {
        isActive = false
        }
}, [apiUrl, idInstance, apiTokenInstance, chatId])

  return (
    <section className="conversation">
    <header className="conversation__header">
        <button
        className="mobile-back"
        onClick={onBack}
        aria-label="Вернуться к выбору чата"
        >
        ←
        </button>
      <div className="avatar">
        {(contactName[0] || 'M').toUpperCase()}
      </div>

      <div className="contact">
        <h2>{contactName}</h2>
        <p>{contactPhone}</p>
      </div>
    </header>

    <div className="messages">
      {messages.length === 0 && (
        <div className="messages-empty">
          Начните переписку
        </div>
      )}

      {messages.map((message) => (
        <div
          key={message.id}
          className={`message ${message.direction}`}
        >
          {message.text}
        </div>
      ))}
    </div>

    {error && <p className="error conversation__error">{error}</p>}

    <div className="composer">
      <input
        type="text"
        placeholder="Сообщение"
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
        onKeyDown={(e) => {
            if (e.key === 'Enter' && !isSending) {handleSendMessage()}
        }}
        />

      <button
        className="send-btn"
        onClick={handleSendMessage}
        disabled={isSending}
      >
        {isSending ? '...' : 'Отправить'}
      </button>
    </div>
  </section>
  )
}
