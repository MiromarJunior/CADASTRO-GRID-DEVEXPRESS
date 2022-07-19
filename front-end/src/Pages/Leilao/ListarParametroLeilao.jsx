import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Autenticação/validacao";
import {
    DataTypeProvider, EditingState, SortingState,
    IntegratedSorting,
    IntegratedFiltering,
    FilteringState,
    PagingState,
    IntegratedPaging,
} from '@devexpress/dx-react-grid';
import {
    Grid,
    Table,
    TableHeaderRow,
    TableEditRow,
    TableFilterRow,
    TableColumnVisibility,
    PagingPanel,
    TableColumnResizing,
    TableColumnReordering,
    DragDropProvider,

} from '@devexpress/dx-react-grid-material-ui';
import { cnpj } from "cpf-cnpj-validator";
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { getAcessoUserMenu } from "../../Service/usuarioService";
import { deleteParametroLeilao, getParametroLeilao } from "../../Service/parametroLeilaoService";



const getRowId = row => row.id;
const ListarParametroLeilao = () => {
    const [rows, setRows] = useState([]);
    const navigate = useNavigate();
    const { logout, nomeUser } = useContext(AuthContext);
    const [validCNPJ] = useState(["SGRA_CNPJ"]);
    const [editSeg] = useState(["ALTERACAO"]);
    let token = localStorage.getItem("token");
    // const [defaultHiddenColumnNames] = useState(['nova']);
    const [pageSizes] = useState([5, 10, 15, 0]);
    const [acessoGeral, setAcessoGeral] = useState(false);
    const [acessoADD, setAcessoADD] = useState(false);
    const [displayEDIT, setDisplayEDIT] = useState("none");
    const [displayDEL, setDisplayDEL] = useState("none");

    const listaParamLe = "LIST_PARAMLE";
    const incluirParamLe = "ADD_PARAMLE";
    const excluirParamLe = "DEL_PARAMLE";
    const editarParamLe = "EDIT_PARAMLE";


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
                            listarParametroLeilao();
                        } else if (listaParamLe === ac) {
                            listarParametroLeilao();
                        } else if (incluirParamLe === ac) {
                            setAcessoADD(true);
                        } else if (editarParamLe === ac) {
                            setDisplayEDIT("");
                        } else if (excluirParamLe === ac) {
                            setDisplayDEL("");
                        }
                    })
                })
                .catch((err) => {
                    console.error(err);
                    window.alert("Erro ao Listar Seguradoras !!")
                })
        }
        acessoMenuUser();
        //eslint-disable-next-line  
    }, [logout, token]);

    const listarParametroLeilao = async () => {
        let dados = { token };
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
                    (res.data).forEach((item, index) => (item.id = index));
                    return setRows(res.data);
                }
            })
            .catch((res) => {
                return console.error(res);
            })
    };

    const deletarParametroLeilao = (idPar) => {
        if (acessoGeral || displayDEL === "") {
            let dados = { idPar, token, acessoGeral: true };
            if (window.confirm("deseja excluir o parametro ?")) {
                deleteParametroLeilao(dados)
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
                            listarParametroLeilao();
                        }
                        else if (res.data === "sucesso") {
                            window.alert("Parametro excluído com Sucesso!!!");
                            listarParametroLeilao();
                        }

                    })
                    .catch((res) => {
                        console.error(res);
                        window.alert("Erro ao tentar excluir seguradora");
                    })
            }
        } else {
            window.alert("Usuário sem permissão !!!");
        }

    };



    //GRID



    const BotaoAd = < AddCircleOutlinedIcon className="margemRight" titleAccess="Cadastrar novo" fontSize="large" style={{ color: "blue" }} type="button" onClick={() => navigate("/cadastrarparametrosLeilao/0")} />

    const columns =
        (acessoGeral || acessoADD ?

            [{ name: 'PALE_RANKING_PONTUACAO_INICIAL', title: "RANKING P. INICIAL" },
            { name: 'ID_PARAMETROS_LEILAO', title: "COD. PARÂMETRO" },
            {
                name: 'HORAS', title: `HORAS PADRÃO`,
                getCellValue: row => (row.HORAS.replace(",", ":"))
            },
            { name: 'SGRA_RAZAO_SOCIAL', title: "SEGURADORA" },
            { name: 'SGRA_CNPJ', title: `CNPJ` },
            {
                name: "ALTERACAO", title: BotaoAd,
                getCellValue: row => (row.ID_PARAMETROS_LEILAO)
            }
            ]
            :
            [
                { name: 'PALE_RANKING_PONTUACAO_INICIAL', title: "RANKING P. INICIAL" },
                { name: 'ID_PARAMETROS_LEILAO', title: "COD. PARÂMETRO" },
                {
                    name: 'HORAS', title: `HORAS PADRÃO`,
                    getCellValue: row => (row.HORAS.replace(",", ":"))
                },
                { name: 'SGRA_RAZAO_SOCIAL', title: "SEGURADORA" },
                { name: 'SGRA_CNPJ', title: `CNPJ` },
                {
                    name: "ALTERACAO", title: "Cadastro",
                    getCellValue: row => (row.ID_PARAMETROS_LEILAO)
                }
            ]

        )
    const [defaultColumnWidths] = useState([
        { columnName: 'PALE_RANKING_PONTUACAO_INICIAL', width: 200 },
        { columnName: 'ID_PARAMETROS_LEILAO', width: 180 },
        { columnName: 'HORAS', width: 150 },
        { columnName: 'SGRA_RAZAO_SOCIAL', width: 250 },
        { columnName: 'SGRA_CNPJ', width: 150 },
        { columnName: 'ALTERACAO', width: 200 },

    ])
    const defaultOrderColumns = ["PALE_RANKING_PONTUACAO_INICIAL", "ID_PARAMETROS_LEILAO", "HORAS", "SGRA_RAZAO_SOCIAL", "SGRA_CNPJ", "ALTERACAO"]


    const [editingStateColumns] = useState([
        { columnName: "ALTERACAO", editingEnabled: false, title: "" },
        // {columnName : "PALE_RANKING_PONTUACAO_INICIAL",widht: 300},
        // {columnName : "PRDT_VALOR",align: 'center'},

    ])



    const EditSeguradorasAdm = ({ value }) => (
        <div>
            <ModeEditOutlineOutlinedIcon titleAccess="Alterar" style={{ color: "orange", display: displayEDIT }} className="margemRight" onClick={(e) => navigate(`/cadastrarparametrosLeilao/${value}`)} type="button" />
            <DeleteForeverOutlinedIcon titleAccess={"Excluir"} type="button" fontSize="medium" style={{ color: "red", display: displayDEL }} className="margemRight" onClick={(e) => deletarParametroLeilao(value)} />
            <VisibilityIcon style={{ color: "green", display: (displayEDIT === "none" ? "" : "none") }} titleAccess="Visualizar" className="margemRight" onClick={(e) => navigate(`/cadastrarparametrosLeilao/${value}`)} type="button" />
        </div>

    )
    const EditSeguradorasProv = props => (
        <DataTypeProvider
            formatterComponent={EditSeguradorasAdm}
            {...props}
        />
    )




    return (
        <div className="container-fluid">

            <h3 id='titulos'>Parametros de Leilão  🔨​​</h3>

            <div className="card">
                <Grid
                    rows={rows}
                    columns={columns}
                    getRowId={getRowId}
                >

                    <FilteringState />
                    <IntegratedFiltering />
                    <PagingState
                        defaultCurrentPage={0}
                        defaultPageSize={5}
                    />
                    <IntegratedPaging />

                    <SortingState
                        columnExtensions={editingStateColumns}
                    />
                    <IntegratedSorting
                    />
                    <EditingState
                        columnExtensions={editingStateColumns}
                    />
                    <EditSeguradorasProv
                        for={editSeg}
                    />
                    <ValidCnpjProv
                        for={validCNPJ}
                    />
                    <DragDropProvider />
                    <Table
                    //  tableComponent={TableComponent}
                    />
                    <TableColumnReordering
                        defaultOrder={defaultOrderColumns}
                    />

                    {/* {!acessoGeral ? <TableColumnVisibility
                        defaultHiddenColumnNames={defaultHiddenColumnNames}

                    /> : ""
                    } */}
                    <TableColumnResizing defaultColumnWidths={defaultColumnWidths} />
                    <TableHeaderRow
                        contentComponent={TableComponentTitle}
                        showSortingControls />
                    <TableEditRow />
                    <TableFilterRow />
                    <PagingPanel
                        pageSizes={pageSizes}
                    />


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
const ValidCnpj = ({ value }) => (
    cnpj.format(value)
)
const ValidCnpjProv = (props) => (
    <DataTypeProvider
        formatterComponent={ValidCnpj}
        {...props}

    />
)


export default ListarParametroLeilao;