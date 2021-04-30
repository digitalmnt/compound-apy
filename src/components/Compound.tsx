import {
  Box, Container,
  SimpleGrid, Slider,
  SliderFilledTrack,
  SliderThumb, SliderTrack,
  Text
} from "@chakra-ui/react"
import dayjs from 'dayjs'
import React, { FC, useEffect, useState } from 'react'
import DatePicker from 'react-date-picker'
import { MdGraphicEq } from 'react-icons/md'
import { getBlockFromTimestamp } from '../services/compound'
import { BlockProps } from '../types'
import { Chart } from './Chart'



async function findBlocks({ interval, startDate, endDate }: BlockProps) {
  const start = dayjs(startDate)
  const end = dayjs(endDate)
  const blockIncrements = [start]
  let lastIncrement: any = blockIncrements.splice(-1)[0]

  while (lastIncrement.isBefore(end)) {
    blockIncrements.push(lastIncrement.add(interval, 'week'))
    lastIncrement = lastIncrement.add(interval, 'week')
  }

  const unixIncrements = blockIncrements.map((ts) => ts.unix())
  const blocks = await Promise.all(unixIncrements.map(async (ts) => await getBlockFromTimestamp(ts) ))
  // add timestamps
  const blockAndTime = blocks.map((block, i) => ({
    block,
    timeStamp: blockIncrements[i]
  }))

  const filteredBlocks = blockAndTime.filter((block) => block.block)
  return filteredBlocks
}

export const Compound: FC = () => {
  const [startDate, setStartDate] = useState<any>(new Date())
  const [endDate, setEndDate] = useState<any>(new Date())
  const [interval, updateInterval] = useState<Number | null>(1)
  const [blocks, setBlocks] = useState<[]>([])
  const [isLoading, updateLoading] = useState<boolean>(false)
  
  useEffect(() => {
    async function getBlocks() {
      updateLoading(true)
      const blocks: any = await findBlocks({ interval, startDate, endDate })
      setBlocks(blocks)
      updateLoading(false)
    }
    getBlocks()
  }, [startDate, endDate, interval])

  return (
    <Container>
      <SimpleGrid columns={2} spacing={10}>
        <Box m={2}>
          <Text fontSize="l">Start Date</Text>
          <DatePicker
            onChange={setStartDate}
            value={startDate}
          />
        </Box>
        <Box m={2}>
          <Text fontSize="l">End Date</Text>
          <DatePicker
            onChange={setEndDate}
            value={endDate}
          />
        </Box>
      </SimpleGrid>
      <Text fontSize="xl">Time Interval (Weeks): {interval}</Text>
      <Slider
        aria-label="slider-ex-4"
        defaultValue={10}
        onChangeEnd={(val) => updateInterval((val / 10))}
        step={10}
      >
        <SliderTrack bg="green">
          <SliderFilledTrack bg="blue" />
        </SliderTrack>

        <SliderThumb boxSize={6}>
          <Box color="green" as={MdGraphicEq} />
        </SliderThumb>
      </Slider>
        <Chart blocks={blocks} isBlocksLoading={isLoading}/>
    </Container>
  )
}
