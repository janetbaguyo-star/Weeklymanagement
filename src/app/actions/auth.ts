'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function loginAction(formData: FormData) {
  const username = formData.get('username')
  const password = formData.get('password')

  const expectedUsername = process.env.APP_USERNAME || 'admin'
  const expectedPassword = process.env.APP_PASSWORD || 'admin' // default fallback if absent

  if (username === expectedUsername && password === expectedPassword) {
    const cookieStore = await cookies()
    cookieStore.set('auth-session', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/'
    })
    
    redirect('/')
  }

  return { error: 'Invalid credentials' }
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete('auth-session')
  redirect('/login')
}
