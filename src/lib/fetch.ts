export const chat = async (message: string, session: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_SERVER}chat?message=${encodeURIComponent(
      message
    )}&session_id=${encodeURIComponent(session)}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )

  return response
}

export const sidebarChat = async (
  message: string,
  session: string,
  article: number
) => {
  const response = await fetch(
    `${
      import.meta.env.VITE_API_SERVER
    }sidebar/chat?message=${encodeURIComponent(
      message
    )}&session_id=${encodeURIComponent(
      session
    )}&article_id=${encodeURIComponent(article)}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )

  return response
}
