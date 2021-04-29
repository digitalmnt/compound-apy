import { Container, Input, Text } from "@chakra-ui/react"
import React, { useContext } from 'react'
import { AccountContext } from '../context/account'
interface Account {
  account: string,
  updateAccount: (Account: string) => void;
}



export const AccountInput = () => {
  const { updateAccount, account } = useContext<Account>(AccountContext)

  return (
    <Container>
      <Text fontSize="l">
        Enter the Ethereum address you would like to track:
      </Text>
      <Text fontSize="sm">
        Sample Address: 0x701bd63938518d7db7e0f00945110c80c67df532
      </Text>
      <Input
        placeholder={account}
        onChange={(event) => updateAccount(event.target.value)}
      /> 
    </Container>
  )
}
