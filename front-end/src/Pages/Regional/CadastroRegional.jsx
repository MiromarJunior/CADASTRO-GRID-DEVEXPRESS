/**
 * Pagina em construção para cadastrar uma nova unidade empresarial
 */

import { useContext, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
//import "./cad.css";
import { AuthContext } from "../../Autenticação/validacao";
import { DataTypeProvider } from '@devexpress/dx-react-grid';
import { apenasNr, validaCampo } from "../../Service/utilServiceFrontEnd";
import { getAcessoUserMenu } from "../../Service/usuarioService";
import { Box, MenuItem, TextField } from "@mui/material";
import { saveRegional, getRegional } from "../../Service/regionalService";

let acessoGeral = false;

const CadastroRegional = () => {
    const { logout, nomeUser } = useContext(AuthContext);
    const [rgalAbreviatura, setRgalAbreviatura] = useState("");
    const [rgalDescricao, setRgalDescricao] = useState("");
    const [rgalFormaAberturaAtual, setRgalFormaAberturaAtual] = useState("");
    const [rgalNovaFormaAbertura, setRgalNovaFormaAbertura] = useState("");
    const [rgalFormaEncerramento, setRgalFormaEncerramento] = useState("");
    const [rgalRegraCalculoAtual, setRgalRegraCalculoAtual] = useState("");
    const [rgalNovaRegraCalculo, setRgalNovaRegraCalculo] = useState("");
    const [rgalTipoDisputaAtual, setRgalTipoDisputaAtual] = useState("");
    const [rgalNovoTipoDisputa, setRgalNovoTipoDisputa] = useState("");
    const { idRegional } = useParams();
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const [idRegionalN, setIdRegionalN] = useState(idRegional);
    const [displayCont, setDisplayCont] = useState(idRegionalN === "0" ? "none" : "");
    const listaRgal = "LIST_REGIONAL";
    const incluirRgal = "ADD_REGIONAL";
    const excluirRgal = "DEL_REGIONAL";
    const editarRgal = "EDIT_REGIONAL";

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
                                buscarRegional();
                                setDisplayAcesso("");
                            } else if (incluirRgal === ac) {
                                setAcessoCAD(true);
                                setDisplayAcesso("");
                            } else if (listaRgal === ac) {
                                buscarRegional();
                            } else if (excluirRgal === ac) {
                                setAcessoCAD(true);
                            } else if (editarRgal === ac) {
                                buscarRegional();
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
        // eslint-disable-next-line
    }, [idRegionalN, logout, nomeUser, token]);


    const buscarRegional = async () => {
        if (idRegional > 0) {
            let dados = { token, idRegional };
            await getRegional(dados)
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
                            setRgalAbreviatura(l.RGAL_ABREVIATURA);
                            setRgalDescricao(l.RGAL_DESCRICAO);
                            setRgalFormaAberturaAtual(l.RGAL_FORMA_ABERTURA_ATUAL);
                            setRgalNovaFormaAbertura(l.RGAL_NOVA_FORMA_ABERTURA);
                            setRgalFormaEncerramento(l.RGAL_FORMA_ENCERRAMENTO);
                            setRgalRegraCalculoAtual(l.RGAL_REGRA_CALCULO_ATUAL);
                            setRgalNovaRegraCalculo(l.RGAL_NOVA_REGRA_CALCULO);
                            setRgalTipoDisputaAtual(l.RGAL_TIPO_DISPUTA_ATUAL);
                            setRgalNovoTipoDisputa(l.RGAL_NOVO_TIPO_DISPUTA);
                        })
                    }
                }).catch((res) => {
                    console.error(res);
                    window.alert("Erro ao buscar Regional")
                })
        }
    }

    const salvarRegional = () => {
        const dados = {
            rgalAbreviatura, rgalDescricao, rgalFormaAberturaAtual,
            rgalNovaFormaAbertura, rgalFormaEncerramento, rgalRegraCalculoAtual,
            rgalNovaRegraCalculo, rgalTipoDisputaAtual, rgalNovoTipoDisputa,
            token, idRegional: idRegionalN, acessoGeral
        };
        if (
            validaCampo(rgalAbreviatura, 'Abreviatura não pode ser vazio', 12, 'Tamanho campo Código Legado invalido') &&
            validaCampo(rgalDescricao, 'Descrição não pode ser vazio', 128, 'Tamanho campo Descrição invalido')

        ) {
            saveRegional(dados)
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
                        if (idRegionalN > 0) {
                            window.alert("Regional Alterada com Sucesso!!!");
                            navigate("/listarRegional");
                        } else {
                            // (res.data).forEach((l) => { setIdRegionalN(l.ID_REGIONAL); });
                            setDisplayCont("");
                            window.alert("Regional Cadastrado com Sucesso!!!");
                            navigate("/listarRegional");
                        }
                    }
                }).catch((erro) => {
                    window.alert("Erro ao tentar cadastrar");
                    console.error(erro, "erro ao tentar cadastrar");
                })
        }
    }

    //grid 

    const [addedRows, setAddedRows] = useState([]);
    const [pageSizes] = useState([5, 10, 15, 0]);

    const ValidaNumber = ({ value }) => (
        value ? apenasNr(value) : value
    )
    const ValidaNumberProv = (props) => (
        <DataTypeProvider
            formatterComponent={ValidaNumber}
            {...props}
        />
    )

    return (
        <div>
            <div style={{ marginBottom: "10px", marginTop: "10px" }}>
                <h3 id="titulos">CADASTRO DE REGIONAL </h3>
                <Box
                    component="form"
                    sx={{
                        '& .MuiTextField-root': { m: 1, width: '25ch' },
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <div style={{}} >
                        <TextField required label="Abreviatura" error={rgalAbreviatura.length < 1 || rgalAbreviatura.length > 127 ? true : false} variant="outlined" disabled={!acessoCAD} maxLength={128} id="rgalAbreviatura" type="text" onChange={(e) => setRgalAbreviatura(e.target.value)} value={rgalAbreviatura} style={{ minWidth: "15em" }} />
                        <TextField required label="Descrição" error={rgalDescricao.length < 1 || rgalDescricao.length > 127 ? true : false} variant="outlined" disabled={!acessoCAD} maxLength={128} id="rgalDescricao" type="text" onChange={(e) => setRgalDescricao(e.target.value)} value={rgalDescricao} style={{ minWidth: "30em" }} />

                        <TextField required select label="Forma de Abertura Atual" id="rgalFormaAbertAtual" error={rgalFormaAberturaAtual.length < 1 ? true : false} disabled={!acessoCAD} value={rgalFormaAberturaAtual} onChange={(e) => setRgalFormaAberturaAtual(e.target.value)} style={{ maxWidth: "11em" }}  >
                            <MenuItem value={"Automático"}>Automático</MenuItem>
                        </TextField>

                        <TextField required select label="Nova Forma de Abertura" id="rgalNovaForAbertura" error={rgalNovaFormaAbertura.length < 1 ? true : false} disabled={!acessoCAD} value={rgalNovaFormaAbertura} onChange={(e) => setRgalNovaFormaAbertura(e.target.value)} style={{ maxWidth: "11em" }}  >
                            <MenuItem value={"Automático"}>Automático</MenuItem>
                            <MenuItem value={"Manual"}>Manual</MenuItem>
                        </TextField>

                        <TextField required select label="Forma de Encerramento" id="rgalFormaEncer" error={rgalFormaEncerramento.length < 1 ? true : false} disabled={!acessoCAD} value={rgalFormaEncerramento} onChange={(e) => setRgalFormaEncerramento(e.target.value)} style={{ maxWidth: "11em" }}  >
                            <MenuItem value={"Automático"}>Automático</MenuItem>
                            <MenuItem value={"Manual"}>Manual</MenuItem>
                        </TextField>

                        <TextField required select label="Regra do Cálculo Atual" id="rgalRegraCalcAtual" error={rgalRegraCalculoAtual.length < 1 ? true : false} disabled={!acessoCAD} value={rgalRegraCalculoAtual} onChange={(e) => setRgalRegraCalculoAtual(e.target.value)} style={{ maxWidth: "11em" }}  >
                            <MenuItem value={"Preço"}>Preço</MenuItem>
                            <MenuItem value={"Prazo"}>Prazo</MenuItem>
                            <MenuItem value={"Mix Preço"}>Mix Preço</MenuItem>
                            <MenuItem value={"Mix Prazo"}>Mix Prazo</MenuItem>
                            <MenuItem value={"Mix Preço Prazo"}>Mix Preço Prazo</MenuItem>
                        </TextField>

                        <TextField required select label="Nova Regra do Cálculo" id="rgalNovaRegraCalc" error={rgalNovaRegraCalculo.length < 1 ? true : false} disabled={!acessoCAD} value={rgalNovaRegraCalculo} onChange={(e) => setRgalNovaRegraCalculo(e.target.value)} style={{ maxWidth: "11em" }}  >
                            <MenuItem value={"Preço"}>Preço</MenuItem>
                            <MenuItem value={"Prazo"}>Prazo</MenuItem>
                            <MenuItem value={"Mix Preço"}>Mix Preço</MenuItem>
                            <MenuItem value={"Mix Prazo"}>Mix Prazo</MenuItem>
                            <MenuItem value={"Mix Preço Prazo"}>Mix Preço Prazo</MenuItem>
                        </TextField>

                        <TextField required select label="Tipo de Disputa Atual" id="rgalTipoDisputaAtu" error={rgalTipoDisputaAtual.length < 1 ? true : false} disabled={!acessoCAD} value={rgalTipoDisputaAtual} onChange={(e) => setRgalTipoDisputaAtual(e.target.value)} style={{ maxWidth: "11em" }}  >
                            <MenuItem value={"Cotação"}>Cotação</MenuItem>
                            <MenuItem value={"Leilão"}>Leilão</MenuItem>
                        </TextField>

                        <TextField required select label="Novo Tipo de Disputa" id="rgalNovoTipoDisp" error={rgalNovoTipoDisputa.length < 1 ? true : false} disabled={!acessoCAD} value={rgalNovoTipoDisputa} onChange={(e) => setRgalNovoTipoDisputa(e.target.value)} style={{ maxWidth: "11em" }}  >
                            <MenuItem value={"Cotação"}>Cotação</MenuItem>
                            <MenuItem value={"Leilão"}>Leilão</MenuItem>
                        </TextField>
                    </div>
                </Box>
            </div>

            <div className="form-inline" id="" style={{ fontSize: "9", marginBottom: "10px" }}>

                <hr style={{ width: "100%" }} />

                <div className="form-group col-md-10" style={{ marginBottom: "10px", marginLeft: "20px", marginTop: "10px" }}>
                    <Button style={{ display: displayAcesso }} className="margemRight" onClick={(e) => salvarRegional(e)} > {idRegionalN === "0" ? "CADASTRAR" : "SALVAR ALTERAÇÕES"}</Button>
                    <Button id="buttonAlert" onClick={(e) => navigate("/listarRegional")} > {idRegionalN === "0" ? "CANCELAR" : "SAIR"} </Button><br />
                </div>
            </div>
        </div>
    )
};

export default CadastroRegional;