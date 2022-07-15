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
import { deleteContatoForID, getContatoFornecedor, getFornecedor, saveContatoFornecedor, saveFornecedor } from "../../Service/fornecedorService";
import { apenasNr, validaCodLEG, validaNomeFANT, validaOpSIMPLES, validaStatusSEG, validaTipoPESSOA, validaCNPJ, validaEMAIL, validaRAZAO, validaCEP, validaUF, validaCIDADE, validaBAIRRO, validaLOGRAD, validaNRLOGRAD, validaCOMPL, validaSMTP, validaPORTA, validaSEMAIL, validaREMET, validaNREMET, validaSOAPRET, validaSOAPNOT, validaSMTPAuth, validaSMTPSecure, validaCampo } from "../../Service/utilServiceFrontEnd";
import { getUnidadeFederativa } from "../../Service/enderecoService";
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import IconButton from '@mui/material/IconButton';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { getAcessoUserMenu } from "../../Service/usuarioService";
import { Box, MenuItem, TextField } from "@mui/material";

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


const CadastroFornecedor = () => {
    const { logout, nomeUser } = useContext(AuthContext);
    const [fornCnpj, setFornCnpj] = useState("");
    const [fornIdLegado, setFornIdLegado] = useState("");
    const [fornNaturezaJuridica, setFornNaturezaJuridica] = useState("");
    const [fornNomeFantasia, setFornNomeFantasia] = useState("");
    const [fornRazaoSocial, setFornRazaoSocial] = useState("");
    const [fornOptanteSimplesNacional, setFornOptanteSimplesNacional] = useState("");
    const [fornStatus, setFornStatus] = useState("");
    const [fornSituacao, setFornSituacao] = useState("");
    const [fornInscricaoEstadual, setFornInscricaoEstadual] = useState("");
    const [fornInscricaoMunicipal, setFornInscricaoMunicipal] = useState("");
    const [fornCep, setFornCep] = useState("");
    const [fornCidade, setFornCidade] = useState("");
    const [estadoUF, setEstadoUF] = useState("");
    //const [idUnidadeFederativa, setIdUnidadeFederativa] = useState(""); 
    const [fornRua, setFornRua] = useState("");
    const [fornNumero, setFornNumero] = useState("");
    const [fornComplemento, setFornComplemento] = useState("");
    const [fornBairro, setFornBairro] = useState("");
    const [fornGrupoEconomico, setFornGrupoEconomico] = useState("");
    const [fornHorarioSaida1, setFornHorarioSaida1] = useState("");
    const [fornHorarioSaida2, setFornHorarioSaida2] = useState("");
    const [fornHorarioSaida3, setFornHorarioSaida3] = useState("");
    const [fornMultimarcas, setFornMultimarcas] = useState("");
    const [fornTipoPeca, setFornTipoPeca] = useState("");
    const [fornFaturamentoMinimo, setFornFaturamentoMinimo] = useState("");
    const [fornLatitude, setFornLatitude] = useState("");
    const [fornLongitude, setFornLongitude] = useState("");
    const { idFornecedor } = useParams();
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const [idFornecedorN, setIdFornecedorN] = useState(idFornecedor);
    const [displayCont, setDisplayCont] = useState(idFornecedorN === "0" ? "none" : "");
    const [rows, setRows] = useState([]);
    const [listaUF, setListaUF] = useState([]);
    const [editingRowIds, getEditingRowIds] = useState([]);
    const [rowChanges, setRowChanges] = useState({});
    const [acessoGeral, setAcessoGeral] = useState(false);
    const [acessoCAD, setAcessoCAD] = useState(false);
    const [displayAcesso, setDisplayAcesso] = useState("none");
    const editarSgra = "EDIT_SGRA";


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
                        (res.data).forEach((ac) => {
                            if (process.env.REACT_APP_API_ACESSO_GERAL === ac || editarSgra === ac) {
                                setAcessoGeral(true);
                                setAcessoCAD(true);
                                setDisplayAcesso("");
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
        buscarContatos(idFornecedorN);

        //eslint-disable-next-line
    }, [idFornecedor, idFornecedorN, logout, nomeUser, token]);

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
        const buscarFornecedores = async () => {

            if (idFornecedor > 0) {
                let dados = { token, idFornecedor };
                await getFornecedor(dados)
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


                                setFornCnpj(l.FORN_CNPJ);
                                setFornIdLegado(l.FORN_ID_LEGADO);
                                setFornNaturezaJuridica(l.FORN_NATUREZA_JURIDICA);
                                setFornNomeFantasia(l.FORN_NOME_FANTASIA);
                                setFornRazaoSocial(l.FORN_RAZAO_SOCIAL);
                                setFornOptanteSimplesNacional(l.FORN_OPTANTE_SIMPLES_NACIONAL);
                                setFornStatus(l.FORN_STATUS);
                                setFornSituacao(l.FORN_SITUACAO);
                                setFornInscricaoEstadual(l.FORN_INSCRICAO_ESTADUAL);
                                setFornInscricaoMunicipal(l.FORN_INSCRICAO_MUNICIPAL);
                                setFornCep(l.FORN_CEP);
                                setFornCidade(l.FORN_CIDADE);
                                // setIdUnidadeFederativa(l.ID_UNIDADE_FEDERATIVA);   
                                setEstadoUF(l.UNFE_SIGLA);
                                setFornRua(l.FORN_RUA);
                                setFornNumero(l.FORN_NUMERO);
                                setFornComplemento(l.FORN_COMPLEMENTO);
                                setFornBairro(l.FORN_BAIRRO);
                                setFornGrupoEconomico(l.FORN_GRUPO_ECONOMICO);
                                setFornHorarioSaida1(l.FORN_HORARIO_SAIDA1);
                                setFornHorarioSaida2(l.FORN_HORARIO_SAIDA2);
                                setFornHorarioSaida3(l.FORN_HORARIO_SAIDA3);
                                setFornMultimarcas(l.FORN_MULTIMARCAS);
                                setFornTipoPeca(l.FORN_TIPO_PECA);                        
                                setFornFaturamentoMinimo(l.FORN_FATURAMENTO_MINIMO);
                                setFornLatitude(l.FORN_LATITUDE);
                                setFornLongitude(l.FORN_LONGITUDE);
                            })
                        }
                    }).catch((res) => {
                        console.error(res);
                        window.alert("Erro ao buscar Fornecedores")
                    })
            }
        }
        buscarFornecedores();
    }, [idFornecedor, logout, token])
    const buscarContatos = async (idFornecedorN) => {
        const dados = { token, idFornecedor: idFornecedorN, acessoGeral }
        await getContatoFornecedor(dados)
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

    const salvarFornecedor = () => {

        const dados = {

            fornCnpj: apenasNr(fornCnpj), fornIdLegado: apenasNr(fornIdLegado), fornNaturezaJuridica,
            fornNomeFantasia, fornRazaoSocial, fornOptanteSimplesNacional, fornStatus, fornSituacao,
            fornInscricaoEstadual: apenasNr(fornInscricaoEstadual), fornInscricaoMunicipal: apenasNr(fornInscricaoMunicipal),
            fornCep: apenasNr(fornCep), fornCidade, estadoUF, fornRua, fornNumero, fornComplemento,
            fornBairro, fornGrupoEconomico, fornHorarioSaida1, fornHorarioSaida2, fornHorarioSaida3, fornMultimarcas,
            fornTipoPeca, fornFaturamentoMinimo, fornLatitude, fornLongitude, token, idFornecedor: idFornecedorN, acessoGeral

        };

        if ( 
            validaCNPJ(fornCnpj) &&
            validaCampo(fornIdLegado,'Código Legado Obrigatório',64,'Tamanho campo Código Legado invalido')&&
            validaCampo(fornNaturezaJuridica,'Natureza Juridica Obrigatório',12,'Tamanho campo Natureza Juridica invalido')&&
            validaCampo(fornNomeFantasia,'Nome Fantasia Obrigatório',64,'Tamanho campo Nome Fantasia invalido')&&
            validaCampo(fornRazaoSocial,'Razão Social Obrigatório',128,'Tamanho campo Razão invalido')&&
            validaCampo(fornOptanteSimplesNacional,'Optante Simples Nacional Obrigatório',3,'Tamanho campo Optante Simples Nacional invalido')&&
            validaCampo(fornStatus,'Status Obrigatório',7,'Tamanho campo Status invalido')&&
            validaCampo(fornSituacao,'Situação Obrigatório',12,'Tamanho campo Situação invalido')&&
            validaCampo(fornCep,'CEP Obrigatório',8,'Tamanho campo CEP invalido')&&
            validaCampo(fornCidade,'Cidade Obrigatório',64,'Tamanho campo Cidade invalido')&&
            validaCampo(fornRua,'Rua Obrigatório',128,'Tamanho campo Rua invalido')&&
            validaCampo(estadoUF,'UF Obrigatório',2,'Tamanho campo UF invalido')&&
            validaCampo(fornNumero,'Numero Obrigatório',10,'Tamanho campo Numero invalido')&&
            validaCampo(fornComplemento,'Complemento Obrigatório',64,'Tamanho campo Complemento invalido')&&
            validaCampo(fornBairro,'Bairro Obrigatório',64,'Tamanho campo Bairro invalido')

        ) {
            saveFornecedor(dados)
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
                        if (idFornecedorN > 0) {
                            window.alert("Fornecedor Alterada com Sucesso!!!");
                        } else {
                            (res.data).forEach((l) => { setIdFornecedorN(l.ID_FORNECEDOR); });
                            setDisplayCont("");
                            window.alert("Fornecedor Cadastrado com Sucesso!!!");
                        }
                    }
                }).catch((erro) => {
                    window.alert("Erro ao tentar cadastrar");
                    console.error(erro, "erro ao tentar cadastrar");
                })
        }
    }

    const salvarContato = (contatos) => {
        const dadosContato = { contatos, token, idFornecedor: idFornecedorN, acessoGeral }
        saveContatoFornecedor(dadosContato)
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
                    buscarContatos(idFornecedorN);
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
        deleteContatoForID(dados)
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
                    buscarContatos(idFornecedorN);
                }
            })
            .catch((res) => {
                console.error(res);
                window.alert("Erro ao excluir contato")
            })
    };
    const buscaCepOnline = async () => {

        var cepSONr = (isNaN(fornCep)) ? fornCep.replace(/\D/g, '') : fornCep;

        var validacep = /^[0-9]{8}$/;

        if (validacep.test(cepSONr)) {

            await fetch(`https://viacep.com.br/ws/${cepSONr}/json/`)
                .then(res => res.json()).then(data => {

                    if (data.erro) {
                        window.alert("CEP não encontrado")
                    } else {
                        setFornBairro(data.bairro);
                        setEstadoUF(data.uf);
                        setFornRua(data.logradouro);
                        setFornCidade(data.localidade);
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
        { name: 'FRCO_NOME', title: "Nome Contato" },
        { name: 'FRCO_FUNCAO', title: "FUNÇÃO" },
        { name: 'FRCO_DEPARTAMENTO', title: "DEPARTAMENTO", },
        { name: 'FRCO_EMAIL', title: "EMAIL" },
        { name: 'FRCO_URL', title: "URL" },
        { name: 'FRCO_CELULAR_DDD', title: " DDD" },
        { name: 'FRCO_CELULAR_NUMERO', title: " NR CELULAR" },
        { name: 'FRCO_CELULAR_OPERADORA', title: " OPERADORA" },
        { name: 'FRCO_FONE_COMERCIAL_DDD', title: " DDD" },
        { name: 'FRCO_FONE_COMERCIAL_NUMERO', title: " NR COMERCIAL" },
        { name: 'FRCO_FONE_COMERCIAL_RAMAL', title: " RAMAL" },

    ]);
    const [tableColumnExtensions] = useState([
        { columnName: 'FRCO_NOME', width: 200 },
        { columnName: 'FRCO_FUNCAO', width: 150 },
        { columnName: 'FRCO_DEPARTAMENTO', width: 150 },
        { columnName: 'FRCO_EMAIL', width: 330 },
        { columnName: 'FRCO_URL', width: 330 },
        { columnName: 'FRCO_CELULAR_DDD', width: 80 },
        { columnName: 'FRCO_CELULAR_NUMERO', width: 150 },
        { columnName: 'FRCO_CELULAR_OPERADORA', width: 150 },
        { columnName: 'FRCO_FONE_COMERCIAL_DDD', width: 80 },
        { columnName: 'FRCO_FONE_COMERCIAL_NUMERO', width: 150 },
        { columnName: 'FRCO_FONE_COMERCIAL_RAMAL', width: 80 },
    ]);


    const [addedRows, setAddedRows] = useState([]);
    const [pageSizes] = useState([5, 10, 15, 0]);


    const changeAddedRows = value => setAddedRows(
        value.map(row => (Object.keys(row).length ? row : {
            ID_FORNECEDOR_CONTATO: null,
            FRCO_NOME: "",
            FRCO_FUNCAO: "",
            FRCO_DEPARTAMENTO: "",
            FRCO_EMAIL: "",
            FRCO_URL: "",
            FRCO_CELULAR_DDD: "",
            FRCO_CELULAR_NUMERO: "",
            FRCO_CELULAR_OPERADORA: "",
            FRCO_FONE_COMERCIAL_DDD: "",
            FRCO_FONE_COMERCIAL_NUMERO: "",
            FRCO_FONE_COMERCIAL_RAMAL: ""
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
                if (!(changedRows[i].ID_FORNECEDOR_CONTATO)) {

                    if (changedRows[i].FRCO_NOME === "" || changedRows[i].FRCO_NOME.length > 64) {
                        window.alert("Campo Nome com tamanho inválido");
                    }
                    else if (changedRows[i].FRCO_FUNCAO === "" || changedRows[i].FRCO_FUNCAO.length > 64) {
                        window.alert("Campo Função com tamanho inválido");
                    }
                    else if (changedRows[i].FRCO_DEPARTAMENTO === "" || changedRows[i].FRCO_DEPARTAMENTO.length > 12) {
                        window.alert("Campo Departamento com tamanho inválido");
                    }
                    else if (!emailV.test(changedRows[i].FRCO_EMAIL) || changedRows[i].FRCO_EMAIL.length > 128) {
                        window.alert("Email Contato inválido");
                    }
                    else if (changedRows[i].FRCO_URL === "" || changedRows[i].FRCO_URL.length > 256) {
                        window.alert("Campo URL com tamanho inválido");
                    }
                    else if (changedRows[i].FRCO_CELULAR_DDD === "" || isNaN(changedRows[i].FRCO_CELULAR_DDD) || changedRows[i].SGCO_CELULAR_DDD.length > 3) {
                        window.alert("Campo Celular DDD inválido");
                    }
                    else if (changedRows[i].FRCO_CELULAR_NUMERO === "" || isNaN(changedRows[i].FRCO_CELULAR_NUMERO) || changedRows[i].SGCO_CELULAR_NUMERO.length > 10) {
                        window.alert("Campo Celular NR inválido");
                    }
                    else if (changedRows[i].FRCO_CELULAR_OPERADORA === "" || changedRows[i].FRCO_CELULAR_OPERADORA.length > 20) {
                        window.alert("Campo Operadora  com tamanho inválido");
                    }
                    else if (changedRows[i].FRCO_FONE_COMERCIAL_DDD === "" || isNaN(changedRows[i].FRCO_FONE_COMERCIAL_DDD) || changedRows[i].SGCO_FONE_COMERCIAL_DDD.length > 3) {
                        window.alert("Campo Fone Comercial DDD inválido");
                    }
                    else if (changedRows[i].FRCO_FONE_COMERCIAL_NUMERO === "" || isNaN(changedRows[i].FRCO_FONE_COMERCIAL_NUMERO) || changedRows[i].SGCO_FONE_COMERCIAL_NUMERO.length > 10) {
                        window.alert("Campo Fone Comercial NR  inválido");
                    }
                    else if (changedRows[i].FRCO_FONE_COMERCIAL_RAMAL === "" || isNaN(changedRows[i].FRCO_FONE_COMERCIAL_RAMAL) || changedRows[i].SGCO_FONE_COMERCIAL_RAMAL.length > 5) {
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

                    if (changedRows[i].FRCO_NOME === "" || changedRows[i].FRCO_NOME.length > 64) {
                        window.alert("Campo Nome com tamanho inválido");
                    }
                    else if (changedRows[i].FRCO_FUNCAO === "" || changedRows[i].FRCO_FUNCAO.length > 64) {
                        window.alert("Campo Função com tamanho inválido");
                    }
                    else if (changedRows[i].FRCO_DEPARTAMENTO === "" || changedRows[i].FRCO_DEPARTAMENTO.length > 12) {
                        window.alert("Campo Departamento com tamanho inválido");
                    }
                    else if (!emailV.test(changedRows[i].FRCO_EMAIL) || changedRows[i].FRCO_EMAIL.length > 128) {
                        window.alert("Email Contato inválido");
                    }
                    else if (changedRows[i].FRCO_URL === "" || changedRows[i].FRCO_URL.length > 256) {
                        window.alert("Campo URL com tamanho inválido");
                    }
                    else if (changedRows[i].FRCO_CELULAR_DDD === "" || isNaN(changedRows[i].FRCO_CELULAR_DDD) || changedRows[i].SGCO_CELULAR_DDD.length > 3) {
                        window.alert("Campo Celular DDD inválido");
                    }
                    else if (changedRows[i].FRCO_CELULAR_NUMERO === "" || isNaN(changedRows[i].FRCO_CELULAR_NUMERO) || changedRows[i].SGCO_CELULAR_NUMERO.length > 10) {
                        window.alert("Campo Celular NR inválido");
                    }
                    else if (changedRows[i].FRCO_CELULAR_OPERADORA === "" || changedRows[i].FRCO_CELULAR_OPERADORA.length > 20) {
                        window.alert("Campo Operadora  com tamanho inválido");
                    }
                    else if (changedRows[i].FRCO_FONE_COMERCIAL_DDD === "" || isNaN(changedRows[i].FRCO_FONE_COMERCIAL_DDD) || changedRows[i].SGCO_FONE_COMERCIAL_DDD.length > 3) {
                        window.alert("Campo Fone Comercial DDD inválido");
                    }
                    else if (changedRows[i].FRCO_FONE_COMERCIAL_NUMERO === "" || isNaN(changedRows[i].FRCO_FONE_COMERCIAL_NUMERO) || changedRows[i].SGCO_FONE_COMERCIAL_NUMERO.length > 10) {
                        window.alert("Campo Fone Comercial NR  inválido");
                    }
                    else if (changedRows[i].FRCO_FONE_COMERCIAL_RAMAL === "" || isNaN(changedRows[i].FRCO_FONE_COMERCIAL_RAMAL) || changedRows[i].SGCO_FONE_COMERCIAL_RAMAL.length > 5) {
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
            let idCont = parseInt(changedRowsDel.map(l => l.ID_FORNECEDOR_CONTATO));
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
    const [validaNumber] = useState(["FRCO_CELULAR_DDD", "FRCO_CELULAR_NUMERO",
        "FRCO_FONE_COMERCIAL_DDD", "FRCO_FONE_COMERCIAL_NUMERO",
        "FRCO_FONE_COMERCIAL_RAMAL", "ID_FORNECEDOR"]);

    return (
        <div>
            <div style={{ marginBottom: "10px", marginTop: "10px" }}>
                <h3 id="titulos">CADASTRO DE FORNECEDORES </h3>
                <Box
                    component="form"
                    sx={{
                        '& .MuiTextField-root': { m: 1, width: '25ch' },
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <div style={{}} >

                        <TextField required label="Razão Social" error={fornRazaoSocial.length < 1 || fornRazaoSocial.length > 127 ? true : false} variant="outlined" disabled={!acessoCAD} maxLength={128} id="razaoSoc" type="text" onChange={(e) => setFornRazaoSocial(e.target.value)} value={fornRazaoSocial} style={{ minWidth: "30em" }} />
                        <TextField required label="Nome Fantasia" error={fornNomeFantasia.length < 1 || fornNomeFantasia.length > 63 ? true : false} disabled={!acessoCAD} maxLength={64} id="nomeFant" type="text" onChange={(e) => setFornNomeFantasia(e.target.value)} value={fornNomeFantasia} style={{ minWidth: "25em" }} />
                        <TextField required label="CNPJ" error={fornCnpj.length < 1 || fornCnpj.length > 20 ? true : false} disabled={!acessoCAD} id="txtCnpj" maxLength={20} onChange={(e) => setFornCnpj(e.target.value)} value={cnpj.format(fornCnpj)} />
                        <TextField required label="Codigo Legado" error={fornIdLegado.length < 1 || fornIdLegado.length > 64 ? true : false} disabled={!acessoCAD} maxLength={64} id="codLeg" type="number" value={fornIdLegado} onChange={(e) => setFornIdLegado(e.target.value)} style={{ maxWidth: "11em" }} />
                        <TextField required id="tipoP" error={fornNaturezaJuridica.length < 1 ? true : false} label="Tipo de Pessoa" select disabled={!acessoCAD} value={fornNaturezaJuridica} onChange={(e) => setFornNaturezaJuridica(e.target.value)} style={{ maxWidth: "11em" }}  >
                            <MenuItem value={"Juridica"}>Juridica</MenuItem>
                            <MenuItem value={"Fisica"}>Fisica</MenuItem>
                        </TextField>
                        <TextField required select error={fornOptanteSimplesNacional.length < 1 ? true : false} label="Optante Simples" disabled={!acessoCAD} id="opSimp" value={fornOptanteSimplesNacional} onChange={(e) => setFornOptanteSimplesNacional(e.target.value)} style={{ maxWidth: "11em" }}>
                            <MenuItem value={"Sim"} >Sim</MenuItem>
                            <MenuItem value={"Nao"}>Não</MenuItem>
                        </TextField>
                        <TextField required select error={fornStatus.length < 1 ? true : false} label={"Status"} disabled={!acessoCAD} id="statusFOR" value={fornStatus} onChange={(e) => setFornStatus(e.target.value)} style={{ maxWidth: "11em" }}>
                            <MenuItem value={"Ativo"}>Ativo</MenuItem>
                            <MenuItem value={"Inativo"}>Inativo</MenuItem>
                        </TextField>
                        <TextField required label="Situação" error={fornSituacao.length < 1 || fornSituacao.length > 12 ? true : false} disabled={!acessoCAD} maxLength={12} id="fornSituacao" type="text" onChange={(e) => setFornSituacao(e.target.value)} value={fornSituacao} style={{ maxWidth: "10em" }} />
                        <TextField required label="Inscrição Estadual" error={fornInscricaoEstadual.length > 20 ? true : false} disabled={!acessoCAD} maxLength={20} type="text" onChange={(e) => setFornInscricaoEstadual(e.target.value)} value={fornInscricaoEstadual} />
                        <TextField required label="Inscrição Municipal" error={fornInscricaoMunicipal.length > 20 ? true : false} disabled={!acessoCAD} maxLength={20} type="text" onChange={(e) => setFornInscricaoMunicipal(e.target.value)} value={fornInscricaoMunicipal} />
                        <TextField required select error={estadoUF.length < 1 ? true : false} label={"UF"} disabled={!acessoCAD} id="uf" onChange={(e) => setEstadoUF(e.target.value)} value={estadoUF} style={{ maxWidth: "6em" }} >
                            {listaUF.map((l) =>
                                <MenuItem key={l.ID_UNIDADE_FEDERATIVA} value={l.UNFE_SIGLA}>{l.UNFE_SIGLA}</MenuItem>
                            )}
                        </TextField>
                        <TextField required label="CEP" error={fornCep.length < 1 || fornCep.length > 10 ? true : false} disabled={!acessoCAD} id="cep" type="text" onChange={(e) => setFornCep(e.target.value)} value={fornCep} style={{ maxWidth: "11em" }}></TextField>
                        <Button disabled={!acessoCAD} onClick={(e) => buscaCepOnline(e)} style={{ padding: "13px", marginTop: "11px" }} > BUSCAR CEP  </Button>
                        <TextField required label="Cidade" error={fornCidade.length < 1 || fornCidade.length > 64 ? true : false} disabled={!acessoCAD} maxLength={64} id="cidade" type="text" onChange={(e) => setFornCidade(e.target.value)} value={fornCidade} />
                        <TextField required label="Bairro" error={fornBairro.length < 1 || fornBairro.length > 64 ? true : false} disabled={!acessoCAD} maxLength={64} id="bairro" type="text" onChange={(e) => setFornBairro(e.target.value)} value={fornBairro} />
                        <TextField required label="Logradouro" error={fornRua.length < 1 || fornRua.length > 128 ? true : false} disabled={!acessoCAD} maxLength={128} id="lograd" type="text" onChange={(e) => setFornRua(e.target.value)} value={fornRua} style={{ minWidth: "25em" }} />
                        <TextField required label="NR" error={fornNumero.length < 1 || fornNumero.length > 10 ? true : false} disabled={!acessoCAD} maxLength={10} id="nrLograd" type="text" onChange={(e) => setFornNumero(e.target.value)} value={fornNumero} style={{ maxWidth: "11em" }} />
                        <TextField required label="Complemento" error={fornComplemento.length < 1 || fornComplemento.length > 64 ? true : false} disabled={!acessoCAD} maxLength={64} id="compl" type="text" onChange={(e) => setFornComplemento(e.target.value)} value={fornComplemento} style={{ minWidth: "25em" }} />
                    
                        <TextField required label="Grupo Economico" error={fornGrupoEconomico.length < 1 || fornGrupoEconomico.length > 128 ? true : false} disabled={!acessoCAD} maxLength={128} id="grpeconomico" type="text" onChange={(e) => setFornGrupoEconomico(e.target.value)} value={fornGrupoEconomico} style={{ minWidth: "25em" }} />
                        <TextField required label="Hora Saida 1" error={fornHorarioSaida1.length < 1 || fornHorarioSaida1.length > 4 ? true : false} disabled={!acessoCAD} id="hr1" type="text" onChange={(e) => setFornHorarioSaida1(e.target.value)} value={fornHorarioSaida1} style={{ maxWidth: "11em" }}></TextField>
                        <TextField required label="Hora Saida 2" error={fornHorarioSaida2.length < 1 || fornHorarioSaida2.length > 4 ? true : false} disabled={!acessoCAD} id="hr2" type="text" onChange={(e) => setFornHorarioSaida2(e.target.value)} value={fornHorarioSaida2} style={{ maxWidth: "11em" }}></TextField>
                        <TextField required label="Hora Saida 3" error={fornHorarioSaida3.length < 1 || fornHorarioSaida3.length > 4 ? true : false} disabled={!acessoCAD} id="hr3" type="text" onChange={(e) => setFornHorarioSaida3(e.target.value)} value={fornHorarioSaida3} style={{ maxWidth: "11em" }}></TextField>
                        <TextField required select error={fornMultimarcas.length < 1 ? true : false} label="Multimarcas" disabled={!acessoCAD} id="multmarca" value={fornMultimarcas} onChange={(e) => setFornMultimarcas(e.target.value)} style={{ maxWidth: "11em" }}>
                            <MenuItem value={"Sim"} >Sim</MenuItem>
                            <MenuItem value={"Nao"}>Não</MenuItem>
                        </TextField>
                        <TextField required label="Tipo Peça" error={fornTipoPeca.length < 1 || fornTipoPeca.length > 8 ? true : false} disabled={!acessoCAD} maxLength={128} id="tipopeca" type="text" onChange={(e) => setFornTipoPeca(e.target.value)} value={fornTipoPeca} style={{ minWidth: "25em" }} />
                        <TextField required label="Faturamento Minimo" error={fornFaturamentoMinimo.length < 1 || fornFaturamentoMinimo.length > 10 ? true : false} disabled={!acessoCAD} id="fatmin" type="text" onChange={(e) => setFornFaturamentoMinimo(e.target.value)} value={fornFaturamentoMinimo} style={{ maxWidth: "11em" }}></TextField>
                        <TextField required label="Latitude" error={fornLatitude.length < 1 || fornLatitude.length > 8 ? true : false} disabled={!acessoCAD} id="latitude" type="text" onChange={(e) => setFornLatitude(e.target.value)} value={fornLatitude} style={{ maxWidth: "11em" }}></TextField>
                        <TextField required label="Longitude" error={fornLongitude.length < 1 || fornLongitude.length > 8 ? true : false} disabled={!acessoCAD} id="longitude" type="text" onChange={(e) => setFornLongitude(e.target.value)} value={fornLongitude} style={{ maxWidth: "11em" }}></TextField>
                   
                    </div>
                </Box>
            </div>

            <div className="form-inline" id="" style={{ fontSize: "9", marginBottom: "10px" }}>

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
                    <Button style={{ display: displayAcesso }} className="margemRight" onClick={(e) => salvarFornecedor(e)} > {idFornecedorN === "0" ? "CADASTRAR" : "SALVAR ALTERAÇÕES"}</Button>
                    <Button id="buttonAlert" onClick={(e) => navigate("/listarFornecedor")} > {idFornecedorN === "0" ? "CANCELAR" : "SAIR"} </Button><br />
                </div>
            </div>
        </div>
    )
};

export default CadastroFornecedor;