import { Box, Checkbox, FormControlLabel, FormGroup, MenuItem, TextField } from "@mui/material";
import { cnpj } from "cpf-cnpj-validator";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../Autenticação/validacao";
import { formataPercLeilao, getParametroLeilao, getSegParametroLeilao, limit2, maxValperc, saveParametroLeilao } from "../../Service/parametroLeilaoService";
import { getSeguradora } from "../../Service/seguradoraService";
import { getAcessoUserMenu } from "../../Service/usuarioService";
import { formatHrLeilao, validaCampo, validaCampoParam, validaHrIni, validaMin } from "../../Service/utilServiceFrontEnd";

const CadastroParametroLeilao = () => {
  const token = localStorage.getItem("token");
  const { logout, nomeUser } = useContext(AuthContext);
  const [pontuacaoInicial, setPontuacaoInicial] = useState("");
  const [horasL, setHorasL] = useState("00:00");
  const [horasExtend, setHorasExtend] = useState("00:00");
  const [horaIniL, setHoraIniL] = useState("00:00");
  const [horaFimL, setHoraFimL] = useState("00:00");
  const [tempoAbertAft, setTempoAbertAft] = useState("");
  const [qtdHorasValSef, setQtdHorasValSef] = useState("");
  const [horarioAtendIni, setHorarioAtendIni] = useState("00:00");
  const [horarioAtendFim, setHorarioAtendFim] = useState("00:00");
  const [feriado, setFeriado] = useState("");
  const [qtdVencedores, setQtdVencedores] = useState("");
  const [criticaPed, setCriticaPed] = useState("");
  const [limiteApr, setLimiteApr] = useState("");
  const [percLimite, setPercLimite] = useState("");
  const [limiteCot, setLImiteCot] = useState("");
  const [qtdHorasBO, setQtdHorasBO] = useState("");
  const [prazoBO, setPrazoBO] = useState("");
  const [horasTotalCot, setHorasTotalCot] = useState("00:00");
  const [horasTotalLei, setHorasTotalLei] = useState("00:00");
  const [tempoRecalculo, setTempoRecalculo] = useState("");
  const [encerraAnt, setEncerraAnt] = useState("");
  const [percAltLeilao, setPercAltLeilao] = useState("");
  const [tempoAlt, setTempoAlt] = useState("");
  const [acessoGeral, setAcessogeral] = useState();
  const [listaSeg, setListaSeg] = useState([]);
  const [idSeg, setIdSeg] = useState("");
  const { idPar } = useParams();
  const navigate = useNavigate();

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
              if (process.env.REACT_APP_API_ACESSO_GERAL === ac) {
                setAcessogeral(true);

              }
            })
          }
        })
        .catch((err) => {
          console.error(err);
          window.alert("Erro ao buscar Usuário - Parametro leilão !!")
        })
    }
    acessoMenuUser();
    if (idPar > 0) {
      listarParametroLeilao();
    }
    //eslint-disable-next-line
  }, [logout, token, nomeUser]);

  useEffect(() => {
    const listarSeguradoras = async () => {
      let dados = { token, idPar };
      await getSegParametroLeilao(dados)
        .then((res) => {
          if (res.data === "erroLogin") {
            alert("Sessão expirada, Favor efetuar um novo login !!");
            logout();
            window.location.reload();
          }
          else if (res.data === "semAcesso") {
            alert("Usuário sem permissão !!!");
            navigate("/home");

          } else if (res.data === "campoNulo") {
            alert("Preencha todos os Campos obrigatorios!!!");
          }
          else if (res.data === "erroSalvar") {
            alert("Erro a tentar salvar ou alterar!!!");
          }
          else {

            setListaSeg(res.data);
          }
        })
        .catch((res) => {
          return console.error(res);
        })
    };
    listarSeguradoras();



  }, [logout, navigate, token])


  const listarParametroLeilao = async () => {
    let dados = { token, idPar, acessoGeral };
    await getParametroLeilao(dados)
      .then((res) => {
        if (res.data === "erroLogin") {
          alert("Sessão expirada, Favor efetuar um novo login !!");
          logout();
          window.location.reload();
        }
        else if (res.data === "semAcesso") {
          alert("Usuário sem permissão !!!");
          navigate("/home");

        } else if (res.data === "campoNulo") {
          alert("Preencha todos os Campos obrigatorios!!!");
        }
        else if (res.data === "erroSalvar") {
          alert("Erro a tentar listar parametros de leilão!!!");
        }
        else {
          res.data.forEach((l) => {
            setPontuacaoInicial(l.PALE_RANKING_PONTUACAO_INICIAL);
            setHorasL(formatHrLeilao(l.HORAS));
            setHorasExtend(formatHrLeilao(l.HORAS_EXT));
            setHoraIniL(formatHrLeilao(l.HORA_INI));
            setHoraFimL(formatHrLeilao(l.HORA_FIM));
            setTempoAbertAft(l.PALE_TEMPO_ABERTURA_AFTER);
            setQtdHorasValSef(l.PALE_QTDE_HORAS_VALID_SEFAZ);
            setHorarioAtendIni(formatHrLeilao(l.HORAS_FAL_CON_IN));
            setHorarioAtendFim(formatHrLeilao(l.HORAS_FAL_CON_FIM));
            setFeriado(l.PALE_FACULTATIVO_FERIADO);
            setQtdVencedores(l.PALE_QTDE_VENCEDORES_GENUINOS);
            setCriticaPed(limit2(l.PALE_PORC_AJ_PRC_CRIT_PEDIDO));
            setLimiteApr( limit2(l.PALE_PORC_AJ_PRC_LIMITE_APROV));
            setPercLimite(limit2(l.PALE_PORC_AJ_PRC_PERC_LIMITE));
            setLImiteCot(limit2(l.PALE_PORC_AJ_PRC_LIMITE_COTA));
            setQtdHorasBO(l.PALE_PARAM_BO_QTDE_HORAS);
            setPrazoBO(l.PALE_PARAM_BO_QTDE_DIAS);
            setHorasTotalCot(formatHrLeilao(l.HORAS_COT));
            setHorasTotalLei(formatHrLeilao(l.HORAS_LEIL));
            setTempoRecalculo(l.PALE_ONLINE_TEMPO_RECALCULO);
            setEncerraAnt(l.PALE_ONLINE_TEMPO_ENCER_ANTEC);
            setPercAltLeilao(limit2(l.PALE_ONLINE_PERC_ALT_LEILAO));
            setTempoAlt(l.PALE_ONLINE_TEMPO_ALT);
            setIdSeg(l.ID_SEGURADORA);
          })
        }
      })
      .catch((res) => {
        return console.error(res);
      })
  };

  const cadastrarParametros = () => {



    const dados = {
      token, pontuacaoInicial, horasL: horasL.replace(":", ""), horasExtend: horasExtend.replace(":", ""),
      horaIniL: horaIniL.replace(":", ""), horaFimL: horaFimL.replace(":", ""), tempoAbertAft,
      qtdHorasValSef, horarioAtendIni: horarioAtendIni.replace(":", ""),
      horarioAtendFim: horarioAtendFim.replace(":", ""), feriado: (feriado ? feriado : "Nao"), qtdVencedores,
      qtdHorasBO, prazoBO, horasTotalCot: horasTotalCot.replace(":", ""), horasTotalLei: horasTotalLei.replace(":", ""),
      tempoRecalculo, encerraAnt, tempoAlt, idSeg, acessoGeral, idPar,
      criticaPed : formataPercLeilao(criticaPed), 
      limiteApr : formataPercLeilao(limiteApr), 
      percLimite: formataPercLeilao(percLimite),
      limiteCot : formataPercLeilao(limiteCot),
      percAltLeilao : formataPercLeilao(percAltLeilao)
      // criticaPed : criticaPed.replace(".",","), limiteApr : limiteApr ? limiteApr.replace(".",",") : "",  
      // percLimite : percLimite.replace(".",","), limiteCot : limiteCot.replace(".",","),    
      // percAltLeilao : percAltLeilao.replace(".",","),  
    }

   if(
    validaCampoParam(idSeg,"Seguradora não pode ser vazio",14,"Valor superior ao permitido, favor corrigir \nSeguradora") &&
    validaCampoParam(pontuacaoInicial,"Pontuação Inicial não pode ser vazio",6,"Valor superior ao permitido, favor corrigir \nPOntução inicial") &&
    validaHrIni(horasL,null,"Valor de horas leilão não pode ser 00:00")&&
    validaHrIni(horasExtend,null,"Valor de horas extendida não pode ser 00:00")&&
    validaHrIni(horaIniL,horaFimL,"Valor de Hora inicial não pode ser maior ou igual a final, Leilão") &&
    validaCampoParam(tempoAbertAft,"Tempo abertura after não pode ser vazio",4,"Valor superior ao permitido, favor corrigir \nTempo abertura after") &&
    validaCampoParam(qtdHorasValSef,"Horas para Validação Sefaz não pode ser vazio",4,"Valor superior ao permitido, favor corrigir \nValidação Sefaz") &&
    validaHrIni(horarioAtendIni,horarioAtendFim,"Valor de Hora inicial não pode ser maior ou igual a final \nHorário de Atendimento") &&
    validaCampoParam(qtdVencedores,"Vendedores genuínos não pode ser vazio",4,"Valor superior ao permitido, favor corrigir \nVendedores genuínos") &&
    maxValperc(criticaPed,"Valor do percentual critica inválido") &&
    maxValperc(limiteApr,"Valor do percentual Limite aprovados inválido") &&
    maxValperc(percLimite,"Valor do percentual limite inválido") &&
    maxValperc(limiteCot,"Valor do percentual limite cotação inválido") &&
    validaCampoParam(qtdHorasBO,"Quantida horas BO não pode ser vazio",4,"Valor superior ao permitido, favor corrigir \nQuantidade horas BO") &&
    validaCampoParam(prazoBO,"Quantida dias BO não pode ser vazio",4,"Valor superior ao permitido, favor corrigir \nQuantidade dias BO") &&
    validaHrIni(horasTotalCot,null,"Total de horas cotação não pode ser 00:00")&&
    validaHrIni(horasTotalLei,null,"Total de horas  leilão não pode ser 00:00")&&
    validaCampoParam(tempoRecalculo,"Tempo para recalculo não pode ser vazio",4,"Valor superior ao permitido, favor corrigir \nTempo para recalculo") &&
    validaCampoParam(encerraAnt,"Encerramento antecipado em minutos não pode ser vazio",4,"Valor superior ao permitido, favor corrigir \nEncerramento antecipado em minutos") &&
    validaCampoParam(tempoAlt,"Tempo alteração em minutos não pode ser vazio",4,"Valor superior ao permitido, favor corrigir \nTempo alteração em minutos") &&
    maxValperc(percAltLeilao,"Valor do Perc Alt leilão inválido") 
       
   ){    

    saveParametroLeilao(dados)
      .then((res) => {
        if (res.data === "erroLogin") {
          window.alert("Sessão expirada, Favor efetuar um novo login !!");
          logout();
          window.location.reload();
        }
        else if (res.data === "semAcesso") {
          window.alert("Usuário sem permissão !!!");
        } else if (res.data === "sucesso") {
          window.alert("Parametro cadastrado com sucesso !!");
          navigate("/listarparametrosLeilao");
        }
        else if (res.data === "sucessoU") {
          window.alert("Parametro atualizado com sucesso !!");
          navigate("/listarparametrosLeilao");
        }
        else {
          window.alert(" erro ao tentar cadastrar Parametros");
        }
      })
      .catch((erro) => {
        console.error("Erro paramentro leilão", erro);
        window.alert("Erro ao tentar Cadastrar Parametro de leilão");
      })


    }


  }

  return (
    <div className="container-fluid">
      <h3 id="titulos">Parametros do Leilão</h3>

      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete="off"
      >

        <TextField required id=""  error={idSeg ? false : true} disabled={!acessoGeral} label="Seguradora" select  onChange={(e) => setIdSeg(e.target.value)} style={{ minWidth: "40em" }} value={(idSeg.toString())}  >
          {listaSeg.map(l =>
            <MenuItem key={l.ID_SEGURADORA} value={l.ID_SEGURADORA}>{l.SGRA_RAZAO_SOCIAL}  CNPJ {l.SGRA_CNPJ ? cnpj.format(l.SGRA_CNPJ) : " "}</MenuItem>
          )}
        </TextField>

        <label id="titulosLabel">Ranking</label>
        <TextField required label="Pontuação Inicial" error={pontuacaoInicial ? false : true} disabled={!acessoGeral} id="" value={pontuacaoInicial} onChange={(e) => setPontuacaoInicial(parseInt(Number(e.target.value.substring(0, 6))))} type={"number"} />
        <hr />

        <label id="titulosLabel">Leilão</label>
        <TextField required label="Horas" error={horasL === "00:00" ? true : false} disabled={!acessoGeral} id="" value={horasL ? horasL : "00:00"} onChange={(e) => setHorasL(e.target.value)} type={"time"} />
        <TextField required label="Horas Extendida" error={horasExtend === "00:00" ? true : false} disabled={!acessoGeral} id="" value={horasExtend ? horasExtend : "00:00"} onChange={(e) => setHorasExtend(e.target.value)} type={"time"} />
        <TextField required label="Horário Inicio" error={horaIniL === "00:00" ? true : false} disabled={!acessoGeral} id="" value={horaIniL ? horaIniL : "00:00"} onChange={(e) => setHoraIniL(e.target.value)} type={"time"} />
        <TextField required label="Horário Fim" error={horaFimL === "00:00" ? true : false} disabled={!acessoGeral} id="" value={horaFimL ? horaFimL : "00:00"} onChange={(e) => setHoraFimL(e.target.value)} type={"time"} />
        <TextField required label="Tempo Abertura After" error={tempoAbertAft ? false : true} disabled={!acessoGeral} id="" value={tempoAbertAft} onChange={(e) => setTempoAbertAft(parseInt(Number(e.target.value.substring(0, 4))))} type={"number"} />
        <label  style={{ marginTop : "1.2em" }}> em Minutos</label>
        <hr />

        <label id="titulosLabel">Horas para validação nota SEFAZ</label>
        <TextField required label="Quantidade de Horas" error={qtdHorasValSef ? false : true} disabled={!acessoGeral} id="" value={qtdHorasValSef ? qtdHorasValSef : ""} onChange={(e) => setQtdHorasValSef(Number(e.target.value.substring(0, 4)))} type={"number"}/>
        <hr />

        <label id="titulosLabel">Horário de Atendimento para tela fale Conosco</label>
        <TextField required label="Horário Inicial" error={horarioAtendIni === "00:00" ? true : false} disabled={!acessoGeral} id="" value={horarioAtendIni ? horarioAtendIni : "00:00"} onChange={(e) => setHorarioAtendIni(e.target.value)} type={"time"} />
        <label style={{ marginTop: "1.2em" }}> até as </label>
        <TextField required label="Horário Fim" error={horarioAtendFim === "00:00" ? true : false} disabled={!acessoGeral} id="" value={horarioAtendFim ? horarioAtendFim : "00:00"} onChange={(e) => setHorarioAtendFim(e.target.value)} type={"time"} />
        <hr />

        <label id="titulosLabel">Feriado</label>
        <FormGroup>
          <FormControlLabel onChange={(e) => setFeriado((feriado === "Sim" ? "Nao" : "Sim"))} control={<Checkbox />} value={feriado === "Sim" ? "Sim" : "Nao"} label="Facultativo/Feriado" checked={feriado === "Sim" ? true : false} />
        </FormGroup>
        <hr />

        <label id="titulosLabel">Vencedores Genuínos</label>
        <TextField style={{ minWidth: "15em" }} required label="Quantidade de Vencedores" error={qtdVencedores ? false : true} disabled={!acessoGeral} id="" value={qtdVencedores ? qtdVencedores : ""} onChange={(e) => setQtdVencedores(parseInt(Number(e.target.value.substring(0, 4))))} type={"number"} />
        <hr />

        <label id="titulosLabel">Ajuste de Preço</label>
        <TextField required label="Critica de Pedidos   0,00 %" error={criticaPed ? false : true} disabled={!acessoGeral} id="" value={(criticaPed ? criticaPed : "")} onChange={(e) => setCriticaPed(e.target.value)} type={"number"} />
        <TextField required label="Limite Aprovados    %" error={limiteApr > 0 ? false : true} disabled={!acessoGeral} id="" value={limiteApr ? limiteApr : ""} onChange={(e) => setLimiteApr(e.target.value)} type={"number"} />
        <TextField required label="Percentual Limite   %" error={percLimite > 0 ? false : true} disabled={!acessoGeral} id="" value={percLimite ? percLimite : ""} onChange={(e) => setPercLimite(e.target.value)} type={"number"} />
        <TextField required label="Limite Cotação    %" error={limiteCot ? false : true} disabled={!acessoGeral} id="" value={limiteCot ? limiteCot : ""} onChange={(e) => setLImiteCot(e.target.value)} type={"number"} />
        <hr />

        <label id="titulosLabel">Parametros de BO</label>
        <TextField required label="Quantidade de Horas" error={qtdHorasBO ? false : true} disabled={!acessoGeral} id="" value={(qtdHorasBO ? qtdHorasBO : "")} onChange={(e) => setQtdHorasBO(parseInt(Number(e.target.value.substring(0, 4))))} type={"number"} />
        <TextField required label="Prazo em dias" error={prazoBO ? false : true} disabled={!acessoGeral} id="" value={(prazoBO ? prazoBO : "")} onChange={(e) => setPrazoBO(parseInt(Number(e.target.value.substring(0, 4))))} type={"number"} />
        <hr />

        <label id="titulosLabel">Leilão On-Line</label>
        <TextField required label="Horas Cotação" error={horasTotalCot === "00:00" ? true : false} disabled={!acessoGeral} id="" value={(horasTotalCot ? horasTotalCot : "00:00")} onChange={(e) => setHorasTotalCot(e.target.value)} type={"time"} />
        <TextField required label="Horas Leilão" error={horasTotalLei === "00:00" ? true : false} disabled={!acessoGeral} id="" value={(horasTotalLei ? horasTotalLei : "00:00")} onChange={(e) => setHorasTotalLei(e.target.value)} type={"time"} />
        <TextField required label="Tempo p/ Recalculo em Minutos" error={tempoRecalculo ? false : true} disabled={!acessoGeral} id="" value={(tempoRecalculo ? tempoRecalculo : "")} onChange={(e) => setTempoRecalculo(parseInt(Number(e.target.value.substring(0, 4))))} type={"number"} />
        <TextField style={{ minWidth: "16em" }} required label="Encerramento Antecipado em Minutos" error={encerraAnt ? false : true} disabled={!acessoGeral} id="" value={(encerraAnt ? encerraAnt : "")} onChange={(e) => setEncerraAnt(parseInt(Number(e.target.value.substring(0, 4))))} type={"number"} />
        <TextField required label="Perc Alt Leilão   %" error={percAltLeilao ? false : true} disabled={!acessoGeral} id="" value={(percAltLeilao ? percAltLeilao : "")} onChange={(e) => setPercAltLeilao(e.target.value)} type={"number"} />
        <TextField required label="Tempo Alteração em Minutos" error={tempoAlt ? false : true} disabled={!acessoGeral} id="" value={(tempoAlt ? tempoAlt : "")} onChange={(e) => setTempoAlt(parseInt(Number(e.target.value.substring(0, 4))))} type={"number"} />
        <hr />
        <button onClick={() => cadastrarParametros()} style={{ marginBottom: "1em", marginLeft : "0.5em" }} className="btn btn-outline-primary margemRight">SALVAR</button>
      <button style={{ marginBottom: "1em" }} onClick={(e) => navigate("/listarparametrosLeilao")} className="btn btn-outline-danger">SAIR</button>


      </Box>

      
    </div>
  )

}

