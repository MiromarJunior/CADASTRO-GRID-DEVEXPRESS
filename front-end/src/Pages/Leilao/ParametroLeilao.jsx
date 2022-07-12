import { Box, TextField } from "@mui/material";
import { useState } from "react";

const ParametroLeilao = ()=>{

    const [pontuacaoInicial, setPontuacaoInicial] = useState([]);
    const [horasL, setHorasL] = useState("");
    const [horasExtend, setHorasExtend] = useState("");
    const [horaIniL, setHoraIniL] = useState("");
    const [horaFimL, setHoraFimL] = useState("");
    const [tempoAbertAft, setTempoAbertAft] = useState("");
    const [qtdHorasValSef, setQtdHorasValSef] = useState("");
    const [horarioAtend, setHorarioAtend] = useState("");

    const [acessoGeral,setAcessogeral]= useState(true);


    return(
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


  <label id="titulosLabel2">Ranking</label>
             <TextField required label="Pontuação Inicial" error={pontuacaoInicial.length > 0 ? false : true} disabled={!acessoGeral} id="" value={pontuacaoInicial}  onChange={(e)=> setPontuacaoInicial(e.target.value)}  type={"number"}  />
          
   <hr/>
  <label id="titulosLabel2">Leilão</label>
            <TextField  required label="Horas" error={horasL.length > 0 ? false : true} disabled={!acessoGeral} id="" value={horasL ? horasL : "00:00"} onChange={(e)=> setHorasL(e.target.value)}   type={"time"}  />
            <TextField required label="Horas Extendida" error={horasExtend.length > 0 ? false : true} disabled={!acessoGeral} id=""  value={horasExtend ? horasExtend : "00:00"}  onChange={(e)=> setHorasExtend(e.target.value)}  type={"time"}  />
            <TextField required label="Horário Inicio" error={horaIniL.length > 0 ? false : true} disabled={!acessoGeral} id=""  value={horaIniL ? horaIniL : "00:00"}  onChange={(e)=> setHoraIniL(e.target.value)}  type={"time"}  />
            <TextField required label="Horário Fim" error={horaFimL.length > 0 ? false : true} disabled={!acessoGeral} id=""  value={horaFimL ? horaFimL : "00:00"}  onChange={(e)=> setHoraFimL(e.target.value)}  type={"time"}  />
          
            <TextField required label="Tempo Abertura After" error={tempoAbertAft.length > 0 ? false : true} disabled={!acessoGeral} id="" value={tempoAbertAft}  onChange={(e)=> setTempoAbertAft(e.target.value)}  type={"number"}  /> 
            <button style={{marginTop : "1.2em", border : "0", backgroundColor  :"white"}}> em Minutos</button>
           
            <hr/> 
              
            <label id="titulosLabel">Horas para validação nota SEFAZ</label>
            <TextField  required label="Quantidade de Horas" error={qtdHorasValSef.length > 0 ? false : true} disabled={!acessoGeral} id="" value={qtdHorasValSef ? qtdHorasValSef : ""} onChange={(e)=> setQtdHorasValSef(e.target.value)}   type={"number"}  />
            <hr/> 
            
            
            
            
            
            
            
            
            
            
            
            
             {/* <TextField select required label="SMTP Secure"  error={smtpSistSecure.length < 1  ? true : false} disabled={!acessoCAD} value={smtpSistSecure} onChange={(e) => setSmtpSistSecure(e.target.value)}style={{ maxWidth : "11em"}}  >
                        <MenuItem value={"TLS"}>TLS</MenuItem>
                        <MenuItem value={"SSL"}>SSL</MenuItem>
             </TextField> */}
            

                
        
                </Box>   


        </div>
    )

} 

export default ParametroLeilao;


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