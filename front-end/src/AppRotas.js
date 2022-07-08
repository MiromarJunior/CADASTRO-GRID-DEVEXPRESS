/*
Página recebe dados da autenticação e faz a liberação e controle da navegação entre as páginas
*/

import { useContext } from "react";
import { AuthContext, AuthProvider } from "./Autenticação/validacao";
import HomePage from "./Pages/Home";
import LoginPage from "./Login/Login";
import CadastroSeguradora from "./Pages/Seguradoras/CadastroSeguradora";
import ListarUsuario from "./Pages/Usuario/ListarUsuario";
import ListarSeguradora from "./Pages/Seguradoras/ListarSeguradora";
import Acesso from "./Pages/Usuario/Acesso";
import Inicial from "./Pages/Inicial";
import GrupoDeAcesso from "./Pages/GrupoDeAcesso";




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
                <Route exact path="/home" element={<Inicial/>} /> 

                   
                
             
                <Route exact path="/acessos/:idGa/:grAce/:grMen" element={ <Private><Acesso /></Private> } />     
                <Route exact path="/gruposDeAcesso" element={ <Private><GrupoDeAcesso /></Private> } />            
                <Route exact path="/listarSeguradora" element={ <Private><ListarSeguradora /></Private> } />
                <Route exact path="/cadastroSeguradora/:idSeg" element={<Private> <CadastroSeguradora /> </Private>} />
                <Route exact path="/listarUsuario" element={ <Private><ListarUsuario /> </Private>} />
              
           
              
            </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}

export default AppRotas;