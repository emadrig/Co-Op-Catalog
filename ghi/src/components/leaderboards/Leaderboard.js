import { useGetLeaderBoardByGameQuery } from "../../store/Api";
import { useParams } from "react-router-dom";


function Leaderboard() {
    const { name } = useParams()
    const { data: game } = useGetLeaderBoardByGameQuery(name)
    console.log(game)
}