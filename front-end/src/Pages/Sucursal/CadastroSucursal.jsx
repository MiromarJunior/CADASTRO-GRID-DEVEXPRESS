/**
 * Pagina em construção para cadastrar uma nova unidade empresarial
 */

import { useContext, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import "./cad.css";
import { cnpj } from 'cpf-cnpj-validator';
import { AuthContext } from "../../Autenticação/validacao";
import { DataTypeProvider, EditingState, IntegratedPaging, PagingState } from '@devexpress/dx-react-grid';
import { Grid,Table,TableHeaderRow,TableEditRow,TableEditColumn,PagingPanel,TableColumnResizing,} from '@devexpress/dx-react-grid-material-ui';
import { deleteContatoSucursalID, getContatoSucursal, getSucursal, saveContatoSucursal, saveSucursal } from "../../Service/sucursalService";
import { apenasNr, validaCNPJ, validaCampo } from "../../Service/utilServiceFrontEnd";
import { getUnidadeFederativa } from "../../Service/enderecoService";
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import IconButton from '@mui/material/IconButton';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { getAcessoUserMenu } from "../../Service/usuarioService";
import { Box, Input, MenuItem, Select, TextField } from "@mui/material";


const FuncaoFormatter = ({ value }) => value ? value : "";

const FuncaoEditor = ({ value, onValueChange }) => (
  <Select 
    input={<Input />}
    value={value}
    onChange={event => onValueChange(event.target.value)}
    style={{ width: '100%' }}
  >
    <MenuItem value="">
    </MenuItem>
    <MenuItem value="Administrativo">Administrativo</MenuItem>
    <MenuItem value="Financeiro">Financeiro</MenuItem>
    <MenuItem value="Gerente">Gerente</MenuItem>
    <MenuItem value="Vendedor">Vendedor</MenuItem>
  </Select> 
);

const FuncaoProvider = props => (
 
  <DataTypeProvider
    formatterComponent={FuncaoFormatter}
    editorComponent={FuncaoEditor}
    {...props}
  /> 
);

//const { format } = require('telefone');
const emailV = /\S+@\S+\.\S+/;

const DeleteButton = ({ onExecute }) => (
    <IconButton
        onClick={() => {
            // eslint-disable-next-line
            if (window.confirm('Deseja excluir esse contato ?')) {
                onExecute();
            }
        }}
        title="Excluir contato"
        size="large"
    >
        <DeleteForeverOutlinedIcon style={{ color: "red" }} />
    </IconButton>
);

const AddButton = ({ onExecute }) => (
    <div style={{ textAlign: 'center' }}>
        <IconButton size="large"
            color="primary"
            onClick={onExecute}
            title="Novo Contato"
        >
            <AddCircleOutlinedIcon style={{ color: "blue" }} fontSize="large" />
        </IconButton>
    </div>
);


const EditButton = ({ onExecute }) => (
    <IconButton onClick={onExecute} title="Alterar Contato" size="large" >
        <ModeEditOutlineOutlinedIcon style={{ color: "orange" }} />
    </IconButton>
);

const CommitButton = ({ onExecute }) => (
    <IconButton onClick={onExecute} title="Salvar alterações" size="large">
        <SaveIcon />
    </IconButton>
);

const CancelButton = ({ onExecute }) => (
    <IconButton color="secondary" onClick={onExecute} title="Cancelar alterações" size="large">
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

let acessoGeral = false;

const CadastroSucursal = () => {
    const { logout, nomeUser } = useContext(AuthContext);
    
    const [sualCnpj, setSualCnpj] = useState("");
    const [sualIdLegado, setSualIdLegado] = useState("");
    const [sualNaturezaJuridica, setSualNaturezaJuridica] = useState("");
    const [sualNomeFantasia, setSualNomeFantasia] = useState("");
    const [sualRazaoSocial, setSualRazaoSocial] = useState("");
    const [sualOptanteSimplesNacional, setSualOptanteSimplesNacional] = useState("");
    const [sualStatus, setSualStatus] = useState("");
    const [sualInscricaoEstadual, setSualInscricaoEstadual] = useState("");
    const [sualInscricaoMunicipal, setSualInscricaoMunicipal] = useState("");
    const [sualCep, setSualCep] = useState("");
    const [sualCidade, setSualCidade] = useState("");
    const [sualRua, setSualRua] = useState("");
    const [sualNumero, setSualNumero] = useState("");
    const [sualComplemento, setSualComplemento] = useState("");
    const [sualBairro, setSualBairro] = useState("");
    const [estadoUF, setEstadoUF] = useState("");
    const { idSucursal } = useParams();
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const [idSucursalN, setIdSucursalN] = useState(idSucursal);
    const [displayCont, setDisplayCont] = useState(idSucursalN === "0" ? "none" : "");
    const [rows, setRows] = useState([]);
    const [listaUF, setListaUF] = useState([]);
    const [editingRowIds, getEditingRowIds] = useState([]);
    const [rowChanges, setRowChanges] = useState({});
    const [sucoFuncaoColumns] = useState(['SUCO_FUNCAO']);
    const listaSual = "LIST_SUCURSAL";
    const incluirSual = "ADD_SUCURSAL";
    const excluirSual = "DEL_SUCURSAL";
    const editarSual = "EDIT_SUCURSAL";

    const [acessoCAD, setAcessoCAD] = useState(false);
    const [displayAcesso, setDisplayAcesso] = useState("none");

    useEffect(() => {
        const acessoMenuUser = async () => {
          let dados = { token, usuario: nomeUser() };
          await getAcessoUserMenu(dados)
            .then((res) => {
              if (res.data === "erroLogin") {
                window.alert("Sessão expirada, Favor efetuar um novo login !!");
                logout();
                window.location.reload();
              } else if (res.data === "semAcesso") {
                window.alert("Usuário sem permissão !!!");
              } else {
                res.data.forEach((ac) => {
                  if (process.env.REACT_APP_API_ACESSO_GERAL === ac) {
                    acessoGeral = true;
                    setAcessoCAD(true);
                    buscarSucursal();
                    setDisplayAcesso("");
                    
                  } else if (incluirSual === ac) {
                    setAcessoCAD(true);
                    setDisplayAcesso("");
                  } else if (listaSual === ac) {
                    buscarSucursal();
                  } else if (excluirSual === ac) {
                    setAcessoCAD(true);
                  } else if (editarSual === ac) {
                    buscarSucursal();
                    setDisplayAcesso("");
                  }
                });
              }
            })
            .catch((err) => {
              console.error(err);
              window.alert("Erro ao buscar Usuário SAC!!");
            });
        };
    
        acessoMenuUser();
        buscarContatos(idSucursalN); 
        // eslint-disable-next-line
      }, [idSucursalN,logout,nomeUser, token]);

    useEffect(() => {
        const buscaUnidadeFederativa = async () => {
            const dados = { token };
            await getUnidadeFederativa(dados)
                .then((res) => {
                    if (res.data === "erroLogin") {
                        alert("Sessão expirada, Favor efetuar um novo login !!");
                        logout();
                        window.location.reload();
                    }
                    else {
                        setListaUF(res.data);
                    }
                }).catch((res) => {
                    console.error(res);
                })
        }
        buscaUnidadeFederativa();
    }, [logout, token]);


        const buscarSucursal = async () => {

            if (idSucursal > 0) {
                let dados = { token, idSucursal };
                await getSucursal(dados)
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
                                setSualCnpj(l.SUAL_CNPJ);                  
                                setSualIdLegado(l.SUAL_ID_LEGADO);              
                                setSualNaturezaJuridica(l.SUAL_NATUREZA_JURIDICA);      
                                setSualNomeFantasia(l.SUAL_NOME_FANTASIA);          
                                setSualRazaoSocial(l.SUAL_RAZAO_SOCIAL);           
                                setSualOptanteSimplesNacional(l.SUAL_OPTANTE_SIMPLES_NACIONAL);
                                setSualStatus(l.SUAL_STATUS);                
                                setSualInscricaoEstadual(l.SUAL_INSCRICAO_ESTADUAL);     
                                setSualInscricaoMunicipal(l.SUAL_INSCRICAO_MUNICIPAL);    
                                setSualCep(l.SUAL_CEP);                   
                                setSualCidade(l.SUAL_CIDADE);                
                                setSualRua(l.SUAL_RUA);                   
                                setSualNumero(l.SUAL_NUMERO);                
                                setSualComplemento(l.SUAL_COMPLEMENTO);           
                                setSualBairro(l.SUAL_CNPJ);    
                                setEstadoUF(l.UNFE_SIGLA);
                            })
                        }
                    }).catch((res) => {
                        console.error(res);
                        window.alert("Erro ao buscar Sucursal")
                    })
            }
        }
        buscarSucursal();

    const buscarContatos = async (idSucursalN) => {
        const dados = { token, idSucursal: idSucursalN, acessoGeral }
        await getContatoSucursal(dados)
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
            }).catch((res) => {
                console.error(res);
                window.alert("Erro ao listar contatos");
            })
    }

    const salvarSucursal = () => {
   
       const dados = {  sualCnpj: apenasNr(sualCnpj),sualIdLegado: apenasNr(sualIdLegado),sualNaturezaJuridica,              
                        sualNomeFantasia,sualRazaoSocial,sualOptanteSimplesNacional,sualStatus,                  
                        sualInscricaoEstadual: apenasNr(sualInscricaoEstadual),sualInscricaoMunicipal: apenasNr(sualInscricaoMunicipal),      
                        sualCep: apenasNr(sualCep),sualCidade,sualRua,sualNumero,sualComplemento,                   
                        sualBairro,estadoUF,token, idSucursal: idSucursalN, acessoGeral
        };

        if ( 
            validaCNPJ(sualCnpj) &&
            validaCampo(sualIdLegado,'Código Legado Obrigatório',64,'Tamanho campo Código Legado invalido')&&
            validaCampo(sualNaturezaJuridica,'Natureza Juridica Obrigatório',12,'Tamanho campo Natureza Juridica invalido')&&
            validaCampo(sualNomeFantasia,'Nome Fantasia Obrigatório',64,'Tamanho campo Nome Fantasia invalido')&&
            validaCampo(sualRazaoSocial,'Razão Social Obrigatório',128,'Tamanho campo Razão invalido')&&
            validaCampo(sualOptanteSimplesNacional,'Optante Simples Nacional Obrigatório',3,'Tamanho campo Optante Simples Nacional invalido')&&
            validaCampo(sualStatus,'Status Obrigatório',7,'Tamanho campo Status invalido')&&
            validaCampo(sualCep,'CEP Obrigatório',8,'Tamanho campo CEP invalido')&&
            validaCampo(sualCidade,'Cidade Obrigatório',64,'Tamanho campo Cidade invalido')&&
            validaCampo(sualRua,'Rua Obrigatório',128,'Tamanho campo Rua invalido')&&
            validaCampo(estadoUF,'UF Obrigatório',2,'Tamanho campo UF invalido')&&
            validaCampo(sualNumero,'Numero Obrigatório',10,'Tamanho campo Numero invalido')&&
            validaCampo(sualBairro,'Bairro Obrigatório',64,'Tamanho campo Bairro invalido')
        ) {
            saveSucursal(dados)
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
                        if (idSucursalN > 0) {
                            window.alert("Sucursal Alterada com Sucesso!!!");
                        } else {
                            (res.data).forEach((l) => { setIdSucursalN(l.ID_SUCURSAL); });
                            setDisplayCont("");
                            window.alert("Sucursal Cadastrado com Sucesso!!!");
                        }
                    }
                }).catch((erro) => {
                    window.alert("Erro ao tentar cadastrar");
                    console.error(erro, "erro ao tentar cadastrar");
                })
        }
    }

    const salvarContato = (contatos) => {
        const dadosContato = { contatos, token, idSucursal: idSucursalN, acessoGeral }
        saveContatoSucursal(dadosContato)
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
                else if (res.data === "sucesso") {
                    buscarContatos(idSucursalN);
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
        let dados = { token, idCont: parseInt(idCont), acessoGeral };
        deleteContatoSucursalID(dados)
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
                    buscarContatos(idSucursalN);
                }
            })
            .catch((res) => {
                console.error(res);
                window.alert("Erro ao excluir contato")
            })
    };
    const buscaCepOnline = async () => {

        var cepSONr = (isNaN(sualCep)) ? sualCep.replace(/\D/g, '') : sualCep;

        var validacep = /^[0-9]{8}$/;

        if (validacep.test(cepSONr)) {

            await fetch(`https://viacep.com.br/ws/${cepSONr}/json/`)
                .then(res => res.json()).then(data => {

                    if (data.erro) {
                        window.alert("CEP não encontrado")
                    } else {
                        setSualBairro(data.bairro);
                        setEstadoUF(data.uf);
                        setSualRua(data.logradouro);
                        setSualCidade(data.localidade);
                    }
                }).catch(res => {
                    window.alert("CEP não encontrado !!!")
                })
        } else {
            window.alert("CEP inválido!");
        }
    }

    //grid 

    const [columns] = useState([
        { name: 'SUCO_NOME', title: "Nome Contato" },
        { name: 'SUCO_FUNCAO', title: "FUNÇÃO" },
        { name: 'SUCO_DEPARTAMENTO', title: "DEPARTAMENTO", },
        { name: 'SUCO_EMAIL', title: "EMAIL" },
        { name: 'SUCO_URL', title: "URL" },
        { name: 'SUCO_CELULAR_DDD', title: " DDD" },
        { name: 'SUCO_CELULAR_NUMERO', title: " NR CELULAR" },
        { name: 'SUCO_CELULAR_OPERADORA', title: " OPERADORA" },
        { name: 'SUCO_FONE_COMERCIAL_DDD', title: " DDD" },
        { name: 'SUCO_FONE_COMERCIAL_NUMERO', title: " NR COMERCIAL" },
        { name: 'SUCO_FONE_COMERCIAL_RAMAL', title: " RAMAL" },

    ]);
    const [tableColumnExtensions] = useState([
        { columnName: 'SUCO_NOME', width: 200 },
        { columnName: 'SUCO_FUNCAO', width: 150 },
        { columnName: 'SUCO_DEPARTAMENTO', width: 150 },
        { columnName: 'SUCO_EMAIL', width: 330 },
        { columnName: 'SUCO_URL', width: 330 },
        { columnName: 'SUCO_CELULAR_DDD', width: 80 },
        { columnName: 'SUCO_CELULAR_NUMERO', width: 150 },
        { columnName: 'SUCO_CELULAR_OPERADORA', width: 150 },
        { columnName: 'SUCO_FONE_COMERCIAL_DDD', width: 80 },
        { columnName: 'SUCO_FONE_COMERCIAL_NUMERO', width: 150 },
        { columnName: 'SUCO_FONE_COMERCIAL_RAMAL', width: 80 },
    ]);


    const [addedRows, setAddedRows] = useState([]);
    const [pageSizes] = useState([5, 10, 15, 0]);


    const changeAddedRows = value => setAddedRows(
        value.map(row => (Object.keys(row).length ? row : {
            ID_SUCURSAL_CONTATO: null,
            SUCO_NOME: "",
            SUCO_FUNCAO: "",
            SUCO_DEPARTAMENTO: "",
            SUCO_EMAIL: "",
            SUCO_URL: "",
            SUCO_CELULAR_DDD: "",
            SUCO_CELULAR_NUMERO: "",
            SUCO_CELULAR_OPERADORA: "",
            SUCO_FONE_COMERCIAL_DDD: "",
            SUCO_FONE_COMERCIAL_NUMERO: "",
            SUCO_FONE_COMERCIAL_RAMAL: ""
        })),
    );

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
            for (let i = 0; i < changedRows.length; i++) {
                if (!(changedRows[i].ID_SUCURSAL_CONTATO)) {

                    if (changedRows[i].SUCO_NOME === "" || changedRows[i].SUCO_NOME.length > 64) {
                        window.alert("Campo Nome com tamanho inválido");
                    }
                     else if (changedRows[i].SUCO_FUNCAO === "" || changedRows[i].SUCO_FUNCAO.length > 64) {
                         window.alert("Campo Função com tamanho inválido");
                     }
                    else if (changedRows[i].SUCO_DEPARTAMENTO === "" || changedRows[i].SUCO_DEPARTAMENTO.length > 12) {
                        window.alert("Campo Departamento com tamanho inválido");
                    }
                    else if (!emailV.test(changedRows[i].SUCO_EMAIL)) {
                        window.alert("Email Contato inválido");
                    }
                    // else if (changedRows[i].SUCO_URL === "" || changedRows[i].SUCO_URL.length > 256) {
                    //     window.alert("Campo URL com tamanho inválido");
                    // }
                    else if (changedRows[i].SUCO_CELULAR_DDD === "" || isNaN(changedRows[i].SUCO_CELULAR_DDD) || changedRows[i].SUCO_CELULAR_DDD.length > 3) {
                        window.alert("Campo Celular DDD inválido");
                    }
                    else if (changedRows[i].SUCO_CELULAR_NUMERO === "" || isNaN(changedRows[i].SUCO_CELULAR_NUMERO) || changedRows[i].SUCO_CELULAR_NUMERO.length > 10) {
                        window.alert("Campo Celular NR inválido");
                    }
                    // else if (changedRows[i].SUCO_CELULAR_OPERADORA === "" || changedRows[i].SUCO_CELULAR_OPERADORA.length > 20) {
                    //     window.alert("Campo Operadora  com tamanho inválido");
                    // }
                    // else if (changedRows[i].SUCO_FONE_COMERCIAL_DDD === "" || isNaN(changedRows[i].SUCO_FONE_COMERCIAL_DDD) || changedRows[i].SUCO_FONE_COMERCIAL_DDD.length > 3) {
                    //     window.alert("Campo Fone Comercial DDD inválido");
                    // }
                    // else if (changedRows[i].SUCO_FONE_COMERCIAL_NUMERO === "" || isNaN(changedRows[i].SUCO_FONE_COMERCIAL_NUMERO) || changedRows[i].SUCO_FONE_COMERCIAL_NUMERO.length > 10) {
                    //     window.alert("Campo Fone Comercial NR  inválido");
                    // }
                    // else if (changedRows[i].SUCO_FONE_COMERCIAL_RAMAL === "" || isNaN(changedRows[i].SUCO_FONE_COMERCIAL_RAMAL) || changedRows[i].SUCO_FONE_COMERCIAL_RAMAL.length > 5) {
                    //     window.alert("Campo Fone Comercial Ramal  inválido");
                    // } 
                    else {
                        salvarContato(changedRows[i]);
                        buscarContatos();
                    }
                }
            }
        }
        if (changed) {

            changedRows = rows.map(row => (changed[row.id] ? { ...row, ...changed[row.id] } : row));
            for (let i = 0; i < changedRows.length; i++) {
                if (JSON.stringify(rows[i]) !== JSON.stringify(changedRows[i])) {

                    if (changedRows[i].SUCO_NOME === "" || changedRows[i].SUCO_NOME.length > 64) {
                        window.alert("Campo Nome com tamanho inválido");
                    }
                     else if (changedRows[i].SUCO_FUNCAO === "" || changedRows[i].SUCO_FUNCAO.length > 64) {
                         window.alert("Campo Função com tamanho inválido");
                     }
                     else if (changedRows[i].SUCO_DEPARTAMENTO === "" || changedRows[i].SUCO_DEPARTAMENTO.length > 12) {
                         window.alert("Campo Departamento com tamanho inválido");
                     }
                     else if (!emailV.test(changedRows[i].SUCO_EMAIL) ) {
                         window.alert("Email Contato inválido");
                     }
                    //  else if (changedRows[i].SUCO_URL === "" || changedRows[i].SUCO_URL.length > 256) {
                    //      window.alert("Campo URL com tamanho inválido");
                    //  }
                     else if (changedRows[i].SUCO_CELULAR_DDD === "" || isNaN(changedRows[i].SUCO_CELULAR_DDD) || changedRows[i].SUCO_CELULAR_DDD.length > 3) {
                         window.alert("Campo Celular DDD inválido");
                     }
                     else if (changedRows[i].SUCO_CELULAR_NUMERO === "" || isNaN(changedRows[i].SUCO_CELULAR_NUMERO) || changedRows[i].SUCO_CELULAR_NUMERO.length > 10) {
                         window.alert("Campo Celular NR inválido");
                     }
                    // else if (changedRows[i].SUCO_CELULAR_OPERADORA === "" || changedRows[i].SUCO_CELULAR_OPERADORA.length > 20) {
                    //     window.alert("Campo Operadora  com tamanho inválido");
                    // }
                    // else if (changedRows[i].SUCO_FONE_COMERCIAL_DDD === "" || isNaN(changedRows[i].SUCO_FONE_COMERCIAL_DDD) || changedRows[i].SUCO_FONE_COMERCIAL_DDD.length > 3) {
                    //     window.alert("Campo Fone Comercial DDD inválido");
                    // }
                    // else if (changedRows[i].SUCO_FONE_COMERCIAL_NUMERO === "" || isNaN(changedRows[i].SUCO_FONE_COMERCIAL_NUMERO) || changedRows[i].SUCO_FONE_COMERCIAL_NUMERO.length > 10) {
                    //     window.alert("Campo Fone Comercial NR  inválido");
                    // }
                    // else if (changedRows[i].SUCO_FONE_COMERCIAL_RAMAL === "" || isNaN(changedRows[i].SUCO_FONE_COMERCIAL_RAMAL) || changedRows[i].SUCO_FONE_COMERCIAL_RAMAL.length > 5) {
                    //     window.alert("Campo Fone Comercial Ramal  inválido");
                    // } 
                    else {
                        salvarContato(changedRows[i]);
                        buscarContatos();
                    }
                }
            }
        }
        if (deleted) {

            const deletedSet = new Set(deleted);
            changedRows = rows.filter(row => !deletedSet.has(row.id));
            let changedRowsDel = rows.filter(row => deletedSet.has(row.id));
            let idCont = parseInt(changedRowsDel.map(l => l.ID_SUCURSAL_CONTATO));
            deletarContato(idCont);
        }
        setRows(changedRows);
    };

    const ValidaNumber = ({ value }) => (
        value ? apenasNr(value) : value
    )
    const ValidaNumberProv = (props) => (
        <DataTypeProvider
            formatterComponent={ValidaNumber}
            {...props}
        />
    )
    const [validaNumber] = useState(["SUCO_CELULAR_DDD", "SUCO_CELULAR_NUMERO",
                                     "SUCO_FONE_COMERCIAL_DDD", "SUCO_FONE_COMERCIAL_NUMERO",
                                     "SUCO_FONE_COMERCIAL_RAMAL", "ID_SUCURSAL"]);

    return (
        <div>
            <div style={{ marginBottom: "10px", marginTop: "10px" }}>
                <h3 id="titulos">CADASTRO DE SUCURSAL </h3>
                <Box
                    component="form"
                    sx={{
                        '& .MuiTextField-root': { m: 1, width: '25ch' },
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <div style={{}} >

                        <TextField required label="Razão Social" error={sualRazaoSocial.length < 1 || sualRazaoSocial.length > 127 ? true : false} variant="outlined" disabled={!acessoCAD} maxLength={128} id="razaoSoc" type="text" onChange={(e) => setSualRazaoSocial(e.target.value)} value={sualRazaoSocial} style={{ minWidth: "30em" }} />
                        <TextField required label="Nome Fantasia" error={sualNomeFantasia.length < 1 || sualNomeFantasia.length > 63 ? true : false} disabled={!acessoCAD} maxLength={64} id="nomeFant" type="text" onChange={(e) => setSualNomeFantasia(e.target.value)} value={sualNomeFantasia} style={{ minWidth: "25em" }} />
                        <TextField required label="CNPJ" error={sualCnpj.length < 1 || sualCnpj.length > 20 ? true : false} disabled={!acessoCAD} id="txtCnpj" maxLength={20} onChange={(e) => setSualCnpj(e.target.value)} value={cnpj.format(sualCnpj)} />
                        <TextField required label="Codigo Legado" error={sualIdLegado.length < 1 || sualIdLegado.length > 64 ? true : false} disabled={!acessoCAD} maxLength={64} id="codLeg" type="number" value={sualIdLegado} onChange={(e) => setSualIdLegado(e.target.value)} style={{ maxWidth: "11em" }} />
                        <TextField required id="tipoP" error={sualNaturezaJuridica.length < 1 ? true : false} label="Tipo de Pessoa" select disabled={!acessoCAD} value={sualNaturezaJuridica} onChange={(e) => setSualNaturezaJuridica(e.target.value)} style={{ maxWidth: "11em" }}  >
                            <MenuItem value={"Juridica"}>Juridica</MenuItem>
                            <MenuItem value={"Fisica"}>Fisica</MenuItem>
                        </TextField>
                        <TextField required select error={sualOptanteSimplesNacional.length < 1 ? true : false} label="Optante Simples" disabled={!acessoCAD} id="opSimp" value={sualOptanteSimplesNacional} onChange={(e) => setSualOptanteSimplesNacional(e.target.value)} style={{ maxWidth: "11em" }}>
                            <MenuItem value={"Sim"} >Sim</MenuItem>
                            <MenuItem value={"Nao"}>Não</MenuItem>
                        </TextField>
                        <TextField required select error={sualStatus.length < 1 ? true : false} label={"Status"} disabled={!acessoCAD} id="statusFOR" value={sualStatus} onChange={(e) => setSualStatus(e.target.value)} style={{ maxWidth: "11em" }}>
                            <MenuItem value={"Ativo"}>Ativo</MenuItem>
                            <MenuItem value={"Inativo"}>Inativo</MenuItem>
                        </TextField>
                        <TextField required label="Inscrição Estadual" error={sualInscricaoEstadual.length > 20 ? true : false} disabled={!acessoCAD} maxLength={20} type="text" onChange={(e) => setSualInscricaoEstadual(e.target.value)} value={sualInscricaoEstadual} />
                        <TextField required label="Inscrição Municipal" error={sualInscricaoMunicipal.length > 20 ? true : false} disabled={!acessoCAD} maxLength={20} type="text" onChange={(e) => setSualInscricaoMunicipal(e.target.value)} value={sualInscricaoMunicipal} />
                        <TextField required label="CEP" error={sualCep.length < 1 || sualCep.length > 10 ? true : false} disabled={!acessoCAD} id="cep" type="text" onChange={(e) => setSualCep(e.target.value)} value={sualCep} style={{ maxWidth: "11em" }}></TextField>
                        <Button disabled={!acessoCAD} onClick={(e) => buscaCepOnline(e)} style={{ padding: "13px", marginTop: "11px" }} > BUSCAR CEP  </Button>
                        <TextField required select error={estadoUF.length < 1 ? true : false} label={"UF"} disabled={!acessoCAD} id="uf" onChange={(e) => setEstadoUF(e.target.value)} value={estadoUF} style={{ maxWidth: "6em" }} >
                            {listaUF.map((l) =>
                                <MenuItem key={l.ID_UNIDADE_FEDERATIVA} value={l.UNFE_SIGLA}>{l.UNFE_SIGLA}</MenuItem>
                            )}
                        </TextField>
                        <TextField required label="Cidade" error={sualCidade.length < 1 || sualCidade.length > 64 ? true : false} disabled={!acessoCAD} maxLength={64} id="cidade" type="text" onChange={(e) => setSualCidade(e.target.value)} value={sualCidade} />
                        <TextField required label="Bairro" error={sualBairro.length < 1 || sualBairro.length > 64 ? true : false} disabled={!acessoCAD} maxLength={64} id="bairro" type="text" onChange={(e) => setSualBairro(e.target.value)} value={sualBairro} />
                        <TextField required label="Logradouro" error={sualRua.length < 1 || sualRua.length > 128 ? true : false} disabled={!acessoCAD} maxLength={128} id="lograd" type="text" onChange={(e) => setSualRua(e.target.value)} value={sualRua} style={{ minWidth: "25em" }} />
                        <TextField required label="NR" error={sualNumero.length < 1 || sualNumero.length > 10 ? true : false} disabled={!acessoCAD} maxLength={10} id="nrLograd" type="text" onChange={(e) => setSualNumero(e.target.value)} value={sualNumero} style={{ maxWidth: "11em" }} />     
                        <TextField required label="Complemento" error={sualComplemento.length < 1 || sualComplemento.length > 64 ? true : false} disabled={!acessoCAD} maxLength={64} id="compl" type="text" onChange={(e) => setSualComplemento(e.target.value)} value={sualComplemento} style={{ minWidth: "25em" }} />                     
                    </div>
                </Box>
            </div>

            <div className="form-inline" id="" style={{ fontSize: "9", marginBottom: "10px" }}>

                <hr style={{ width: "100%" }} />
                <div className="form-group col-md-7" style={{ display: displayCont }}   >
                    <h3 id="titulos" style={{marginLeft:"15em"}} >{acessoGeral || acessoCAD ? "Cadastrar Contato" : "Visualizar Contato"} </h3>
                </div>

                <div style={{ display: displayCont }} className="form-group col-md-12"    >
                    <div className="card" >
                        <Grid
                            rows={rows}
                            columns={columns}
                        >
                            <ValidaNumberProv
                                for={validaNumber}
                            />
                            <FuncaoProvider
                                for={sucoFuncaoColumns}
                            />

                            <EditingState
                                addedRows={addedRows}
                                onAddedRowsChange={changeAddedRows}
                                editingRowIds={editingRowIds}
                                onEditingRowIdsChange={getEditingRowIds}
                                rowChanges={rowChanges}
                                onRowChangesChange={setRowChanges}
                                onCommitChanges={commitChanges}
                            />

                            <PagingState
                                defaultCurrentPage={0}
                                pageSize={5}
                            />
                            <IntegratedPaging />

                            <PagingPanel
                                pageSizes={pageSizes}
                            />
                            <Table
                                columnExtensions={tableColumnExtensions}
                            />
                            <TableColumnResizing defaultColumnWidths={tableColumnExtensions} />
                            <TableHeaderRow />
                            <TableEditRow />
                            {acessoGeral || acessoCAD ? <TableEditColumn
                                showEditCommand
                                showAddCommand={!addedRows.length}
                                showDeleteCommand
                                commandComponent={Command}
                            /> : ""}

                        </Grid>
                    </div>
                </div>

                <div className="form-group col-md-10" style={{ marginBottom: "10px", marginLeft: "20px", marginTop: "10px" }}>
                    <Button style={{ display: displayAcesso }} className="margemRight" onClick={(e) => salvarSucursal(e)} > {idSucursalN === "0" ? "CADASTRAR" : "SALVAR ALTERAÇÕES"}</Button>
                    <Button id="buttonAlert" onClick={(e) => navigate("/listarSucursal")} > {idSucursalN === "0" ? "CANCELAR" : "SAIR"} </Button><br />
                </div>
            </div>
        </div>
    )
};

export default CadastroSucursal;