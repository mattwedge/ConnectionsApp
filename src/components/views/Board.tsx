import { useParams } from "react-router-dom"
import { Board, Tile, useGetBoardsQuery } from "../../reduxStore/services/api/boards"
import { useMemo, useState } from "react"

const shuffle = (arr: Tile[]) => {
  const array = arr.map(t => ({...t}));

  for (let i = array.length - 1; i > 0; i--) { 
    const j = Math.floor(Math.random() * (i + 1)); 
    [array[i], array[j]] = [array[j], array[i]]; 
  } 
  return array; 
};

const TileElement = ({
  tile,
  onPress,
  selected,
  complete
}: {
  tile: Tile;
  onPress: (tile: Tile) => void;
  selected: boolean;
  complete: boolean;
}) => {
  return <button className={`w-20 h-20 font-bold ${complete ? "bg-yellow-200" : (selected ? "bg-gray-400" : "bg-gray-200")} m-1 rounded-lg flex items-center justify-center`} onClick={() => onPress(tile)}>{tile.name}</button>
}

const BoardInner = ({ board }: { board: Board}) => {
  const [shuffleId, setShuffleId] = useState(0.0)
  const [selectedTiles, setSelectedTiles] = useState<number[]>([])
  const [completedGroups, setCompletedGroups] = useState<number[]>([])

  const selectTile = (tile: Tile) => {
    if (completedGroups.includes(tile.group)) {
      return
    }

    const tileIndex = selectedTiles.indexOf(tile.id)
    if (tileIndex === -1) {
      if (selectedTiles.length < 4) {
        setSelectedTiles([...selectedTiles, tile.id])
      }
    } else {
      setSelectedTiles([...selectedTiles.slice(0, tileIndex), ...selectedTiles.slice(tileIndex + 1)])
    }
  }

  const submitTiles = () => {
    for (const group of board.groups) {
      const groupTileIdsStr = [...group.tiles.map(tile => tile.id)].sort().map(id => new String(id)).join(",")
      const selectedTilesStr = [...selectedTiles].sort().map(id => new String(id)).join(",")
      if (groupTileIdsStr === selectedTilesStr) {
        setCompletedGroups([...completedGroups, group.id])
        break
      }
    }
    setSelectedTiles([])
  }


  const boardTiles: Tile[] = []

  for (const group of board.groups) {
    for (const tile of group.tiles) {
      boardTiles.push(tile)
    }
  }

  const randomizedTiles = useMemo(() => {
    return shuffle(boardTiles)
  }, [shuffleId, JSON.stringify(boardTiles)])


  const fullyOrderedTiles = []
  for (const groupId of completedGroups) {
    for (const group of board.groups) {
      if (groupId === group.id) {
        for (const tile of group.tiles) {
          fullyOrderedTiles.push(tile)
        }
        break
      }
    }
  }

  for (const tile of randomizedTiles) {
    if (!fullyOrderedTiles.map(tile => tile.id).includes(tile.id)) {
      fullyOrderedTiles.push(tile)
    }
  }

  const rows = [
    fullyOrderedTiles.slice(0, 4),
    fullyOrderedTiles.slice(4, 8),
    fullyOrderedTiles.slice(8, 12),
    fullyOrderedTiles.slice(12, 16),
  ]


  return <div>
    {
      rows.map((row, i) => <div className="flex flex-row">{row.map(tile => <TileElement
        tile={tile}
        onPress={selectTile}
        selected={selectedTiles.includes(tile.id)}
        complete={i < completedGroups.length}
      />)}
      </div>)
    }
    <div className="mt-2 flex flex-row justify-around">
      <button className="bg-blue-700 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded" onClick={() => {setShuffleId(Math.random())}}>Shuffle</button>
      <button className={`${selectedTiles.length === 4 ? "bg-green-700 hover:bg-green-500": "bg-gray-400"} text-white font-bold py-2 px-4 rounded`} onClick={submitTiles}>Submit</button>
    </div>
  </div>
}


export default function Board () {
  const { data: boards } = useGetBoardsQuery()
  const { boardId } = useParams()

  if (!boards || !boardId) {
    return null
  }

  const board = boards.byId[parseInt(boardId)]

  if (!board) {
    return null
  }

  return <div>
    <BoardInner board={board} />
  </div>
}