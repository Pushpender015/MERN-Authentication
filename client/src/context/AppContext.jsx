import { createContext, useState , useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {

    // This line tells Axios to automatically include cookies (like session ID or authentication token) in every request you send — especially when making cross-origin requests (frontend ↔ backend on different domains or ports).
    axios.defaults.withCredentials = true;

    const backendURL = import.meta.env.VITE_BACKEND_URL;
    const [isLoggedin , setIsLoggedin] = useState(false);
    const [userData, setUserData] = useState(false);

    const getAuthState = async () => {
        try {
            const {data} = await axios.get(backendURL + '/api/auth/is-auth')

            if(data.success) {
                setIsLoggedin(true)
                getUserData()
            }
        }
        catch (error) {
            toast.error(error.message);
        }
    }

    const getUserData = async () => {
        try {
            const {data} = await axios.get(backendURL + '/api/user/data')

            console.log("data: " , data);

            data.success ? setUserData(data.userData) : toast.error(data.message)
        }
        catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(() => {
      getAuthState()
    }, [])
    

    const value = {
        backendURL,
        isLoggedin,
        setIsLoggedin,
        userData,
        setUserData,
        getUserData
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}