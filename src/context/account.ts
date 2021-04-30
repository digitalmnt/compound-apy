import { createContext } from 'react'
import { Account } from '../types'

export const AccountContext = createContext<Account>({
  account: '',
  updateAccount: (account) => {},
})
