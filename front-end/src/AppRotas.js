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
import Inicial from "./Pages/Inicial";
import GrupoDeAcesso from "./Pages/GrupoDeAcesso";
import ListarCategMsgs from "./Pages/CategoriaMensagens/ListarCategoriaMensagens";
import ListarGrupoItem from "./Pages/GruposItem/ListarGrupoItem";
import ListarSubGrupoItem from "./Pages/SubGruposItem/ListarSubGruposItem";
import Acesso from "./Pages/Acesso";
import ParametroLeilao from "./Pages/Leilao/ParametroLeilao";
import MarcaVeiculo from "./Pages/Marca/MarcaVeiculo";

import ListarRegiao from "./Pages/Regiao/ListarRegiao";
import ListarJustificativaItem from "./Pages/JustificativaItem/ListarJustificativaItem";
import ListarMunicipios from "./Pages/Municipios/ListarMunicipios";

const { BrowserRouter, Routes, Route, Navigate, } = require("react-router-dom");


const AppRotas = () => {
    const Private = ({ children }) => {
        const { authenticated, loading } = useContext(AuthContext);
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
                    <Route exact path="/" element={<LoginPage />} />
                    {/* <Route exact path="/home" element={<Inicial/>} /> 
                 <Route exact path="/listarGrupoItem" element={ <ListarGrupoItem />} /> 
                <Route exact path="/ListarSubGrupoItem/:idGrupo" element={ <ListarSubGrupoItem /> } /> 
                <Route exact path="/listarCategMsgs" element={ <ListarCategMsgs /> } />
                <Route exact path="/acessos/:idGa/:grAce/:grMen" element={ <Acesso />} />     
                <Route exact path="/gruposDeAcesso" element={ <GrupoDeAcesso /> } />            
                <Route exact path="/listarSeguradora" element={ <ListarSeguradora /> } />
                <Route exact path="/cadastroSeguradora/:idSeg" element={ <CadastroSeguradora />} />
                <Route exact path="/listarUsuario" element={ <ListarUsuario /> } /> */}


                    <Route exact path="/parametrosLeilao" element={<Private><ParametroLeilao /> </Private>} />
                    <Route exact path="/home" element={<Private><Inicial /></Private>} />
                    <Route exact path="/listarGrupoItem" element={<Private><ListarGrupoItem /> </Private>} />
                    <Route exact path="/ListarSubGrupoItem/:idGrupo" element={<Private><ListarSubGrupoItem /> </Private>} />
                    <Route exact path="/listarCategMsgs" element={<Private><ListarCategMsgs /> </Private>} />
                    <Route exact path="/acessos/:idGa/:grAce/:grMen" element={<Private><Acesso /></Private>} />
                    <Route exact path="/gruposDeAcesso" element={<Private><GrupoDeAcesso /></Private>} />
                    <Route exact path="/listarSeguradora" element={<Private><ListarSeguradora /></Private>} />
                    <Route exact path="/cadastroSeguradora/:idSeg" element={<Private> <CadastroSeguradora /> </Private>} />
                    <Route exact path="/listarUsuario" element={<Private><ListarUsuario /> </Private>} />
                    <Route exact path="/marcaVeiculo" element={<Private><MarcaVeiculo /> </Private>} />

                    <Route exact path="/listarRegiao" element={<Private> <ListarRegiao /> </Private>} />
                    <Route exact path="/listarJustificativaItem" element={<Private><ListarJustificativaItem /> </Private>} />
                    <Route exact path="/listarMunicipios" element={<Private><ListarMunicipios /> </Private>} />

                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}

export default AppRotas;