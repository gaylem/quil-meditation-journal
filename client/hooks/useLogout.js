import { useAuthContext } from './useAuthContext'
import { useEntriesContext } from './useEntriesContext'

export const useLogout = () => {
  const { dispatch } = useAuthContext()
  const { dispatch: dispatchEntries } = useEntriesContext()

  const logout = () => {
    // remove user from storage
    localStorage.removeItem('user')

    // dispatch logout action
    dispatch({ type: 'LOGOUT' })
    dispatchEntries({ type: 'SET_ENTRIES', payload: null })
  }

  return { logout }
}