import React, { useState, useEffect } from 'react';
import BasicLayout from "../layouts/BasicLayout";
import { useRouter } from "next/router";
import { getGameByUrlapi } from "../api/game";
import HeaderGame from "../components/Game/HeaderGame";

export default function Game() {
    const [game, setGame] = useState(null);   
    const { query } = useRouter(); 

    useEffect(() => {
        (async () => {
            const response = await getGameByUrlapi(query.game);
            setGame(response);
        })()
    }, [query])

    if(!game) return null;

    return (
        <BasicLayout className="game">
            <HeaderGame game={game} />
            <p>Tabas Game</p>
        </BasicLayout>
    )
}
