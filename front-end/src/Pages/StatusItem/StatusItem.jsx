import Paper from "@mui/material/Paper";

import {
  DataTypeProvider,
  EditingState,
  FilteringState,
  IntegratedFiltering,
  IntegratedSorting,
  SortingState,
} from "@devexpress/dx-react-grid";

import {
  Grid,
  Table,
  TableHeaderRow,
  TableEditRow,
  TableEditColumn,
  TableFilterRow,
  TableColumnResizing,
} from "@devexpress/dx-react-grid-material-ui";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../Autenticação/validacao";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
import IconButton from "@mui/material/IconButton";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import MenuItem from "@mui/material/MenuItem";
import Input from "@mui/material/Input";
import Select from "@mui/material/Select";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";


import { saveStatusItem, getStatusItem, deleteStatusItem, } from "../../Service/statusItem";

import { getAcessoUserMenu } from "../../Service/usuarioService";
// import { validaDescricao } from "../../Service/utilServiceFrontEnd";


const TableComponentTitle = ({ style, ...restProps }) => (
  <TableHeaderRow.Content
    {...restProps}
    style={{
      color: "black",
      fontWeight: "bold",
      ...style,
    }}
  />
);

const StatusItemFormatter = ({ value }) => value ? value : "";

const StatusItemEditor = ({ value, onValueChange }) => (
    <Select
      input={<Input />}
      value={value}
      onChange={event => onValueChange(event.target.value)}
      style={{ width: '100%' }}
    >
    
      <MenuItem value="">
        
      </MenuItem>
      
      <MenuItem value="Seguradora">
        Seguradora
      </MenuItem>
      <MenuItem value="Mediadora">
        Mediadora
      </MenuItem>
      <MenuItem value="Audatex">
        Audatex
      </MenuItem>
      <MenuItem value="Cilia">
        Cilia
      </MenuItem>
    </Select>
  );
  
  const StatusItemProvider = props => (
 
    <DataTypeProvider
      formatterComponent={StatusItemFormatter}
      editorComponent={StatusItemEditor}
      {...props}
    /> 
  );
  


let acessoGeral = false;

