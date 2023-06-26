import { useGetLeaderBoardByGameQuery } from "../../store/Api";


function Leaderboard({ id }) {
    const { data: game } = useGetLeaderBoardByGameQuery(id)
    console.log(game);

    return (
        <>
            <div>
                <h1>Leaderboard</h1>
            </div>
            <div>
                {game ?
                        game.records.map(record => {
                            return (
                                <div key={record.id}>
                                    <p>{record.score}</p>
                                    <p>{record.player.username}</p>
                                </div>
                            )
                        })
                    :
                    <div>Loading</div>}
            </div>
        </>
    )
}

export default Leaderboard;