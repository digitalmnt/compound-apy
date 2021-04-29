import { createContext } from 'react'

export interface Account {
  account: string,
  updateAccount: (Account: string) => void;
}

export const AccountContext = createContext<Account>({
  account: '',
  updateAccount: (account) => {},
})
