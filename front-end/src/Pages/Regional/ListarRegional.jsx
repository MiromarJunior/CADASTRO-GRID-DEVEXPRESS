import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Autenticação/validacao";
import {DataTypeProvider, EditingState, SortingState,IntegratedSorting,IntegratedFiltering,FilteringState,} from '@devexpress/dx-react-grid';
import {Grid,Table,TableHeaderRow,TableEditRow,TableFilterRow,TableColumnVisibility} from '@devexpress/dx-react-grid-material-ui';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { getAcessoUserMenu } from "../../Service/usuarioService";
import { getRegional, deleteRegional } from "../../Service/regionalService";


const getRowId = row => row.id;

const ListarRegional = () => {
    const [rows, setRows] = useState([]);
    const navigate = useNavigate();
    const { logout, nomeUser } = useContext(AuthContext);
    const [editSeg] = useState(["ALTERACAO"]);
    let token = localStorage.getItem("token");
    const [acessoGeral, setAcessoGeral] = useState(false);
    const [acessoDEL, setAcessoDEL] = useState(false);
    const [defaultHiddenColumnNames] = useState(['nova']);
    const [acessoADD, setAcessoADD] = useState(false);
    const [displayEDIT, setDisplayEDIT] = useState("none");
    const [displayDEL, setDisplayDEL] = useState("none");

    const listaRgal   = "LIST_REGIONAL";
    const incluirRgal = "ADD_REGIONAL";
    const excluirRgal = "DEL_REGIONAL";
    const editarRgal  = "EDIT_REGIONAL";    


    useEffect(() => {
        const acessoMenuUser = async () => {
            let dados = { token, usuario: nomeUser() };
            await getAcessoUserMenu(dados)
                .then((res) => {
                    (res.data).forEach((ac) => {
                        if (process.env.REACT_APP_API_ACESSO_GERAL === ac) {
                            setDisplayEDIT("");
                            setDisplayDEL("");
                            setAcessoGeral(true);
                            listarRegional();
                        } else if (listaRgal === ac) {
                            listarRegional();
                        } else if (incluirRgal === ac) {
                            setAcessoADD(true);
                        } else if (editarRgal === ac) {
                            setDisplayEDIT("");
                        } else if (excluirRgal === ac) {
                            setDisplayDEL("");
                            setAcessoDEL(true);
                        }
                    })
                })
                .catch((err) => {
                    console.error(err);
                    window.alert("Erro ao Listar Regional !!")
                })
        }
        acessoMenuUser();
        //eslint-disable-next-line  
    }, [logout, token]);

    const listarRegional = async () => {
        let dados = { token };
        await getRegional(dados)
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
                    (res.data).forEach((item, index) => (item.id = index));
                    return setRows(res.data);
                }
            })
            .catch((res) => {
                return console.error(res);
            })
    };

    const deletarRegional = (idRegional) => {
        if (acessoGeral || acessoDEL) {
            let dados = { idRegional, token, acessoGeral, acessoDEL };
            if (window.confirm("deseja excluir o parametro ?")) {
                deleteRegional(dados)
                    .then((res) => {
                        if (res.data === "erroLogin") {
                            window.alert("Sessão expirada, Favor efetuar um novo login !!");
                            logout();
                            window.location.reload();
                        }
                        else if (res.data === "semAcesso") {
                            window.alert("Usuário sem permissão !!!");
                        } else if (res.data === "campoNulo") {
                            window.alert("Preencha todos os Campos obrigatorios!!!");
                        }
                        else if (res.data === "erroSalvar") {
                            window.alert("Erro a tentar Excluir Parametro!!!");
                            listarRegional();
                        }
                        else if (res.data === "sucesso") {
                            window.alert("Parametro excluído com Sucesso!!!");
                            listarRegional();
                        }
                    })
                    .catch((res) => {
                        console.error(res);
                        window.alert("Erro ao tentar excluir Regional");
                    })
            }
        } else {
            window.alert("Usuário sem permissão !!!");
        }
    };
    //GRID

    const BotaoAd = < AddCircleOutlinedIcon className="margemRight" titleAccess="Cadastrar novo" fontSize="large" style={{ color: "blue" }} type="button" onClick={() => navigate("/cadastroRegional/0")} />

    const columns =
        (acessoGeral || acessoADD ?

            [
                // { name: 'ID_PARAMETROS_LEILAO', title: "CODIGO PARÂMETRO" },
                { name: 'RGAL_ABREVIATURA', title: `Abreviatura` },
                { name: 'RGAL_DESCRICAO', title: "Descrição" },
                { name: 'RGAL_FORMA_ABERTURA_ATUAL', title: "Forma de Abertura Atual" },
                { name: 'RGAL_TIPO_DISPUTA_ATUAL', title: "Tipo de Disputa Atual" }, 
                { name: 'RGAL_FORMA_ENCERRAMENTO', title: "Forma de Encerramento" },  
                {
                    name: "ALTERACAO", title: BotaoAd,
                    getCellValue: row => (row.ID_REGIONAL)
                }]
            :
            [
                { name: 'RGAL_ABREVIATURA', title: `Abreviatura` },
                { name: 'RGAL_DESCRICAO', title: "Descrição" },
                { name: 'RGAL_FORMA_ABERTURA_ATUAL', title: "Forma de Abertura Atual" },
                { name: 'RGAL_TIPO_DISPUTA_ATUAL', title: "Tipo de Disputa Atual" }, 
                { name: 'RGAL_FORMA_ENCERRAMENTO', title: "Forma de Encerramento" }, 
                {
                    name: "ALTERACAO", title: "Cadastro",
                    getCellValue: row => (row.ID_REGIONAL)
                }]
        )

    const [editingStateColumns] = useState([
        { columnName: "ALTERACAO", editingEnabled: false, title: "" },
    ])


    const EditRegionalAdm = ({ value }) => (
        <div>
            <ModeEditOutlineOutlinedIcon titleAccess="Alterar" style={{ color: "orange", display: displayEDIT }} className="margemRight" onClick={(e) => navigate(`/cadastroRegional/${value}`)} type="button" />
            <DeleteForeverOutlinedIcon titleAccess={"Excluir"} type="button" fontSize="medium" style={{ color: "red", display: displayDEL }} className="margemRight" onClick={(e) => deletarRegional(value)} />
            <VisibilityIcon style={{ color: "green", display: (displayEDIT === "none" ? "" : "none") }} titleAccess="Visualizar" className="margemRight" onClick={(e) => navigate(`/cadastroRegional/${value}`)} type="button" />
        </div>
    )

    const EditRegionalProv = props => (
        <DataTypeProvider
            formatterComponent={EditRegionalAdm}
            {...props}
        />
    )

    return (
        <div className="container-fluid">

            <h3 id='titulos'>Regional​​</h3>

            <div className="card">
                <Grid
                    rows={rows}
                    columns={columns}
                    getRowId={getRowId}
                >
                    <FilteringState defaultFilters={[]} />
                    <IntegratedFiltering />

                    <SortingState
                        columnExtensions={editingStateColumns}
                    />
                    <IntegratedSorting
                    />
                    <EditingState
                        columnExtensions={editingStateColumns}
                    />
                    <EditRegionalProv
                        for={editSeg}
                    />

                    <Table
                    //  tableComponent={TableComponent}
                    />
                    {!acessoGeral ? <TableColumnVisibility
                        defaultHiddenColumnNames={defaultHiddenColumnNames}

                    /> : ""
                    }

                    <TableHeaderRow
                        contentComponent={TableComponentTitle}
                        showSortingControls />
                    <TableEditRow />
                    <TableFilterRow />
                </Grid>
            </div>
        </div>
    )
}
const TableComponentTitle = ({ style, ...restProps }) => (
    <TableHeaderRow.Content
        {...restProps}
        style={{
            color: 'black',
            fontWeight: "bold",
            ...style,
        }}
    />
);



export default ListarRegional;