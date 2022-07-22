import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Autenticação/validacao";
import {
    DataTypeProvider, EditingState, SortingState,
    IntegratedSorting,
    IntegratedFiltering,
    FilteringState,
} from '@devexpress/dx-react-grid';
import {
    Grid,
    Table,
    TableHeaderRow,
    TableEditRow,
    TableFilterRow,
    TableColumnVisibility,

} from '@devexpress/dx-react-grid-material-ui';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { getAcessoUserMenu } from "../../Service/usuarioService";
import { deleteMarcaVeiculo, getMarcaVeiculo } from "../../Service/marcaVeiculoService";
import { TextField } from "@mui/material";



// const TableComponent = ({ ...restProps }) => (
//     <Table.Table
//         {...restProps}
//     />
// );










const getRowId = row => row.id;

const MarcaVeiculo = () => {
    const [rows, setRows] = useState([]);
    const navigate = useNavigate();
    const { logout, nomeUser } = useContext(AuthContext);
    let token = localStorage.getItem("token");
    const [acessoGeral, setAcessoGeral] = useState(false);
    const [acessoDEL, setAcessoDEL] = useState(false);
    const [acessoADD, setAcessoADD] = useState(false);
    const [displayEDIT, setDisplayEDIT] = useState("none");
    const [displayDEL, setDisplayDEL] = useState("none");
    const [columBottom] = useState(["BOTOES"]);
    const [foto, setFoto] = useState([]);

  

    const listarMarcaVeiculo = async () => {

        let dados = { token };
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
                    (res.data).forEach((item, index) => (item.id = index));
                   return setRows(res.data);
                }
            })
            .catch((res) => {
                return console.error(res);
            })
    };

    const excluirMarcaVeiculo = (idMa) => {
        const dados = { idMa, acessoGeral, token }
        deleteMarcaVeiculo(dados)
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
                    alert("Marca veiculo excluida com sucesso.");
                }
                else {
                    alert("Erro ao tentar excluir marca veiculo!!!")
                }





            }).catch((erro) => {
                window.alert("Erro ao tentar excluir");
                console.error(erro, "erro ao tentar excluir");
            })

    }

    useEffect(() => {
        listarMarcaVeiculo();
    }, [])

    const botaoAdd =  <AddCircleOutlinedIcon className="margemRight" titleAccess="Cadastrar novo" fontSize="large" style={{ color: "blue" }} type="button" onClick={() => navigate("/cadastroMarcaVeiculo/0")} />

    const columns = ([
        { name: 'ID_MARCA_VEICULO', title: "Código da Marca" },
        { name: 'MRVC_DESCRICAO', title: "Marca" },        
        { name: 'BOTOES', title: botaoAdd,
        getCellValue: row => (row.ID_MARCA_VEICULO) },


    ]);
    

    const EditMarcaVeiculo = ({ value }) => (
        <div>  
        <ModeEditOutlineOutlinedIcon titleAccess="Alterar" style={{ color: "orange", display : '' }} className="margemRight" onClick={(e) => navigate(`/cadastroMarcaVeiculo/${value}`)} type="button" />
        <DeleteForeverOutlinedIcon titleAccess={"Excluir"} type="button" fontSize="medium" style={{ color: "red" ,display : ''}}   className="margemRight" onClick={()=>excluirMarcaVeiculo(value)}/>
        
        <VisibilityIcon style={{ color: "green" ,display : ('')}} titleAccess="Visualizar" className="margemRight" onClick={(e) => navigate(`/cadastroMarcaVeiculo/${value}`)} type="button" />   
    
        </div>  
    
    )
    
    


    const EditMarcaVeiculoProv = props => (
        <DataTypeProvider
            formatterComponent={ EditMarcaVeiculo}
            {...props}
        />
    )
  
   

    return (
    <div className="container-fluid">
        <h1 id="titulos">Marca Veículo - Em desenvolvimento</h1>
                 <img src={`data:image/png;base64,${foto}`} alt=""/>
        {/* <img alt="" src={ foto ? URL.createObjectURL(foto) : ""}  /> */}
        
        <div className="card">
            <Grid
                rows={rows}
                columns={columns}
                getRowId={getRowId}
            >
                <FilteringState defaultFilters={[]} />
                <IntegratedFiltering />
                <EditMarcaVeiculoProv for ={columBottom}/>

                <SortingState

                />

                <IntegratedSorting
                />
                <EditingState

                />


                <Table
                //  tableComponent={TableComponent}
                />

                <TableHeaderRow />
                <TableEditRow />
                <TableFilterRow />


            </Grid>
        </div >
    </div >)

}

export default MarcaVeiculo