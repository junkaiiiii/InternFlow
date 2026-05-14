export const toLocalDateTimeString = (date: Date) => {
    const offset = date.getTimezoneOffset() * 60000
    return new Date(date.getTime() - offset).toISOString().slice(0, 16)
  }
  
export  const fromLocalDateTimeString = (value: string) => {
    return new Date(value) 
  }