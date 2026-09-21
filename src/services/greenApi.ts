import cleanNumber from '../utils/cleanNumber'

type GetStateInstanceProps = {
  idInstance: string
  apiTokenInstance: string
  apiUrl: string
}

type StateInstance =
  | 'authorized'
  | 'notAuthorized'
  | 'blocked'
  | 'starting'

type GetStateInstanceResponse = {
  stateInstance: StateInstance
}

type SendMessageProps = {
    idInstance: string
    apiTokenInstance: string
    apiUrl: string
    chatId: string
    message: string
}

type SendMessageResponse = {
  idMessage: string
}

type CheckAccountProps = {
  apiUrl: string
  idInstance: string
  apiTokenInstance: string
  phoneNumber: string
}

type CheckAccountResponse = {
  exist: boolean
  chatId: string
  fromCache: boolean
}

type CheckAccountErrorResponse = {
  status: false
  reason: string
}

type ReceiveNotificationProps = {
  apiUrl: string
  idInstance: string
  apiTokenInstance: string
}

type ReceiveNotificationResponse = {
  receiptId: number
  body: NotificationBody
}

type DeleteNotificationProps = {
  apiUrl: string
  idInstance: string
  apiTokenInstance: string
  receiptId: number
}

type DeleteNotificationResponse = {
  result: boolean
  reason: string
}

type NotificationBody = {
  typeWebhook?: string
  idMessage?: string

  senderData?: {
    chatId?: string
    chatType?: string
  }

  messageData?: {
    typeMessage?: string

    textMessageData?: {
      textMessage?: string
    }
  }
}

type GetContactInfoProps = {
  apiUrl: string
  idInstance: string
  apiTokenInstance: string
  chatId: string
}

type GetContactInfoResponse = {
  name: string
  contactName: string
  phoneNumber: number
  avatar: string
  chatId: string
  chatType: string
}

// Function to get the state of the instance
export async function getStateInstance({
  idInstance,
  apiTokenInstance,
  apiUrl,
}: GetStateInstanceProps): Promise<GetStateInstanceResponse> {
  const url = `${apiUrl}/waInstance${idInstance}/getStateInstance/${apiTokenInstance}`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Ошибка подключения к GREEN-API')
  }

  return response.json()
}

// Function to send a message
export async function sendMessage({
  idInstance,
  apiTokenInstance,
  apiUrl,
  chatId,
  message
}: SendMessageProps): Promise<SendMessageResponse> {
  const url = `${apiUrl}/waInstance${idInstance}/sendMessage/${apiTokenInstance}`

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      chatId,
      message
    })
  })

  if (!response.ok) {
    throw new Error('Ошибка отправки сообщения')
  }

  return response.json()
}

// Function to check if an account exists
export async function checkAccount({
  apiUrl,
  idInstance,
  apiTokenInstance,
  phoneNumber,
}: CheckAccountProps): Promise<CheckAccountResponse> {

   const url = `${apiUrl}/waInstance${idInstance}/checkAccount/${apiTokenInstance}`

   const response = await fetch(url, {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json'
     },
     body: JSON.stringify({
       phoneNumber: Number(cleanNumber(phoneNumber))
     })
   })

   if (!response.ok) {
     throw new Error('Ошибка проверки аккаунта')
   }

   const data: CheckAccountResponse | CheckAccountErrorResponse = await response.json()

   if ('status' in data) {
        throw new Error(data.reason)
    }

    return data
 }

 export async function receiveNotification({
  apiUrl,
  idInstance,
  apiTokenInstance,
}: ReceiveNotificationProps): Promise<ReceiveNotificationResponse | null> {
  const url =
    `${apiUrl}/waInstance${idInstance}/receiveNotification/${apiTokenInstance}`

  const response = await fetch(url)

  if (response.status === 408) {
    return null
  }

  if (!response.ok) {
    throw new Error('Ошибка получения уведомления')
  }

  const text = await response.text()

  if (!text) {
    return null
  }

  return JSON.parse(text)
}

// Function to delete a notification
export async function deleteNotification({
  apiUrl,
  idInstance,
  apiTokenInstance,
  receiptId,
}: DeleteNotificationProps): Promise<DeleteNotificationResponse> {
  const url =
    `${apiUrl}/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${receiptId}`

  const response = await fetch(url, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Ошибка удаления уведомления')
  }

  return response.json()
}

export async function getContactInfo({
  apiUrl,
  idInstance,
  apiTokenInstance,
  chatId,
}: GetContactInfoProps): Promise<GetContactInfoResponse> {

    const url = `${apiUrl}/waInstance${idInstance}/getContactInfo/${apiTokenInstance}`

   const response = await fetch(url, {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json'
     },
     body: JSON.stringify({chatId})
   })
   if (!response.ok) {
    throw new Error('Ошибка запроса информации')
  }
  return response.json()
}