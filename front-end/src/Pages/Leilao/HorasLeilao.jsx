
import { Box, Checkbox, FormControlLabel, FormGroup, MenuItem, TextField } from "@mui/material";
import { cnpj } from "cpf-cnpj-validator";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../Autenticação/validacao";
import { getUnidadeFederativa } from "../../Service/enderecoService";
import { formataPercLeilao, getAcrescimoHoraLeilao, getParametroLeilao, getSegParametroLeilao, limit2, maxValperc, saveHoraLeilao, saveParametroLeilao } from "../../Service/parametroLeilaoService";
import { getAcessoUserMenu } from "../../Service/usuarioService";
import { formatHrLeilao, validaCampoParam, validaHrIni, } from "../../Service/utilServiceFrontEnd";
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
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


const getRowId = row => row.id;
const HorasLeilao = () => {

    const token = localStorage.getItem("token");
    const { logout, nomeUser } = useContext(AuthContext);
    const [periodoPadrao, setPeriodoPadrao] = useState("00:00");
    const [periodoAdicional, setPeriodoAdicional] = useState("00:00");
    const [acrescimo, setAcrescimo] = useState("00:00");
    const [estado, setEstado] = useState('');
    const [acessoGeral, setAcessogeral] = useState(false);
    const [acessoCAD, setAcessoCAD] = useState(false);
    const navigate = useNavigate();
    const [displayADD, setDisplayADD] = useState("none");
    const [listaUf, setListaUf] = useState([])
    const [rows, setRows] = useState([]);
    const [pageSizes] = useState([5, 10, 15, 0]);
    const [botaodelete] = useState(["ACOES"])
 

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
                                setAcessoCAD(true);
                                setDisplayADD("");
                                listarAcrescimoHoraLeilao();

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

    useEffect(() => {

        const dados = {
            token
        }

        getUnidadeFederativa(dados)
            .then((res) => {
                setListaUf(res.data);

            }).catch((error) => {
                console.error('Erro ao tentar listar estado', error)

            })


    }, [])

    const cadastrarHoraLeilao = () => {      
        const dados = { periodoPadrao : periodoPadrao.replace(":", ""), periodoAdicional : periodoAdicional.replace(":", ""), acrescimo : acrescimo.replace(":", ""), estado, acessoGeral, token }
        
        
        saveHoraLeilao(dados)
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
                    alert("Horas do leilão cadastrada com sucesso.");
                }
                else if (res.data === "sucessoU") {
                    alert("Horas do leilão alterada com sucesso.");
                }
                else {
                    alert("Erro ao tentar cadastrar horas do leilão!!!")
                }





            }).catch((erro) => {
                window.alert("Erro ao tentar cadastrar");
                console.error(erro, "erro ao tentar cadastrar");
            })

    }

    const listarAcrescimoHoraLeilao = async () => {
        let dados = { token };
        await getAcrescimoHoraLeilao(dados)
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
    
const deletarHoraLeilaoUf = () => {

}

    console.log(rows);
    
    const columns =
        
            [{ name: 'UNFE_SIGLA', title: "UF" },
            { name: 'ACRESCIMO', title: "Acréscimo",
            getCellValue: row => (row.ACRESCIMO.replace(",", ":"))
        },
        {
            name: "ACOES", title: "AÇÕES",
            getCellValue: row => (row.ID_HORARIO_LEILAO_UF)
        }
        
    ]

    const BotaoDelete = ({ value }) => (
        <div>
            
            <DeleteForeverOutlinedIcon titleAccess={"Excluir"} type="button" fontSize="medium" style={{ color: "red"}} onClick={(e) => deletarHoraLeilaoUf(value)} />
            
        </div>

    )
    const BotaoDeleteProv = props => (
        <DataTypeProvider
            formatterComponent={BotaoDelete}
            {...props}
        />
    )



    return (
        <div className="container-fluid centralizar">
            <h3 id="titulos">Quantidade de Horas Leilão</h3>

            <Box component="form" sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' }, }} noValidate autoComplete="off">

                <label id="titulosLabel">Períodos</label>
                <TextField required label="Período Padrão" error={periodoPadrao === "00:00" ? true : false} disabled={!acessoCAD} id="" value={(periodoPadrao ? periodoPadrao : "00:00")} onChange={(e) => setPeriodoPadrao(e.target.value)} type={"time"} />
                <TextField required label="Período Adicional" error={periodoAdicional === "00:00" ? true : false} disabled={!acessoCAD} id="" value={(periodoAdicional ? periodoAdicional : "00:00")} onChange={(e) => setPeriodoAdicional(e.target.value)} type={"time"} /><br />
                <label id="titulosLabel">Acréscimo por estado</label>
                <TextField required label="Acréscimo" error={acrescimo === "00:00" ? true : false} disabled={!acessoCAD} id="" value={(acrescimo ? acrescimo : "00:00")} onChange={(e) => setAcrescimo(e.target.value)} type={"time"} />
                <TextField required id="" error={estado ? false : true} disabled={!acessoCAD} label="Estado" select onChange={(e) => setEstado(e.target.value)} value={estado}  >
                    {listaUf.map(l =>
                        <MenuItem key={l.ID_UNIDADE_FEDERATIVA} value={l.ID_UNIDADE_FEDERATIVA}>{l.UNFE_DESCRICAO} </MenuItem>
                    )}
                </TextField>
                <hr />


            </Box>
            <button onClick={()=> cadastrarHoraLeilao()} style={{ display: displayADD }} className="btn btn-outline-primary margemRight">SALVAR</button>
            <button onClick={(e) => navigate("/listarparametrosLeilao")} className="btn btn-outline-danger">SAIR</button>

            <div className="centralizar" style={{maxWidth : '40em', marginLeft : '28em', marginTop : '1em'}} >
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
                       // columnExtensions={editingStateColumns}
                    />
                    <IntegratedSorting
                    />
                    <EditingState
                        //columnExtensions={editingStateColumns}
                    />

                    <BotaoDeleteProv
                    for={botaodelete}
        
                    />

                    
                    <DragDropProvider />
                    <Table
                    //  tableComponent={TableComponent}
                    />
                    <TableColumnReordering
                      //  defaultOrder={defaultOrderColumns}
                    />

                    {/* {!acessoGeral ? <TableColumnVisibility
                        defaultHiddenColumnNames={defaultHiddenColumnNames}

                    /> : ""
                    } */}
                    <TableColumnResizing 
                   // defaultColumnWidths={defaultColumnWidths}
                     />
                    <TableHeaderRow
                      //  contentComponent={TableComponentTitle}
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

export default HorasLeilao; 