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


import { saveSac, getSacMontadorasID, deleteSacMontadorasID, } from "../../Service/sacMontadorasService";

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

let acessoGeral = false;

const SacMontadoras = () => {
  const { logout, nomeUser } = useContext(AuthContext);
  const token = localStorage.getItem("token");
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();
  const [acessoCad, setAcessoCad] = useState(false);
  const [displayEDIT, setDisplayEDIT] = useState("none");
  const [displayDEL, setDisplayDEL] = useState("none");
  const [displayADD, setDisplayADD] = useState("none");
  const listaSacMont = "LIST_SACMONT";
  const incluirSacMont = "ADD_SACMONT";
  const excluirSacMont = "DEL_SACMONT";
  const editarSacMont = "EDIT_SACMONT";

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

                setDisplayADD("");
                setDisplayDEL("");
                setDisplayEDIT("");

                listaSacMontadorasID();

              } else if (incluirSacMont === ac) {
                setDisplayADD("");
                setAcessoCad(true);
              } else if (listaSacMont === ac) {
                listaSacMontadorasID();
              } else if (excluirSacMont === ac) {
                setDisplayDEL("");
                setAcessoCad(true);
              } else if (editarSacMont === ac) {
                setDisplayEDIT("");
              }
            });
          }
        })
        .catch((err) => {
          console.error(err);

          window.alert("Erro ao buscar Usuário SAC!!");

        });
    };

    acessoMenuUser();
  }, []);



  const cadastraSacMontadoras = (lista) => {
    let dados = { lista, token, acessoGeral: acessoCad };
    if (displayADD ===""){

    saveSac(dados)
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

        listaSacMontadorasID();
      })
      .catch((err) => {
        console.error("Erro ao Cadastrar Dados SAC", err);
        window.alert("Erro ao cadastrar !!");
      });
    }
  };


  const deletarSacMontadoras = (idCont) => {
    let dados = {
      token, acessoGeral : acessoCad, idCont: parseInt(idCont),

    };
    if (displayDEL=== ""){
    deleteSacMontadorasID(dados)
      .then((res) => {
        if (res.data === "erroLogin") {
          alert("Sessão expirada, Favor efetuar um novo login !!");
          logout();
          window.location.reload();
        } else if (res.data === "semAcesso") {
          alert("Usuário sem permissão !!!");
          listaSacMontadorasID();
        } else if (res.data === "campoNulo") {
          alert("Preencha todos os Campos obrigatorios!!!");
        } else if (res.data === "erroSalvar") {
          alert("Erro a tentar excluir!!!");
        } else {
          window.alert("Cadastro excluído com sucesso !!");
          listaSacMontadorasID();
        }
      })
      .catch((err) => {
        console.error("Erro ao Excluir Cadastro ", err);

        window.alert("Erro ao Excluir !!!");

      });
    } else {listaSacMontadorasID()
           alert("Usuário sem permissão !!!");
    }
  };

  const listaSacMontadorasID = async () => {
    let dados = { token, acessoGeral };
    await getSacMontadorasID(dados)
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
        console.error("Erro ao Listar Cadastros SAC", err);
        window.alert("Erro ao Listar !!");
      });
  };

  const columns = [
    {
      name: "SCMN_MARCA",
      title: `MARCA *`,
      required: true,
    },
    {
      name: "SCMN_TELEFONE",

      title: `TELEFONE SAC  *`,

      required: true,
    },
    {
      name: "SCMN_EMAIL",
      title: `E-MAIL SAC *`,
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
      title="Excluir Cadastro SAC"
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
        title="Novo Cadastro SAC"
      >
        <AddCircleOutlinedIcon style={{ color: "blue" }} fontSize="large" />
      </IconButton>
    </div>
  );
  
  const EditButton = ({ onExecute }) => (
    <IconButton style={{display: displayEDIT}}
       onClick={onExecute} title="Alterar Cadastro SAC" size="large">
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
            ID_SAC_MONTADORAS: null,
            SCMN_MARCA: "",
            SCMN_TELEFONE: "",
            SCMN_EMAIL: "",
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
        if (!(changedRows[i].ID_SAC_MONTADORAS)) {
          cadastraSacMontadoras(changedRows[i]);

        }
      }

    }
    if (changed) {
      changedRows = rows.map((row) =>
        changed[row.id] ? { ...row, ...changed[row.id] } : row
      );
      for (let i = 0; i < rows.length; i++) {
        if (JSON.stringify(rows[i]) !== JSON.stringify(changedRows[i])) {


          if (changedRows[i].SCMN_MARCA === "") {

            window.alert("Favor Preencher campo Marca!");
          } else {
            cadastraSacMontadoras(changedRows[i]);
          }

        }

      }
    }
    if (deleted) {
      const deletedSet = new Set(deleted);
      changedRows = rows.filter((row) => deletedSet.has(row.id));

      let idCont = parseInt(changedRows.map(l => l.ID_SAC_MONTADORAS));
      deletarSacMontadoras(idCont);

      // setRows(changedRows);
    }
    setRows(changedRows);
  };
  return (
    <div className="container-fluid" >
      <h3 id="titulos">SAC Montadoras: </h3>
      { }
      <div className="container">
        <Paper>
          <Grid rows={rows} columns={columns}>
            <SortingState />
            <FilteringState
              defaultFilters={[{ columnName: "SCMN_MARCA", value: "" }]}
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

export default SacMontadoras;
