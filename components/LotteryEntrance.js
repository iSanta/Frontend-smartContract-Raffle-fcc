import { useEffect, useState } from "react"
import { useMoralis } from "react-moralis"

import { useWeb3Contract } from "react-moralis"
import { abi, contractAddesses } from "../constants/"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"

export default function LotteryEntrance() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainId = parseInt(chainIdHex)
    console.log("chainId: " + parseInt(chainIdHex))
    const raffleAddress = chainId in contractAddesses ? contractAddesses[chainId][0] : null

    //console.log(useWeb3Contract)

    const [entranceFee, setEntranceFee] = useState("0")
    const [numPlayer, setNumPlayer] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")




    const dispatch = useNotification()

    const { runContractFunction: enterRaffle } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        msgValue: entranceFee,
        params: {},
    })

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, // specify the networkId
        functionName: "getEntranceFee",
        params: {},
    })
    const { runContractFunction: getNumOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, // specify the networkId
        functionName: "getNumOfPlayers",
        params: {},
    })
    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress, // specify the networkId
        functionName: "getRecentWinner",
        params: {},
    })

    async function updateUI() {
        const entranceFeeFromCall = (await getEntranceFee()).toString()
        const numPlayersFromCall = (await getNumOfPlayers()).toString()
        const recentWinnerFromCall = (await getRecentWinner()).toString()
        setEntranceFee(entranceFeeFromCall)
        setNumPlayer(numPlayersFromCall)
        setRecentWinner(recentWinnerFromCall)
        //console.log("valor entrada: " + entranceFee)
    }


    useEffect(() => {
        if (isWeb3Enabled) {

            updateUI()
        }
    }, [isWeb3Enabled])


    const handleSuccess = async (tx) => {
        await tx.wait(1)
        //updateUIValues()
        handleNewNotification(tx)
        updateUI()

    }

    const handleNewNotification = function () {
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Transaction Notification",
            position: "topR",
            icon: "bell",
        })


    }
    return (<div>
        {raffleAddress ? (
            <div>
                <button onClick={
                    async function () {
                        await enterRaffle({
                            // onComplete:
                            // onError:
                            onSuccess: handleSuccess,
                            onError: (error) => console.log(error),
                        })

                    }
                }>Entrar en la rifa</button><br />
                Hola, el costo de la entrada es {ethers.utils.formatEther(entranceFee)} ETH <br />
                Numero de jugadores actuales: {numPlayer}<br />
                Ultimo ganador: {recentWinner}<br />
            </div>
        ) : (
            <div>La direccion de la rifa no fue detectada</div>
        )}


    </div>)
}