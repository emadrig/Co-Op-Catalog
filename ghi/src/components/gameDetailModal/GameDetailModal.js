import Modal from "react-modal";
import { useGetGameDetailsQuery } from "../../store/Api";
import Leaderboard from "../leaderboards/Leaderboard";
import './GameDetailModal.css'


// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#root');

function GameDetailModal({ setModalIsOpen, modalIsOpen, name }) {
    const { data, isLoading } = useGetGameDetailsQuery(name)

    return (
        <>
            <div>
                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={() => setModalIsOpen(false)}
                    className="modal"
                >
                    {isLoading ? <div>Loading...</div> : (
                        <div className="container">
                            <div className="row">
                                <div className="column" id="left-column">
                                    <div className="cell" id="game-area">
                                        <img src={require(`../../${data.game.gif}`)} />
                                    </div>
                                    <div className="row" id="game-pictures">
                                        <div className="cell">Picture of game</div>
                                        <div className="cell">Picture of game</div>
                                        <div className="cell">Picture of game</div>
                                    </div>
                                    <div className="row" id="play-options">
                                        <div className="cell">Play against Friend</div>
                                        <div className="cell">Play against Computer</div>
                                    </div>
                                    <div className="cell" id="description">{ data.game.description }</div>
                                </div>
                                <div className="column" id="right-column">
                                    <div className="cell">
                                        <Leaderboard id={data.game.id} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </Modal>
            </div>
        </>
    );
}

export default GameDetailModal;
