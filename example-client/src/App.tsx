import "./App.css"
import ConnectionForm from "./ConnectionForm"
import CashRegisterSimulator from "./CashRegisterSimulator"
import useCashRegisterStore from "./store"

const App = () => {
  const ipAddress = useCashRegisterStore((state) => state.ipAddress)

  return (
    <div className="App">
      <h1>VisioLab Example Client</h1>
      {ipAddress === "" && <ConnectionForm />}
      {ipAddress !== "" && <CashRegisterSimulator ipAddress={ipAddress} />}
    </div>
  )
}

export default App
