import { useCallback, useState } from "react";
import Carousel from "../carousel/Carousel";
import { useGetGamesQuery } from "../../store/Api";
import GameDetailModal from "../gameDetailModal/GameDetailModal";
import './MainPage.css'

function MainPage() {
    const { data: games, isLoading } = useGetGamesQuery()
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [gameName, setGameName] = useState('Testing')

    const activateGameDetailModal = useCallback(
        (name) => () => {
            setGameName(name)
            setModalIsOpen(true)
        },
        []
    )


    return (
        <>
            <div style={{ "margin": "20px" }}>
                <div className="container">
                    <Carousel />
                    <div className="games-grid">
                        {
                            isLoading ? <div>Loading...</div> : games.map(game => (
                                <div key={game.id} className="game-square">
                                    <img onClick={activateGameDetailModal(game.name)} className='game-square-img' src={require(`../../${game.gif}`)} />
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
            <GameDetailModal setModalIsOpen={setModalIsOpen} modalIsOpen={modalIsOpen} name={gameName} />
        </>
    )
}

export default MainPage