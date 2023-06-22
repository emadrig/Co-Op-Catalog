import { useGetLeaderBoardByGameQuery } from "../../store/Api";


function Leaderboard({id}) {
    const { data: game } = useGetLeaderBoardByGameQuery(id)
    console.log(game)
}

export default Leaderboard;