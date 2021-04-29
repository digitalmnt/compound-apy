import {
  Box, ChakraProvider,
  Grid, Text,
  theme, VStack
} from "@chakra-ui/react"
import * as React from "react"
import { ColorModeSwitcher } from "./ColorModeSwitcher"
import { AccountInput } from './components/AccountInput'
import { Compound } from './components/Compound'
import { AccountContext } from './context/account'
import { Logo } from "./Logo"

export const App = () => {
  const [account, updateAccount] = React.useState('0x')

  return (
    <ChakraProvider theme={theme}>
      <AccountContext.Provider value={{ account, updateAccount }}>
        <Box textAlign="center" fontSize="xl">
          <Grid minH="100vh" p={3}>
            <ColorModeSwitcher justifySelf="flex-end" />
            <VStack spacing={8}>
              <Logo h="20vmin" />
              <AccountInput />
              {account !== '0x' &&
                <div>
                  <Text>
                    Select a date range and interval to see your APY from lending to Compound
                  </Text>
                  <Compound />
                </div>
              }
            </VStack>
          </Grid>
        </Box>
      </AccountContext.Provider>
    </ChakraProvider>
  )
}
