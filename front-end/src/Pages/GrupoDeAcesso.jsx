
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import IconButton from '@mui/material/IconButton';
import { AuthContext } from "../Autenticação/validacao";
import { Paper } from "@mui/material";
import { deleteGrupoAcesso, getAcessoUserMenu, getGrupoAcesso, saveGrupoAcesso } from "../Service/usuarioService";
import { Grid, PagingPanel, Table, TableColumnResizing, TableEditColumn, TableEditRow, TableFilterRow, TableHeaderRow } from "@devexpress/dx-react-grid-material-ui";
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { DataTypeProvider, EditingState, FilteringState, IntegratedFiltering, IntegratedPaging, IntegratedSorting, PagingState, SortingState } from "@devexpress/dx-react-grid";





// const style = {
//   position: 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: 400,
//   bgcolor: 'background.paper',
//   border: '2px solid #000',
//   boxShadow: 24,
//   p: 4,
// };


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


const DeleteButton = ({ onExecute }) => (
  <IconButton
    onClick={() => {
      // eslint-disable-next-line
      if (window.confirm('Deseja excluir esse grupo de Acesso ?')) {
        onExecute();
      }
    }}
    title="Excluir Grupo de Acesso"
    size="large"
  >
    <DeleteForeverOutlinedIcon style={{ color: "red" }} />
  </IconButton>
);

const AddButton = ({ onExecute }) => (
  <div style={{ textAlign: 'center' }}>
    <IconButton size="large"
      color="primary"
      onClick={onExecute}
      title="Novo Grupo de Acesso"
    >
      <AddCircleOutlinedIcon style={{ color: "blue" }} fontSize="large" />
    </IconButton>
  </div>
);


const EditButton = ({ onExecute }) => (
  <IconButton onClick={onExecute} title="Alterar Nome Grupo de Acesso" size="large" >
    <ModeEditOutlineOutlinedIcon style={{ color: "orange" }} />
  </IconButton>
);

const CommitButton = ({ onExecute }) => (
  <IconButton onClick={onExecute} title="Salvar alterações" size="large">
    <SaveIcon />
  </IconButton>
);

const CancelButton = ({ onExecute }) => (
  <IconButton color="secondary" onClick={onExecute} title="Cancelar alterações" size="large">
    <CancelIcon />
  </IconButton>
);
const commandComponents = {

  add: AddButton,
  edit: EditButton,
  delete: DeleteButton,
  commit: CommitButton,
  cancel: CancelButton,

};

const Command = ({ id, onExecute }) => {
  const CommandButton = commandComponents[id];
  return (
    <CommandButton
      onExecute={onExecute}
    />
  );
};













