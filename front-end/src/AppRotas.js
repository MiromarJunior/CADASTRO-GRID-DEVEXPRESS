/*
Página recebe dados da autenticação e faz a liberação e controle da navegação entre as páginas
*/

import { useContext } from "react";
import { AuthContext, AuthProvider } from "./Autenticação/validacao";
import HomePage from "./Pages/Home";
import LoginPage from "./Login/Login";
import CadastroSeguradora from "./Pages/Seguradoras/CadastroSeguradora";
import CadastroFornecedor from "./Pages/Fornecedores/CadastroFornecedor";
import ListarUsuario from "./Pages/Usuario/ListarUsuario";
import ListarSeguradora from "./Pages/Seguradoras/ListarSeguradora";
import ListarFornecedor from "./Pages/Fornecedores/ListarFornecedor";
import Inicial from "./Pages/Inicial";
import GrupoDeAcesso from "./Pages/GrupoDeAcesso";
import ListarCategMsgs from "./Pages/CategoriaMensagens/ListarCategoriaMensagens";
import ListarGrupoItem from "./Pages/GruposItem/ListarGrupoItem";
import ListarSubGrupoItem from "./Pages/SubGruposItem/ListarSubGruposItem";
import Acesso from "./Pages/Acesso";
import CadastroParametroLeilao from "./Pages/Leilao/CadastroParametroLeilao";
import MarcaVeiculo from "./Pages/Marca/MarcaVeiculo";
import SacMontadoras from "./Pages/SacMontadoras/SacMontadoras";
import Regiao from "./Pages/Regiao/Regiao";
import JustificativaItem from "./Pages/JustificativaItem/JustificativaItem";
import Municipios from "./Pages/Municipios/Municipios";
import TipoPeca from "./Pages/TipoPeca/TipoPeca";
import ListarParametroLeilao from "./Pages/Leilao/ListarParametroLeilao";
import StatusItem from "./Pages/StatusItem/StatusItem";

const { BrowserRouter, Routes, Route, Navigate } = require("react-router-dom");

const AppRotas = () => {
  const Private = ({ children }) => {
    const { authenticated, loading } = useContext(AuthContext);
    if (loading) {
      return <div className="loading">Carregando...</div>;
    }
    if (!authenticated) {
      return <Navigate to="/"></Navigate>;
    }
    return children;
  };

  return (
    <BrowserRouter>
      <AuthProvider>
        <HomePage />

        <Routes>
          <Route exact path="/" element={<LoginPage />} />       
          <Route exact path="/cadastrarparametrosLeilao/:idPar" element={<Private><CadastroParametroLeilao /></Private>}/>
          <Route exact path="/listarparametrosLeilao" element={<Private><ListarParametroLeilao /></Private>}/>

          <Route exact path="/home" element={<Private><Inicial/></Private>}/>
          <Route exact path="/listarGrupoItem" element={<Private><ListarGrupoItem /></Private>}/>
          <Route exact path="/ListarSubGrupoItem/:idGrupo" element={<Private><ListarSubGrupoItem /></Private>}/>
          <Route exact path="/listarCategMsgs" element={<Private><ListarCategMsgs /></Private>}/>
          <Route exact path="/acessos/:idGa/:grAce/:grMen" element={<Private><Acesso/></Private>}/>
          <Route exact path="/gruposDeAcesso" element={<Private><GrupoDeAcesso/></Private>}/>
          <Route exact path="/listarSeguradora" element={<Private><ListarSeguradora/></Private>}/>
          <Route exact path="/cadastroSeguradora/:idSeg" element={<Private><CadastroSeguradora/></Private>}/>
          <Route exact path="/listarUsuario" element={<Private><ListarUsuario/></Private>}/>
          <Route exact path="/marcaVeiculo" element={<Private><MarcaVeiculo/></Private>}/>
          <Route exact path="/sacmontadoras" element={<Private> <SacMontadoras /></Private>}/>
          <Route exact path="/tipoPeca" element={<Private> <TipoPeca /> </Private>} />
          <Route exact path="/regiao" element={<Private> <Regiao /> </Private>} />
          <Route exact path="/justificativaItem" element={<Private><JustificativaItem /> </Private>} />
          <Route exact path="/municipios" element={<Private><Municipios /> </Private>} />
          <Route exact path="/listarFornecedor" element={ <Private><ListarFornecedor /></Private> } />
          <Route exact path="/cadastroFornecedor/:idFornecedor" element={<Private> <CadastroFornecedor /> </Private>} />
          <Route exact path="/statusItem" element={ <Private><StatusItem /></Private> } />
          
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};


export default AppRotas;
