import { useGetLeaderBoardByGameQuery } from "../../store/Api";


function Leaderboard({ id }) {
    const { data: game } = useGetLeaderBoardByGameQuery(id)

    return (
        <>
            <div>
                <h1>Leaderboard</h1>
            </div>
            <div>
                {game ?
                    <table>
                        <thead>
                            <tr>
                                <th>Player</th>
                                <th>Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {game.high_scores.map(highScore => {
                                return (
                                    <tr key={highScore.id}>
                                        <td>{highScore.player.username}</td>
                                        <td>{highScore.score}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                    :
                    <div>Loading</div>}
            </div>
        </>
    )
}

export default Leaderboard;