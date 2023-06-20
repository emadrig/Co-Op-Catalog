import { React} from "react";
import Carousel from "../carousel/Carousel";
import { useGetGamesQuery } from "../../store/Api";
import './MainPage.css'

function MainPage() {
    const { data, isLoading} = useGetGamesQuery()

    return (
        <div style={{"margin": "20px"}}>
            <div className="container">
                <Carousel />
                <div className="games-grid">
                {
                    isLoading ? <div>Loading...</div> : data.games.map(game => (
                        <div key={game.id} className="game-square">
                            <img className='game-square-img' src={require(`../../${game.gif}`)}/>
                        </div>
                    ))
                }
                </div>
            </div>
        </div>
    )
}

export default MainPage