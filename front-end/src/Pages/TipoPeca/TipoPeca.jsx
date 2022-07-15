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


import { saveTipoPeca, getTipoPeca, deleteTipoPeca, } from "../../Service/tipoPeca";

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
const TipoPecaFormatter = ({ value }) => value ? value : "";

const TipoPecaEditor = ({ value, onValueChange }) => (
    <Select
      input={<Input />}
      value={value}
      onChange={event => onValueChange(event.target.value)}
      style={{ width: '100%' }}
    >
    
      <MenuItem value="">
        
      </MenuItem>
      
      <MenuItem value="Liberado">
        Liberado
      </MenuItem>
      {/* <MenuItem value="Cancelado">
        Cancelado
      </MenuItem>
      <MenuItem value="Inativo">
        Inativo
      </MenuItem>
      <MenuItem value="Defeito">
        Defeito
      </MenuItem> */}
    </Select>
  );
  
  const TipoPecaProvider = props => (
 
    <DataTypeProvider
      formatterComponent={TipoPecaFormatter}
      editorComponent={TipoPecaEditor}
      {...props}
    /> 
  );
  
  
let acessoGeral = false;

const TipoPeca = () => {
  const { logout, nomeUser } = useContext(AuthContext);
  const token = localStorage.getItem("token");
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();
  const [acessoCad, setAcessoCad] = useState(false);
  const [displayEDIT, setDisplayEDIT] = useState("none");
  const [displayDEL, setDisplayDEL] = useState("none");
  const [displayADD, setDisplayADD] = useState("none");
  const [booleanColumns] = useState(['TPPC_CLASSIFICACAO_PECAS']);
  const listaTipoPec = "LIST_TIPOPECA";
  const incluirTipoPec = "ADD_TIPOPECA";
  const excluirTipoPec = "DEL_TIPOPECA";
  const editarTipoPec = "EDIT_TIPOPECA";

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

                listaTipoPeca();

              } else if (incluirTipoPec === ac) {
                setDisplayADD("");
                setAcessoCad(true);
              } else if (listaTipoPec === ac) {
                listaTipoPeca();
              } else if (excluirTipoPec === ac) {
                setDisplayDEL("");
                setAcessoCad(true);
              } else if (editarTipoPec === ac) {
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



  const cadastrarTipoPeca = (lista) => {
    let dados = { lista, token, acessoGeral: acessoCad };
    if (displayADD ===""){

    saveTipoPeca(dados)
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

        listaTipoPeca();
      })
      .catch((err) => {
        console.error("Erro ao Cadastrar dados Tipo de Peças", err);
        window.alert("Erro ao cadastrar !!");
      });
    }
  };


  const deletarTipoPecas = (idCont) => {
    let dados = {
      token, acessoGeral : acessoCad, idCont: parseInt(idCont),

    };
    if (displayDEL=== ""){
    deleteTipoPeca(dados)
      .then((res) => {
        if (res.data === "erroLogin") {
          alert("Sessão expirada, Favor efetuar um novo login !!");
          logout();
          window.location.reload();
        } else if (res.data === "semAcesso") {
          alert("Usuário sem permissão !!!");
          listaTipoPeca();
        } else if (res.data === "campoNulo") {
          alert("Preencha todos os Campos obrigatorios!!!");
        } else if (res.data === "erroSalvar") {
          alert("Erro a tentar excluir!!!");
        } else {
          window.alert("Cadastro excluído com sucesso !!");
          listaTipoPeca();
        }
      })
      .catch((err) => {
        console.error("Erro ao Excluir Cadastro ", err);

        window.alert("Erro ao Excluir !!!");

      });
    } else {listaTipoPeca()
           alert("Usuário sem permissão !!!");
    }
  };

  const listaTipoPeca = async () => {
    let dados = { token, acessoGeral };
    await getTipoPeca(dados)
      .then((res) => {
        if (res.data === "erroLogin") {
          window.alert("Sessão expirada, Favor efetuar um novo login !!");
          logout();
          window.location.reload();
        } else if (res.data === "semAcesso") {
          window.alert("Usuário sem permissão !!!");
        } else {
          res.data.forEach((item, index) => (item.id = index));
          return setRows(res.data);
        }
      })
      .catch((err) => {
        console.error("Erro ao Listar Tipos de Peças", err);
        window.alert("Erro ao Listar !!");
      });
  };

  const columns = [
    {
      name: "TPPC_DESCRICAO",
      title: `Descrição: *`,
      required: true,
    },
    {
      name: "TPPC_CLASSIFICACAO_PECAS",

      title: `Classificação nas Peças`,

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
      title="Excluir Cadastro Tipo de Peça"
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
        title="Novo Cadastro"
      >
        <AddCircleOutlinedIcon style={{ color: "blue" }} fontSize="large" />
      </IconButton>
    </div>
  );
  
  const EditButton = ({ onExecute }) => (
    <IconButton style={{display: displayEDIT}}
       onClick={onExecute} title="Alterar Cadastro" size="large">
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
            ID_TIPO_PECA: null,
            TPPC_DESCRICAO: "",
            TPPC_CLASSIFICACAO_PECAS: "",
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
        if (!(changedRows[i].ID_TIPO_PECA)) {
            cadastrarTipoPeca(changedRows[i]);

        }
      }

    }
    if (changed) {
      changedRows = rows.map((row) =>
        changed[row.id] ? { ...row, ...changed[row.id] } : row
      );
      for (let i = 0; i < rows.length; i++) {
        if (JSON.stringify(rows[i]) !== JSON.stringify(changedRows[i])) {


          if (changedRows[i].TPPC_CLASSIFICACAO_PECAS === "" ){
              window.alert("Favor Definir a Classificação nas Peças!");
          } else {
            cadastrarTipoPeca(changedRows[i]);
          }

        }

      }
    }
    if (deleted) {
      const deletedSet = new Set(deleted);
      changedRows = rows.filter((row) => deletedSet.has(row.id));

      let idCont = parseInt(changedRows.map(l => l.ID_TIPO_PECA));
      deletarTipoPecas(idCont);

      // setRows(changedRows);
    }
    setRows(changedRows);
  };
  return (
    <div className="container-fluid" >
      <h3 id="titulos">Tipo Peça: </h3>
      { }
      <div className="container">
        <Paper>
          <Grid rows={rows} columns={columns}>
            <SortingState />
            <FilteringState
              defaultFilters={[{ columnName: "TPPC_CLASSIFICACAO_PECAS", value: "" }]}
            />
            <TipoPecaProvider
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

export default TipoPeca;
