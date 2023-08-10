import { useGetLeaderBoardByGameQuery } from "../../store/Api";
import Modal from "react-modal";
// import './LeaderboardModal.css'

Modal.setAppElement('#root');

function LeaderboardModal({ setModalIsOpen, modalIsOpen, id }) {
    const { data: game } = useGetLeaderBoardByGameQuery(id)

    console.log(game)

    return (
        <div>
        <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={() => setModalIsOpen(false)}
                    id="leaderboard-modal"
                    className="leaderboard-content"
                    overlayClassName="leaderboard-overlay"
                >
            <div className="modal-container">

            <div>
                <h1 id="title"> {game?.high_scores[0].game.name} Leaderboard</h1>
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
            </div>
            </Modal>
        </div>
    )
}

export default LeaderboardModal;
