/**
 * Pagina em construção para cadastrar uma nova unidade empresarial
 */

import { useContext, useEffect,useState } from "react";
import { Form } from "react-bootstrap";
// import apiUniEmpServ from "../../Services/UnidadeEmpresarialService"
// import apiEmpresaService from "../../Services/GrupoEmpresarialService"
import { useNavigate, useParams } from "react-router-dom";
// import apiEnderecoService from "../../Services/EnderecoService";
// import apiUsuarioService from "../../Services/usuarioService";
import "./cad.css";
import { cnpj } from 'cpf-cnpj-validator';
import { AuthContext } from "../../Autenticação/validacao";
import { DataTypeProvider, EditingState, IntegratedPaging, IntegratedSorting, PagingState, SortingState } from '@devexpress/dx-react-grid';
import {
    Grid,
    Table,
    TableHeaderRow,
    TableEditRow,
    TableEditColumn,
    PagingPanel,
    DragDropProvider, TableColumnReordering,
  TableFixedColumns, TableSummaryRow,
} from '@devexpress/dx-react-grid-material-ui';
import { deleteContatoSegID, getContatoSeguradora, getSeguradora, saveContatoSeguradora, saveSeguradora } from "../../Service/seguradoraService";
import { apenasNr, validaCodLEG, validaNomeFANT, validaOpSIMPLES, validaStatusSEG, validaTipoPESSOA, validaCNPJ, validaEMAIL,  validaRAZAO, validaCEP, validaUF, validaCIDADE, validaBAIRRO, validaLOGRAD, validaNRLOGRAD, validaCOMPL, validaSMTP, validaPORTA, validaSEMAIL, validaREMET, validaNREMET, validaSOAPRET, validaSOAPNOT, validaGRID,  } from "../../Service/utilServiceFrontEnd";
import { getUnidadeFederativa } from "../../Service/enderecoService";
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { styled } from '@mui/material/styles';




const { format } = require('telefone');
const emailV = /\S+@\S+\.\S+/;