const getRowId = row => row.id;
const GrupoDeAcesso = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { logout, nomeUser } = useContext(AuthContext);
  const [rows, setRows] = useState([]);
  const [rowChanges, setRowChanges] = useState({});
  const [addedRows, setAddedRows] = useState([]);
  const [editingRowIds, getEditingRowIds] = useState([]);
  const [botaoAcessoColumn] = useState(["ACESSOUSU"]);
  const [botaoAcessoSGRA] = useState(["ACESSOSGRA"]);
  const [botaoAcessoGeral] = useState(["ACESSOGERAL"]);
  const [botaoAcessoRegiao] = useState(["ACESSOREGIAO"]);
  const [botaoAcessoJust] = useState(["ACESSOJUSTIFICATIVA"]);
  const [botaoAcessoSac] = useState(["ACESSOSAC"]);
  
  
  const [pageSizes] = useState([5, 10, 15, 0]);

  const [acessoGeral, setAcessoGeral] = useState(false);
  const [displayAcesso, setDisplayAcesso] = useState("none");

  const cadastraGrupoAcesso = (lista) => {

    let dados = { lista, token, acessoGeral };


    saveGrupoAcesso(dados)
      .then((res) => {
        if (res.data === "erroLogin") {
          window.alert("Sessão expirada, Favor efetuar um novo login !!");
          logout();
          window.location.reload();
        }
        else if (res.data === "semAcesso") {
          window.alert("Usuário sem permissão !!!");

        } else if (res.data === "sucesso") {
          window.alert("Grupo de Acesso cadastrado com sucesso !!");
          listaGrupoAcesso();

        } else if (res.data === "sucessoU") {
          window.alert("Grupo de Acesso atualizado com sucesso !!");
          listaGrupoAcesso();

        }

        else if (res.data === "duplicidade") {
          window.alert("Não é possivel cadastrar um grupo já cadastrado !\nFavor verificar!!");
          listaGrupoAcesso();

        }
        else {
          window.alert(" erro ao tentar cadastrar Grupo de Acesso");
        }

      })
      .catch((err) => {
        console.error(err);
        window.alert("Erro ao cadastrar grupo de Acesso!!")
      })
  }
  const listaGrupoAcesso = async () => {
    let dados = { token };
    await getGrupoAcesso(dados)
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
        window.alert("Erro ao listar grupo de acesso !!")
      })

  }

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
                listaGrupoAcesso();


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

  const excluirGrupoAcesso = (idGa) => {

    let dados = { idGa, token, acessoGeral };


    deleteGrupoAcesso(dados)
      .then((res) => {
        if (res.data === "erroLogin") {
          window.alert("Sessão expirada, Favor efetuar um novo login !!");
          logout();
          window.location.reload();
        }
        else if (res.data === "semAcesso") {
          window.alert("Usuário sem permissão !!!");

        } else if (res.data === "sucesso") {
          // window.alert("Grupo de Acesso cadastrado com sucesso !!");   
          listaGrupoAcesso();

        } else if (res.data === "usuVinc") {
          window.alert("Não foi possivel excluir Grupo, pois existem usuário(s) vinculado(s) !!");
          listaGrupoAcesso();

        }


        else {
          window.alert(" erro ao tentar excluir Grupo de Acesso");
          listaGrupoAcesso();
        }

      })
      .catch((err) => {
        console.error(err);
        window.alert("Erro ao cadastrar grupo de Acesso!!")
      })
  }


  const [columns] = useState([

    { name: 'GRAC_DESCRICAO', title: "GRUPO" },
    {
      name: 'ACESSOUSU', title: "USUÁRIO",
      getCellValue: row => (row.GRAC_CODIGO ? [row.GRAC_CODIGO, row.GRAC_DESCRICAO] : undefined),
    },
    {
      name: "ACESSOSGRA", title: "SEGURADORAS",
      getCellValue: row => (row.GRAC_CODIGO ? [row.GRAC_CODIGO, row.GRAC_DESCRICAO] : undefined),
    },

    {
      name: "ACESSOREGIAO", title: "ACESSO REGIAO",
      getCellValue: row => (row.GRAC_CODIGO ? [row.GRAC_CODIGO, row.GRAC_DESCRICAO] : undefined),
    },
    {
      name: "ACESSOJUSTIFICATIVA", title: "ACESSO JUST. ITEM",
      getCellValue: row => (row.GRAC_CODIGO ? [row.GRAC_CODIGO, row.GRAC_DESCRICAO] : undefined),
    },
    {
      name: "ACESSOSAC", title: "ACESSO SAC ",
      getCellValue: row => (row.GRAC_CODIGO ? [row.GRAC_CODIGO, row.GRAC_DESCRICAO] : undefined),
    },



    {
      name: "ACESSOGERAL", title: "ACESSO GERAL",
      getCellValue: row => (row.GRAC_CODIGO ? [row.GRAC_CODIGO, row.GRAC_DESCRICAO] : undefined),
    },
   



  ])


  const [defaultColumnWidths] = useState([
    { columnName: 'GRAC_DESCRICAO', width: 200 },
    { columnName: 'ACESSOUSU', width: 110 },
    { columnName: 'ACESSOSGRA', width: 150 },
    { columnName: 'ACESSOGERAL', width: 150 },
    { columnName: 'ACESSOREGIAO', width: 150 },
    { columnName: 'ACESSOSAC', width: 150 },
    { columnName: 'ACESSOJUSTIFICATIVA', width: 180 },

  ])


  const changeAddedRows = value => setAddedRows(
    value.map(row => (Object.keys(row).length ? row : {
      GRAC_CODIGO: null,
      GRAC_DESCRICAO: "",
      STATUS: "",


    })),
  );

  const commitChanges = ({ added, changed, deleted }) => {

    let changedRows;
    if (added) {

      const startingAddedId = rows.length > 0 ? rows[rows.length - 1].id + 1 : 0;
      changedRows = [
        ...rows,
        ...added.map((row, index) => ({
          id: startingAddedId + index,
          ...row,
        })),
      ];


      for (let i = 0; i < changedRows.length; i++) {
        if (!(changedRows[i].GRAC_CODIGO)) {

          if (changedRows[i].GRAC_DESCRICAO === "" || changedRows[i].GRAC_DESCRICAO.length > 60) {
            window.alert("Tamanho do campo inválido");

          } else {
            cadastraGrupoAcesso(changedRows[i])
          }

        }
      }

    }

    if (changed) {
      changedRows = rows.map(row => (changed[row.id] ? { ...row, ...changed[row.id] } : row));
      for (let i = 0; i < rows.length; i++) {
        if (JSON.stringify(rows[i]) !== JSON.stringify(changedRows[i])) {

          if (changedRows[i].GRAC_DESCRICAO === "" || changedRows[i].GRAC_DESCRICAO.length > 60) {
            window.alert("Tamanho do campo inválido");

          } else {
            cadastraGrupoAcesso(changedRows[i])
          }
        }
      }



    }
    if (deleted) {
      const deletedSet = new Set(deleted);
      changedRows = rows.filter(row => !deletedSet.has(row.id));
      let changedRowsDel = rows.filter(row => deletedSet.has(row.id));
      let idGa = parseInt(changedRowsDel.map(l => l.GRAC_CODIGO));
      excluirGrupoAcesso(idGa);
      setRows(changedRows);
    }
    setRows(changedRows);

  }
  const [filteringStateColumnExtensions] = useState([
    { columnName: 'ACESSOUSU', filteringEnabled: false, editingEnabled: false },
  ]);

  const BotaoEditor = () => " ";
  const BotaoAcesso = ({ value }) => (
    <div>
      <button style={{ fontSize: 12 }} className="btn btn-outline-primary" onClick={(e) => navigate(`/acessos/${value[0]}/${value[1]}/USUARIO`)}>USUÁRIO</button>
    </div>


  )
  const BotaoAcessoProv = (props) => (
    <DataTypeProvider
      formatterComponent={BotaoAcesso}
      editorComponent={BotaoEditor}
      {...props}

    />
  )

  const BotaoAcessoSGRA = ({ value }) => (
    <div>
      <button style={{ fontSize: 12 }} className="btn btn-outline-primary" onClick={(e) => navigate(`/acessos/${value[0]}/${value[1]}/SEGURADORA`)}>SEGURADORAS</button>

    </div>


  )
  const BotaoAcessoSGRAProv = (props) => (
    <DataTypeProvider
      formatterComponent={BotaoAcessoSGRA}
      editorComponent={BotaoEditor}
      {...props}

    />
  )


  const BotaoAcessoGeral = ({ value }) => (
    <div>
      <button style={{ fontSize: 12 }} className="btn btn-outline-secondary" onClick={(e) => navigate(`/acessos/${value[0]}/${value[1]}/GERAL`)}>ACESSOS</button>

    </div>

  )
  const BotaoAcessoGeralProv = (props) => (
    <DataTypeProvider
      formatterComponent={BotaoAcessoGeral}
      editorComponent={BotaoEditor}
      {...props}

    />
  )

  const BotaoAcessoRegiao = ({ value }) => (
    <div>
      <button style={{ fontSize: 12 }} className="btn btn-outline-primary" onClick={(e) => navigate(`/acessos/${value[0]}/${value[1]}/REGIAO`)}>REGIÃO</button>

    </div>

  )
  const BotaoAcessoRegiaoProv = (props) => (
    <DataTypeProvider
      formatterComponent={BotaoAcessoRegiao}
      editorComponent={BotaoEditor}
      {...props}

    />
  )
  const BotaoAcessoJust = ({ value }) => (
    <div>
      <button style={{ fontSize: 12 }} className="btn btn-outline-primary" onClick={(e) => navigate(`/acessos/${value[0]}/${value[1]}/JUSTIFICATIVA`)}>JUST. ITEM</button>

    </div>

  )
  const BotaoAcessoJustProv = (props) => (
    <DataTypeProvider
      formatterComponent={BotaoAcessoJust}
      editorComponent={BotaoEditor}
      {...props}

    />
  )
  const BotaoAcessoSac = ({ value }) => (
    <div>
      <button style={{ fontSize: 12 }} className="btn btn-outline-primary" onClick={(e) => navigate(`/acessos/${value[0]}/${value[1]}/SACMONT`)}>SAC MONTADORA</button>

    </div>

  )
  const BotaoAcessoSacProv = (props) => (
    <DataTypeProvider
      formatterComponent={BotaoAcessoSac}
      editorComponent={BotaoEditor}
      {...props}

    />
  )


  


  return (
    <div className="container-fluid">
      <h3 id="titulos">{acessoGeral ? "Grupos de Acesso" : "Usuário sem permissão"} </h3>

      <div className="card " style={{ display: displayAcesso }}>
        <Paper>
          <Grid
            rows={rows}
            columns={columns}
            getRowId={getRowId}
          >
            <BotaoAcessoProv
              for={botaoAcessoColumn}
            />
            <BotaoAcessoSGRAProv
              for={botaoAcessoSGRA}
            />
            <BotaoAcessoGeralProv
              for={botaoAcessoGeral}
            />
            <BotaoAcessoRegiaoProv
              for={botaoAcessoRegiao}
            />
            <BotaoAcessoJustProv
              for={botaoAcessoJust}
            />
            <BotaoAcessoSacProv
              for={botaoAcessoSac}
            />



             <FilteringState
          
          />
         <IntegratedFiltering />
            <PagingState
              defaultCurrentPage={0}
              defaultPageSize={5}
            />
            <IntegratedPaging />




            <EditingState
              columnExtensions={filteringStateColumnExtensions}
              editingRowIds={editingRowIds}
              onEditingRowIdsChange={getEditingRowIds}
              rowChanges={rowChanges}
              onRowChangesChange={setRowChanges}
              addedRows={addedRows}
              onAddedRowsChange={changeAddedRows}
              onCommitChanges={commitChanges}
            // defaultEditingRowIds={}
            />
            <SortingState />           
            <IntegratedSorting />
            <Table />
            <TableEditRow />
            <TableEditColumn
              showEditCommand
              showDeleteCommand
              //showAddCommand
              showAddCommand={!addedRows.length}
              commandComponent={Command}
            />
            <TableColumnResizing defaultColumnWidths={defaultColumnWidths} />
            <TableHeaderRow
              showSortingControls
              contentComponent={TableComponentTitle}
            />
            <TableFilterRow />
            <PagingPanel
              pageSizes={pageSizes}
            />
           



          </Grid>
        </Paper>

      </div>




    </div>






  )

}

export default GrupoDeAcesso;



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