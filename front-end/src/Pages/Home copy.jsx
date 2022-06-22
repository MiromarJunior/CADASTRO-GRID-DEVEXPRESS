import { useContext, useEffect, useState } from "react";
import {useNavigate } from "react-router-dom";
import { AuthContext } from "../Autenticação/validacao";
import("./home.css");




const HomePage = ()=>{
    const navigate = useNavigate();
    const token = localStorage.getItem("token");    
    const { logout,nomeUser } = useContext(AuthContext);      
    return(
        <div style={{display : nomeUser() ? "" : "none"}} >
            <nav className="navbar navbar-light bg-light shadow">
  <div className="container-fluid">
    {/* <span className="navbar-brand mb-0 h1">Menu App</span> */}

    <button className="navbar-toggler" type="button" data-bs-toggle="modal" data-bs-target="#exampleModal">
      <span className="navbar-toggler-icon"></span>
    </button>
    <button className="btn btn-dark">Usuário(a){nomeUser()}</button>
  </div>
</nav>

<div className="modal true" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog modal-fullscreen">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLabel">MENU</h5>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body" >

        <ul className="list-group list-group-flush">
        <button style={{fontSize : 12, marginBottom : "10px"}} className="btn btn-outline-primary margemRight" onClick={(e)=>navigate("/cadastroSeguradora/0")}>CADASTRAR SEGURDORA</button> 
        <button style={{fontSize : 12}} className="btn btn-outline-primary margemRight" onClick={(e)=>navigate("/listarSeguradora")}>LISTAR SEGURADORAS</button> 

         
          <li className="list-group-item">DOCUMENTOS</li>
          <li className="list-group-item">APLICATIVO</li>
          <li className="list-group-item">CONTATOS</li>
          <li className="list-group-item">SOBRE</li>
        </ul>

      </div>
     
      <div className="modal-footer">
      
      <button className="btn btn-outline-danger "  data-bs-dismiss="modal" onClick={(e) => logout(e)}  > SAIR</button>
      </div>
             {/* <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div> */}
    </div>
  </div>
</div>


          
        </div>

    )

}

export default HomePage;