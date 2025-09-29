import { createContext, useState, useEffect } from "react";
import API from "../api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // ✅ Fetch user profile on app load
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await API.get("/profile");
                setUser(response.data.profile);
            } catch (error) {
                console.error("User not authenticated");
            }
            setLoading(false);
        };
        fetchUser();
    }, []);

    // ✅ Login Function
    const login = async (userData) => {
        try {
            const response = await API.post("/auth/login", userData);
            localStorage.setItem("token", response.data.token);
            setUser(response.data.user);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    };

    // ✅ Logout Function
    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};




