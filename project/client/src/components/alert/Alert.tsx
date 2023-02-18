import Loading from "./Loading"
import Toast from "./Toast"
import { useSelector } from "react-redux"
import { RootStore } from "../../utils/TypeScript"

export const Alert = () => {
  const { alertReducer } = useSelector((state: RootStore) => state)

  return (
    <div>
        {alertReducer.loading && <Loading/>}
        {alertReducer.errors && <Toast title='Errors' body={alertReducer.errors} bgColor='bg-danger' />}
        {alertReducer.success && <Toast title='Success' body={alertReducer.success} bgColor='bg-success' />}
    </div>
  )
}

export const showErrMsg = (msg: string) => {
  return <div className="errMsg" >{msg}</div>
}

export const showSuccessMsg = (msg: string) => {
  return <div className="successMsg" >{msg}</div>
}