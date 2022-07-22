import { Box, TextField } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../Autenticação/validacao";
import { deleteMarcaVeiculo, getMarcaVeiculo, saveMarcaVeiculo } from "../../Service/marcaVeiculoService";
import { getAcessoUserMenu } from "../../Service/usuarioService";
import { validaTmIgm } from "../../Service/utilServiceFrontEnd";


const CadastroMarcaVeiculo = () => {
    const { idMa } = useParams();
    const token = localStorage.getItem("token");
    const { logout, nomeUser } = useContext(AuthContext);
    const [acessoGeral, setAcessogeral] = useState(true);
    const [codigoMarca, setCodigoMarca] = useState(idMa);
    const [descricao, setDescricao] = useState('');
    const [posLogChat, setPosLogChat] = useState('');
    const [logo, setLogo] = useState();
    const [logoApont, setLogoApont] = useState();
    const [imagemChat, setImagemChat] = useState();
    const [imagemChatColor, setImagemChatColor] = useState();
    const [logoB, setLogoB] = useState("");
    const [logoApontB, setLogoApontB] = useState("");
    const [imagemChatB, setImagemChatB] = useState("");
    const [imagemChatColorB, setImagemChatColorB] = useState("");
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
                 
                    listarMarcaVeiculo();
                  
    
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
        
        //eslint-disable-next-line
      }, [logout, token, nomeUser]);

    const cadastrarMarcaVeiculo = () => {    
       
        const dados = { descricao, posLogChat,logo , logoApont, imagemChat, imagemChatColor, idMa, acessoGeral, token }
        console.log(dados);
        
        saveMarcaVeiculo(dados)
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
                else if (res.data === "sucesso") {
                    alert("Marca veiculo cadastrada com sucesso.");
                }
                else if (res.data === "sucessoU") {
                    alert("Marca veiculo alterada com sucesso.");
                    listarMarcaVeiculo();
                }
                else {
                    alert("Erro ao tentar cadastrar marca veiculo!!!")
                }





            }).catch((erro) => {
                window.alert("Erro ao tentar cadastrar");
                console.error(erro, "erro ao tentar cadastrar");
            })

    }


    const listarMarcaVeiculo = async () => {

        let dados = { token, idMa };
        await getMarcaVeiculo(dados)
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
                    alert("Erro ao tentar listar marcas!!!");
                 }
                else {                      
                    (res.data).forEach((l)=>{
                        setDescricao(l.MRVC_DESCRICAO);
                        setPosLogChat(l.MRVC_POSICAO_LOGO_CHAT);
                        setLogo(l.MRVC_IMAGEM_LOGO);
                     //   setLogoB(l.MRVC_IMAGEM_LOGO);
                        setLogoApont(l.MRVC_IMAGEM_LOGO_APONTADOR);
                        setImagemChat(l.MRVC_IMAGEM_CHAT);
                        setImagemChatColor(l.MRVC_IMAGEM_CHAT_COLORIDO);
                    })
                }
            })
            .catch((res) => {
                return console.error(res);
            })
    };



   
    return (
        <div className="container-fluid centralizar" >
            <h3 id="titulos">Cadastro Marca Veiculo</h3>
            <Box
                component="form"
                encType="multipart/form-data"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
            >   
                <TextField required label="Código Marca" disabled={true} id="" value={codigoMarca} type={"number"} /><br />
                <TextField required label="Descrição" error={descricao ? false : true} disabled={!acessoGeral} id="" value={descricao} onChange={(e) => setDescricao(e.target.value)} type={"text"} /><br />
                <TextField required label="Posição Logo Chat" error={posLogChat ? false : true} disabled={!acessoGeral} id="" value={posLogChat} onChange={(e) => setPosLogChat(e.target.value)} type={"number"} /><br />
              
                <img src={`data:image/png;base64,${logo}`} alt=""/>               
                <TextField name= {typeof(logo) ==="object" ? "logo" : ""}  inputProps={{ accept :"image/*"}} required label="Imagem Logo" error={logo ? false : true} disabled={!acessoGeral} id="logo"  onChange={(e) => setLogo( e.target.files[0])} type={"file"} InputLabelProps={{
                    shrink: true
                }} style={{ minWidth: '25em' }} /><br />
               
               <img src={`data:image/png;base64,${logoApont}`} alt=""/>
                <TextField name="logoApont" inputProps={{ accept :"image/*"}} required label="Imagem Logo Apontador" error={logoApont ? false : true} disabled={!acessoGeral} id="" onChange={(e) => setLogoApont(e.target.files[0])} type={"file"} InputLabelProps={{
                    shrink: true 
                }} style={{ minWidth: '25em' }} /><br />
                
                 <img src={`data:image/png;base64,${imagemChat}`} alt=""/>
                <TextField name="imagemChat" inputProps={{ accept :"image/*"}} required label="Imagem Chat" error={imagemChat ? false : true} disabled={!acessoGeral} id=""  onChange={(e) => setImagemChat(e.target.files[0])} type={"file"} InputLabelProps={{
                    shrink: true,
                }} style={{ minWidth: '25em' }} /><br />
                
                <img src={`data:image/png;base64,${imagemChatColor}`} alt=""/>
                <TextField name="imagemChatColor" inputProps={{ accept :"image/*"}}  required label="Imagem Chat Colorido" error={imagemChatColor ? false : true} disabled={!acessoGeral} id=""  onChange={(e) => setImagemChatColor(e.target.files[0])} type={"file"} InputLabelProps={{
                    shrink: true,
                }} style={{ minWidth: '25em' }} />

                <br />
                

            </Box>
            <button onClick={() => cadastrarMarcaVeiculo()} style={{ marginBottom: "1em", marginLeft: "0.5em" }} className="btn btn-outline-primary">SALVAR</button>
            <button style={{ marginBottom: "1em", marginLeft: "1em" }} onClick={(e) => navigate("/marcaVeiculo")} className="btn btn-outline-danger">VOLTAR</button>

        </div>
    )

}

export default CadastroMarcaVeiculo;
