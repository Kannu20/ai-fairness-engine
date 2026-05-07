// import { createContext, useContext, useState, useEffect } from "react";
// import axios from "axios";

// const API = process.env.REACT_APP_API_URL || "";
// axios.defaults.withCredentials = true;

// const AuthContext = createContext(null);

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     axios
//       .get(`${API}/api/auth/me`)
//       .then((r) => setUser(r.data.user))
//       .catch(() => setUser(null))
//       .finally(() => setLoading(false));
//   }, []);

//   const loginWithGoogle = () => {
//     window.location.href = `${API}/api/auth/google`;
//   };

//   const loginWithEmail = async (email, password) => {
//     const res = await axios.post(`${API}/api/auth/login`, { email, password });
//     if (res.data.success) {
//       setUser(res.data.user);
//       window.location.href = "/dashboard";
//     }
//     return res.data;
//   };

//   const signupWithEmail = async (name, email, password, role) => {
//     const res = await axios.post(`${API}/api/auth/signup`, { name, email, password, role });
//     if (res.data.success) {
//       setUser(res.data.user);
//       window.location.href = "/dashboard";
//     }
//     return res.data;
//   };

//   const logout = async () => {
//     await axios.post(`${API}/api/auth/logout`);
//     setUser(null);
//     window.location.href = "/";
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, loginWithGoogle, loginWithEmail, signupWithEmail, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => useContext(AuthContext);
// export { API };

import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "";

axios.defaults.withCredentials = true;

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API}/api/auth/me`)
      .then((r) => setUser(r.data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const loginWithGoogle = () => {
    window.location.href = `${API}/api/auth/google`;
  };

  const loginWithEmail = async (email, password) => {
    const res = await axios.post(`${API}/api/auth/login`, { email, password });

    if (res.data.success) {
      setUser(res.data.user);
      window.location.href = "/dashboard";
    }

    return res.data;
  };

  const signupWithEmail = async (name, email, password, role) => {
    const res = await axios.post(`${API}/api/auth/signup`, {
      name,
      email,
      password,
      role,
    });

    if (res.data.success) {
      setUser(res.data.user);
      window.location.href = "/dashboard";
    }

    return res.data;
  };

  const logout = async () => {
    await axios.post(`${API}/api/auth/logout`);
    setUser(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginWithGoogle,
        loginWithEmail,
        signupWithEmail,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
export { API };