const PREFIX = 'Demo';
const classes = {
  lookupEditCell: `${PREFIX}-lookupEditCell`,
  dialog: `${PREFIX}-dialog`,
  inputRoot: `${PREFIX}-inputRoot`,
  selectMenu: `${PREFIX}-selectMenu`,
};
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${classes.lookupEditCell}`]: {
    padding: theme.spacing(1),
  },
  [`& .${classes.dialog}`]: {
    width: 'calc(100% - 16px)',
  },
  [`& .${classes.inputRoot}`]: {
    width: '100%',
  },
  [`& .${classes.selectMenu}`]: {
    position: 'absolute !important',
  },
}));



const AddButton = ({ onExecute }) => (
    <div style={{ textAlign: 'center' }}>
      <Button
        color="primary"
        onClick={onExecute}
        title="Create new row"
      >
        Novo
      </Button>
    </div>
  );
  
  const EditButton = ({ onExecute }) => (
    <IconButton onClick={onExecute} title="Edit row" size="large">
      <EditIcon />
    </IconButton>
  );
  
  const DeleteButton = ({ onExecute }) => (
    <IconButton
      onClick={() => {
        // eslint-disable-next-line
        if (window.confirm('Are you sure you want to delete this row?')) {
          onExecute();
        }
      }}
      title="Delete row"
      size="large"
    >
      <DeleteIcon />
    </IconButton>
  );
  
  const CommitButton = ({ onExecute }) => (
    <IconButton onClick={onExecute} title="Save changes" size="large">
      <SaveIcon />
    </IconButton>
  );
  
  const CancelButton = ({ onExecute }) => (
    <IconButton color="secondary" onClick={onExecute} title="Cancel changes" size="large">
      <CancelIcon />
    </IconButton>
  );
  
  const commandComponents = {
    add: AddButton,
    edit: EditButton,
    delete: DeleteButton,
    commit: CommitButton,
    cancel: CancelButton,
  };
  
  const Command = ({ id, onExecute }) => {
    const CommandButton = commandComponents[id];
    return (
      <CommandButton
        onExecute={onExecute}
      />
    );
  };
  
 
  
  const LookupEditCell = ({
    availableColumnValues, value, onValueChange,
  }) => (
    <StyledTableCell
      className={classes.lookupEditCell}
    >
      <Select
        value={value}
        onChange={event => onValueChange(event.target.value)}
        MenuProps={{
          className: classes.selectMenu,
        }}
        input={(
          <Input
            classes={{ root: classes.inputRoot }}
          />
        )}
      >
        {availableColumnValues.map(item => (
          <MenuItem key={item} value={item}>
            {item}
          </MenuItem>
        ))}
      </Select>
    </StyledTableCell>
  );
  
  const Cell = (props) => {
    const { column } = props;
    
   
    return <Table.Cell {...props} />;
  };
  
  const EditCell = (props) => {
    const { column } = props;

    
    return <TableEditRow.Cell {...props} />;
  };
  













const CadastroSeguradora = () => {
    const { logout } = useContext(AuthContext);
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
    const { idSeg } = useParams();
    const token = localStorage.getItem("token");
    const navigate = useNavigate(); 
    const [idSegN, setIdSegN] = useState(idSeg);
    const [displayCont, setDisplayCont] = useState(idSegN === "0" ? "none" : "");
    const [rows, setRows] = useState([]);
    const [listaUF,setListaUF] = useState([]);
   let editor = false;



    useEffect(() => {   
        buscarSeguradoras();
        buscarContatos(idSegN);    
        buscaUnidadeFederativa();
        

    }, [idSeg]);

    const buscaUnidadeFederativa = ()=>{
        const dados = {token};
        getUnidadeFederativa(dados)
        .then((res)=>{
            if (res.data === "erroLogin") {
                alert("Sessão expirada, Favor efetuar um novo login !!");
                logout();
                window.location.reload();
            }
            else{
                setListaUF(res.data);
            }

        }).catch((res)=>{
            console.error(res);
            window.alert("Erro ao listar Estados")
        })
    }
  

    const buscarSeguradoras =  () => {
        if (idSeg > 0) {
            let dados = { token, idSeg };
            getSeguradora(dados)
                .then((res) => {
                    if (res.data === "erroLogin") {
                        alert("Sessão expirada, Favor efetuar um novo login !!");
                        logout();
                        window.location.reload();
                    }
                    else if (res.data === "semAcesso") {
                        alert("Usuário sem permissão !!!");

                    } else if (res.data === "campoNulo") {
                        alert("Preencha todos os Campos obrigatorios!!!");
                    }
                    else if (res.data === "erroSalvar") {
                        alert("Erro a tentar salvar ou alterar!!!");
                    } else {                      
                      
                        res.data.forEach((l) => {
                            setBairro(l.SGRA_BAIRRO);
                            setCep(l.SGRA_CEP);
                            setCnpjSeguradora(l.SGRA_CNPJ);
                            setCodLegado(l.SGRA_ID_LEGADO);
                            setComplemento(l.SGRA_COMPLEMENTO);
                            setTipoPessoa(l.SGRA_NATUREZA_JURIDICA);
                            setNomeFantasia(l.SGRA_NOME_FANTASIA);
                            setRazaoSocial(l.SGRA_RAZAO_SOCIAL);
                            setOptSimples(l.SGRA_OPTANTE_SIMPLES_NACIONAL);
                            setStatusSeg(l.SGRA_STATUS);
                            setIE(l.SGRA_INSCRICAO_ESTADUAL);
                            setIM(l.SGRA_INSCRICAO_MUNICIPAL);
                            setNomeCidade(l.SGRA_CIDADE);
                            setEstadoUF(l.UNFE_SIGLA);
                            setLogradouro(l.SGRA_RUA);
                            setNrLogradouro(l.SGRA_NUMERO);
                            setSmtpSist(l.SGRA_SMTP);
                            setPortaSist(l.SGRA_PORTA);
                            setEmailSist(l.SGRA_USUARIO_EMAIL);
                            setSenhaEmailSist(l.SRGA_SENHA);
                            setRemetenteEmailSist(l.SGRA_REMETENTE);
                            setNomeRemetenteEmailSist(l.SGRA_NOME_REMETENTE);
                            setSmtpSistAuth(l.SGRA_SMTP_AUTH);
                            setSmtpSistSecure(l.SGRA_SMTP_SECURE);
                            setSoapRetSol(l.SGRA_RETORNO_SOLICITACAO);
                            setSoapRetNotas(l.SGRA_RETORNO_NOTAS);

                        })
                        
                    }
                }).catch((res) => {
                    console.error(res);
                    window.alert("Erro ao buscar Seguradoradas")
                })
        }
    }
    
    const buscarContatos = (idSegN) => {
        const dados = { token, idSeg: idSegN }
        getContatoSeguradora(dados)
            .then((res) => {
                if (res.data === "erroLogin") {
                    alert("Sessão expirada, Favor efetuar um novo login !!");
                    logout();
                    window.location.reload();
                }
                else if (res.data === "semAcesso") {
                    alert("Usuário sem permissão !!!");

                } else if (res.data === "campoNulo") {
                    alert("Preencha todos os Campos obrigatorios!!!");
                }
                else if (res.data === "erroSalvar") {
                    alert("Erro a tentar salvar ou alterar!!!");
                } else {
                    (res.data).forEach((item, index) => (item.id = index));
                    setRows(res.data);

                }

            }).catch = (res) => {
                console.error(res);
                window.alert("Erro ao listar contatos");
            }
    }
 
    const salvarSeguradora = () => {
   
        const dados = {
            codLegado : apenasNr(codLegado), cnpjSeguradora : apenasNr(cnpjSeguradora), 
            tipoPessoa, optSimples, statusSeg,
            razaoSocial, nomeFantasia, ie : apenasNr(ie), im : apenasNr(im),
            logradouro, complemento, bairro, estadoUF, nrLogradouro, cep : apenasNr(cep),
            nomeCidade, smtpSist, portaSist, emailSist, senhaEmailSist,
            remetenteEmailSist, nomeRemetenteEmailSist, smtpSistAuth, smtpSistSecure,
            soapRetSol, soapRetNotas, token, idSeg : idSegN
        };
      
   
        
        if(validaRAZAO() &&    
             validaNomeFANT() && 
             validaCNPJ(cnpjSeguradora) &&     
             validaCodLEG() &&  
             validaTipoPESSOA() &&
             validaOpSIMPLES() &&
             validaStatusSEG() &&
             validaCEP() &&
             validaUF() &&
             validaCIDADE() &&
             validaBAIRRO() &&
             validaLOGRAD() &&
             validaNRLOGRAD()&&
             validaCOMPL() &&
             validaSMTP() &&
             validaPORTA() &&
             validaEMAIL(emailSist) &&
             validaSEMAIL() &&
             validaREMET() &&
             validaNREMET() &&
             validaSOAPRET() &&
             validaSOAPNOT()    
        
        ){
        saveSeguradora(dados)
            .then((res) => {
                if (res.data === "erroLogin") {
                    alert("Sessão expirada, Favor efetuar um novo login !!");
                    logout();
                    window.location.reload();
                }
                else if (res.data === "semAcesso") {
                    alert("Usuário sem permissão !!!");

                } else if (res.data === "campoNulo") {
                    alert("Preencha todos os Campos obrigatorios!!!");
                }
                else if (res.data === "erroSalvar") {
                    alert("Erro a tentar salvar ou alterar!!!");
                }


                else {
                    if (idSegN > 0) {
                        window.alert("Seguradora Alterada com Sucesso!!!");
                    } else {
                        (res.data).forEach((l) => { setIdSegN(l.ID_SEGURADORA); });
                        setDisplayCont("");
                        window.alert("Seguradora Cadastrada  com Sucesso!!!");
                    }
                }
            }).catch((erro) => {
                window.alert("Erro ao tentar cadastrar");
                console.error(erro, "erro ao tentar cadastrar");
            })
        }
    }

    const salvarContato = (rows) => {
        const dadosContato = { contatos: rows, token, idSeg: idSegN }
        console.log(dadosContato);
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
                    // alert("Contato Cadastrado  com Sucesso!!!");   
                    buscarContatos(idSegN);
                }
                else {
                    alert("Erro ao cadastrar");
                }

            }).catch((error) => {
                console.error(error,
                    "Erro ao salvar Contato");

            })

    }

    const deletarContato = (idCont) => {
        let dados = { token, idCont };
        if (window.confirm("Deseja excluir o Contato ?")) {
            deleteContatoSegID(dados)
                .then((res) => {
                    if (res.data === "erroLogin") {
                        alert("Sessão expirada, Favor efetuar um novo login !!");
                        logout();
                        window.location.reload();
                    }
                    else if (res.data === "semAcesso") {
                        alert("Usuário sem permissão !!!");

                    } else if (res.data === "campoNulo") {
                        alert("Preencha todos os Campos obrigatorios!!!");
                    }
                    else if (res.data === "erroSalvar") {
                        alert("Erro a tentar salvar ou alterar!!!");
                    } else {
                        buscarContatos(idSegN);
                    }
                })
                .catch((res) => {
                    console.error(res);
                    window.alert("Erro ao excluir contato")
                })
        }

    };
    const buscaCepOnline = () => {
      
        
        var cepSONr = (isNaN(cep)) ? cep.replace(/\D/g, '') : cep;
     
    
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
      
    }

    const alertaSair = () => {
        if (idSegN === "0") {
            if (window.confirm("Deseja sair sem salvar a seguradora ?")) {
                navigate("/listarSeguradora");
            }
        } else {
            navigate("/listarSeguradora");
        }
    }



// abaixo GRID



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

    



    const [sorting, getSorting] = useState([]);
    const [editingRowIds, getEditingRowIds] = useState([]);
    const [addedRows, setAddedRows] = useState([]);
    const [rowChanges, setRowChanges] = useState({});
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(0);
    const [pageSizes] = useState([5, 10, 0]);











   
   
    const BotaoDEL = ({value})=>(     
      <div> 
       
      <ModeEditOutlineOutlinedIcon style={{ color: "blue" }} className="margemRight" type="button"/>
<DeleteForeverOutlinedIcon type="button" fontSize="medium"  style={{ color: "red" }} onClick={(e)=>deletarContato(value)}/>
 

      </div>
           

        
       
    )
    const BoataoDELjProv = (props)=>(
        <DataTypeProvider
        formatterComponent={BotaoDEL}
        {...props}

        />
    )
    const [botaoDel] = useState(["ALTERAÇÃO"]);





    const [columns] = useState([
        { name: 'ALTERAÇÃO', title: "ALTERAÇÃO",
        getCellValue: row => (row.ID_SEGURADORA_CONTATO)  
     },
        { name: 'SGCO_NOME', title: "Nome Contato" },
        { name: 'SGCO_FUNCAO', title: "FUNÇÃO" },
        { name: 'SGCO_DEPARTAMENTO', title: "DEPARTAMENTO" },
        { name: 'SGCO_EMAIL', title: "EMAIL" },
        { name: 'SGCO_URL', title: "URL" },
        { name: 'SGCO_CELULAR_DDD', title: " DDD" },
        { name: 'SGCO_CELULAR_NUMERO', title: " NR CELULAR" },
        { name: 'SGCO_CELULAR_OPERADORA', title: " OPERADORA" },
        { name: 'SGCO_FONE_COMERCIAL_DDD', title: " DDD" },
        { name: 'SGCO_FONE_COMERCIAL_NUMERO', title: " NR COMERCIAL" },
        { name: 'SGCO_FONE_COMERCIAL_RAMAL', title: " RAMAL" },

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
           
                        let val = true; 
                        let msg = "";
                        changedRows.forEach((l)=>{

                            
                            if(l.SGCO_NOME === "" || !l.SGCO_NOME ){                      
                                val = false;
                                msg = "Campo Nome não pode ser nulo";
                                setRows(changedRows);
                             }
                           else if(l.SGCO_FUNCAO === "" || !l.SGCO_FUNCAO ){                      
                                val = false;
                                msg = "Campo Função não pode ser nulo";
                                setRows(changedRows);
                             }
                             
                             else if(l.SGCO_DEPARTAMENTO === "" || !l.SGCO_DEPARTAMENTO ){                      
                                val = false;
                                msg = "Campo Departamento não pode ser nulo";
                                setRows(changedRows);
                             }
                            else if(l.SGCO_DEPARTAMENTO === "" || !l.SGCO_DEPARTAMENTO ){                      
                                val = false;
                                msg = "Campo Departamento não pode ser nulo";
                                setRows(changedRows);
                             } 
                             else if(!emailV.test(l.SGCO_EMAIL))
                             { val = false; 
                                msg = "Email Contato inválido" ;
                                 setRows(changedRows);
                            }
                            else if(l.SGCO_URL === "" || !l.SGCO_URL ){                      
                                val = false;
                                msg = "Campo URL não pode ser nulo";
                                setRows(changedRows);
                             } 
                             else if(l.SGCO_CELULAR_DDD === "" || !l.SGCO_CELULAR_DDD  || isNaN(l.SGCO_CELULAR_DDD)){                      
                                
        
                                if(l.SGCO_CELULAR_DDD === 0 ){
                                    val = true;
                                 }else{
                                    val = false;
                                msg = "Campo Celular DDD inválido";
                                setRows(changedRows);
                                 }
                             } 
                             else if(l.SGCO_CELULAR_NUMERO === "" || !l.SGCO_CELULAR_NUMERO || isNaN(l.SGCO_CELULAR_NUMERO)){                      
                                
        
                                if(l.SGCO_CELULAR_NUMERO === 0 ){
                                    val = true;
                                 }else{
                                    val = false;
                                    msg = "Campo Celular NR inválido";
                                    setRows(changedRows);
                                 }
        
        
        
        
                             } 
                             else if(l.SGCO_CELULAR_OPERADORA === "" || !l.SGCO_CELULAR_OPERADORA  ){                      
                                val = false;
                                msg = "Campo Operadora  não pode ser nulo";
                                setRows(changedRows);
        
        
                             }
                             else if(l.SGCO_FONE_COMERCIAL_DDD === "" || !l.SGCO_FONE_COMERCIAL_DDD || isNaN(l.SGCO_FONE_COMERCIAL_DDD) ){                      
                               
        
                                if(l.SGCO_FONE_COMERCIAL_DDD === 0 ){
                                    val = true;
                                 }else{
                                    val = false;
                                msg = "Campo Fone Comercial DDD inválido";
                                setRows(changedRows);
                                 }           
                             }
                             else if(l.SGCO_FONE_COMERCIAL_NUMERO === "" || !l.SGCO_FONE_COMERCIAL_NUMERO ||  isNaN(l.SGCO_FONE_COMERCIAL_NUMERO)  ){                      
                               
                                if(l.SGCO_FONE_COMERCIAL_NUMERO === 0 ){
                                    val = true;
                                 }else{
                                    val = false;
                                    msg = "Campo Fone Comercial NR  inválido";
                                    setRows(changedRows);
                                 }          
        
                             }
                             else if(l.SGCO_FONE_COMERCIAL_RAMAL === "" || !l.SGCO_FONE_COMERCIAL_RAMAL ||  isNaN(l.SGCO_FONE_COMERCIAL_RAMAL)   ){                      
                                
                             if(l.SGCO_FONE_COMERCIAL_RAMAL === 0 ){
                                val = true;
                             }else{
                                msg = "Campo Fone Comercial Ramal  inválido";
                                setRows(changedRows);
                                val = false;
                             }
                                
                             }      
        
        
                            })         
                          

            if(val){
                setRows(changedRows);
                salvarContato(changedRows);
                buscarContatos();

            }else{
                window.alert(msg);
            }                       
               
            
        }
        if (changed) {
         
     changedRows = rows.map(row =>   (changed[row.id] ? { ...row, ...changed[row.id] } : row));
                    let val = true; 
                    let msg = "";
                    changedRows.forEach((l)=>{

                        if(l.SGCO_NOME === "" || !l.SGCO_NOME ){                      
                            val = false;
                            msg = "Campo Nome não pode ser nulo";
                            setRows(changedRows);
                         }
                       else if(l.SGCO_FUNCAO === "" || !l.SGCO_FUNCAO ){                      
                            val = false;
                            msg = "Campo Função não pode ser nulo";
                            setRows(changedRows);
                         }
                         
                         else if(l.SGCO_DEPARTAMENTO === "" || !l.SGCO_DEPARTAMENTO ){                      
                            val = false;
                            msg = "Campo Departamento não pode ser nulo";
                            setRows(changedRows);
                         }
                        else if(l.SGCO_DEPARTAMENTO === "" || !l.SGCO_DEPARTAMENTO ){                      
                            val = false;
                            msg = "Campo Departamento não pode ser nulo";
                            setRows(changedRows);
                         } 
                         else if(!emailV.test(l.SGCO_EMAIL))
                         { val = false; 
                            msg = "Email Contato inválido" ;
                             setRows(changedRows);
                        }
                        else if(l.SGCO_URL === "" || !l.SGCO_URL ){                      
                            val = false;
                            msg = "Campo URL não pode ser nulo";
                            setRows(changedRows);
                         } 
                         else if(l.SGCO_CELULAR_DDD === "" || !l.SGCO_CELULAR_DDD  || isNaN(l.SGCO_CELULAR_DDD)){                      
                            
    
                            if(l.SGCO_CELULAR_DDD === 0 ){
                                val = true;
                             }else{
                                val = false;
                            msg = "Campo Celular DDD inválido";
                            setRows(changedRows);
                             }
                         } 
                         else if(l.SGCO_CELULAR_NUMERO === "" || !l.SGCO_CELULAR_NUMERO || isNaN(l.SGCO_CELULAR_NUMERO)){                      
                            
    
                            if(l.SGCO_CELULAR_NUMERO === 0 ){
                                val = true;
                             }else{
                                val = false;
                                msg = "Campo Celular NR inválido";
                                setRows(changedRows);
                             }
    
    
    
    
                         } 
                         else if(l.SGCO_CELULAR_OPERADORA === "" || !l.SGCO_CELULAR_OPERADORA  ){                      
                            val = false;
                            msg = "Campo Operadora  não pode ser nulo";
                            setRows(changedRows);
    
    
                         }
                         else if(l.SGCO_FONE_COMERCIAL_DDD === "" || !l.SGCO_FONE_COMERCIAL_DDD || isNaN(l.SGCO_FONE_COMERCIAL_DDD) ){                      
                           
    
                            if(l.SGCO_FONE_COMERCIAL_DDD === 0 ){
                                val = true;
                             }else{
                                val = false;
                            msg = "Campo Fone Comercial DDD inválido";
                            setRows(changedRows);
                             }
    
    
    
                         }
                         else if(l.SGCO_FONE_COMERCIAL_NUMERO === "" || !l.SGCO_FONE_COMERCIAL_NUMERO ||  isNaN(l.SGCO_FONE_COMERCIAL_NUMERO)  ){                      
                           
                            if(l.SGCO_FONE_COMERCIAL_NUMERO === 0 ){
                                val = true;
                             }else{
                                val = false;
                                msg = "Campo Fone Comercial NR  inválido";
                                setRows(changedRows);
                             }
    
    
    
                         }
                         else if(l.SGCO_FONE_COMERCIAL_RAMAL === "" || !l.SGCO_FONE_COMERCIAL_RAMAL ||  isNaN(l.SGCO_FONE_COMERCIAL_RAMAL)   ){                      
                            
                         if(l.SGCO_FONE_COMERCIAL_RAMAL === 0 ){
                            val = true;
                         }else{
                            msg = "Campo Fone Comercial Ramal  inválido";
                            setRows(changedRows);
                            val = false;
                         }
                            
                         }      
    
    
                        })
    


                    if(val){
                    setRows(changedRows);
                    salvarContato(changedRows);

                    }else{
                        window.alert(msg);
                    }
                     
                //   setRows(changedRows);
                //     salvarContato(changedRows);
          
            
          
        }
        if (deleted) {

            const deletedSet = new Set(deleted);

            // changedRows = rows.filter(row => !deletedSet.has(row.id));

            changedRows = rows.filter(row => deletedSet.has(row.id));
            deletarContato(changedRows.map(l => l.ID_SEGURADORA_CONTATO));
            setRows(changedRows);
        }
    };


   









    const ValidaNumber = ({value})=>(       
        apenasNr(value)
        
    )
    const ValidaNumberProv = (props)=>(
        <DataTypeProvider
        formatterComponent={ValidaNumber}
        {...props}

        />
    )
    const [validaNumber] = useState(["SGCO_CELULAR_DDD","SGCO_CELULAR_NUMERO",
    "SGCO_FONE_COMERCIAL_DDD","SGCO_FONE_COMERCIAL_NUMERO","SGCO_FONE_COMERCIAL_RAMAL","ID_SEGURADORA"]);


    const [editingStateColumns] = useState([
         {columnName : "SGCO_NOME", maxLength : 5 ,editingEnabled: false},
       
        // {columnName : "PRDT_VALOR_LIQUIDO",editingEnabled: false},
        // {columnName : "PRDT_VALOR",align: 'center'},
    
       ])









    return (

        <div>


            <div className="container-fluid" style={{ marginBottom: "10px", marginTop: "10px" }}>


                <div className="form-inline" id="" style={{ fontSize: "9" }}>
                    <div className="form-group col-md-8">
                        <h3 id="titulo">CADASTRO DE SEGURADORAS </h3>
                    </div>
                    <div className="form-group col-md-12"></div>
                    <div className="form-group col-md-6 margemRight">
                        <Form.Label   >RAZÃO SOCIAL</Form.Label>
                        <Form.Control maxLength={128} id="razaoSoc" className="" type="text" onChange={(e) => setRazaoSocial(e.target.value)} value={razaoSocial} style={{ width: "100%" }} placeholder="" />
                    </div>


                    <div className="form-group col-md-5 ">
                        <Form.Label   >NOME FANTASIA</Form.Label>
                        <Form.Control maxLength={64} id="nomeFant" className="form__input1" type="text" onChange={(e) => setNomeFantasia(e.target.value)} value={nomeFantasia} style={{ width: "102%" }} placeholder="" />

                    </div>


                    <div className="form-group col-md-2 margemRight" >
                        <Form.Label  >CNPJ</Form.Label>
                        <Form.Control id="txtCnpj" className="  form__input1 " maxLength={20} type="text" onChange={(e) => setCnpjSeguradora(e.target.value)} value={cnpj.format(cnpjSeguradora)} placeholder="" />

                    </div>
                    <div className="form-group col-md-2 margemRight" >
                        <Form.Label  >CODIGO LEGADO</Form.Label>
                        <Form.Control maxLength={64} id="codLeg" className="  form__input1 " type="number" value={codLegado} onChange={(e) => setCodLegado(e.target.value)}  placeholder="" />

                    </div>

                    <div className="form-group col-md-2 margemRight" >
                        <Form.Label  >TIPO PESSOA</Form.Label>
                        <Form.Select id="tipoP" value={tipoPessoa} onChange={(e) => setTipoPessoa(e.target.value)} className="  form__input1 " style={{ paddingBottom: "13px" }}>
                            <option value={""} >Selecione</option>
                            <option value={"Juridica"} >Jurídica</option>
                            <option value={"Fisica"}>Física</option>
                        </Form.Select>


                    </div>
                    <div className="form-group col-md-2 margemRight" >
                        <Form.Label  >OPTANTE SIMPLES</Form.Label>
                        <Form.Select id="opSimp" value={optSimples} onChange={(e) => setOptSimples(e.target.value)} className="  form__input1 " style={{ paddingBottom: "13px" }}>
                            <option value={""} >Selecione</option>
                            <option value={"Sim"} >Sim</option>
                            <option value={"Nao"}>Não</option>
                        </Form.Select>

                    </div>


                    <div className="form-group col-md-1.1 margemRight" >
                        <Form.Label  >STATUS SEGURADORA</Form.Label>
                        <Form.Select id="statusSEG" value={statusSeg} onChange={(e) => setStatusSeg(e.target.value)} className="  form__input1 " style={{ paddingBottom: "13px" }}>
                            <option value={""} >Selecione</option>
                            <option value={"Ativo"}>Ativo</option>
                            <option value={"Inativo"}>Inativo</option>
                        </Form.Select>

                    </div>
                    <div className="form-group col-md-2 margemRight" style={{ width: "190px" }}>
                        <Form.Label   >INSCRIÇÃO ESTADUAL</Form.Label>
                        <Form.Control maxLength={20} className="form__input1" type="text" onChange={(e) => setIE(e.target.value)} value={ie} placeholder="" />

                    </div>
                    <div className="form-group col-md-2 margemRight" style={{ width: "190px" }}>
                        <Form.Label   >INSCRIÇÃO MUNICIPAL</Form.Label>
                        <Form.Control   maxLength={20} className="form__input1" type="text" onChange={(e) => setIM(e.target.value)} value={im} style={{ maxWidth: "100%" }} placeholder="" />

                    </div>


                    <div className="form-group col-md-1 margemRight">
                        <Form.Label  >CEP</Form.Label>
                        <Form.Control  id="cep" className="form__input1" type="text" onChange={(e) => setCep(e.target.value)} value={cep} placeholder=" " />

                    </div>


                    <div className="form-group col-md-2">
                        <div style={{ marginTop: "35px" }}>
                            <Button onClick={(e) => buscaCepOnline(e)} > BUSCAR CEP  </Button>
                        </div>
                    </div>


                    <div className="form-group col-md-1 margemRight">
                        <Form.Label  >UF</Form.Label>
                        
                        <Form.Select id="uf" onChange={(e) => setEstadoUF(e.target.value)} value={estadoUF}  className="  form__input1 " style={{ paddingBottom: "13px" }}>
                        
                            {listaUF.map((l)=>
                            <option key={l.ID_UNIDADE_FEDERATIVA} value={l.UNFE_SIGLA}>{l.UNFE_SIGLA}</option>
                            )}
                           
                        
                        </Form.Select>
                            

                    </div>



                   
                    <div className="form-group col-md-3 margemRight ">
                        <Form.Label  >CIDADE</Form.Label>
                        <Form.Control  maxLength={64}  id="cidade" className="form__input1" type="text" onChange={(e) => setNomeCidade(e.target.value)} value={nomeCidade} style={{ width: "280PX" }} placeholder="" />
                    </div>

                    <div className="form-group col-md-4 margemRight">
                        <Form.Label   >BAIRRO</Form.Label>
                        <Form.Control  maxLength={64}  id="bairro" className="form__input1" type="text" onChange={(e) => setBairro(e.target.value)} value={bairro} style={{ width: "92%" }} placeholder=" " />
                    </div>
                    <div className="form-group col-md-4 margemRight">
                        <Form.Label   >LOGRADOURO</Form.Label>
                        <Form.Control  maxLength={128}  id="lograd" className="form__input1" type="text" onChange={(e) => setLogradouro(e.target.value)} value={logradouro} placeholder="" />
                    </div>
                    <div className="form-group col-md-1 margemRight">
                        <Form.Label   >NR</Form.Label>
                        <Form.Control maxLength={10}  id="nrLograd" className="form__input1" type="text" onChange={(e) => setNrLogradouro(e.target.value)} value={nrLogradouro} style={{ width: "100%" }} placeholder="" />
                    </div>



                    <div className="form-group col-md-4 margemRight">
                        <Form.Label   >COMPLEMENTO</Form.Label>
                        <Form.Control maxLength={64}  id="compl" className="form__input1" type="text" onChange={(e) => setComplemento(e.target.value)} value={complemento} placeholder="" />
                    </div>

                    <hr style={{ width: "100%" }} />
                    <div className="form-group col-md-7">
                        <h3 id="titulo" >Dados do Sistema</h3>
                    </div>
                    <div className="form-group col-md-4"></div>


                    <div className="form-group col-md-3 margemRight">
                        <Form.Label   >SMTP</Form.Label>
                        <Form.Control id="smtp" maxLength={256}  value={smtpSist} onChange={(e) => setSmtpSist(e.target.value)} className="form__input1" type="text" placeholder="" />
                    </div>
                    <div className="form-group col-md-1 margemRight">
                        <Form.Label   >PORTA</Form.Label>
                        <Form.Control id="porta" maxLength={5}  value={portaSist} onChange={(e) => setPortaSist(e.target.value)} className="form__input1" type="number" placeholder="" />
                    </div>
                    <div className="form-group col-md-3 margemRight">
                        <Form.Label   >Usuário(E-MAIL)</Form.Label>
                        <Form.Control  maxLength={128}  id="txtEmailU" value={emailSist} onChange={(e) => setEmailSist(e.target.value)} className="form__input1" type="text" placeholder="" />
                    </div>
                    <div className="form-group col-md-3" style={{ width: "270px" }}>
                        <Form.Label   >Senha(E-MAIL)</Form.Label>
                        <Form.Control id="semail" maxLength={128}  value={senhaEmailSist} onChange={(e) => setSenhaEmailSist(e.target.value)} className="form__input1" type="password" placeholder="" />
                    </div>
                    <div className="form-group col-md-3 margemRight">
                        <Form.Label   >Remetente</Form.Label>
                        <Form.Control id="remet" maxLength={256}  value={remetenteEmailSist} onChange={(e) => setRemetenteEmailSist(e.target.value)} className="form__input1" type="text" placeholder="" />
                    </div>
                    <div className="form-group col-md-3 margemRight">
                        <Form.Label   >Nome Remetente</Form.Label>
                        <Form.Control id="nremet" maxLength={256}  value={nomeRemetenteEmailSist} onChange={(e) => setNomeRemetenteEmailSist(e.target.value)} className="form__input1" type="text" placeholder="" />
                    </div>
                    <div className="form-group col-md-1 margemRight">
                        <Form.Label   >SMTP Auth</Form.Label>
                        <Form.Select value={smtpSistAuth} onChange={(e) => setSmtpSistAuth(e.target.value)} className="  form__input1 " style={{ paddingBottom: "13px" }}>
                            <option value={""} >Selecione</option>
                            <option value={"True"}>True</option>
                            <option value={"False"}>False</option>
                        </Form.Select>
                    </div>
                    <div className="form-group col-md-1 margemRight">
                        <Form.Label style={{ width: "100px" }}  >SMTP Secure</Form.Label>
                        <Form.Select value={smtpSistSecure} onChange={(e) => setSmtpSistSecure(e.target.value)} className="  form__input1 " style={{ width: "120px", paddingBottom: "13px" }}>
                            <option value={""} >Selecione</option>
                            <option value={"TLS"}>TLS</option>
                            <option value={"SSL"}>SSL</option>
                        </Form.Select>
                    </div>
                    <div className="form-group col-md-5 margemRight">
                        <Form.Label   >SOAP Retorno de Solicitação</Form.Label>
                        <Form.Control id="soapret" maxLength={256} value={soapRetSol} onChange={(e) => setSoapRetSol(e.target.value)} className="form__input1" type="text" placeholder="" />
                    </div>
                    <div className="form-group col-md-5 margemRight">
                        <Form.Label   >SOAP Retorno de Notas</Form.Label>
                        <Form.Control id="soapNo" maxLength={256} value={soapRetNotas} onChange={(e) => setSoapRetNotas(e.target.value)} className="form__input1" type="text" placeholder="" />
                    </div>



                    <hr style={{ width: "100%" }} />

                    <div style={{ display: displayCont }} className="form-group col-md-12"    >



                        {/* <div className="form-group col-md-7"  >
                <h3 id="titulo" >Cadastrar Contato</h3>
                </div> */}

                        {/* <div className="card" >
                            <Grid
                                rows={rows}
                                columns={columns}
                            //  getRowId={getRowId}
                            >
                                 <ValidaNumberProv
                                 for={validaNumber}
        
                                    />
                                    <BoataoDELjProv
                                         for={botaoDel}   
                                        />
                                <EditingState
                                    onCommitChanges={commitChanges}
                                    columnExtensions={editingStateColumns}
                                // columnExtensions={"editingStateColumns"}
                                />
                                
    
                               

                                <PagingState
                                    defaultCurrentPage={0}
                                    pageSize={3}
                                />
                                <IntegratedPaging />
           
                                <PagingPanel />
                                <Table />
                                <TableHeaderRow />
                                <TableEditRow />
                                
                             <TableEditColumn
                                    showAddCommand
                                    showEditCommand
                                    showDeleteCommand
                                
                              />

                            </Grid>

                        </div> */}




<Paper>
      <Grid
        rows={rows}
        columns={columns}
     
      >
        <SortingState
          sorting={sorting}
          onSortingChange={getSorting}
        />
        <PagingState
          currentPage={currentPage}
          onCurrentPageChange={setCurrentPage}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
        />
        <EditingState
          editingRowIds={editingRowIds}
          onEditingRowIdsChange={getEditingRowIds}
          rowChanges={rowChanges}
          onRowChangesChange={setRowChanges}
          addedRows={addedRows}
       
          onCommitChanges={commitChanges}
        />
       

        <IntegratedSorting />
        <IntegratedPaging />
       
     
      

        <DragDropProvider />

        <Table
     
       
        />
        
        <TableHeaderRow showSortingControls />
        <TableEditRow
          cellComponent={EditCell}
        />
        <TableEditColumn
          width={170}
          showAddCommand={!addedRows.length}
          showEditCommand
          showDeleteCommand
          commandComponent={Command}
        />

        
        <PagingPanel
          pageSizes={pageSizes}
        />
      </Grid>
    </Paper>





                    </div>























                    <div className="form-group col-md-12"></div><br /><br /><br />


                    <div className="form-group col-md-10">
                        {/* <Button disabled={!(idSegN > 0)} className="margemRight" id="buttonInfo" onClick={()=>buscarContatos(idSegN)} > CONTATOS </Button> */}
                        <Button className="margemRight" onClick={(e) => salvarSeguradora(e)} > {idSegN === "0" ? "CADASTRAR" : "SALVAR ALTERAÇÕES"}</Button>
                        <Button id="buttonAlert" onClick={(e) => alertaSair(e)} > {idSegN === "0" ? "CANCELAR" : "SAIR"} </Button><br />

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