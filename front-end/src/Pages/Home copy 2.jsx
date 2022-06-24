import { useContext, useEffect, useState } from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../Autenticação/validacao";
import("./home.css");




const HomePage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { logout, nomeUser } = useContext(AuthContext);

  
  return (
    <div style={{ display: nomeUser() ? "" : "none" }} >
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
                {/* <button style={{ fontSize: 12, marginBottom: "10px" }} className="btn btn-outline-primary margemRight" onClick={(e) => navigate("/cadastroSeguradora/0")}>CADASTRAR SEGURDORA</button>
                <button style={{ fontSize: 12 }} className="btn btn-outline-primary margemRight" onClick={(e) => navigate("/listarSeguradora")}>LISTAR SEGURADORAS</button> */}


<Dropdown className="btnMenu" >
  <Dropdown.Toggle variant="success" id="dropdown-basic">
    CADASTROS GERAIS
  </Dropdown.Toggle>

  <Dropdown.Menu>
    <Dropdown.Item ></Dropdown.Item>
 


    <Dropdown>
  <Dropdown.Toggle variant="success" id="dropdown-basic">
    BÁSICOS
  </Dropdown.Toggle>

  <Dropdown.Menu>
    <Dropdown.Item >
    
    <button style={{ fontSize: 12 }} className="btn btn-outline-primary margemRight" onClick={(e) => navigate("/listarSeguradora")}>LISTAR SEGURADORAS</button> 
    </Dropdown.Item>

    <Dropdown.Item >
    <button style={{ fontSize: 12, marginBottom: "10px" }} className="btn btn-outline-primary margemRight" onClick={(e) => navigate("/cadastroSeguradora/0")}>CADASTRAR SEGURADORA</button>
    </Dropdown.Item>
  
  </Dropdown.Menu>
</Dropdown>
  </Dropdown.Menu>  
</Dropdown>
         

           


         








              </ul>

            </div>

            <div className="modal-footer" >

              <button className="btn btn-outline-danger " data-bs-dismiss="modal" onClick={(e) => logout(e)}  > SAIR</button>
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


/*


                <div className="dropdown"style={{  marginBottom: "5px" }} >
                  <button  className="btn btn-secondary dropdown-toggle btnMenu" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                    CADASTROS GERAIS
                  </button>
                  <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                     <li>
                                     
                                     </li>
                  </ul>
                </div>

                <div className="dropdown" style={{  marginBottom: "5px" }} >
                  <button className="btn btn-secondary dropdown-toggle btnMenu" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                    PEÇAS
                  </button>
                  <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                  </ul>
                </div>

                <div className="dropdown" style={{  marginBottom: "5px" }} >
                  <button className="btn btn-secondary dropdown-toggle btnMenu" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                    RADAR HDI
                  </button>
                  <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                  </ul>
                </div>

                <div className="dropdown" style={{  marginBottom: "5px" }} >
                  <button className="btn btn-secondary dropdown-toggle " type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                    RANKING
                  </button>
                  <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                  </ul>
                </div>


          <li className="list-group-item">DOCUMENTOS</li>
          <li className="list-group-item">APLICATIVO</li>
          <li className="list-group-item">CONTATOS</li>
          <li className="list-group-item">SOBRE</li>


            <li><a class="dropdown-item" href="#">Another action</a></li>
    <li><a class="dropdown-item" href="#">Something else here</a></li>









    
            <DropdownButton id="" variant="secondary"title="PEÇAS   "  className="btnMenu">
              <Dropdown.Item >
                        </Dropdown.Item>              
              </DropdownButton>
          
             
              <DropdownButton id="dropdown-basic-button" variant="secondary"title="RADAR HDI"  className="btnMenu">
              <Dropdown.Item >
                        </Dropdown.Item>              
              </DropdownButton>

              <DropdownButton id="dropdown-basic-button" variant="secondary"title="RANKING"  className="btnMenu">
              <Dropdown.Item >
                        </Dropdown.Item>              
              </DropdownButton>

              <DropdownButton id="dropdown-basic-button" variant="secondary"title=""  className="btnMenu">
              <Dropdown.Item >
                        </Dropdown.Item>              
              </DropdownButton>

              <DropdownButton id="dropdown-basic-button" variant="secondary"title=""  className="btnMenu">
              <Dropdown.Item >
                        </Dropdown.Item>              
              </DropdownButton>
          
*/