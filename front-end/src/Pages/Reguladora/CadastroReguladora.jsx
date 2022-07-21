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
import {
    Grid,
    Table,
    TableHeaderRow,
    TableEditRow,
    TableEditColumn,
    PagingPanel,
    TableColumnResizing,
} from '@devexpress/dx-react-grid-material-ui';
import { deleteContatoReguladoraID, getContatoReguladora, getReguladora, saveContatoReguladora, saveReguladora } from "../../Service/reguladoraService";
import { apenasNr, validaCNPJ, validaCampo } from "../../Service/utilServiceFrontEnd";
import { getUnidadeFederativa } from "../../Service/enderecoService";
import { getRegional } from "../../Service/regionalService";
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

const CadastroReguladora = () => {
    const { logout, nomeUser } = useContext(AuthContext);
    const [rgraCnpj, setRgraCnpj] = useState("");
    const [rgraIdLegado, setRgraIdLegado] = useState("");
    const [rgraNaturezaJuridica, setRgraNaturezaJuridica] = useState("");
    const [rgraNomeFantasia, setRgraNomeFantasia] = useState("");
    const [rgraRazaoSocial, setRgraRazaoSocial] = useState("");
    const [rgraOptanteSimplesNacional, setRgraOptanteSimplesNacional] = useState("");
    const [rgraStatus, setRgraStatus] = useState("");
    const [rgraTipoReguladora, setRgraTipoReguladora] = useState("");
    const [rgraSigla, setRgraSigla] = useState("");
    const [rgraInscricaoEstadual, setRgraInscricaoEstadual] = useState("");
    const [rgraInscricaoMunicipal, setRgraInscricaoMunicipal] = useState("");
    const [rgraCep, setRgraCep] = useState("");
    const [rgraCidade, setRgraCidade] = useState("");
    //const [idUnidadeFederativa, setIdUnidadeFederativa] = useState("");
    const [rgraRua, setRgraRua] = useState("");
    const [rgraNumero, setRgraNumero] = useState("");
    const [rgraComplemento, setRgraComplemento] = useState("");
    const [rgraBairro, setRgraBairro] = useState("");    
    const [estadoUF, setEstadoUF] = useState("");  
    const [regAbreviatura, setRegAbreviatura] = useState("");    
    const { idReguladora } = useParams();
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const [idReguladoraN, setIdReguladoraN] = useState(idReguladora);    
    const [displayCont, setDisplayCont] = useState(idReguladoraN === "0" ? "none" : "");
    const [rows, setRows] = useState([]);
    const [listaUF, setListaUF] = useState([]);
    const [listaRegAbreviatura, setListaRegAbreviatura] = useState([]);
    const [editingRowIds, getEditingRowIds] = useState([]);
    const [rowChanges, setRowChanges] = useState({});

    //const [acessoGeral, setAcessoGeral] = useState(false);
    //const [acessoCAD, setAcessoCAD] = useState(false);
    //verificar
   
    const [rgcoFuncaoColumns] = useState(['RGCO_FUNCAO']);
    const listaRgra   = "LIST_REGULADORA";
    const incluirRgra = "ADD_REGULADORA";
    const excluirRgra = "DEL_REGULADORA";
    const editarRgra  = "EDIT_REGULADORA";

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
                    buscarReguladora();
                    setDisplayAcesso("");
                  } else if (incluirRgra === ac) {
                    setAcessoCAD(true);
                    setDisplayAcesso("");
                  } else if (listaRgra === ac) {
                    buscarReguladora();
                  } else if (excluirRgra === ac) {
                    setAcessoCAD(true);
                  } else if (editarRgra === ac) {
                    buscarReguladora();
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
        buscarContatos(idReguladoraN); 
        // eslint-disable-next-line
      }, [idReguladoraN,logout,nomeUser, token]);

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

    useEffect(() => {
        const buscaRegional = async () => {
            const dados = { token };
            await getRegional(dados)
                .then((res) => {
                    if (res.data === "erroLogin") {
                        alert("Sessão expirada, Favor efetuar um novo login !!");
                        logout();
                        window.location.reload();
                    }
                    else {
                        setListaRegAbreviatura(res.data);
                    }
                }).catch((res) => {
                    console.error(res);
                })
        }
        buscaRegional();
    }, [logout, token]);


        const buscarReguladora = async () => {

            if (idReguladora > 0) {
                let dados = { token, idReguladora };
                await getReguladora(dados)
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
                                setRgraCnpj(l.RGRA_CNPJ);    
                                setRgraIdLegado(l.RGRA_ID_LEGADO);              
                                setRgraNaturezaJuridica(l.RGRA_NATUREZA_JURIDICA);       
                                setRgraNomeFantasia(l.RGRA_NOME_FANTASIA);           
                                setRgraRazaoSocial(l.RGRA_RAZAO_SOCIAL);            
                                setRgraOptanteSimplesNacional(l.RGRA_OPTANTE_SIMPLES_NACIONAL); 
                                setRgraStatus(l.RGRA_STATUS);
                                setRgraTipoReguladora(l.RGRA_TIPO_REGULADORA);         
                                setRgraSigla(l.RGRA_SIGLA);     
                                setRgraInscricaoEstadual(l.RGRA_INSCRICAO_ESTADUAL);      
                                setRgraInscricaoMunicipal(l.RGRA_INSCRICAO_MUNICIPAL);     
                                setRgraCep(l.RGRA_CEP);                    
                                setRgraCidade(l.RGRA_CIDADE);                 
                                setEstadoUF(l.UNFE_SIGLA);  
                                setRegAbreviatura(l.RGAL_ABREVIATURA);
                                setRgraRua(l.RGRA_RUA);                    
                                setRgraNumero(l.RGRA_NUMERO);                 
                                setRgraComplemento(l.RGRA_COMPLEMENTO);            
                                setRgraBairro(l.RGRA_BAIRRO);     
                            })
                        }
                    }).catch((res) => {
                        console.error(res);
                        window.alert("Erro ao buscar Reguladora")
                    })
            }
        }

    const buscarContatos = async (idReguladoraN) => {
        const dados = { token, idReguladora: idReguladoraN, acessoGeral }
        await getContatoReguladora(dados)
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

    const salvarReguladora = () => {
   
       const dados = { rgraCnpj: apenasNr(rgraCnpj),rgraIdLegado: apenasNr(rgraIdLegado),rgraNaturezaJuridica,       
                       rgraNomeFantasia,rgraRazaoSocial,rgraOptanteSimplesNacional,rgraStatus,rgraTipoReguladora,         
                       rgraSigla,rgraInscricaoEstadual: apenasNr(rgraInscricaoEstadual),rgraInscricaoMunicipal: apenasNr(rgraInscricaoMunicipal),     
                       rgraCep: apenasNr(rgraCep),rgraCidade,rgraRua,rgraNumero,rgraComplemento,rgraBairro,estadoUF,regAbreviatura,
                       token, idReguladora: idReguladoraN, acessoGeral
        };

        if ( 
            validaCNPJ(rgraCnpj) &&
            validaCampo(rgraIdLegado,'Código Legado Obrigatório',64,'Tamanho campo Código Legado invalido')&&
            validaCampo(rgraNaturezaJuridica,'Natureza Juridica Obrigatório',12,'Tamanho campo Natureza Juridica invalido')&&
            validaCampo(rgraNomeFantasia,'Nome Fantasia Obrigatório',64,'Tamanho campo Nome Fantasia invalido')&&
            validaCampo(rgraRazaoSocial,'Razão Social Obrigatório',128,'Tamanho campo Razão invalido')&&
            validaCampo(rgraOptanteSimplesNacional,'Optante Simples Nacional Obrigatório',3,'Tamanho campo Optante Simples Nacional invalido')&&
            validaCampo(rgraStatus,'Status Obrigatório',7,'Tamanho campo Status invalido')&&
            validaCampo(rgraTipoReguladora,'Tipo Reguladora Obrigatório',12,'Tamanho campo Tipo Reguladora invalido')&&
            validaCampo(rgraSigla,'Sigla Obrigatório',32,'Tamanho campo Sigla invalido')&&
            validaCampo(rgraCep,'CEP Obrigatório',8,'Tamanho campo CEP invalido')&&
            validaCampo(rgraCidade,'Cidade Obrigatório',64,'Tamanho campo Cidade invalido')&&
            validaCampo(rgraRua,'Rua Obrigatório',128,'Tamanho campo Rua invalido')&&
            validaCampo(estadoUF,'UF Obrigatório',2,'Tamanho campo UF invalido')&&
            validaCampo(rgraNumero,'Numero Obrigatório',10,'Tamanho campo Numero invalido')&&
            validaCampo(rgraComplemento,'Complemento Obrigatório',64,'Tamanho campo Complemento invalido')&&
            validaCampo(rgraBairro,'Bairro Obrigatório',64,'Tamanho campo Bairro invalido')&&
            validaCampo(regAbreviatura,'Regional Obrigatório',14,'Tamanho campo Regional invalido')
        ) {
            saveReguladora(dados)
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
                        if (idReguladoraN > 0) {
                            window.alert("Reguladora Alterada com Sucesso!!!");
                        } else {
                            (res.data).forEach((l) => { setIdReguladoraN(l.ID_REGULADORA); });
                            setDisplayCont("");
                            window.alert("Reguladora Cadastrado com Sucesso!!!");
                        }
                    }
                }).catch((erro) => {
                    window.alert("Erro ao tentar cadastrar");
                    console.error(erro, "erro ao tentar cadastrar");
                })
        }
    }

    const salvarContato = (contatos) => {
        const dadosContato = { contatos, token, idReguladora: idReguladoraN, acessoGeral }
        saveContatoReguladora(dadosContato)
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
                    buscarContatos(idReguladoraN);
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
        deleteContatoReguladoraID(dados)
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
                    buscarContatos(idReguladoraN);
                }
            })
            .catch((res) => {
                console.error(res);
                window.alert("Erro ao excluir contato")
            })
    };
    const buscaCepOnline = async () => {

        var cepSONr = (isNaN(rgraCep)) ? rgraCep.replace(/\D/g, '') : rgraCep;

        var validacep = /^[0-9]{8}$/;

        if (validacep.test(cepSONr)) {

            await fetch(`https://viacep.com.br/ws/${cepSONr}/json/`)
                .then(res => res.json()).then(data => {

                    if (data.erro) {
                        window.alert("CEP não encontrado")
                    } else {
                        setRgraBairro(data.bairro);
                        setEstadoUF(data.uf);
                        setRgraRua(data.logradouro);
                        setRgraCidade(data.localidade);
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
        { name: 'RGCO_NOME', title: "Nome Contato" },
        { name: 'RGCO_FUNCAO', title: "FUNÇÃO" },
        { name: 'RGCO_DEPARTAMENTO', title: "DEPARTAMENTO", },
        { name: 'RGCO_EMAIL', title: "EMAIL" },
        { name: 'RGCO_URL', title: "URL" },
        { name: 'RGCO_CELULAR_DDD', title: " DDD" },
        { name: 'RGCO_CELULAR_NUMERO', title: " NR CELULAR" },
        { name: 'RGCO_CELULAR_OPERADORA', title: " OPERADORA" },
        { name: 'RGCO_FONE_COMERCIAL_DDD', title: " DDD" },
        { name: 'RGCO_FONE_COMERCIAL_NUMERO', title: " NR COMERCIAL" },
        { name: 'RGCO_FONE_COMERCIAL_RAMAL', title: " RAMAL" },

    ]);
    const [tableColumnExtensions] = useState([
        { columnName: 'RGCO_NOME', width: 200 },
        { columnName: 'RGCO_FUNCAO', width: 150 },
        { columnName: 'RGCO_DEPARTAMENTO', width: 150 },
        { columnName: 'RGCO_EMAIL', width: 330 },
        { columnName: 'RGCO_URL', width: 330 },
        { columnName: 'RGCO_CELULAR_DDD', width: 80 },
        { columnName: 'RGCO_CELULAR_NUMERO', width: 150 },
        { columnName: 'RGCO_CELULAR_OPERADORA', width: 150 },
        { columnName: 'RGCO_FONE_COMERCIAL_DDD', width: 80 },
        { columnName: 'RGCO_FONE_COMERCIAL_NUMERO', width: 150 },
        { columnName: 'RGCO_FONE_COMERCIAL_RAMAL', width: 80 },
    ]);


    const [addedRows, setAddedRows] = useState([]);
    const [pageSizes] = useState([5, 10, 15, 0]);


    const changeAddedRows = value => setAddedRows(
        value.map(row => (Object.keys(row).length ? row : {
            ID_REGULADORA_CONTATO: null,
            RGCO_NOME: "",
            RGCO_FUNCAO: "",
            RGCO_DEPARTAMENTO: "",
            RGCO_EMAIL: "",
            RGCO_URL: "",
            RGCO_CELULAR_DDD: "",
            RGCO_CELULAR_NUMERO: "",
            RGCO_CELULAR_OPERADORA: "",
            RGCO_FONE_COMERCIAL_DDD: "",
            RGCO_FONE_COMERCIAL_NUMERO: "",
            RGCO_FONE_COMERCIAL_RAMAL: ""
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
                if (!(changedRows[i].ID_REGULADORA_CONTATO)) {

                    if (changedRows[i].RGCO_NOME === "" || changedRows[i].RGCO_NOME.length > 64) {
                        window.alert("Campo Nome com tamanho inválido");
                    }
                     else if (changedRows[i].RGCO_FUNCAO === "" || changedRows[i].RGCO_FUNCAO.length > 64) {
                         window.alert("Campo Função com tamanho inválido");
                     }
                    else if (changedRows[i].RGCO_DEPARTAMENTO === "" || changedRows[i].RGCO_DEPARTAMENTO.length > 12) {
                        window.alert("Campo Departamento com tamanho inválido");
                    }
                    else if (!emailV.test(changedRows[i].RGCO_EMAIL)) {
                        window.alert("Email Contato inválido");
                    }
                     else if (changedRows[i].RGCO_URL === "" || changedRows[i].RGCO_URL.length > 256) {
                         window.alert("Campo URL com tamanho inválido");
                    }
                    else if (changedRows[i].RGCO_CELULAR_DDD === "" || isNaN(changedRows[i].RGCO_CELULAR_DDD) || changedRows[i].RGCO_CELULAR_DDD.length > 3) {
                        window.alert("Campo Celular DDD inválido");
                    }
                    else if (changedRows[i].RGCO_CELULAR_NUMERO === "" || isNaN(changedRows[i].RGCO_CELULAR_NUMERO) || changedRows[i].RGCO_CELULAR_NUMERO.length > 10) {
                        window.alert("Campo Celular NR inválido");
                    }
                    // else if (changedRows[i].RGCO_CELULAR_OPERADORA === "" || changedRows[i].RGCO_CELULAR_OPERADORA.length > 20) {
                    //     window.alert("Campo Operadora  com tamanho inválido");
                    // }
                    // else if (changedRows[i].RGCO_FONE_COMERCIAL_DDD === "" || isNaN(changedRows[i].RGCO_FONE_COMERCIAL_DDD) || changedRows[i].RGCO_FONE_COMERCIAL_DDD.length > 3) {
                    //     window.alert("Campo Fone Comercial DDD inválido");
                    // }
                    // else if (changedRows[i].RGCO_FONE_COMERCIAL_NUMERO === "" || isNaN(changedRows[i].RGCO_FONE_COMERCIAL_NUMERO) || changedRows[i].RGCO_FONE_COMERCIAL_NUMERO.length > 10) {
                    //     window.alert("Campo Fone Comercial NR  inválido");
                    // }
                    // else if (changedRows[i].RGCO_FONE_COMERCIAL_RAMAL === "" || isNaN(changedRows[i].RGCO_FONE_COMERCIAL_RAMAL) || changedRows[i].RGCO_FONE_COMERCIAL_RAMAL.length > 5) {
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

                    if (changedRows[i].RGCO_NOME === "" || changedRows[i].RGCO_NOME.length > 64) {
                        window.alert("Campo Nome com tamanho inválido");
                    }
                     else if (changedRows[i].RGCO_FUNCAO === "" || changedRows[i].RGCO_FUNCAO.length > 64) {
                         window.alert("Campo Função com tamanho inválido");
                     }
                     else if (changedRows[i].RGCO_DEPARTAMENTO === "" || changedRows[i].RGCO_DEPARTAMENTO.length > 12) {
                         window.alert("Campo Departamento com tamanho inválido");
                     }
                     else if (!emailV.test(changedRows[i].RGCO_EMAIL) ) {
                         window.alert("Email Contato inválido");
                     }
                     else if (changedRows[i].RGCO_URL === "" || changedRows[i].RGCO_URL.length > 256) {
                          window.alert("Campo URL com tamanho inválido");
                     }
                     else if (changedRows[i].RGCO_CELULAR_DDD === "" || isNaN(changedRows[i].RGCO_CELULAR_DDD) || changedRows[i].RGCO_CELULAR_DDD.length > 3) {
                         window.alert("Campo Celular DDD inválido");
                     }
                     else if (changedRows[i].RGCO_CELULAR_NUMERO === "" || isNaN(changedRows[i].RGCO_CELULAR_NUMERO) || changedRows[i].RGCO_CELULAR_NUMERO.length > 10) {
                         window.alert("Campo Celular NR inválido");
                     }
                    // else if (changedRows[i].RGCO_CELULAR_OPERADORA === "" || changedRows[i].RGCO_CELULAR_OPERADORA.length > 20) {
                    //     window.alert("Campo Operadora  com tamanho inválido");
                    // }
                    // else if (changedRows[i].RGCO_FONE_COMERCIAL_DDD === "" || isNaN(changedRows[i].RGCO_FONE_COMERCIAL_DDD) || changedRows[i].RGCO_FONE_COMERCIAL_DDD.length > 3) {
                    //     window.alert("Campo Fone Comercial DDD inválido");
                    // }
                    // else if (changedRows[i].RGCO_FONE_COMERCIAL_NUMERO === "" || isNaN(changedRows[i].RGCO_FONE_COMERCIAL_NUMERO) || changedRows[i].RGCO_FONE_COMERCIAL_NUMERO.length > 10) {
                    //     window.alert("Campo Fone Comercial NR  inválido");
                    // }
                    // else if (changedRows[i].RGCO_FONE_COMERCIAL_RAMAL === "" || isNaN(changedRows[i].RGCO_FONE_COMERCIAL_RAMAL) || changedRows[i].RGCO_FONE_COMERCIAL_RAMAL.length > 5) {
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
            let idCont = parseInt(changedRowsDel.map(l => l.ID_REGULADORA_CONTATO));
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
    const [validaNumber] = useState(["RGCO_CELULAR_DDD", "RGCO_CELULAR_NUMERO",
                                     "RGCO_FONE_COMERCIAL_DDD", "RGCO_FONE_COMERCIAL_NUMERO",
                                     "RGCO_FONE_COMERCIAL_RAMAL", "ID_REGULADORA"]);
    return (
        <div>
            <div style={{ marginBottom: "10px", marginTop: "10px" }}>
                <h3 id="titulos">CADASTRO DE REGULADORAS </h3>
                <Box
                    component="form"
                    sx={{
                        '& .MuiTextField-root': { m: 1, width: '25ch' },
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <div style={{}} >

                        <TextField required label="CNPJ" error={rgraCnpj.length < 1 || rgraCnpj.length > 20 ? true : false} disabled={!acessoCAD} id="txtCnpj" maxLength={20} onChange={(e) => setRgraCnpj(e.target.value)} value={cnpj.format(rgraCnpj)} />
                        <TextField required label="Razão Social" error={rgraRazaoSocial.length < 1 || rgraRazaoSocial.length > 127 ? true : false} variant="outlined" disabled={!acessoCAD} maxLength={128} id="razaoSoc" type="text" onChange={(e) => setRgraRazaoSocial(e.target.value)} value={rgraRazaoSocial} style={{ minWidth: "30em" }} />
                        <TextField required label="Nome Fantasia" error={rgraNomeFantasia.length < 1 || rgraNomeFantasia.length > 63 ? true : false} disabled={!acessoCAD} maxLength={64} id="nomeFant" type="text" onChange={(e) => setRgraNomeFantasia(e.target.value)} value={rgraNomeFantasia} style={{ minWidth: "25em" }} />
                        <TextField required label="Sigla" error={rgraSigla.length < 1 || rgraSigla.length > 32 ? true : false} disabled={!acessoCAD} maxLength={32} id="rgraSigla" type="text" value={rgraSigla} onChange={(e) => setRgraSigla(e.target.value)} style={{ maxWidth: "11em" }} />
                        <TextField required label="Codigo Legado" error={rgraIdLegado.length < 1 || rgraIdLegado.length > 64 ? true : false} disabled={!acessoCAD} maxLength={64} id="codLeg" type="number" value={rgraIdLegado} onChange={(e) => setRgraIdLegado(e.target.value)} style={{ maxWidth: "11em" }} />
                        <TextField required id="tipoP" error={rgraNaturezaJuridica.length < 1 ? true : false} label="Tipo de Pessoa" select disabled={!acessoCAD} value={rgraNaturezaJuridica} onChange={(e) => setRgraNaturezaJuridica(e.target.value)} style={{ maxWidth: "11em" }}  >
                            <MenuItem value={"Juridica"}>Juridica</MenuItem>
                            <MenuItem value={"Fisica"}>Fisica</MenuItem>
                        </TextField>
                        <TextField required select error={rgraOptanteSimplesNacional.length < 1 ? true : false} label="Optante Simples" disabled={!acessoCAD} id="opSimp" value={rgraOptanteSimplesNacional} onChange={(e) => setRgraOptanteSimplesNacional(e.target.value)} style={{ maxWidth: "11em" }}>
                            <MenuItem value={"Sim"} >Sim</MenuItem>
                            <MenuItem value={"Nao"}>Não</MenuItem>
                        </TextField>
                        <TextField required select error={rgraStatus.length < 1 ? true : false} label={"Status"} disabled={!acessoCAD} id="statusREG" value={rgraStatus} onChange={(e) => setRgraStatus(e.target.value)} style={{ maxWidth: "11em" }}>
                            <MenuItem value={"Ativo"}>Ativo</MenuItem>
                            <MenuItem value={"Inativo"}>Inativo</MenuItem>
                        </TextField>
                        <TextField required select error={rgraTipoReguladora.length < 1 ? true : false} label={"Tipo Reguladora"} disabled={!acessoCAD} id="TpRegu" value={rgraTipoReguladora} onChange={(e) => setRgraTipoReguladora(e.target.value)} style={{ maxWidth: "11em" }}>
                            <MenuItem value={"Reguladora"}>Reguladora</MenuItem>
                            <MenuItem value={"Bate-Pronto"}>Bate-Pronto</MenuItem>
                        </TextField>
                        <TextField required label="Inscrição Estadual" error={rgraInscricaoEstadual.length > 20 ? true : false} disabled={!acessoCAD} maxLength={20} type="text" onChange={(e) => setRgraInscricaoEstadual(e.target.value)} value={rgraInscricaoEstadual} />
                        <TextField required label="Inscrição Municipal" error={rgraInscricaoMunicipal.length > 20 ? true : false} disabled={!acessoCAD} maxLength={20} type="text" onChange={(e) => setRgraInscricaoMunicipal(e.target.value)} value={rgraInscricaoMunicipal} />
                        <TextField required select error={regAbreviatura.length < 1 ? true : false} label={"Regional"} disabled={!acessoCAD} id="abrev" onChange={(e) => setRegAbreviatura(e.target.value)} value={regAbreviatura} style={{ maxWidth: "12em" }} >
                            {listaRegAbreviatura.map((r) =>
                                <MenuItem key={r.ID_REGIONAL} value={r.RGAL_ABREVIATURA}>{r.RGAL_ABREVIATURA}</MenuItem>
                            )}
                        </TextField>                        
                        <TextField required label="CEP" error={rgraCep.length < 1 || rgraCep.length > 10 ? true : false} disabled={!acessoCAD} id="cep" type="text" onChange={(e) => setRgraCep(e.target.value)} value={rgraCep} style={{ maxWidth: "11em" }}></TextField>
                        <Button disabled={!acessoCAD} onClick={(e) => buscaCepOnline(e)} style={{ padding: "13px", marginTop: "11px" }} > BUSCAR CEP  </Button>
                        <TextField required select error={estadoUF.length < 1 ? true : false} label={"UF"} disabled={!acessoCAD} id="uf" onChange={(e) => setEstadoUF(e.target.value)} value={estadoUF} style={{ maxWidth: "6em" }} >
                            {listaUF.map((l) =>
                                <MenuItem key={l.ID_UNIDADE_FEDERATIVA} value={l.UNFE_SIGLA}>{l.UNFE_SIGLA}</MenuItem>
                            )}
                        </TextField>
                        <TextField required label="Cidade" error={rgraCidade.length < 1 || rgraCidade.length > 64 ? true : false} disabled={!acessoCAD} maxLength={64} id="cidade" type="text" onChange={(e) => setRgraCidade(e.target.value)} value={rgraCidade} />
                        <TextField required label="Bairro" error={rgraBairro.length < 1 || rgraBairro.length > 64 ? true : false} disabled={!acessoCAD} maxLength={64} id="bairro" type="text" onChange={(e) => setRgraBairro(e.target.value)} value={rgraBairro} />
                        <TextField required label="Logradouro" error={rgraRua.length < 1 || rgraRua.length > 128 ? true : false} disabled={!acessoCAD} maxLength={128} id="lograd" type="text" onChange={(e) => setRgraRua(e.target.value)} value={rgraRua} style={{ minWidth: "25em" }} />
                        <TextField required label="NR" error={rgraNumero.length < 1 || rgraNumero.length > 10 ? true : false} disabled={!acessoCAD} maxLength={10} id="nrLograd" type="text" onChange={(e) => setRgraNumero(e.target.value)} value={rgraNumero} style={{ maxWidth: "11em" }} />
                        <TextField required label="Complemento" error={rgraComplemento.length < 1 || rgraComplemento.length > 64 ? true : false} disabled={!acessoCAD} maxLength={64} id="compl" type="text" onChange={(e) => setRgraComplemento(e.target.value)} value={rgraComplemento} style={{ minWidth: "25em" }} />
                   
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
                                for={rgcoFuncaoColumns}
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
                    <Button style={{ display: displayAcesso }} className="margemRight" onClick={(e) => salvarReguladora(e)} > {idReguladoraN === "0" ? "CADASTRAR" : "SALVAR ALTERAÇÕES"}</Button>
                    <Button id="buttonAlert" onClick={(e) => navigate("/listarReguladora")} > {idReguladoraN === "0" ? "CANCELAR" : "SAIR"} </Button><br />
                </div>
            </div>
        </div>
    )
};

export default CadastroReguladora;