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
import { apenasNr, validaCodLEG, validaNomeFANT, validaOpSIMPLES, validaStatusSEG, validaTipoPESSOA, validaCNPJ, validaEMAIL, validaRAZAO, validaCEP, validaUF, validaCIDADE, validaBAIRRO, validaLOGRAD, validaNRLOGRAD, validaCOMPL, validaSMTP, validaPORTA, validaSEMAIL, validaREMET, validaNREMET, validaSOAPRET, validaSOAPNOT } from "../../Service/utilServiceFrontEnd";
import { getUnidadeFederativa } from "../../Service/enderecoService";
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import IconButton from '@mui/material/IconButton';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

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
    const [listaUF, setListaUF] = useState([]);
    const [editingRowIds, getEditingRowIds] = useState([]);
    const [rowChanges, setRowChanges] = useState({});




    useEffect(() => {
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
                            setEmailSist(l.SGRA_USUARIO_EMAIL);
                            setSenhaEmailSist(l.SGRA_SENHA);
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
            soapRetSol, soapRetNotas, token, idSeg: idSegN
        };



        if (validaRAZAO() &&
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
            validaNRLOGRAD() &&
            validaCOMPL() &&
            validaSMTP() &&
            validaPORTA() &&
            validaEMAIL(emailSist) &&
            validaSEMAIL() &&
            validaREMET() &&
            validaNREMET() &&
            validaSOAPRET() &&
            validaSOAPNOT()

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
        let dados = { token, idCont : parseInt(idCont) };
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
            let idCont =parseInt(changedRowsDel.map(l => l.ID_SEGURADORA_CONTATO));
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
                        <Form.Control maxLength={64} id="codLeg" className="  form__input1 " type="number" value={codLegado} onChange={(e) => setCodLegado(e.target.value)} placeholder="" />

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
                        <Form.Control maxLength={20} className="form__input1" type="text" onChange={(e) => setIM(e.target.value)} value={im} style={{ maxWidth: "100%" }} placeholder="" />

                    </div>


                    <div className="form-group col-md-1 margemRight">
                        <Form.Label  >CEP</Form.Label>
                        <Form.Control id="cep" className="form__input1" type="text" onChange={(e) => setCep(e.target.value)} value={cep} placeholder=" " />

                    </div>


                    <div className="form-group col-md-2">
                        <div style={{ marginTop: "35px" }}>
                            <Button onClick={(e) => buscaCepOnline(e)} > BUSCAR CEP  </Button>
                        </div>
                    </div>


                    <div className="form-group col-md-1 margemRight">
                        <Form.Label  >UF</Form.Label>

                        <Form.Select id="uf" onChange={(e) => setEstadoUF(e.target.value)} value={estadoUF} className="  form__input1 " style={{ paddingBottom: "13px" }}>

                            {listaUF.map((l) =>
                                <option key={l.ID_UNIDADE_FEDERATIVA} value={l.UNFE_SIGLA}>{l.UNFE_SIGLA}</option>
                            )}


                        </Form.Select>


                    </div>




                    <div className="form-group col-md-3 margemRight ">
                        <Form.Label  >CIDADE</Form.Label>
                        <Form.Control maxLength={64} id="cidade" className="form__input1" type="text" onChange={(e) => setNomeCidade(e.target.value)} value={nomeCidade} style={{ width: "280PX" }} placeholder="" />
                    </div>

                    <div className="form-group col-md-4 margemRight">
                        <Form.Label   >BAIRRO</Form.Label>
                        <Form.Control maxLength={64} id="bairro" className="form__input1" type="text" onChange={(e) => setBairro(e.target.value)} value={bairro} style={{ width: "92%" }} placeholder=" " />
                    </div>
                    <div className="form-group col-md-4 margemRight">
                        <Form.Label   >LOGRADOURO</Form.Label>
                        <Form.Control maxLength={128} id="lograd" className="form__input1" type="text" onChange={(e) => setLogradouro(e.target.value)} value={logradouro} placeholder="" />
                    </div>
                    <div className="form-group col-md-1 margemRight">
                        <Form.Label   >NR</Form.Label>
                        <Form.Control maxLength={10} id="nrLograd" className="form__input1" type="text" onChange={(e) => setNrLogradouro(e.target.value)} value={nrLogradouro} style={{ width: "100%" }} placeholder="" />
                    </div>



                    <div className="form-group col-md-4 margemRight">
                        <Form.Label   >COMPLEMENTO</Form.Label>
                        <Form.Control maxLength={64} id="compl" className="form__input1" type="text" onChange={(e) => setComplemento(e.target.value)} value={complemento} placeholder="" />
                    </div>

                    <hr style={{ width: "100%" }} />
                    <div className="form-group col-md-7">
                        <h3 id="titulo" >Dados do Sistema</h3>
                    </div>
                    <div className="form-group col-md-4"></div>


                    <div className="form-group col-md-3 margemRight">
                        <Form.Label   >SMTP</Form.Label>
                        <Form.Control id="smtp" maxLength={256} value={smtpSist} onChange={(e) => setSmtpSist(e.target.value)} className="form__input1" type="text" placeholder="" />
                    </div>
                    <div className="form-group col-md-1 margemRight">
                        <Form.Label   >PORTA</Form.Label>
                        <Form.Control id="porta" maxLength={5} value={portaSist} onChange={(e) => setPortaSist(e.target.value)} className="form__input1" type="number" placeholder="" />
                    </div>
                    <div className="form-group col-md-3 margemRight">
                        <Form.Label   >Usuário(E-MAIL)</Form.Label>
                        <Form.Control maxLength={128} id="txtEmailU" value={emailSist} onChange={(e) => setEmailSist(e.target.value)} className="form__input1" type="text" placeholder="" />
                    </div>
                    <div className="form-group col-md-3" style={{ width: "270px" }}>
                        <Form.Label   >Senha(E-MAIL)</Form.Label>
                        <Form.Control id="semail" maxLength={128} value={senhaEmailSist} onChange={(e) => setSenhaEmailSist(e.target.value)} className="form__input1" type="password" placeholder="" />
                    </div>
                    <div className="form-group col-md-3 margemRight">
                        <Form.Label   >Remetente</Form.Label>
                        <Form.Control id="remet" maxLength={256} value={remetenteEmailSist} onChange={(e) => setRemetenteEmailSist(e.target.value)} className="form__input1" type="text" placeholder="" />
                    </div>
                    <div className="form-group col-md-3 margemRight">
                        <Form.Label   >Nome Remetente</Form.Label>
                        <Form.Control id="nremet" maxLength={256} value={nomeRemetenteEmailSist} onChange={(e) => setNomeRemetenteEmailSist(e.target.value)} className="form__input1" type="text" placeholder="" />
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
                    <div className="form-group col-md-7" style={{ display: displayCont }}   >
                        <h3 id="titulo" >Cadastrar Contato</h3>
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
                                <TableEditColumn
                                    showEditCommand
                                    showAddCommand={!addedRows.length}
                                    showDeleteCommand
                                    commandComponent={Command}
                                />
                            </Grid>
                        </div>
                    </div>



                    <div className="form-group col-md-12"></div><br /><br /><br />


                    <div className="form-group col-md-10">
                        {/* <Button disabled={!(idSegN > 0)} className="margemRight" id="buttonInfo" onClick={()=>buscarContatos(idSegN)} > CONTATOS </Button> */}
                        <Button className="margemRight" onClick={(e) => salvarSeguradora(e)} > {idSegN === "0" ? "CADASTRAR" : "SALVAR ALTERAÇÕES"}</Button>
                        <Button id="buttonAlert" onClick={(e) => navigate("/listarSeguradora")} > {idSegN === "0" ? "CANCELAR" : "SAIR"} </Button><br />

                    </div>

                    <div className="form-group col-md-4"></div>



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