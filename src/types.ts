export interface Account {
  account: string,
  updateAccount: (Account: string) => void;
}

export interface BlockData {
  timeStamp: any,
  block: number[]
}
export interface ChartComponentProps {
  blocks: BlockData[]
  isBlocksLoading: boolean
}

export interface BlockProps {
  interval: Number | null,
  startDate: Date,
  endDate: Date,
}

export interface Point {
  x: Date,
  y: number
}
export interface ChartData {
  id: string,
  data: Point[],
}
