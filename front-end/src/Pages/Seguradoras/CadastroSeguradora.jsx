/**
 * Pagina em construção para cadastrar uma nova unidade empresarial
 */

import { useContext, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
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
} from '@devexpress/dx-react-grid-material-ui';
import { deleteContatoSegID, getContatoSeguradora, getSeguradora, saveContatoSeguradora, saveSeguradora } from "../../Service/seguradoraService";
import { apenasNr, validaCodLEG, validaNomeFANT, validaOpSIMPLES, validaStatusSEG, validaTipoPESSOA, validaCNPJ, validaEMAIL, validaRAZAO, validaCEP, validaUF, validaCIDADE, validaBAIRRO, validaLOGRAD, validaNRLOGRAD, validaCOMPL, validaSMTP, validaPORTA, validaSEMAIL, validaREMET, validaNREMET, validaSOAPRET, validaSOAPNOT, validaSMTPAuth, validaSMTPSecure } from "../../Service/utilServiceFrontEnd";
import { getUnidadeFederativa } from "../../Service/enderecoService";
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import IconButton from '@mui/material/IconButton';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { getAcessoUserMenu } from "../../Service/usuarioService";
import { Box, InputLabel, MenuItem, Select, TextField } from "@mui/material";

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


const CadastroSeguradora = () => {
    const { logout, nomeUser } = useContext(AuthContext);
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
    const [listaUF, setListaUF] = useState([]);
    const [editingRowIds, getEditingRowIds] = useState([]);
    const [rowChanges, setRowChanges] = useState({});
    const [acessoGeral, setAcessoGeral] = useState(false);
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
                    }
                    else if (res.data === "semAcesso") {
                        window.alert("Usuário sem permissão !!!");

                    } else {
                        (res.data).map((l) => {
                            if (process.env.REACT_APP_API_ACESSO_GERAL || process.env.REACT_APP_API_ACESSO_CAD === l.ACES_DESCRICAO) {

                                setAcessoGeral(true);
                                setDisplayAcesso("");
                                setAcessoCAD(true);
                            }



                        })


                    }


                })
                .catch((err) => {
                    console.error(err);
                    window.alert("Erro ao buscar Usuário !!")
                })

        }


        acessoMenuUser();



        buscarSeguradoras();
        buscarContatos(idSegN);
        buscaUnidadeFederativa();


    }, [idSeg]);

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


    const buscarSeguradoras = async () => {
        if (idSeg > 0) {
            let dados = { token, idSeg };
            await getSeguradora(dados)
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
                            setSenhaEmailSist("null")
                            setEmailSist(l.SGRA_USUARIO_EMAIL);
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

    const buscarContatos = async (idSegN) => {
        const dados = { token, idSeg: idSegN }
        await getContatoSeguradora(dados)
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

    const salvarSeguradora = () => {

        const dados = {
            codLegado: apenasNr(codLegado), cnpjSeguradora: apenasNr(cnpjSeguradora),
            tipoPessoa, optSimples, statusSeg,
            razaoSocial, nomeFantasia, ie: apenasNr(ie), im: apenasNr(im),
            logradouro, complemento, bairro, estadoUF, nrLogradouro, cep: apenasNr(cep),
            nomeCidade, smtpSist, portaSist, emailSist, senhaEmailSist,
            remetenteEmailSist, nomeRemetenteEmailSist, smtpSistAuth, smtpSistSecure,
            soapRetSol, soapRetNotas, token, idSeg: idSegN, acessoCAD, acessoGeral
        };



        if (validaRAZAO() &&
            validaNomeFANT() &&
            validaCNPJ(cnpjSeguradora) &&
            validaCodLEG() &&
            validaTipoPESSOA(tipoPessoa) &&
            validaOpSIMPLES(optSimples) &&
            validaStatusSEG(statusSeg) &&
            validaCEP() &&
            validaUF(estadoUF) &&
            validaCIDADE() &&
            validaBAIRRO() &&
            validaLOGRAD() &&
            validaNRLOGRAD() &&
            validaCOMPL() &&
            validaSMTP() &&
            validaPORTA() &&
            validaEMAIL(emailSist) &&
            validaSEMAIL() &&
            validaREMET() &&
            validaNREMET() &&
            validaSOAPRET() &&
            validaSOAPNOT() &&
            validaSMTPAuth(smtpSistAuth) &&
            validaSMTPSecure(smtpSistSecure)

        ) {
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

    const salvarContato = (contatos) => {
        const dadosContato = { contatos, token, idSeg: idSegN }
        saveContatoSeguradora(dadosContato)
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
        let dados = { token, idCont: parseInt(idCont) };
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


    };
    const buscaCepOnline = async () => {


        var cepSONr = (isNaN(cep)) ? cep.replace(/\D/g, '') : cep;

        var validacep = /^[0-9]{8}$/;

        if (validacep.test(cepSONr)) {

            await fetch(`https://viacep.com.br/ws/${cepSONr}/json/`)
                .then(res => res.json()).then(data => {

                    if (data.erro) {
                        window.alert("CEP não encontrado")
                    } else {
                        setBairro(data.bairro);
                        setEstadoUF(data.uf);
                        setLogradouro(data.logradouro);
                        setNomeCidade(data.localidade);

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
        { name: 'SGCO_NOME', title: "Nome Contato" },
        { name: 'SGCO_FUNCAO', title: "FUNÇÃO" },
        { name: 'SGCO_DEPARTAMENTO', title: "DEPARTAMENTO", },
        { name: 'SGCO_EMAIL', title: "EMAIL" },
        { name: 'SGCO_URL', title: "URL" },
        { name: 'SGCO_CELULAR_DDD', title: " DDD" },
        { name: 'SGCO_CELULAR_NUMERO', title: " NR CELULAR" },
        { name: 'SGCO_CELULAR_OPERADORA', title: " OPERADORA" },
        { name: 'SGCO_FONE_COMERCIAL_DDD', title: " DDD" },
        { name: 'SGCO_FONE_COMERCIAL_NUMERO', title: " NR COMERCIAL" },
        { name: 'SGCO_FONE_COMERCIAL_RAMAL', title: " RAMAL" },

    ]);


    const [addedRows, setAddedRows] = useState([]);


    const changeAddedRows = value => setAddedRows(
        value.map(row => (Object.keys(row).length ? row : {
            ID_SEGURADORA_CONTATO: null,
            SGCO_NOME: "",
            SGCO_FUNCAO: "",
            SGCO_DEPARTAMENTO: "",
            SGCO_EMAIL: "",
            SGCO_URL: "",
            SGCO_CELULAR_DDD: "",
            SGCO_CELULAR_NUMERO: "",
            SGCO_CELULAR_OPERADORA: "",
            SGCO_FONE_COMERCIAL_DDD: "",
            SGCO_FONE_COMERCIAL_NUMERO: "",
            SGCO_FONE_COMERCIAL_RAMAL: ""



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
                if (!(changedRows[i].ID_SEGURADORA_CONTATO)) {

                    if (changedRows[i].SGCO_NOME === "" || changedRows[i].SGCO_NOME.length > 64) {
                        window.alert("Campo Nome com tamanho inválido");
                    }
                    else if (changedRows[i].SGCO_FUNCAO === "" || changedRows[i].SGCO_FUNCAO.length > 64) {
                        window.alert("Campo Função com tamanho inválido");
                    }
                    else if (changedRows[i].SGCO_DEPARTAMENTO === "" || changedRows[i].SGCO_DEPARTAMENTO.length > 12) {
                        window.alert("Campo Departamento com tamanho inválido");
                    }

                    else if (!emailV.test(changedRows[i].SGCO_EMAIL) || changedRows[i].SGCO_EMAIL.length > 128) {
                        window.alert("Email Contato inválido");
                    }
                    else if (changedRows[i].SGCO_URL === "" || changedRows[i].SGCO_URL.length > 256) {
                        window.alert("Campo URL com tamanho inválido");
                    }
                    else if (changedRows[i].SGCO_CELULAR_DDD === "" || isNaN(changedRows[i].SGCO_CELULAR_DDD) || changedRows[i].SGCO_CELULAR_DDD.length > 3) {
                        window.alert("Campo Celular DDD inválido");
                    }
                    else if (changedRows[i].SGCO_CELULAR_NUMERO === "" || isNaN(changedRows[i].SGCO_CELULAR_NUMERO) || changedRows[i].SGCO_CELULAR_NUMERO.length > 10) {
                        window.alert("Campo Celular NR inválido");
                    }
                    else if (changedRows[i].SGCO_CELULAR_OPERADORA === "" || changedRows[i].SGCO_CELULAR_OPERADORA.length > 20) {
                        window.alert("Campo Operadora  com tamanho inválido");
                    }
                    else if (changedRows[i].SGCO_FONE_COMERCIAL_DDD === "" || isNaN(changedRows[i].SGCO_FONE_COMERCIAL_DDD) || changedRows[i].SGCO_FONE_COMERCIAL_DDD.length > 3) {
                        window.alert("Campo Fone Comercial DDD inválido");
                    }
                    else if (changedRows[i].SGCO_FONE_COMERCIAL_NUMERO === "" || isNaN(changedRows[i].SGCO_FONE_COMERCIAL_NUMERO) || changedRows[i].SGCO_FONE_COMERCIAL_NUMERO.length > 10) {
                        window.alert("Campo Fone Comercial NR  inválido");
                    }
                    else if (changedRows[i].SGCO_FONE_COMERCIAL_RAMAL === "" || isNaN(changedRows[i].SGCO_FONE_COMERCIAL_RAMAL) || changedRows[i].SGCO_FONE_COMERCIAL_RAMAL.length > 5) {
                        window.alert("Campo Fone Comercial Ramal  inválido");
                    } else {
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


                    if (changedRows[i].SGCO_NOME === "" || changedRows[i].SGCO_NOME.length > 64) {
                        window.alert("Campo Nome com tamanho inválido");
                    }
                    else if (changedRows[i].SGCO_FUNCAO === "" || changedRows[i].SGCO_FUNCAO.length > 64) {
                        window.alert("Campo Função com tamanho inválido");
                    }
                    else if (changedRows[i].SGCO_DEPARTAMENTO === "" || changedRows[i].SGCO_DEPARTAMENTO.length > 12) {
                        window.alert("Campo Departamento com tamanho inválido");
                    }

                    else if (!emailV.test(changedRows[i].SGCO_EMAIL) || changedRows[i].SGCO_EMAIL.length > 128) {
                        window.alert("Email Contato inválido");
                    }
                    else if (changedRows[i].SGCO_URL === "" || changedRows[i].SGCO_URL.length > 256) {
                        window.alert("Campo URL com tamanho inválido");
                    }
                    else if (changedRows[i].SGCO_CELULAR_DDD === "" || isNaN(changedRows[i].SGCO_CELULAR_DDD) || changedRows[i].SGCO_CELULAR_DDD.length > 3) {
                        window.alert("Campo Celular DDD inválido");

                    }
                    else if (changedRows[i].SGCO_CELULAR_NUMERO === "" || isNaN(changedRows[i].SGCO_CELULAR_NUMERO) || changedRows[i].SGCO_CELULAR_NUMERO.length > 10) {
                        window.alert("Campo Celular NR inválido");
                    }
                    else if (changedRows[i].SGCO_CELULAR_OPERADORA === "" || changedRows[i].SGCO_CELULAR_OPERADORA.length > 20) {
                        window.alert("Campo Operadora  com tamanho inválido");
                    }
                    else if (changedRows[i].SGCO_FONE_COMERCIAL_DDD === "" || isNaN(changedRows[i].SGCO_FONE_COMERCIAL_DDD) || changedRows[i].SGCO_FONE_COMERCIAL_DDD.length > 3) {
                        window.alert("Campo Fone Comercial DDD inválido");
                    }
                    else if (changedRows[i].SGCO_FONE_COMERCIAL_NUMERO === "" || isNaN(changedRows[i].SGCO_FONE_COMERCIAL_NUMERO) || changedRows[i].SGCO_FONE_COMERCIAL_NUMERO.length > 10) {
                        window.alert("Campo Fone Comercial NR  inválido");
                    }
                    else if (changedRows[i].SGCO_FONE_COMERCIAL_RAMAL === "" || isNaN(changedRows[i].SGCO_FONE_COMERCIAL_RAMAL) || changedRows[i].SGCO_FONE_COMERCIAL_RAMAL.length > 5) {
                        window.alert("Campo Fone Comercial Ramal  inválido");
                    } else {
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
            let idCont = parseInt(changedRowsDel.map(l => l.ID_SEGURADORA_CONTATO));
            deletarContato(idCont);
            // deletarContato( changedRowsDel.map(l => l.ID_SEGURADORA_CONTATO));

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
    const [validaNumber] = useState(["SGCO_CELULAR_DDD", "SGCO_CELULAR_NUMERO",
        "SGCO_FONE_COMERCIAL_DDD", "SGCO_FONE_COMERCIAL_NUMERO", "SGCO_FONE_COMERCIAL_RAMAL", "ID_SEGURADORA"]);



    return (
        <div>
                  

            <div className="container-fluid" style={{ marginBottom: "10px", marginTop: "10px" }}>



          
                    <h3 id="titulos">CADASTRO DE SEGURADORAS </h3>
             
               
                <Box
                    component="form"
                    sx={{
                        '& .MuiTextField-root': { m: 1, width: '25ch' },
                    }}
                    noValidate
                    autoComplete="off"
                   
                >

            <div style={{marginLeft : "-40px"}} >                 
                    <TextField required label="Razão Social" error={razaoSocial.length < 1  || razaoSocial.length > 127 ? true : false}  variant="outlined" disabled={!acessoCAD} maxLength={128} id="razaoSoc"  type="text" onChange={(e) => setRazaoSocial(e.target.value)} value={razaoSocial} style={{width : "48%"}}/>
                    <TextField required label="Nome Fantasia" error={nomeFantasia.length < 1  || nomeFantasia.length > 63 ? true : false} disabled={!acessoCAD} maxLength={64} id="nomeFant"  type="text" onChange={(e) => setNomeFantasia(e.target.value)} value={nomeFantasia}  style={{width : "48%"}} />
                    <TextField required label="CNPJ" error={cnpjSeguradora.length < 1  || cnpjSeguradora.length > 20 ? true : false}   disabled={!acessoCAD} id="txtCnpj"  maxLength={20}  onChange={(e) => setCnpjSeguradora(e.target.value)} value={cnpj.format(cnpjSeguradora)} />
                    <TextField required label="Codigo Legado" error={codLegado.length < 1  || codLegado.length > 64 ? true : false} disabled={!acessoCAD} maxLength={64} id="codLeg"  type="number" value={codLegado} onChange={(e) => setCodLegado(e.target.value)} style={{maxWidth : "15%"}} />
                     <TextField required id="tipoP" error={tipoPessoa.length < 1 ? true : false} label="Tipo de Pessoa" select  disabled={!acessoCAD}  value={tipoPessoa} onChange={(e) => setTipoPessoa(e.target.value)}  style={{maxWidth : "18%"}}  >
                      
                        <MenuItem  value={"Juridica"}>Juridica</MenuItem>
                        <MenuItem  value={"Fisica"}>Fisica</MenuItem>
                    </TextField>
                    <TextField  required select error={optSimples.length < 1  ? true : false} label="Optante Simples" disabled={!acessoCAD} id="opSimp" value={optSimples} onChange={(e) => setOptSimples(e.target.value)}  style={{ maxWidth : "20%" }}>
                        
                        <MenuItem value={"Sim"} >Sim</MenuItem>
                        <MenuItem value={"Nao"}>Não</MenuItem>
                    </TextField>
                    <TextField required select error={statusSeg.length < 1  ? true : false} label={"Status"} disabled={!acessoCAD} id="statusSEG" value={statusSeg} onChange={(e) => setStatusSeg(e.target.value)}  style={{ maxWidth : "15%"}}>
                       
                        <MenuItem value={"Ativo"}>Ativo</MenuItem>
                        <MenuItem value={"Inativo"}>Inativo</MenuItem>
                    </TextField>

                    <TextField required label="Inscrição Estadual" error={ ie.length > 20 ? true : false}  disabled={!acessoCAD} maxLength={20}  type="text" onChange={(e) => setIE(e.target.value)} value={ie} />
                    <TextField required label="Inscrição Municipal" error={ im.length > 20 ? true : false}  disabled={!acessoCAD} maxLength={20}  type="text" onChange={(e) => setIM(e.target.value)} value={im}  />
                    <TextField required select error={estadoUF.length < 1  ? true : false} label={"UF"} disabled={!acessoCAD} id="uf" onChange={(e) => setEstadoUF(e.target.value)} value={estadoUF}  style={{ maxWidth : "10%"}} >
                    {listaUF.map((l) =>
                        <MenuItem key={l.ID_UNIDADE_FEDERATIVA} value={l.UNFE_SIGLA}>{l.UNFE_SIGLA}</MenuItem>
                    )}
                    </TextField>                    
                    <TextField required label="CEP" error={cep.length < 1 || cep.length > 10 ? true : false} disabled={!acessoCAD} id="cep" type="text" onChange={(e) => setCep(e.target.value)} value={cep}  style={{ maxWidth : "20%"}}/>
              
                   <Button onClick={(e) => buscaCepOnline(e)} style={{padding : "13px", marginTop : "11px", marginLeft : "2%"}} > BUSCAR CEP  </Button>
                   <TextField required label="Cidade" error={nomeCidade.length < 1 || nomeCidade.length > 64 ? true : false} disabled={!acessoCAD} maxLength={64} id="cidade"  type="text" onChange={(e) => setNomeCidade(e.target.value)} value={nomeCidade} />
                   <TextField required label="Bairro" error={bairro.length < 1 || bairro.length > 64 ? true : false} disabled={!acessoCAD} maxLength={64} id="bairro" type="text" onChange={(e) => setBairro(e.target.value)} value={bairro}  />
                   <TextField required label="Logradouro" error={logradouro.length < 1 || logradouro.length > 128 ? true : false} disabled={!acessoCAD} maxLength={128} id="lograd"  type="text" onChange={(e) => setLogradouro(e.target.value)} value={logradouro} style={{ width : "48%"}} />
                   <TextField required label="Complemento" error={complemento.length < 1 || complemento.length > 64 ? true : false} disabled={!acessoCAD} maxLength={64} id="compl" type="text" onChange={(e) => setComplemento(e.target.value)} value={complemento} style={{ width : "48%"}}   />
                   <TextField required label="NR" error={nrLogradouro.length < 1 || nrLogradouro.length > 10 ? true : false} disabled={!acessoCAD} maxLength={10} id="nrLograd"  type="text" onChange={(e) => setNrLogradouro(e.target.value)} value={nrLogradouro}   />
                              
            </div>

                </Box>

               

            </div>
          
                <hr style={{ width: "100%" }} />
      
                

                <Box
                    component="form"
                    sx={{
                        '& .MuiTextField-root': { m: 1, width: '25ch' },
                    }}
                    noValidate
                    autoComplete="off"
                   
                >

             <div style={{marginLeft : "-30px", display: displayAcesso}}>
             <h3 id="titulos" >Dados do Sistema</h3>       

             <TextField required label="SMTP" error={smtpSist.length < 1 || smtpSist.length > 255 ? true : false} disabled={!acessoCAD} id="smtp" maxLength={256} value={smtpSist} onChange={(e) => setSmtpSist(e.target.value)}  type="text"  />
             <TextField required label="Porta" error={portaSist.length < 1 || portaSist.length > 5 ? true : false}  disabled={!acessoCAD} id="porta" maxLength={5} value={portaSist} onChange={(e) => setPortaSist(e.target.value)} type="number"  style={{ width : "8%"}}/>
             <TextField required label="Usuário (E-Mail)" error={emailSist.length < 1 || emailSist.length > 128 ? true : false} disabled={!acessoCAD} maxLength={128} id="txtEmailU" value={emailSist} onChange={(e) => setEmailSist(e.target.value)}  type="text" style={{ width : "41%"}}  />
             <TextField required label="Senha(E-MAIL)" error={senhaEmailSist.length < 1 || senhaEmailSist.length > 128 ? true : false}disabled={!acessoCAD} id="semail" maxLength={128} value={senhaEmailSist} onChange={(e) => setSenhaEmailSist(e.target.value)}  type="password"  />
             <TextField required label="Remetente" error={remetenteEmailSist.length < 1 || remetenteEmailSist.length > 256 ? true : false} disabled={!acessoCAD} id="remet" maxLength={256} value={remetenteEmailSist} onChange={(e) => setRemetenteEmailSist(e.target.value)}  type="text" style={{ width : "30%"}} />
             <TextField required label="Nome Remetente" error={nomeRemetenteEmailSist.length < 1 || nomeRemetenteEmailSist.length > 256 ? true : false} disabled={!acessoCAD} id="nremet" maxLength={256} value={nomeRemetenteEmailSist} onChange={(e) => setNomeRemetenteEmailSist(e.target.value)}  type="text" style={{ width : "30%"}} />
             <TextField select required label="SMTP Auth" error={smtpSistAuth.length < 1  ? true : false} disabled={!acessoCAD} value={smtpSistAuth} onChange={(e) => setSmtpSistAuth(e.target.value)} style={{ maxWidth : "13%"}} >
                        <MenuItem value={"True"}>True</MenuItem>
                        <MenuItem value={"False"}>False</MenuItem>
             </TextField>
             <TextField select required label="SMTP Secure"  error={smtpSistSecure.length < 1  ? true : false} disabled={!acessoCAD} value={smtpSistSecure} onChange={(e) => setSmtpSistSecure(e.target.value)}style={{ maxWidth : "12%"}}  >
                        <MenuItem value={"TLS"}>TLS</MenuItem>
                        <MenuItem value={"SSL"}>SSL</MenuItem>
             </TextField>
             <TextField required label="SOAP Retorno de Solicitação"  error={soapRetSol.length < 1 || soapRetSol.length > 256 ? true : false} disabled={!acessoCAD} id="soapret" maxLength={256} value={soapRetSol} onChange={(e) => setSoapRetSol(e.target.value)}  type="text" style={{ width : "48%"}}/>
             <TextField required label="SOAP Retorno de Notas" error={soapRetNotas.length < 1 || soapRetNotas.length > 256 ? true : false} disabled={!acessoCAD} id="soapNo" maxLength={256} value={soapRetNotas} onChange={(e) => setSoapRetNotas(e.target.value)}  type="text" style={{ width : "48%"}} />
 

                
             </div>
                </Box>   


               

           

             <div className="form-inline" id="" style={{ fontSize: "9" }}>

                <hr style={{ width: "100%" }} />
                <div className="form-group col-md-7" style={{ display: displayCont }}   >
                    <h3 id="titulo" >{acessoGeral || acessoCAD ? "Cadastrar Contato" : "Visualizar Contato"} </h3>
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
                            <PagingPanel />
                            <Table />
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



            


                <div className="form-group col-md-10">
                    {/* <Button disabled={!(idSegN > 0)} className="margemRight" id="buttonInfo" onClick={()=>buscarContatos(idSegN)} > CONTATOS </Button> */}
                    <Button style={{ display: displayAcesso }} className="margemRight" onClick={(e) => salvarSeguradora(e)} > {idSegN === "0" ? "CADASTRAR" : "SALVAR ALTERAÇÕES"}</Button>
                    <Button id="buttonAlert" onClick={(e) => navigate("/listarSeguradora")} > {idSegN === "0" ? "CANCELAR" : "SAIR"} </Button><br />

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
 
    
   
   
   



//      const BotaoDEL = ({value})=>(     
//        <div> 
       
//        <ModeEditOutlineOutlinedIcon style={{ color: "blue" }} className="margemRight" type="button"/>
//  <DeleteForeverOutlinedIcon type="button" fontSize="medium"  style={{ color: "red" }} onClick={(e)=>deletarContato(value)}/>
  
//        </div>
           
 
        
       
//      )
//      const BoataoDELjProv = (props)=>(
//          <DataTypeProvider
//          formatterComponent={BotaoDEL}
//          {...props}
 
//          />
//      )
//      const [botaoDel] = useState(["ALTERAÇÃO"]);
 
 
 
 


 * 
 * 
 * 
 * 
 * 
 * 
 * 
 *  <div className="form-group col-md-1">
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