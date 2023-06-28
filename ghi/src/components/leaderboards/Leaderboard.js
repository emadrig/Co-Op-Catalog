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
                            {game.records.map(record => {
                                return (
                                    <tr key={record.id}>
                                        <td>{record.player.username}</td>
                                        <td>{record.score}</td>
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