const StatusItem = () => {
  const { logout, nomeUser } = useContext(AuthContext);
  const token = localStorage.getItem("token");
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();
  const [acessoCad, setAcessoCad] = useState(false);
  const [displayEDIT, setDisplayEDIT] = useState("none");
  const [displayDEL, setDisplayDEL] = useState("none");
  const [displayADD, setDisplayADD] = useState("none");
  const [booleanColumns] = useState(['STIT_RESPONSAVEL']);
  const listStatusItem = "LIST_STIT";
  const incluirStatusItem = "ADD_STIT";
  const excluirStatusItem = "DEL_STIT";
  const editarStatusItem = "EDIT_STIT";

  useEffect(() => {
    const acessoMenuUser = async () => {
      let dados = { token, usuario: nomeUser() };
      await getAcessoUserMenu(dados)
        .then((res) => {
          if (res.data === "erroLogin") {
            window.alert("Sessão expirada, Favor efetuar um novo login !!");
            logout();
            window.location.reload();
          } else if (res.data === "semAcesso") {
            window.alert("Usuário sem permissão !!!");
          } else {
            res.data.forEach((ac) => {
              if (process.env.REACT_APP_API_ACESSO_GERAL === ac) {
                acessoGeral = true;
                setAcessoCad(true);
                setDisplayADD("");
                setDisplayDEL("");
                setDisplayEDIT("");

                listaStatusItem();

              } else if (incluirStatusItem === ac) {
                setDisplayADD("");
                setAcessoCad(true);
              } else if (listStatusItem === ac) {
                listaStatusItem();
              } else if (excluirStatusItem === ac) {
                setDisplayDEL("");
                setAcessoCad(true);
              } else if (editarStatusItem === ac) {
                setDisplayEDIT("");
              }
            });
          }
        })
        .catch((err) => {
          console.error(err);

          window.alert("Erro ao buscar Usuário!!");

        });
    };

    acessoMenuUser();
  }, []);



  const cadastraStatusItem = (lista) => {
    let dados = { lista, token, acessoGeral: acessoCad };
    if (displayADD ===""){

    saveStatusItem(dados)
      .then((res) => {
        if (res.data === "erroLogin") {
          alert("Sessão expirada, Favor efetuar um novo login !!");
          logout();
          window.location.reload();
        } else if (res.data === "semAcesso") {
          alert("Usuário sem permissão !!!");
        } else if (res.data === "campoNulo") {
          alert("Preencha todos os Campos obrigatorios!!!");
        } else if (res.data === "erroSalvar") {
          alert("Erro a tentar salvar ou alterar!!!");

        } else if (res.data === "sucesso") {
          alert("Cadastrado com sucesso !")

        }

        listaStatusItem();
      })
      .catch((err) => {
        console.error("Erro ao Cadastrar Status do Item", err);
        window.alert("Erro ao cadastrar !!");
      });
    }
  };


  const deletarStatusItem = (idCont) => {
    let dados = {
      token, acessoGeral : acessoCad, idCont: parseInt(idCont),

    };
    if (displayDEL=== ""){
    deleteStatusItem(dados)
      .then((res) => {
        if (res.data === "erroLogin") {
          alert("Sessão expirada, Favor efetuar um novo login !!");
          logout();
          window.location.reload();
        } else if (res.data === "semAcesso") {
          alert("Usuário sem permissão !!!");
          listaStatusItem();
        } else if (res.data === "campoNulo") {
          alert("Preencha todos os Campos obrigatorios!!!");
        } else if (res.data === "erroSalvar") {
          alert("Erro a tentar excluir!!!");
        } else {
          window.alert("Cadastro excluído com sucesso !!");
          listaStatusItem();
        }
      })
      .catch((err) => {
        console.error("Erro ao Excluir Cadastro ", err);

        window.alert("Erro ao Excluir !!!");

      });
    } else {listaStatusItem()
           alert("Usuário sem permissão !!!");
    }
  };

  const listaStatusItem = async () => {
    let dados = { token, acessoGeral };
    await getStatusItem(dados)
      .then((res) => {
        if (res.data === "erroLogin") {
          window.alert("Sessão expirada, Favor efetuar um novo login !!");
          logout();
          window.location.reload();
        } else if (res.data === "semAcesso") {
          window.alert("Usuário sem permissão !!!");
          navigate("/home");
        } else {
          res.data.forEach((item, index) => (item.id = index));
          return setRows(res.data);
        }
      })
      .catch((err) => {
        console.error("Erro ao Listar Cadastros SAC", err);
        window.alert("Erro ao Listar !!");
      });
  };

  const columns = [
    {
      name: "STIT_CODIGO",
      title: `Codigo *`,
      required: true,
    },
    {
      name: "STIT_DESCRICAO",

      title: `Descrição  *`,

      required: true,
    },
    {
      name: "STIT_RESPONSAVEL",
      title: `Responsável *`,
      required: true,
    },
    {
        name: "STIT_CONCEITO",
        title: `Conceito *`,
        required: true,
      },
  ];
  
  const DeleteButton = ({ onExecute }) => (
    <IconButton style={{display: displayDEL}}
      onClick={() => {
        // eslint-disable-next-line
        if (window.confirm("Deseja excluir este Cadastro ?")) {
          onExecute();
        }
      }}
      title="Excluir Cadastro"
      size="large"
    >
      <DeleteForeverOutlinedIcon style={{ color: "red" }} />
    </IconButton>
  );
  
  const AddButton = ({ onExecute }) => (
    <div style={{ textAlign: "center" }}>
      <IconButton style={{display: displayADD}}
        size="large"
        color="primary"
        onClick={onExecute}
        title="Novo Cadastro "
      >
        <AddCircleOutlinedIcon style={{ color: "blue" }} fontSize="large" />
      </IconButton>
    </div>
  );
  
  const EditButton = ({ onExecute }) => (
    <IconButton style={{display: displayEDIT}}
       onClick={onExecute} title="Alterar Cadastro " size="large">
      <ModeEditOutlineOutlinedIcon style={{ color: "orange" }} />
    </IconButton>
  );
  
  const CommitButton = ({ onExecute }) => (
    <IconButton onClick={onExecute} title="Salvar alterações" size="large">
      <SaveIcon />
    </IconButton>
  );
  
  const CancelButton = ({ onExecute }) => (
    <IconButton
      color="secondary"
      onClick={onExecute}
      title="Cancelar alterações"
      size="large"
    >
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
    return <CommandButton onExecute={onExecute} />;
  };
  
  const [rowChanges, setRowChanges] = useState({});
  const [addedRows, setAddedRows] = useState([]);
  const [editingRowIds, getEditingRowIds] = useState([]);

  const changeAddedRows = (value) =>
    setAddedRows(
      value.map((row) =>
        Object.keys(row).length
          ? row
          : {
            ID_STATUS_ITEM: null,
            STIT_CODIGO: "",
            STIT_DESCRICAO: "",
            STIT_RESPONSAVEL: "",
            STIT_CONCEITO: "",
          }
      )
    );
  const commitChanges = ({ added, changed, deleted }) => {
    let changedRows;
    if (added) {
      const startingAddedId =
        rows.length > 0 ? rows[rows.length - 1].id + 1 : 0;
      changedRows = [
        ...rows,
        ...added.map((row, index) => ({
          id: startingAddedId + index,
          ...row,
        })),
      ];

      for (let i = 0; i < changedRows.length; i++) {
        if (!(changedRows[i].ID_STATUS_ITEM)) {
            cadastraStatusItem(changedRows[i]);

        }
      }

    }
    if (changed) {
      changedRows = rows.map((row) =>
        changed[row.id] ? { ...row, ...changed[row.id] } : row
      );
      for (let i = 0; i < rows.length; i++) {
        if (JSON.stringify(rows[i]) !== JSON.stringify(changedRows[i])) {


          if (changedRows[i].STIT_CODIGO === "") {

            window.alert("Favor Preencher campo Codigo!");
          } else {
            cadastraStatusItem(changedRows[i]);
          }

        }

      }
    }
    if (deleted) {
      const deletedSet = new Set(deleted);
      changedRows = rows.filter((row) => deletedSet.has(row.id));

      let idCont = parseInt(changedRows.map(l => l.ID_STATUS_ITEM));
      deletarStatusItem(idCont);

      // setRows(changedRows);
    }
    setRows(changedRows);
  };
  return (
    <div className="container-fluid" >
      <h3 id="titulos">Status Item </h3>
      { }
      <div className="container-fluid">
        <Paper>
          <Grid rows={rows} columns={columns}>
            <SortingState />
            <FilteringState
              defaultFilters={[{ columnName: "STIT_CODIGO", value: "" }]}
            />
            <StatusItemProvider
              for={booleanColumns}
            />
            <IntegratedFiltering />
            <IntegratedSorting />
            <EditingState
              editingRowIds={editingRowIds}
              onEditingRowIdsChange={getEditingRowIds}
              rowChanges={rowChanges}
              onRowChangesChange={setRowChanges}
              addedRows={addedRows}
              onAddedRowsChange={changeAddedRows}
              onCommitChanges={commitChanges}
            // defaultEditingRowIds={}
            />

            <Table />

            <TableHeaderRow
              showSortingControls
              contentComponent={TableComponentTitle}
            />
            <TableEditRow />
            <TableEditColumn
              showEditCommand
              showDeleteCommand
              showAddCommand={!addedRows.length}
              commandComponent={Command}
            />
            <TableFilterRow />
          </Grid>
        </Paper>
      </div>
    </div>
  );
};

export default StatusItem;
