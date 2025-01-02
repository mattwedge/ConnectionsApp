import { useNavigate } from "react-router-dom";
import { useGetBoardsQuery } from "../../reduxStore/services/api/boards"

export default function Home () {
  const { data } = useGetBoardsQuery()
  const navigate = useNavigate();

  if (!data) {
    return null
  }

  const sortedBoards = Object.values(data.byId)
    .sort((a, b) => a.created_at < b.created_at ? 1 : -1)
    .map(board => {
      const creationDate = new Date(board.created_at)
      return <div
        className="px-4 py-2 bg-green-200 rounded-lg border-green-800 border-2 hover:bg-green-300 cursor-pointer"
        key={board.id}
        onClick={() => navigate(`/board/${board.id}`)}
      >
        <div className="flex flex-row">
          <h2 className="font-bold text-lg mr-4">{board.name}</h2>
          <div className="text-sm">{`${creationDate.getDate()}/${creationDate.getMonth() + 1}/${creationDate.getFullYear()}`}</div>
        </div>
        <div>By {board.created_by.username}</div>
      </div>
    })

  return <>{sortedBoards}</>
} 