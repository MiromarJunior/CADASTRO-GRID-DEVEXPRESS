/*
Página recebe dados da autenticação e faz a liberação e controle da navegação entre as páginas
*/

import { useContext } from "react";
import { AuthContext, AuthProvider } from "./Autenticação/validacao";
import HomePage from "./Pages/Home";
import LoginPage from "./Login/Login";
import ListarProdutos from "./Pages/Produtos/ListarProdutos";
import CadastroSeguradora from "./Pages/Seguradoras/CadastroSeguradora";
import ListarUsuario from "./Pages/Usuario/ListarUsuario";
import ListarSeguradora from "./Pages/Seguradoras/ListarSeguradora";



const { BrowserRouter, Routes, Route, Navigate, } = require("react-router-dom");


const AppRotas = () => {
    const Private = ({ children }) => {
        const { authenticated, loading} = useContext(AuthContext);
        if (loading) {
            return <div className="loading">Carregando...</div>
        }
        if (!authenticated) {
            return <Navigate to="/"></Navigate>
        }
        return children;

    } 


    return (

        <BrowserRouter>
       
        <AuthProvider>
        <HomePage />
   
      
       
      
            <Routes>
                <Route exact path="/" element={<LoginPage/>} />    
                            
                <Route exact path="/listarSeguradora" element={ <ListarSeguradora /> } />
                <Route exact path="/cadastroSeguradora/:idSeg" element={ <CadastroSeguradora /> } />
                <Route exact path="/listarUsuario" element={ <ListarUsuario /> } />
              
                <Route exact path="/listarProdutos" element={<Private><ListarProdutos /></Private> } />
              
            </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}

export default AppRotas;