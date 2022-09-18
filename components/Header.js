import { useMoralis } from "react-moralis"
import { useEffect } from "react"

export default function Header() {

    const { enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3, isWeb3EnableLoading } = useMoralis()
    useEffect(() => {
        if (isWeb3Enabled) return
        if (typeof window !== "undefined") {
            if (window.localStorage.getItem("connected")) {
                enableWeb3()
            }
        }
        //enableWeb3()
    }, [])

    useEffect(() => {
        Moralis.onAccountChanged((account) => {
            if (account == null) {
                window.localStorage.removeItem("connected")
                deactivateWeb3()
            }
        })
    }, [])

    return (<div>
        {account ? (<div>Conectado a {account.slice(0, 6)}...{account.slice(account.length - 4)}</div>) : (<button onClick={async () => {
            await enableWeb3()
            if (typeof window !== "undefined")
                window.localStorage.setItem("connected", "injected")
        }} disabled={isWeb3EnableLoading}>Connect</button>)}
    </div>)
}