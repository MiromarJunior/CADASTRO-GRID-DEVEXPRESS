import { Box, TextField } from "@mui/material";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Autenticação/validacao";


const CadastroMarcaVeiculo = () => {
    const token = localStorage.getItem("token");
    const { logout, nomeUser } = useContext(AuthContext);
    const [acessoGeral, setAcessogeral] = useState(true);
    const [codigoMarca, setCodigoMarca] = useState('');
    const [descricao, setDescricao] = useState('');
    const [posLogChat, setPosLogChat] = useState('');
    const [logo, setLogo] = useState();
    const [logoApont, setLogoApont] = useState();
    const [imagemChat, setImagemChat] = useState();
    const [imagemChatColor, setImagemChatColor] = useState();
    const navigate = useNavigate();
    const cadastrarMarcaVeiculo = () => {

    }
    return (
        <div className="container-fluid centralizar" >
            <h3 id="titulos">Cadastro Marca Veiculo</h3>
            <Box
                component="form"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
            >
                <TextField required label="Código Marca" disabled={true} id="" value={codigoMarca} type={"number"} /><br />
                <TextField required label="Descrição" error={descricao ? false : true} disabled={!acessoGeral} id="" value={descricao} onChange={(e) => setDescricao(e.target.value)} type={"text"} /><br />
                <TextField required label="Posição Logo Chat" error={posLogChat ? false : true} disabled={!acessoGeral} id="" value={posLogChat} onChange={(e) => setPosLogChat(e.target.value)} type={"number"} /><br />
                <TextField required label="Imagem Logo" error={logo ? false : true} disabled={!acessoGeral} id="" value={logo} onChange={(e) => setLogo(e.target.value)} type={"file"} InputLabelProps={{
                    shrink: true,
                }} style={{ minWidth: '25em' }} /><br />
                <TextField required label="Imagem Logo Apontador" error={logoApont ? false : true} disabled={!acessoGeral} id="" value={logoApont} onChange={(e) => setLogoApont(e.target.value)} type={"file"} InputLabelProps={{
                    shrink: true,
                }} style={{ minWidth: '25em' }} /><br />
                <TextField required label="Imagem Chat" error={imagemChat ? false : true} disabled={!acessoGeral} id="" value={imagemChat} onChange={(e) => setImagemChat(e.target.value)} type={"file"} InputLabelProps={{
                    shrink: true,
                }} style={{ minWidth: '25em' }} /><br />
                <TextField required label="Imagem Chat Colorido" error={imagemChatColor ? false : true} disabled={!acessoGeral} id="" value={imagemChatColor} onChange={(e) => setImagemChatColor(e.target.value)} type={"file"} InputLabelProps={{
                    shrink: true,
                }} style={{ minWidth: '25em' }} />

                <br/>
                <button onClick={() => cadastrarMarcaVeiculo()} style={{ marginBottom: "1em", marginLeft: "0.5em" }} className="btn btn-outline-primary">SALVAR</button>
                <button style={{ marginBottom: "1em", marginLeft: "1em"}} onClick={(e) => navigate("/marcaVeiculo")} className="btn btn-outline-danger">VOLTAR</button>


            </Box>
        </div>
    )

}

export default CadastroMarcaVeiculo;
