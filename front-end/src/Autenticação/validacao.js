import { useNavigate } from "react-router-dom";
import { api, loginUsuario } from "../Service/usuarioService";
const { createContext, useState, useEffect } = require("react");

export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [Usuario, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  
    const recoveredUser = localStorage.getItem("Usuario");
    if (recoveredUser) {
      setUser(JSON.parse(recoveredUser));
    }
    setLoading(false);
  }, []);



  const login = async (usuario, senha) => {
    try {
      let dados = {usuario, senha}
      const response = await loginUsuario(dados);
      const loggedUser = response.data.Usuario;
      let token = response.data.token;   
   
      localStorage.setItem("Usuario", JSON.stringify(loggedUser));
      localStorage.setItem("token", token);   
    

      sessionStorage.setItem("diplayU","none");
      api.defaults.headers.Authorization = `Bearer ${token}`;
      setUser(loggedUser);
      navigate("/listarProdutos");
    
     
     
      if (token === undefined) {
        alert("Usuário ou Senha inválido");
        localStorage.removeItem("token");
        localStorage.removeItem("Usuario");
        api.defaults.headers.Authorization = null;
        setUser(null);
        navigate("/");
      }
    } catch (error) {
      alert("Erro ao tentar conectar com servidor !!");
      localStorage.removeItem("token");
      localStorage.removeItem("Usuario");
      api.defaults.headers.Authorization = null;
      setUser(null);
      navigate("/");
    }
  };

  function nomeUser(){
    return Usuario;
  }
 
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("Usuario");
     api.defaults.headers.Authorization = null;
    setUser(null);
    navigate("/");
   
  
  };


const valor = "teste novo"
  return (
    <AuthContext.Provider
      value={{ authenticated: !!Usuario, Usuario, loading, login, logout,nomeUser}}
    >
      {children}
    </AuthContext.Provider>
  );
};