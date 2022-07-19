
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";



import { AuthContext } from "../Autenticação/validacao";

import { Checkbox, FormControlLabel, FormGroup, Paper } from "@mui/material";
import { getAcesso, getAcessoUserMenu, saveAcesso } from "../Service/usuarioService";

import { Grid, Table, TableColumnResizing, TableFilterRow, TableHeaderRow } from "@devexpress/dx-react-grid-material-ui";

import { DataTypeProvider, EditingState, FilteringState, IntegratedFiltering, IntegratedSorting, SortingState } from "@devexpress/dx-react-grid";
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import ListIcon from '@mui/icons-material/List';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';


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


const getRowId = row => row.id;
const Acesso = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { logout, nomeUser } = useContext(AuthContext);
  const [rows, setRows] = useState([]);
  const [botaoAcessosL] = useState(["ACESSOL"]);
  const [acessoGeral, setAcessoGeral] = useState(false);
  const [displayAcesso, setDisplayAcesso] = useState("none")
  const { idGa, grAce, grMen } = useParams();


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
                setAcessoGeral(true);
                setDisplayAcesso("");
                listaAcesso();
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

    //eslint-disable-next-line
  }, [logout, token, nomeUser]);

  const cadastrarAcesso = (idGa, idAc) => {

    let dados = { idGa, idAc, token, acessoGeral };
    if (acessoGeral) {

      saveAcesso(dados)
        .then((res) => {
          if (res.data === "erroLogin") {
            window.alert("Sessão expirada, Favor efetuar um novo login !!");
            logout();
            window.location.reload();
          }
          else if (res.data === "semAcesso") {
            window.alert("Usuário sem permissão !!!");

          } else if (res.data === "sucesso") {
           // window.alert("Acesso cadastrado com sucesso !!");
            listaAcesso();

          }
          else if (res.data === "sucessoD") {
           // window.alert("Acesso excluído com sucesso !!");
            listaAcesso();

          }


          else {
            window.alert(" erro ao tentar cadastrar Acesso");
          }

        })
        .catch((err) => {
          console.error(err);
          window.alert("Erro ao cadastrar grupo de Acesso!!")
        })
    } else {
      window.alert("Usuário sem permissão !!!");
      navigate("/home");

    }
  }
  const listaAcesso = async () => {
    let dados = { token, idGa, acessoGeral, grupoMenu: grMen };



    await getAcesso(dados)
      .then((res) => {
        if (res.data === "erroLogin") {
          window.alert("Sessão expirada, Favor efetuar um novo login !!");
          logout();
          window.location.reload();
        }
        else if (res.data === "semAcesso") {
          window.alert("Usuário sem permissão !!!");

        } else {
          (res.data).forEach((item, index) => (item.id = index));
          return setRows(res.data);
        }


      })


      .catch((err) => {
        console.error(err);
        window.alert("Erro ao cadastrar !!")
      })
  }

  const alteraAcesso = (valor) => {
    if (valor === "ACESSO_MASTER") {
      return "ACESSO GERAL"
    } else if (valor === "CADASTRO_SGRA") {
      return "CADASTRO SEGURADORAS"
    } else if (valor === "ACESSO_ADM_USRO") {
      return "ADM USUÁRIO"
    } else if (valor === "ACESSO_CAD_GERAL") {
      return "CADASTROS GERAIS"
    } else if (valor === "ACESSO_ADM_SGRA") {
      return "ADM SEGURADORAS"
    } else if (valor === "LIST_SGRA") {
      return <span> Listar Seguradoras  <ListIcon style={{ color: "green" }} /></span>
    } else if (valor === "ADD_USRO") {
      return <span>Incluir Usuário <AddCircleOutlinedIcon style={{ color: "blue" }} /> </span>
    } else if (valor === "EDIT_USRO") {
      return <span>Alterar usuário <ModeEditOutlineOutlinedIcon style={{ color: "orange" }} /></span>
    } else if (valor === "DEL_USRO") {
      return <span>Excluir Usuário <DeleteForeverOutlinedIcon style={{ color: "red" }} /></span>
    } else if (valor === "LIST_USRO") {
      return <span>Listar Todos os Usuários <ListIcon style={{ color: "green" }} /></span>
    } else if (valor === "ADM_USRO") {
      return <span>Administrador Usuários </span>
    } else if (valor === "ADD_SGRA") {
      return <span>Incluir Seguradora <AddCircleOutlinedIcon style={{ color: "blue" }} /> </span>
    } else if (valor === "EDIT_SGRA") {
      return <span>Alterar Seguradora <ModeEditOutlineOutlinedIcon style={{ color: "orange" }} /></span>
    } else if (valor === "DEL_SGRA") {
      return <span>Excluir Seguradora <DeleteForeverOutlinedIcon style={{ color: "red" }} /></span>
    } else if (valor === "ADD_REGIAO") {
      return <span>Incluir Região <AddCircleOutlinedIcon style={{ color: "blue" }} /> </span>
    } else if (valor === "EDIT_REGIAO") {
      return <span>Alterar Região <ModeEditOutlineOutlinedIcon style={{ color: "orange" }} /></span>
    } else if (valor === "DEL_REGIAO") {
      return <span>Excluir Região <DeleteForeverOutlinedIcon style={{ color: "red" }} /></span>
    } else if (valor === "LIST_REGIAO") {
      return <span>Listar Região <ListIcon style={{ color: "green" }} /></span>
    } else if (valor === "ADD_JUSTIFICATIVA") {
      return <span>Incluir Justificativa do Item <AddCircleOutlinedIcon style={{ color: "blue" }} /> </span>
    } else if (valor === "EDIT_JUSTIFICATIVA") {
      return <span>Alterar Justificativa do Item <ModeEditOutlineOutlinedIcon style={{ color: "orange" }} /></span>
    } else if (valor === "DEL_JUSTIFICATIVA") {
      return <span>Excluir Justificativa do Item <DeleteForeverOutlinedIcon style={{ color: "red" }} /></span>
    } else if (valor === "LIST_JUSTIFICATIVA") {
      return <span>Listar Justificativa do Item <ListIcon style={{ color: "green" }} /></span>
    } else if (valor === "LIST_SACMONT") {
      return <span>Listar SAC Montadoras <ListIcon style={{ color: "green" }} /></span>
    } else if (valor === "EDIT_SACMONT") {
      return <span>Editar SAC Montadoras <ModeEditOutlineOutlinedIcon style={{ color: "orange" }} /></span>
    } else if (valor === "DEL_SACMONT") {
      return <span>Excluir SAC Montadoras <DeleteForeverOutlinedIcon style={{ color: "red" }} /></span>
    } else if (valor === "ADD_SACMONT") {
      return <span>Incluir SAC Montadoras <AddCircleOutlinedIcon style={{ color: "blue" }} /> </span>
    } else if (valor === "LIST_FORNECEDOR") {
      return <span>Listar Fornecedor <ListIcon style={{ color: "green" }} /></span>
    } else if (valor === "EDIT_FORNECEDOR") {
      return <span>Editar Fornecedor <ModeEditOutlineOutlinedIcon style={{ color: "orange" }} /></span>
    } else if (valor === "DEL_FORNECEDOR") {
      return <span>Excluir Fornecedor <DeleteForeverOutlinedIcon style={{ color: "red" }} /></span>
    } else if (valor === "ADD_FORNECEDOR") {
      return <span>Incluir Fornecedor <AddCircleOutlinedIcon style={{ color: "blue" }} /> </span>
    } else if (valor === "LIST_PARAMLE") {
      return <span>Listar Parametros de Leilão <ListIcon style={{ color: "green" }} /></span>
    } else if (valor === "EDIT_PARAMLE") {
      return <span>Editar Parametros de Leilão <ModeEditOutlineOutlinedIcon style={{ color: "orange" }} /></span>
    } else if (valor === "DEL_PARAMLE") {
      return <span>Excluir Parametros de Leilão <DeleteForeverOutlinedIcon style={{ color: "red" }} /></span>
    } else if (valor === "ADD_PARAMLE") {
      return <span>Incluir Parametros de Leilão <AddCircleOutlinedIcon style={{ color: "blue" }} /> </span>
    }else if (valor === "LIST_TIPOPECA") {
      return <span>Listar Tipo de Peças <ListIcon style={{ color: "green" }} /></span>
    } else if (valor === "EDIT_TIPOPECA") {
      return <span>Editar Tipo de Peças <ModeEditOutlineOutlinedIcon style={{ color: "orange" }} /></span>
    } else if (valor === "DEL_TIPOPECA") {
      return <span>Excluir Tipo de Peças <DeleteForeverOutlinedIcon style={{ color: "red" }} /></span>
    } else if (valor === "ADD_TIPOPECA") {
      return <span>Incluir Tipo de Peças <AddCircleOutlinedIcon style={{ color: "blue" }} /> </span>
    }else if (valor === "LIST_STIT") {
      return <span>Listar Status de Item <ListIcon style={{ color: "green" }} /></span>
    } else if (valor === "EDIT_STIT") {
      return <span>Editar Status de Item <ModeEditOutlineOutlinedIcon style={{ color: "orange" }} /></span>
    } else if (valor === "DEL_STIT") {
      return <span>Excluir Status de Item <DeleteForeverOutlinedIcon style={{ color: "red" }} /></span>
    } else if (valor === "ADD_STIT") {
      return <span>Incluir Status de Item <AddCircleOutlinedIcon style={{ color: "blue" }} /> </span>
    }

    else { return valor }

  }

  let gr = "";
  if(grMen === "PARAMLE"){gr = "Parametros de leilão"}
  else if(grMen ==="USUARIO" ){ gr = "Usuário"}
  else if(grMen ==="SEGURADORA" ){ gr = "Seguradoras"}
  else if(grMen ==="REGIAO" ){ gr = "Região"}
  else if(grMen ==="JUSTIFICATIVA" ){ gr = "Justificativa do Item"}
  else if(grMen ==="SACMONT" ){ gr = "Sac Montadora"}
  else if(grMen ==="TIPOPECA" ){ gr = "Tipo de peças"}
  else if(grMen ==="STATUSITEM" ){ gr = "Status de Item"}
  else if(grMen ==="GERAL" ){ gr = "Permitidos"}
  else if(grMen ==="FORNECEDOR" ){ gr = "Fornecedores"}
  else if(grMen ==="STATUSITEM" ){ gr = "Status Item"}





  const columns = ([
    { name: 'ACES_DESCRICAO', title: "ACESSO", 
    getCellValue: row => (alteraAcesso(row.ACES_DESCRICAO)), 
    },
    {
      name: 'ACESSOL', title: "ATIVO",
      getCellValue: row => ([row.TOTAL, row.ACES_CODIGO]),
    },
    ])

  const [defaultColumnWidths] = useState([
    { columnName: 'ACES_DESCRICAO', width: 400 },
    { columnName: 'ACESSOL', width: 200 },
  ]);

  const [filteringStateColumnExtensions] = useState([
    { columnName: 'ALTERACAO', filteringEnabled: false, editingEnabled: false },
  ]);


  const BotaoAcessos = ({ value }) => (
    <div>
      <FormGroup>
        <FormControlLabel onClick={(e) => cadastrarAcesso(idGa, value[1])} control={<Checkbox checked={value[0] === 1 ? true : false} />} />
        {/* <FormControlLabel disabled control={<Checkbox />} label="Disabled" /> */}
      </FormGroup>

      {/* <button  onClick={(e)=> cadastrarAcesso(idGa,value[1])}  className={value[0] === 1 ? "btn btn-outline-danger btnAcessoGr" : "btn btn-outline-primary btnAcessoGr"} >{  value[0] === 1 ? "DESATIVAR" : "ATIVAR"}</button> */}

    </div>
  )
  const BotaoAcessosProv = (props) => (
    <DataTypeProvider
      formatterComponent={BotaoAcessos}
      {...props}

    />
  )















  return (

    <div className="container-fluid " style={{ display: displayAcesso }} >
      <h3 id="titulos"> Controle de Acessos {gr} <br/>do Grupo de Acesso {grAce}</h3>
      <button style={{ marginBottom: "5px" }} className="btn btn-outline-primary btnAcessoGr" onClick={(e) => navigate("/gruposDeAcesso")} >VOLTAR</button>
      <div className="card  "    >
        <Paper>
          <Grid
            rows={rows}
            columns={columns}
            getRowId={getRowId}
          >

            <BotaoAcessosProv
              for={botaoAcessosL}
            />
            <EditingState
              columnExtensions={filteringStateColumnExtensions}

            // defaultEditingRowIds={}
            />
            <SortingState
              defaultSorting={[{ columnName: 'ACES_DESCRICAO', direction: 'asc' }]}
            />
            <FilteringState
              columnExtensions={filteringStateColumnExtensions}
              defaultFilters={[]} />


            <IntegratedFiltering />
            <IntegratedSorting />
            <Table />
            <TableColumnResizing defaultColumnWidths={defaultColumnWidths} />



            <TableHeaderRow
              showSortingControls
              contentComponent={TableComponentTitle}
            />
            <TableFilterRow />


          </Grid>
        </Paper>

      </div>




    </div>






  )

}

export default Acesso;



/*

 <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        
        <Typography id="modal-modal-title" variant="h6" component="h2" >
            Novo Grupo de Acesso
          </Typography><br/>
          
    
                  	
      <TextField onChange={(e)=> setGrupoAcesso((e.target.value).toUpperCase())} id="outlined-basic" label="Nome Grupo Acesso" variant="outlined"  /><br/>
                    	

                	
          
            <button className="btnL" style={{width : "33%", padding : "2%"}} onClick={cadastraGrupoAcesso} >SALVAR 💾</button>
       
               
        </Box>
        
      </Modal>

*/
