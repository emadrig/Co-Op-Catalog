import { useEffect, useState } from 'react'
import './Carousel.css'
import { useGetGamesQuery } from '../../store/Api'


function Carousel() {
    const { data: games, isLoading} = useGetGamesQuery()
    const [currentIndex, setCurrentIndex] = useState(0)

    const carouselInfiniteScroll = () => {
        if (currentIndex === games.length - 1) {
            return setCurrentIndex(0)
        }
        return setCurrentIndex(currentIndex + 1)
    }

    useEffect(() => {
        const interval = setInterval(() => { carouselInfiniteScroll() }, 4000)
        // clean up function
        return () => clearInterval(interval)
    })

    return (
        <div className='carousel-container'>
            {isLoading ? <div>Loading...</div> : games.map((game, index) => {
                return <h1 className='carousel-item'
                    style={{ transform: `translate(-${currentIndex * 100}%)` }}
                    key={index}>
                        <img src={require(`../../${game.picture_1}`)} alt={`Slide ${index}`} />
                    </h1>
            })
            }
        </div>
    )
}
export default Carousel