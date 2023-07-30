import Modal from "react-modal";
import { useGetGameDetailsQuery } from "../../store/Api";
import Leaderboard from "../leaderboards/Leaderboard";
import './GameDetailModal.css'
import { Link } from "react-router-dom";


// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root');

function GameDetailModal({ setModalIsOpen, modalIsOpen, name }) {
    const { data: game, isLoading } = useGetGameDetailsQuery(name)

    return (
        <>
            <div>
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={() => setModalIsOpen(false)}
                    id="game-detail-modal"
                    className="game-detail-content"
                    overlayClassName="game-detail-overlay"
                >
                    {isLoading ? <div>Loading...</div> : (
                        <>
                            <div className="modal-container">
                                <h1 id='game-detail-title'>{game.name}</h1>
                                <div className="row">
                                    <div className="column" id="left-column">
                                        <div className="cell" id="game-area">
                                            <img src={require(`../../${game.picture_1}`)} id="big-game-img" alt="" />
                                        </div>
                                        <div className="row" id="game-pictures">
                                            <div className="cell" >
                                                <img src={require(`../../${game.picture_2}`)} alt="" className="game-picture" />
                                            </div>
                                            <div className="cell" >
                                                <img src={require(`../../${game.picture_3}`)} alt="" className="game-picture" />
                                            </div>
                                            <div className="cell" >
                                                <img src={require(`../../${game.picture_1}`)} alt="" className="game-picture" />
                                            </div>
                                        </div>
                                        <div className="row" id="play-options">
                                            <Link to={`/play/${game.name}`} className="cell" id="play-against-friend">Play against Friend</Link>
                                            <div className="cell" id="play-against-computer">Play against Computer</div>
                                        </div>
                                        <div className="cell" id="description">{game.description}</div>
                                    </div>
                                    <div className="column" id="right-column">
                                        <div className="row">
                                            <div className="cell" id="leaderboard">
                                                <Leaderboard id={game.id} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </Modal>
            </div>
        </>
    );
}

export default GameDetailModal;
