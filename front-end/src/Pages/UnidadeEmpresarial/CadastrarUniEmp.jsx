/**
 * Pagina em construção para cadastrar uma nova unidade empresarial
 */



import { useContext, useEffect, useState } from "react";
import { Button, Form, FormLabel, FormSelect } from "react-bootstrap";
// import apiUniEmpServ from "../../Services/UnidadeEmpresarialService"
// import apiEmpresaService from "../../Services/GrupoEmpresarialService"
import { useNavigate, useParams } from "react-router-dom";
// import apiEnderecoService from "../../Services/EnderecoService";
// import apiUsuarioService from "../../Services/usuarioService";
import "./cad.css";
import { cnpj, cpf } from 'cpf-cnpj-validator';
import { AuthContext } from "../../Autenticação/validacao";



const { format } = require('telefone');


const CadastroUniEmp = () => {
    const [cnpjEmpresa, setCnpj] = useState("");
    const [razaoSocial, setRazaoSocial] = useState("");
    const [nomeFantasia, setNomeFantasia] = useState("");
    const [listaGrupoEmp, setGrupoEmp] = useState([]);
    const [ie, setIE] = useState("");
    const [im, setIM] = useState("");
    const [logradouro, setLogradouro] = useState("");
    const [complemento, setComplemento] = useState("");
    const [bairro, setBairro] = useState("");
    const [codigoIBGECidade, setCodigoIBGECidade] = useState("");
    const [estadoUF, setEstadoUF] = useState("");
    const [nrLogradouro, setNrLogradouro] = useState("");
    const [cep, setCep] = useState("");
    const [nomeCidade, setNomeCidade] = useState("");
    const [listaUF, setListaUF] = useState([]);
    const token = localStorage.getItem("token")
    const { codigo } = useParams();
    const navigate = useNavigate();
    const { logout, nomeUser } = useContext(AuthContext)
 
    const [displayCadastro, setDisplayCadastro] = useState("none");  
    const [acessoCAD, setAcessoCAD] = useState(false);
    const [acessoTotalSistema, setAcessoTotalSistema] = useState(false);
    const [email01, setEmail01] = useState("");
    const [email02, setEmail02] = useState("");
    const [fone01, setFone01] = useState("");
    const [fone02, setFone02] = useState("");
    const emailV = /\S+@\S+\.\S+/;


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


    // const salvarUniEmp = (e) => {
    //     e.preventDefault();
    //     var cnpj01, cep01, ie01, im01;
    //     if (cnpjEmpresa) { cnpj01 = cnpjEmpresa.replace(/\D/g, '') } else { cnpj01 = cnpjEmpresa };
    //     if (cep) { cep01 = cep.replace(/\D/g, '') } else { cep01 = cep };
    //     if (ie) { ie01 = ie.replace(/\D/g, '') } else { ie01 = ie };
    //     if (im) { im01 = im.replace(/\D/g, '') } else { im01 = im };
        
    //     const uniEmp = {
    //         codigo, cnpj: cnpj01, razaoSocial, nomeFantasia, ie: ie01, im: im01,
    //         logradouro, complemento, bairro, codigoIBGECidade, estadoUF, nrLogradouro, cep: cep01,
    //         nomeCidade, acessoCAD,
    //         token,acessoTotalSistema,email01, email02, 
    //         fone01 : fone01.replace(/\D/g, ''), fone02 : fone02.replace(/\D/g, '')
    //     };
    //     if (codigo > 0) {
           

    //             let testeEmail01=false,testeEmail02=false,testeCnpj = false;
    //             if ((emailV.test(email01))) {
    //                 testeEmail01 = true;
    //             }else{
    //                 alert("Email principal inválido!")
    //             }
              
    //                 if(email02 !== null && (emailV.test(email02)) ){
    //                     testeEmail02 = true;
        
    //                 }else if((email02 === null || email02 === "")){
    //                     testeEmail02 = true
    //                 }else{
    //                     alert("Email secundário inválido!")
        
    //                 } 
    //                 if (cnpj.isValid(cnpjEmpresa)) {
    //                     testeCnpj = true;
    //                 }else{ alert("CNPJ inválido!!")}
    //                 if(testeCnpj && testeEmail01 && testeEmail02){   
                   

    //             try {
    //                 apiUniEmpServ.saveUniEmp(uniEmp)
    //                     .then((res) => {
    //                         if (res.data === "erroLogin") {
    //                             alert("Sessão expirada, Favor efetuar um novo login !!");
    //                             logout();
    //                             window.location.reload();
    //                         }
    //                         else if (res.data === "semAcesso") {
    //                             alert("Usuário sem permissão !!!")
    //                             navigate("/listarUniEmp/" + codigo);

    //                         } else if (res.data === "campoNulo") {
    //                             alert("Preencha todos os Campos obrigatorios!!!");


    //                         }
    //                         else if (res.data === "sucesso") {
    //                             alert("Unidade Empresarial Cadastrada com Sucesso!!!");
    //                             navigate("/listarUniEmp/" + codigo);


    //                         }

    //                         else {
    //                             alert("Erro ao cadastrar");
                               

    //                         }

    //                     })


    //             } catch (error) {
    //                 console.log(error)
    //                 alert("Erro ao cadastrar!")
    //             }    

    //         } 



            
    //     } else {

    //         alert("Favor selecionar uma empresa")
    //     }
    // }


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
                            setCodigoIBGECidade(data.ibge);
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


    return (

        <div>

        <div className="container-fluid"  >
            <h3 id="titulos" > {listaGrupoEmp.map(l => l.GREM_NOME)} - CADASTRAR UNIDADE EMPRESARIAL </h3><br />

            <div  className="form-inline" id="">
            <div className="form-group col-md-3 margemRight" >
                    <Form.Label  >CNPJ OU CPF</Form.Label>
                    <Form.Control className="  form__input1 maxSize-14" maxLength={18} type="cnpj" onChange={(e) => setCnpj(e.target.value)} value={cnpjEmpresa.length === 11? cpf.format(cnpjEmpresa) : cnpj.format(cnpjEmpresa)} style={{ maxWidth: "100%" }} placeholder="" />

                </div>
                <div className="form-group col-md-2 margemRight" >
                    <Form.Label  >Codigo Legado</Form.Label>
                    <Form.Control className="  form__input1 maxSize-14" maxLength={18} type="cnpj" placeholder="" />

                </div>
                
                <div className="form-group col-md-1 margemRight" >
                    <Form.Label  >Tipo Pessoa</Form.Label>
                    <Form.Control disabled={true} className="  form__input1 maxSize-14" maxLength={18} type="cnpj" value={cnpjEmpresa.length === 11 ? "FISICA" : "JURÍDICA"} />

                </div>
                <div className="form-group col-md-1.1 margemRight" >
                    <Form.Label  >Optante Simples</Form.Label>
                    <Form.Select className="  form__input1 " style={{width : "120px" ,paddingBottom : "13px"}}>
                        <option>Sim</option>
                        <option>Não</option>
                    </Form.Select>

                </div>


                <div className="form-group col-md-1.1 margemRight" >
                    <Form.Label  >Status Empresa</Form.Label>
                    <Form.Select className="  form__input1 " style={{width : "120px" ,paddingBottom : "13px"}}>
                        <option>Ativo</option>
                        <option>Inativo</option>
                    </Form.Select>

                </div>
               







                <div className="form-group col-md-6 margemRight">
                    <Form.Label   >RAZÃO SOCIAL</Form.Label>
                    <Form.Control className=""  type="text" onChange={(e) => setRazaoSocial(e.target.value)} value={razaoSocial} style={{ width: "100%" }} placeholder="" />
                </div>
                <div className="form-group col-md-3">
                    <Form.Label   >INCRIÇAO ESTADUAL</Form.Label>
                    <Form.Control className="form__input1" type="text" onChange={(e) => setIE(e.target.value)} value={ie} style={{ maxWidth: "100%" }} placeholder="" />

                </div>

                <div className="form-group col-md-6 margemRight ">
                    <Form.Label   >NOME FANTASIA</Form.Label>
                    <Form.Control  className="form__input1" type="text" onChange={(e) => setNomeFantasia(e.target.value)} value={nomeFantasia} style={{ width: "100%" }} placeholder="" />

                </div>
                <div className="form-group col-md-3">
                    <Form.Label   >INSCRIÇÃO MUNICIPAL</Form.Label>
                    <Form.Control className="form__input1" type="text" onChange={(e) => setIM(e.target.value)} value={im} style={{ maxWidth: "100%" }} placeholder="" />

                </div>
                <div className="form-group col-md-2"></div>

                <div className="form-group col-md-2 margemRight">
                        <Form.Label   >TELEFONE</Form.Label>
                        <Form.Control className="form__input1" type="" value={format(fone01)} onChange={(e) => setFone01(e.target.value)} style={{ width: "100%" }} placeholder="" />

                    </div>
                   

                    <div className="form-group col-md-4 ">
                        <Form.Label   >EMAIL</Form.Label><br />
                        <Form.Control className="form__input1" type="" value={email01} onChange={(e) => setEmail01(e.target.value)} style={{ width: "95%" }} placeholder="" />

                    </div>
                  
                    <div className="form-group col-md-3">
                    <Form.Label  >CEP</Form.Label>                       
                        <Form.Control className="form__input1" type="text" onChange={(e) => setCep(e.target.value)} value={cep} style={{ width: "50%" }} placeholder=" " />                          
                   
                </div>                             
               
                
                <div className="form-group col-md-2"> 
                <div style={{marginTop : "35px", marginLeft : "-140px"}}>
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
                <div className="form-group col-md-2 margemRight ">
                    <Form.Label  >CIDADE</Form.Label>
                    <Form.Control className="form__input1" type="text" onChange={(e) => setNomeCidade(e.target.value)} value={nomeCidade} style={{ width: "100%" }} placeholder="" />
                </div>

                <div className="form-group col-md-3 margemRight">
                    <Form.Label   >BAIRRO</Form.Label>
                    <Form.Control className="form__input1" type="text" onChange={(e) => setBairro(e.target.value)} value={bairro} style={{ width: "86%" }} placeholder=" "/>
                </div>
                <div className="form-group col-md-3">
                    <Form.Label   >COMPLEMENTO</Form.Label>
                    <Form.Control className="form__input1" type="text" onChange={(e) => setComplemento(e.target.value)} value={complemento} style={{ width: "100%", marginLeft :"-37px" }} placeholder="" />
                </div>

                
                <div className="form-group col-md-2"></div>
                <div className="form-group col-md-1 margemRight">
                    <Form.Label   >NR</Form.Label>
                    <Form.Control className="form__input1" type="text" onChange={(e) => setNrLogradouro(e.target.value)} value={nrLogradouro} style={{ width: "100%" }} placeholder="" />
                </div>
                <div className="form-group col-md-4">
                    <Form.Label   >LOGRADOURO</Form.Label>
                    <Form.Control className="form__input1" type="text" onChange={(e) => setLogradouro(e.target.value)} value={logradouro} style={{ width: "92%" }} placeholder="" />
                </div>
                
                <div className="form-group col-md-12"></div><br/><br/><br/>
               

                <div className="form-group col-md-6">
                    <Button className="margemRight"> CADASTRAR </Button>
                    <Button  id="buttonAlert"onClick={() => navigate("/home")} > CANCELAR  </Button><br />

                </div>
               

                <div className="form-group col-md-4"></div>
                <div className="form-group col-md-4"></div>
                <div className="form-group col-md-4"></div>

                <div className="form-group col-md-4"></div>
                <div className="form-group col-md-4"></div>




                <div style={{ display: "none" }}>
                    <Form.Control type="text" onChange={(e) => setCodigoIBGECidade(e.target.value)} value={codigoIBGECidade} style={{ width: "50%" }} placeholder="Código Cidade" />


                </div>








            


            </div>
           

     
        </div>

        


    </div>


    )

};

export default CadastroUniEmp;

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