
export default function cleanNumber(phoneNumber: string): string {
  let cleanedNumber = phoneNumber.replace(/\D/g, '')

  if (cleanedNumber.length === 11 && cleanedNumber.startsWith('8')) {
    cleanedNumber = '7' + cleanedNumber.slice(1)
  }
  const isRussian =
    cleanedNumber.length === 11 &&
    cleanedNumber.startsWith('7')

  const isBelarusian =
    cleanedNumber.length === 12 &&
    cleanedNumber.startsWith('375')

  if (!isRussian && !isBelarusian) {
    throw new Error('Введите корректный номер РФ или РБ')
  }

  return cleanedNumber
}