/**
 * Pagina em construção para cadastrar uma nova unidade empresarial
 */

import { useContext, useEffect, useRef, useState } from "react";
import { Button, Form, FormLabel, FormSelect, Modal } from "react-bootstrap";
// import apiUniEmpServ from "../../Services/UnidadeEmpresarialService"
// import apiEmpresaService from "../../Services/GrupoEmpresarialService"
import { useNavigate, useParams } from "react-router-dom";
// import apiEnderecoService from "../../Services/EnderecoService";
// import apiUsuarioService from "../../Services/usuarioService";
import "./cad.css";
import { cnpj, cpf } from 'cpf-cnpj-validator';
import { AuthContext } from "../../Autenticação/validacao";
import { DataTypeProvider, EditingState, IntegratedPaging, PagingState } from '@devexpress/dx-react-grid';
import {
    Grid,
    Table,
    TableHeaderRow,
    TableEditRow,
    TableEditColumn,
    PagingPanel,
  } from '@devexpress/dx-react-grid-bootstrap4';
import { saveContatoSeguradora, saveSeguradora } from "../../Service/seguradoraService";



const { format } = require('telefone');
const getRowId = row => row.ID_USUARIO;
let idSeg;

const CadastroSeguradora = () => {
    const [cnpjSeguradora, setCnpjSeguradora] = useState("");
    const [codLegado, setCodLegado] = useState("");
    const [tipoPessoa, setTipoPessoa] = useState("");
    const [optSimples, setOptSimples] = useState("");
    const [statusSeg, setStatusSeg] = useState("");
    const [razaoSocial, setRazaoSocial] = useState("");
    const [nomeFantasia, setNomeFantasia] = useState("");
    const [ie, setIE] = useState("");
    const [im, setIM] = useState("");
    const [logradouro, setLogradouro] = useState("");
    const [complemento, setComplemento] = useState("");
    const [bairro, setBairro] = useState("");
    const [estadoUF, setEstadoUF] = useState("");
    const [nrLogradouro, setNrLogradouro] = useState("");
    const [cep, setCep] = useState("");
    const [nomeCidade, setNomeCidade] = useState("");
    const [listaUF, setListaUF] = useState([]);
    const [smtpSist, setSmtpSist] = useState("");
    const [portaSist, setPortaSist] = useState("");
    const [emailSist, setEmailSist] = useState("");
    const [senhaEmailSist, setSenhaEmailSist] = useState("");
    const [remetenteEmailSist, setRemetenteEmailSist] = useState("");
    const [nomeRemetenteEmailSist, setNomeRemetenteEmailSist] = useState("");
    const [smtpSistAuth, setSmtpSistAuth] = useState("");
    const [smtpSistSecure, setSmtpSistSecure] = useState("");
    const [soapRetSol, setSoapRetSol] = useState("");
    const [soapRetNotas, setSoapRetNotas] = useState("");
    const [nomeContatoSeg, setNomeContatoSeg] = useState("");
    const [funcaoContatoSeg, setFuncaoContatoSeg] = useState("");
    const [departContatoSeg, setDepartContatoSeg] = useState("");
    const [emailContato, setEmailContato] = useState("");
    const [urlContato, setUrlContato] = useState("");
    const [dddContatoCel, setDddContatocel] = useState("");
    const [nrContatoCel, setNrContatoCel] = useState("");
    const [operadoraContato, setOperadoraContato] = useState("");
    const [dddContatoCom, setDddContatoCom] = useState("");
    const [nrContatoCom, setNrContatoCom] = useState("");
    const [ramalContato, setRamalContato] = useState("");
   
    
    


    const token = localStorage.getItem("token");   
    const navigate = useNavigate();
    const emailV = /\S+@\S+\.\S+/;




    const [rows,setRows] = useState([]);


    // const SelectInputDep = ({value})=>(       
    //     <FormSelect>      
    //              <option>{value[0]}</option>
    //              <option>{value[1]}</option>            
    //     </FormSelect>
    // )
    // const SelectInpuDepProv = (props)=>(
    //     <DataTypeProvider
    //     formatterComponent={SelectInputDep}
    //     {...props}
        
    //     />
    // )
    // const SelectInputFunc = ({value})=>(       
    //     <FormSelect>      
    //              <option>{"PEÇAS"}</option>
    //              <option>{"SERVIÇOS"}</option>                            
    //     </FormSelect>
    // )
    // const SelectInpuFuncProv = (props)=>(
    //     <DataTypeProvider
    //     formatterComponent={SelectInputFunc}
    //     {...props}
        
    //     />
    // )






    //const gridRef = useRef();
    const [columns] = useState([    
       
       
         { name: 'SGCO_NOME', title: "Nome Contato"}, 
         { name: 'SGCO_FUNCAO', title: "FUNÇÃO" },       
         {name: 'SGCO_DEPARTAMENTO', title: "DEPARTAMENTO"},
         { name: 'SGCO_EMAIL', title: "EMAIL"}, 
         { name: 'SGCO_URL', title: "URL"},
          { name: 'SGCO_CELULAR_DDD', title: " DDD"}, 
          { name: 'SGCO_CELULAR_NUMERO', title: " NR CELULAR"},   
          { name: 'SGCO_CELULAR_OPERADORA', title: " OPERADORA"},         
          { name: 'SGCO_FONE_COMERCIAL_DDD', title: " DDD"},   
          { name: 'SGCO_FONE_COMERCIAL_NUMERO', title: " NR COMERCIAL"},   
          { name: 'SGCO_FONE_COMERCIAL_RAMAL', title: " RAMAL"},  
         

 
     ]);
    //  const [selectDep]= useState(["SGCO_DEPARTAMENTO"]);
    //  const [selectFunc]= useState(["SGCO_FUNCAO"]);

  
     
     const commitChanges = ({ added, changed, deleted }) => {
        let changedRows;
        if (added) {           
          const startingAddedId = rows.length > 0 ? rows[rows.length - 1].id + 1 : 0;
          changedRows = [
            ...rows,
            ...added.map((row, index) => ({
              id: startingAddedId + index,
              ...row,
            })),
          ];
          setRows(changedRows);
          salvarContato(changedRows);
        }
        if (changed) {
          changedRows = rows.map(row => (changed[row.id] ? { ...row, ...changed[row.id] } : row));
          setRows(changedRows);
        }
        if (deleted) {
            
         const deletedSet = new Set(deleted);
          changedRows = rows.filter(row => deletedSet.has(row.id)  );         
         //deletarProdutoID(changedRows.map(l=>l.PRDT_ID));         
        }       
      };

    // useEffect(() => {
    //     buscaGrupoEmp();
    //     buscaEstadoUF();
    //     buscaUsuario();

    // }, [codigo]);


    // const buscaUsuario = () => {
    //     const dados = { token, nomeUser : nomeUser() }
    //     apiUsuarioService.getAcessoMenu(dados)
    //         .then((res) => {
    //             if (res.data === "erroLogin") {
    //                 alert("Sessão expirada, Favor efetuar um novo login !!");
    //                 logout();
    //                 window.location.reload();
    //             } else {
    //                 res.data.forEach((l) => {                      

    //                         if (process.env.REACT_APP_CADUNI === l.ACES_DESCRICAO) {
    //                             setDisplayCadastro("");
    //                             setAcessoCAD(true);
    //                         }
    //                         if (process.env.REACT_APP_GERAL === l.ACES_DESCRICAO) {
    //                             setDisplayCadastro("");
    //                             setAcessoCAD(true);
    //                             setAcessoTotalSistema(true);
    //                         }
                        
    //                 })
    //             }

    //         }).catch((res) => {
    //             alert(res.data)
    //         })


    // }

    // const buscaGrupoEmp = () => {
    //     const cod = { codigo, token ,acessoTotalSistema}
    //     apiEmpresaService.getGrupoEmpID(cod)
    //         .then((res) => {
    //             if (res.data === "erroLogin") {
    //                 alert("Sessão expirada, Favor efetuar o login");
    //                 logout();
    //                 window.location.reload();
    //             } else {
    //                 setGrupoEmp(res.data);
    //             }


    //         }).catch((res) => {
    //             alert(res.data);
    //         })
    // }



    // const buscaEstadoUF = () => {
    //     const dados = { token,acessoTotalSistema }
    //     apiEnderecoService.getEstadosUF(dados)
    //         .then((res) => {
    //             if (res.data === "erroLogin") {
    //                 alert("Sessão expirada, Favor efetuar o login");
    //                 logout();
    //                 window.location.reload();
    //             }
    //             else {

    //                 setListaUF(res.data);

    //             }

    //         }).catch((res) => {
    //             alert(res.data);
    //         })

    // }


    const salvarSeguradora = (e) => {
        e.preventDefault();
        // var cnpj01, cep01, ie01, im01;
        // if (cnpjSeguradora) { cnpj01 = cnpjEmpresa.replace(/\D/g, '') } else { cnpj01 = cnpjSeguradora };
        // if (cep) { cep01 = cep.replace(/\D/g, '') } else { cep01 = cep };
        // if (ie) { ie01 = ie.replace(/\D/g, '') } else { ie01 = ie };
        // if (im) { im01 = im.replace(/\D/g, '') } else { im01 = im };
        
        const dados = {            
            codLegado, cnpjSeguradora, tipoPessoa,optSimples,statusSeg,
            razaoSocial, nomeFantasia, ie, im,
            logradouro, complemento, bairro, estadoUF, nrLogradouro, cep,
            nomeCidade, smtpSist, portaSist, emailSist, senhaEmailSist,
            remetenteEmailSist, nomeRemetenteEmailSist, smtpSistAuth ,smtpSistSecure,
            soapRetSol, soapRetNotas, nomeContatoSeg, funcaoContatoSeg, departContatoSeg,
            emailContato, urlContato, dddContatoCel, nrContatoCel ,operadoraContato, dddContatoCom,
            nrContatoCom, ramalContato, token    


        };

                       
                    saveSeguradora(dados)
                        .then((res) => {
                            if (res.data === "erroLogin") {
                                alert("Sessão expirada, Favor efetuar um novo login !!");
                                //logout();
                                window.location.reload();
                            }
                            else if (res.data === "semAcesso") {
                                alert("Usuário sem permissão !!!");                                

                            } else if (res.data === "campoNulo") {
                                alert("Preencha todos os Campos obrigatorios!!!");
                            }
                            else {
                                      (res.data).forEach((l)=>{ idSeg = l.ID_SEGURADORA});
                                      
                                        alert("Seguradora Cadastrada  com Sucesso!!!");
                                        if(window.confirm("Deseja cadastrar um novo contato")){
                                            setShow(true);
                                        }

                                       
                                                
                                  
                                                         

                            }

                        }).catch((erro)=>{
                            console.log(erro, "erro ao tentar cadastrar")
                        })            
                
         
                    
            } 

            console.log(idSeg, "ID");

    const salvarContato = (rows)=>{
        const dadosContato = {contatos : rows, token}
        saveContatoSeguradora(dadosContato)
                    .then((res) => {
                        if (res.data === "erroLogin") {
                            alert("Sessão expirada, Favor efetuar um novo login !!");
                            //logout();
                            window.location.reload();
                        }
                        else if (res.data === "semAcesso") {
                            alert("Usuário sem permissão !!!");                                

                        } else if (res.data === "campoNulo") {
                            alert("Preencha todos os Campos obrigatorios!!!");
                        }
                        else if (res.data === "sucesso") {
                            alert("Contato Cadastrado  com Sucesso!!!");     
                            
                        }

                        else {
                            alert("Erro ao cadastrar");                              

                        }

                    }).catch((error)=> {
                    console.log(error,
                        "Erro ao salvar Contato");
                    
                })

    }

 


    const buscaCepOnline = (e) => {
        e.preventDefault();
        var cepSONr = cep.replace(/\D/g, '');
        if (cepSONr !== "") {
            var validacep = /^[0-9]{8}$/;
            if (validacep.test(cepSONr)) {

                fetch(`https://viacep.com.br/ws/${cepSONr}/json/`)
                    .then(res => res.json()).then(data => {

                        if (data.erro) {
                            alert("CEP não encontrado")
                        } else {
                            setBairro(data.bairro);
                            setEstadoUF(data.uf);
                            setLogradouro(data.logradouro);
                           
                            setNomeCidade(data.localidade);

                        }
                    }).catch(res => {
                        alert("CEP não encontrado !!!")
                    })
            }
        } else {
            alert("Favor preencher cep corretamente !!!")
        }
    }

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);



    return (

        <div>
            <button  onClick={handleShow}  >modal</button>

        <div className="container-fluid"  style={{marginBottom : "10px", marginTop : "10px"}}>
          

            <div  className="form-inline" id="" style={{fontSize : "9"}}>
            <div className="form-group col-md-8">
            <h3 id="titulo">CADASTRAR SEGURADORA </h3>
            </div>
            <div className="form-group col-md-12"></div>
            <div className="form-group col-md-6 margemRight">
                    <Form.Label   >RAZÃO SOCIAL</Form.Label>
                    <Form.Control className=""  type="text" onChange={(e) => setRazaoSocial(e.target.value)} value={razaoSocial} style={{ width: "100%" }} placeholder="" />
                </div>
               

                <div className="form-group col-md-5 ">
                    <Form.Label   >NOME FANTASIA</Form.Label>
                    <Form.Control  className="form__input1" type="text" onChange={(e) => setNomeFantasia(e.target.value)} value={nomeFantasia} style={{ width: "102%" }} placeholder="" />

                </div>     
            
           
            <div className="form-group col-md-2 margemRight" >
                    <Form.Label  >CNPJ OU CPF</Form.Label>
                    <Form.Control className="  form__input1 " maxLength={18} type="cnpj" onChange={(e) => setCnpjSeguradora(e.target.value)} value={cnpjSeguradora.length === 11? cpf.format(cnpjSeguradora) : cnpj.format(cnpjSeguradora)}  placeholder="" />

                </div>
                <div className="form-group col-md-2 margemRight" >
                    <Form.Label  >CODIGO LEGADO</Form.Label>
                    <Form.Control className="  form__input1 " value={codLegado} onChange={(e)=>setCodLegado(e.target.value)} type="text" placeholder="" />

                </div>
                
                <div className="form-group col-md-2 margemRight" >
                    <Form.Label  >TIPO PESSOA</Form.Label>
                    <Form.Select  onChange={(e)=>setTipoPessoa(e.target.value)} className="  form__input1 " style={{paddingBottom : "13px"}}>
                    <option value={""} >Selecione</option>
                        <option value={"Juridica"} >Jurídica</option>
                        <option value={"Fisica"}>Física</option>
                    </Form.Select>
                   

                </div>
                <div className="form-group col-md-2 margemRight" >
                    <Form.Label  >OPTANTE SIMPLES</Form.Label>
                    <Form.Select  onChange={(e)=>setOptSimples(e.target.value)} className="  form__input1 " style={{paddingBottom : "13px"}}>
                    <option value={""} >Selecione</option>
                        <option value={"Sim"} >Sim</option>
                        <option value={"Nao"}>Não</option>
                    </Form.Select>

                </div>


                <div className="form-group col-md-1.1 margemRight" >
                    <Form.Label  >STATUS SEGURADORA</Form.Label>
                    <Form.Select onChange={(e)=>setStatusSeg(e.target.value)} className="  form__input1 " style={{paddingBottom : "13px"}}>
                    <option value={""} >Selecione</option>
                        <option value={"Ativo"}>Ativo</option>
                        <option value={"Inativo"}>Inativo</option>
                    </Form.Select>

                </div>
                <div className="form-group col-md-2 margemRight" style={{ width: "190px" }}>
                    <Form.Label   >INSCRIÇÃO ESTADUAL</Form.Label>
                    <Form.Control className="form__input1" type="text" onChange={(e) => setIE(e.target.value)} value={ie}  placeholder="" />

                </div>
                <div className="form-group col-md-2 margemRight" style={{ width: "190px" }}>
                    <Form.Label   >INSCRIÇÃO MUNICIPAL</Form.Label>
                    <Form.Control className="form__input1" type="text" onChange={(e) => setIM(e.target.value)} value={im} style={{ maxWidth: "100%" }} placeholder="" />

                </div>    

               

               
                  
                    <div className="form-group col-md-1 margemRight">
                    <Form.Label  >CEP</Form.Label>                       
                        <Form.Control className="form__input1" type="text" onChange={(e) => setCep(e.target.value)} value={cep}  placeholder=" " />                          
                   
                </div>                             
               
                
                <div className="form-group col-md-2"> 
                <div style={{marginTop : "35px"}}>
                <Button onClick={(e) => buscaCepOnline(e)} > BUSCAR CEP  </Button> 
                 </div>                                       
                </div>
              

                <div className="form-group col-md-1 margemRight">
                    <Form.Label  >UF</Form.Label>
                    <Form.Control className="form__input1" type="text" onChange={(e) => setEstadoUF(e.target.value)} value={estadoUF} style={{ width: "100%" }} placeholder="" />
                </div>
               
                

                {/* <div className="form-group col-md-1">
                    <Form.Label >UF</Form.Label>
                    <FormSelect className="form__input1" onChange={(e) => setEstadoUF(e.target.value)} value={estadoUF} >
                        {listaUF.map((lf) => <option key={estadoUF} value={estadoUF}>{estadoUF}</option>)}
                    </FormSelect>

                </div> */}
                <div className="form-group col-md-3 margemRight ">
                    <Form.Label  >CIDADE</Form.Label>
                    <Form.Control className="form__input1" type="text" onChange={(e) => setNomeCidade(e.target.value)} value={nomeCidade} style={{ width: "280PX" }} placeholder="" />
                </div>

                <div className="form-group col-md-4 margemRight">
                    <Form.Label   >BAIRRO</Form.Label>
                    <Form.Control className="form__input1" type="text" onChange={(e) => setBairro(e.target.value)} value={bairro} style={{ width: "92%" }}  placeholder=" "/>
                </div>
                <div className="form-group col-md-4 margemRight">
                    <Form.Label   >LOGRADOURO</Form.Label>
                    <Form.Control className="form__input1" type="text" onChange={(e) => setLogradouro(e.target.value)} value={logradouro}  placeholder="" />
                </div>
                <div className="form-group col-md-1 margemRight">
                    <Form.Label   >NR</Form.Label>
                    <Form.Control className="form__input1" type="text" onChange={(e) => setNrLogradouro(e.target.value)} value={nrLogradouro} style={{ width: "100%" }} placeholder="" />
                </div>



                <div className="form-group col-md-4 margemRight">
                    <Form.Label   >COMPLEMENTO</Form.Label>
                    <Form.Control className="form__input1" type="text" onChange={(e) => setComplemento(e.target.value)} value={complemento}  placeholder="" />
                </div>

                
                
               







                <hr style={{width : "100%"}}/>
                <div className="form-group col-md-7">
                <h3 id="titulo" >Dados do Sistema</h3>
                </div>
                <div className="form-group col-md-4"></div>


                <div className="form-group col-md-3 margemRight">
                    <Form.Label   >SMTP</Form.Label>
                    <Form.Control value={smtpSist} onChange={(e)=>setSmtpSist(e.target.value)} className="form__input1" type="text"  placeholder="" />
                </div>
                <div className="form-group col-md-1 margemRight">
                    <Form.Label   >PORTA</Form.Label>
                    <Form.Control value={portaSist} onChange={(e)=>setPortaSist(e.target.value)} className="form__input1" type="text"  placeholder="" />
                </div>
                <div className="form-group col-md-3 margemRight">
                    <Form.Label   >Usuário(E-MAIL)</Form.Label>
                    <Form.Control value={emailSist} onChange={(e)=>setEmailSist(e.target.value)} className="form__input1" type="text"  placeholder="" />
                </div>
                <div className="form-group col-md-3" style={{width : "270px"}}>
                    <Form.Label   >Senha(E-MAIL)</Form.Label>
                    <Form.Control value={senhaEmailSist} onChange={(e)=>setSenhaEmailSist(e.target.value)} className="form__input1" type="password" placeholder="" />
                </div>
                <div className="form-group col-md-3 margemRight">
                    <Form.Label   >Remetente</Form.Label>
                    <Form.Control value={remetenteEmailSist} onChange={(e)=>setRemetenteEmailSist(e.target.value)} className="form__input1" type="text"  placeholder="" />
                </div>
                <div className="form-group col-md-3 margemRight">
                    <Form.Label   >Nome Remetente</Form.Label>
                    <Form.Control value={nomeRemetenteEmailSist} onChange={(e)=>setNomeRemetenteEmailSist(e.target.value)} className="form__input1" type="text"  placeholder="" />
                </div>
                <div className="form-group col-md-1 margemRight">
                    <Form.Label   >SMTP Auth</Form.Label>
                    <Form.Select onChange={(e)=>setSmtpSistAuth(e.target.value)} className="  form__input1 " style={{paddingBottom : "13px"}}>
                    <option value={""} >Selecione</option>
                        <option value={"True"}>True</option>
                        <option value={"False"}>False</option>
                    </Form.Select>
                </div>
                <div className="form-group col-md-1 margemRight">
                    <Form.Label style={{width :"100px"}}  >SMTP Secure</Form.Label>
                    <Form.Select  onChange={(e)=>setSmtpSistSecure(e.target.value)} className="  form__input1 " style={{width : "120px" ,paddingBottom : "13px"}}>
                    <option value={""} >Selecione</option>
                        <option value={"TLS"}>TLS</option>
                        <option value={"SSL"}>SSL</option>
                    </Form.Select>
                </div>
                <div className="form-group col-md-5 margemRight">
                    <Form.Label   >SOAP Retorno de Solicitação</Form.Label>
                    <Form.Control value={soapRetSol} onChange={(e)=>setSoapRetSol(e.target.value)}  className="form__input1" type="text"  placeholder="" />
                </div>
                <div className="form-group col-md-5 margemRight">
                    <Form.Label   >SOAP Retorno de Notas</Form.Label>
                    <Form.Control value={soapRetNotas} onChange={(e)=>setSoapRetNotas(e.target.value)} className="form__input1" type="text"  placeholder="" />
                </div>

              
               
                <hr style={{width : "100%"}}/>   

                <div className="form-group col-md-12"    > 
                <Modal show={show} onHide={handleClose}  size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>

            
        {/* <div className="form-group col-md-7"  >
                <h3 id="titulo" >Cadastrar Contato</h3>
                </div> */}
                
                <div className="card" >
      <Grid
        rows={rows}
        columns={columns}
      //  getRowId={getRowId}
      >
        <EditingState
          onCommitChanges={commitChanges}
         // columnExtensions={"editingStateColumns"}
        />
        {/* <PriceProvider
        for={"priceColumns"}
        
        /> */}
        
        {/* <Table  />
        <TableHeaderRow />
        <TableEditRow />
        <TableEditColumn
          showAddCommand
          showEditCommand
          showDeleteCommand
          
        /> */}
        {/* <SelectInpuDepProv
        for={selectDep}
        />
        <SelectInpuFuncProv
            for={selectFunc}
        /> */}
        <PagingState
          defaultCurrentPage={0}
          pageSize={3}
        />
        <IntegratedPaging />
        <PagingPanel />
        <Table  />
        <TableHeaderRow />
        <TableEditRow />
        <TableEditColumn
          showAddCommand
          showEditCommand
          showDeleteCommand
          
          
        /> 
        
      </Grid>

      </div>
              




          </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      </div>














 
    


                



                
                <div className="form-group col-md-12"></div><br/><br/><br/>
               
              
                <div className="form-group col-md-10">
                    <Button className="margemRight" onClick={(e)=>salvarSeguradora(e)} > CADASTRAR </Button>
                    <Button  id="buttonAlert"onClick={() => navigate("/home")} > CANCELAR  </Button><br />

                </div>    
               
                <div className="form-group col-md-4"></div>
                <div className="form-group col-md-4"></div>

                <div className="form-group col-md-4"></div>
                <div className="form-group col-md-4"></div>



{/* 
                <div style={{ display: "none" }}>
                    <Form.Control type="text" onChange={(e) => setCodigoIBGECidade(e.target.value)} value={codigoIBGECidade} style={{ width: "50%" }} placeholder="Código Cidade" />


                </div> */}








            


            </div>
           

     
        </div>

        


    </div>


    )

};

