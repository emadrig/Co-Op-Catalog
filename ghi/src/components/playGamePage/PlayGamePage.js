import { useParams } from "react-router-dom";
import { useGetGameDetailsQuery } from "../../store/Api";
import { useState } from "react";
import './PlayGamePage.css'



function PlayGamePage() {
    const { gameName } = useParams()
    const { data: game, isLoading } = useGetGameDetailsQuery(gameName)
    if (isLoading) {
        return (
            <div>Loading...</div>
        )
    } else {
        return (
            <div className="play-games-page">
                <div>{game.name}</div>
                <div>{game.description}</div>
                <div>{game.rules}</div>
            </div>
        )
    }
}

export default PlayGamePage