import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import gql from 'graphql-tag'
import { BlockData, ChartData, Point } from '../types'

const axios = require('axios').default


const TIMEOUT = 30000
const HOST = 'https://api.compound.finance/api/v2/'

const instance = axios.create({
  baseURL: HOST,
  timeout: TIMEOUT,
})

function resolveAccountData(returns: any, blocks: BlockData[]) {
  const allCharts: any = {}
  // filter out dates that don't have data
  const returnData = returns.map((value: any) => value.data).filter((dataVal: any) => dataVal.accounts.length)

  // separate accounts
  const accountsData = returnData.map((data: any) => data.accounts)
  accountsData.forEach((accountData: any, i: number) => {
    accountData.forEach((account: any) => {
      if (!allCharts[account.address]) {
        allCharts[account.address] = {}
      }

      account.tokens.forEach((token: any) => {
        if (!allCharts[account.address][token.symbol]) {
          const chartData: ChartData = {
            id: token.symbol,
            data: []
          }

          allCharts[account.address][token.symbol] = chartData
        }

        const point: Point = {
          x: blocks[i].timeStamp.format('MM/DD/YYYY'),
          y: token.lifetime_supply_interest_accrued.value === '0.0' ? Number(token.lifetime_borrow_interest_accrued.value) : Number(token.lifetime_supply_interest_accrued.value)
        }
        allCharts[account.address][token.symbol].data.push(point)
      })
    })
  })
  const flattenedChartData = flattenData(allCharts)
  return flattenedChartData
}

function flattenData(data: any) {
  const flattenedData = Object.keys(data).map((account: any) => {
    const final = {
      account,
      lines: [],
    }
    const lines: any = Object.keys(data[account]).map((key) => data[account][key])
    final.lines = lines
    return final
  })

  return flattenedData
}

export async function getAccountAPY(blocks: BlockData[], account: string) : Promise<any> {
  const accountRequests = blocks.map(async (block) => await instance.get('account', {
    params: {
      addresses: [account],
      block_number: block.block,
    }
  }))

  const returns = await Promise.all(accountRequests)
  return resolveAccountData(returns, blocks)
}

const blockClient = new ApolloClient({
  link: new HttpLink({
    uri: 'https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks',
  }),
  cache: new InMemoryCache(),
})

export const GET_BLOCK = gql`
  query blocks($timestampFrom: Int!, $timestampTo: Int!) {
    blocks(
      first: 1
      orderBy: timestamp
      orderDirection: asc
      where: { timestamp_gt: $timestampFrom, timestamp_lt: $timestampTo }
    ) {
      id
      number
      timestamp
    }
  }
`

/**
 * Grabbed from uniswap-info https://github.com/Uniswap/uniswap-interface
 * @notice Fetches first block after a given timestamp
 * @dev Query speed is optimized by limiting to a 600-second period
 * @param {Int} timestamp in seconds
 */
 export async function getBlockFromTimestamp(timestamp: number) {
  let result = await blockClient.query({
    query: GET_BLOCK,
    variables: {
      timestampFrom: timestamp,
      timestampTo: timestamp + 600,
    },
    fetchPolicy: 'cache-first',
  })
  return result?.data?.blocks?.[0]?.number
}