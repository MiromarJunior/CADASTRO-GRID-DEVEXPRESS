/*
Página recebe dados da autenticação e faz a liberação e controle da navegação entre as páginas
*/

import { useContext } from "react";
import { AuthContext, AuthProvider } from "./Autenticação/validacao";
import HomePage from "./Pages/Home";
import LoginPage from "./Login/Login";
import ListarProdutos from "./Pages/Produtos/ListarProdutos";
import CadastroUniEmp from "./Pages/UnidadeEmpresarial/CadastrarUniEmp";
import CadastroUsuario from "./Pages/Usuario/CadastroUsuario";


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
            <Routes>
                <Route exact path="/" element={<LoginPage/>} />                
                <Route exact path="/cadastroUnidadeEmpresarial" element={ <CadastroUniEmp /> } />
                <Route exact path="/cadastroUsuario" element={ <CadastroUsuario /> } />
                <Route exact path="/home" element={<Private><HomePage /></Private> } />
                <Route exact path="/listarProdutos" element={<Private><ListarProdutos /></Private> } />
              
            </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}

export default AppRotas;