export default CadastroSeguradora;

/**
 * 
 * 
 * 
 * <div className="form-group col-md-1">
        <Form.Label   >CEP</Form.Label>
         <Form.Control   type="text" onChange={(e)=>setCep(e.target.value)} value={cep} style={{width : "110%"  }} placeholder = "00000000" />
        </div>        
        <div className="form-group col-md-2"> <br/><Button className="py-2 my-3" variant="primary" onClick={(e)=> salvarUniEmp(e)}  > PESQUISAR </Button> </div>
   
          
           
            <Form.Label className="mx-2 py-2  "  >LOGRADOURO</Form.Label>
            <Form.Control className="mx-2 py-2 " type="text" onChange={(e)=>setLogradouro(e.target.value)} value={logradouro} style={{width : "80%"  }} placeholder = "Lograduouro" />
            
            <Form.Label className="mx-2 py-2  "  >COMPLEMENTO</Form.Label>
            <Form.Control className="mx-2 py-2 " type="text" onChange={(e)=>setComplemento(e.target.value)} value={complemento} style={{width : "50%"  }} placeholder = "Complemento" />
            
            <Form.Label className="mx-2 py-2  "  >BAIRRO</Form.Label>
            <Form.Control className="mx-2 py-2 " type="text" onChange={(e)=>setBairro(e.target.value)} value={bairro} style={{width : "50%"  }} placeholder = "Bairro" />
            
            <Form.Label className="mx-2 py-2  "  >CODIGO CIDADE</Form.Label>
            <Form.Control className="mx-2 py-2 " type="text" onChange={(e)=>setCodigoCidade(e.target.value)} value={codigoCidade} style={{width : "50%"  }} placeholder = "Código Cidade" />
            <div className="form-inline">
            <Form.Label className="mx-2 py-2  "  >UF</Form.Label>
            <Form.Control className="mx-2 py-2 " type="text" onChange={(e)=>setEstadoUF(e.target.value)} value={estadoUF} style={{width : "20%"  }} placeholder = "Estado : UF" />
            
            <Form.Label className="mx-2 py-2  "  >NR</Form.Label>
            <Form.Control className="mx-2 py-2 " type="text" onChange={(e)=>setNrLogradouro(e.target.value)} value={nomeFantasia} style={{width : "20%"  }} placeholder = "Numero" />
            
            </div>


 <div className="form-group col-md-2">
        
       
        </div>

        <div className="form-group col-md-2">
        <Button className="mx-2 my-2"variant="primary" onClick={(e)=> salvarUniEmp(e)}  > CADASTRAR </Button>
              
        </div>
































<div className="form-row">
        <div className="form-group col-md-6">
            <label for="inputName">Nome</label>
            <input type="text" id="inputName" className="form-control" placeholder="John" required/>
        </div>
        <div className="form-group col-md-6">
            <label for="inputSurname">Sobrenome</label>
            <input type="text" className="form-control" id="inputSurname" placeholder="Doe" required/>
        </div>
        <div className="form-group col-md-6">
            <label for="inputEmail4">Email</label>
            <input type="email" className="form-control" id="inputEmail4" placeholder="doejohnn@email.com" required/>
        </div>
        <div className="form-group col-md-6">
            <label for="inputPassword4">Senha</label>
            <input type="password" className="form-control" id="inputPassword4" placeholder="123@abc" required/>
        </div>
    </div>

 */