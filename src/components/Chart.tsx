import { Spinner } from "@chakra-ui/react"
import { ResponsiveLine } from '@nivo/line'
import React, { useContext, useEffect, useState } from 'react'
import { AccountContext } from '../context/account'
import { getAccountAPY } from '../services/compound'
import { Account, BlockData, ChartComponentProps } from '../types'

const LineChart = ( data: any ) => (
  <ResponsiveLine
      data={data.values}
      margin={{ top: 50, right: 110, bottom: 80, left: 70 }}
      xScale={{ type: 'point' }}
      yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: false, reverse: false }}
      yFormat=" >-.2f"
      axisTop={null}
      axisRight={null}
      axisBottom={{
          orient: 'bottom',
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 45,
          legend: 'Date',
          legendOffset: 65,
          legendPosition: 'middle'
      }}
      axisLeft={{
          orient: 'left',
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Interest Accrued',
          legendOffset: -60,
          legendPosition: 'middle'
      }}
      pointSize={10}
      pointColor={{ theme: 'background' }}
      pointBorderWidth={2}
      pointBorderColor={{ from: 'serieColor' }}
      pointLabelYOffset={-12}
      useMesh={true}
      tooltip={(value) => {
        const { point } = value
        return (
          <div
              style={{
                  background: 'white',
                  padding: '9px 12px',
                  border: '1px solid #ccc',
              }}
          >
            <div style={{display: 'block'}}>
              {point.serieId} - <div style={{
                backgroundColor: point.serieColor,
                height: 15,
                width: 15,
                display: 'inline-block'
              }}></div>
            </div>
            <div style={{display: 'block'}}>
              {point.data.x}: { point.data.y }
            </div>
          </div>
        )
      }}
      legends={[
          {
              anchor: 'bottom-right',
              direction: 'column',
              justify: false,
              translateX: 100,
              translateY: 0,
              itemsSpacing: 0,
              itemDirection: 'left-to-right',
              itemWidth: 80,
              itemHeight: 20,
              itemOpacity: 0.75,
              symbolSize: 12,
              symbolShape: 'circle',
              symbolBorderColor: 'rgba(0, 0, 0, .5)',
              effects: [
                  {
                      on: 'hover',
                      style: {
                          itemBackground: 'rgba(0, 0, 0, .03)',
                          itemOpacity: 1
                      }
                  }
              ]
          }
      ]}
  />
)


export const Chart = (props: ChartComponentProps) => {
  const [accountData, setAccountData] = useState([])
  const [isCompLoading, setCompLoading] = useState(false)
  const accountContext = useContext<Account>(AccountContext)
  const { blocks } = props

  useEffect(() => {
    async function fetchAccountData(blocks: BlockData[]) {
      setCompLoading(true)
      const acctData = await getAccountAPY( blocks, accountContext.account )
      setCompLoading(false)
      setAccountData(acctData)
    }
    fetchAccountData(blocks)
  }, [blocks, accountContext.account])
  return (
    <div style={{ height: 400 }}>
      {
        (props.isBlocksLoading || isCompLoading) ?
        <Spinner
          thickness="8px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
        :
        accountData.map((account: any) => {
          return ( <LineChart key={account.account} values={account.lines} /> )
        })
      }
    </div>
  )
}