export default CadastroParametroLeilao;


/*

   <TextField required label="Porta" error={portaSist.length < 1 || portaSist.length > 5 ? true : false}  disabled={!acessoCAD} id="porta" maxLength={5} value={portaSist} onChange={(e) => setPortaSist(e.target.value)} type="number"  style={{ }}/>
             <TextField required label="Usuário (E-Mail)" error={emailSist.length < 1 || emailSist.length > 128 ? true : false} disabled={!acessoCAD} maxLength={128} id="txtEmailU" value={emailSist} onChange={(e) => setEmailSist(e.target.value)}  type="text" style={{ minWidth : "25em"}}  />
             <TextField required label="Senha(E-MAIL)" error={senhaEmailSist.length < 1 || senhaEmailSist.length > 128 ? true : false}disabled={!acessoCAD} id="semail" maxLength={128} value={senhaEmailSist} onChange={(e) => setSenhaEmailSist(e.target.value)}  type="password"  />
             <TextField required label="Remetente" error={remetenteEmailSist.length < 1 || remetenteEmailSist.length > 256 ? true : false} disabled={!acessoCAD} id="remet" maxLength={256} value={remetenteEmailSist} onChange={(e) => setRemetenteEmailSist(e.target.value)}  type="text" style={{ minWidth : "25em"}} />
             <TextField required label="Nome Remetente" error={nomeRemetenteEmailSist.length < 1 || nomeRemetenteEmailSist.length > 256 ? true : false} disabled={!acessoCAD} id="nremet" maxLength={256} value={nomeRemetenteEmailSist} onChange={(e) => setNomeRemetenteEmailSist(e.target.value)}  type="text" style={{ minWidth : "25em"}} />
             <TextField select required label="SMTP Auth" error={smtpSistAuth.length < 1  ? true : false} disabled={!acessoCAD} value={smtpSistAuth} onChange={(e) => setSmtpSistAuth(e.target.value)} style={{ maxWidth : "11em" }} >
                        <MenuItem value={"True"}>True</MenuItem>
                        <MenuItem value={"False"}>False</MenuItem>
             </TextField>

*/