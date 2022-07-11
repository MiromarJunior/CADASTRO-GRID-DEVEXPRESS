import Paper from '@mui/material/Paper';

import "./SubGruposItem.css";
import {
  DataTypeProvider,
  EditingState,
  FilteringState,
  IntegratedFiltering,
  IntegratedSorting,
  SortingState
} from '@devexpress/dx-react-grid';


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
import { useNavigate,useParams } from "react-router-dom";
import { AuthContext } from "../../Autenticação/validacao";
import { deleteSubGrupoItem, getSubGrupoItem, saveSubGrupoItem, getGrupoItem } from "../../Service/subgrupoitemService";

import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import IconButton from '@mui/material/IconButton';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import MenuItem from '@mui/material/MenuItem';
import Input from '@mui/material/Input';
import Select from '@mui/material/Select';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';



const DeleteButton = ({ onExecute }) => (
  <IconButton
    onClick={() => {
      // eslint-disable-next-line
      if (window.confirm('Deseja excluir este SubGrupo Item ?')) {
        onExecute();
      }
    }}
    title="Excluir SubGrupo Item"
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
      title="Novo SubGrupo de Item"
    >
      <AddCircleOutlinedIcon style={{ color: "blue" }} fontSize="large" />
    </IconButton>
  </div>
);


const EditButton = ({ onExecute }) => (
  <IconButton onClick={onExecute} title="Alterar SubGrupo" size="large" >
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


const ForneceFormatter = ({ value }) => value ? value : "";

const ForneceEditor = ({ value, onValueChange }) => (
  <Select
    defaultValue=""
    input={<Input />}
    value={value}
    onChange={event => onValueChange(event.target.value)}
    style={{ width: '100%' }} >

    <MenuItem value=""></MenuItem>
    <MenuItem value="Genuína">Genuína</MenuItem>
    <MenuItem value="Original">Original</MenuItem>

  </Select>
);

const ForneceProvider = props => (
 
  <DataTypeProvider
    formatterComponent={ForneceFormatter}
    editorComponent={ForneceEditor}
    {...props}
  /> 
);

const ListarSubGrupoItem = () => {

  const { logout } = useContext(AuthContext);
  const token = localStorage.getItem("token");
  const [rows, setRows] = useState([]);
  const [descricaoGrupo, setdescricaoGrupo] = useState([]);
  const { idGrupo } = useParams();
  const [forneceColumn] = useState(['SBGR_FORNECE_GENUINA_ORIGINAL']);
  const navigate = useNavigate();



  useEffect(() => {
    buscaGrupoItem();
     
    listaSubGruposItem();
    // eslint-disable-next-line
  }, [logout, token, idGrupo, descricaoGrupo]);

  const cadastraSubGrupoItem = (lista) => {
    let dados = { lista, token, idGrupo };

    saveSubGrupoItem(dados)
      .then((res) => {
        if (res.data === "erroLogin") {
          window.alert("Sessão expirada, Favor efetuar um novo login !!");
          logout();
          window.location.reload();
        }
        else if (res.data === "semAcesso") {
          window.alert("Usuário sem permissão !!!");

        } else if (res.data === "sucesso") {
          window.alert("Grupo Item cadastrado com sucesso !!");
          listaSubGruposItem();

        } else if (res.data === "duplicidade") {
          window.alert("Grupo de Item já cadastrado !\nFavor verificar!!");

        } else {
          window.alert(" erro ao tentar cadastrar usuário");
        }
      })
      .catch((err) => {
        console.error(err);
        window.alert("Erro ao cadastrar !!")
      })
  }

  const deletarSubGrupoItem = (idSubGrupoItem) => {

    let dados = { token, idSubGrupoItem: parseInt(idSubGrupoItem) };
    deleteSubGrupoItem(dados)
      .then((res) => {
        if (res.data === "erroLogin") {
          window.alert("Sessão expirada, Favor efetuar um novo login !!");
          logout();
          window.location.reload();
        }
        else if (res.data === "semAcesso") {
          window.alert("Usuário sem permissão !!!");

        } else if (res.data === "sucesso") {

          window.alert("SubGrupo Item excluído com sucesso !!");
          
        } else {
          window.alert(" erro ao tentar excluír SubGrupo");
        }
        listaSubGruposItem();
      })
      .catch((err) => {
        console.error(err);
        window.alert("Erro ao Excluir !!")
      })
  }


  const listaSubGruposItem = async () => {
    let dados = { token, idGrupo };
    await getSubGrupoItem(dados)
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

  const buscaGrupoItem = async () => {
    let dados = { token, idGrupo };
    await getGrupoItem(dados)
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
          return setdescricaoGrupo(res.data);
        }
      })
      .catch((err) => {
        console.error(err);
        window.alert("Erro ao cadastrar !!")
      })
  }

  const columns = [
    { name: 'SBGR_DESCRICAO', title: `DESCRIÇÃO DO SUBGRUPO`, required: true },
    { name: 'SBGR_FORNECE_GENUINA_ORIGINAL', title: `FORNECE`, required: true },
  ]

  const [defaultColumnWidths] = useState([
    { columnName: 'SBGR_DESCRICAO', width: 450 },
    { columnName: "SBGR_FORNECE_GENUINA_ORIGINAL", width: 150 }
  ]);
  const [rowChanges, setRowChanges] = useState({});
  const [addedRows, setAddedRows] = useState([]);
  const [editingRowIds, getEditingRowIds] = useState([]);


  const changeAddedRows = value => setAddedRows(
    value.map(row => (Object.keys(row).length ? row : {
      ID_SUBGRUPO_ITEM: null,
      SBGR_DESCRICAO: "",
      SBGR_FORNECE_GENUINA_ORIGINAL: "",
      ID_GRUPO_ITEM: ""
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
        if (!(changedRows[i].ID_SUBGRUPO_ITEM)) {


          if (changedRows[i].SBGR_DESCRICAO === "") {
            window.alert("Favor Preencher campo Descrição do SubGrupo");
          } else {
            cadastraSubGrupoItem(changedRows[i])
          }
          //cadastraUsuario(changedRows[i]);
        }
      }
      //setRows(changedRows);     
    }
    if (changed) {
      changedRows = rows.map(row => (changed[row.id] ? { ...row, ...changed[row.id] } : row));
      for (let i = 0; i < rows.length; i++) {
        if (JSON.stringify(rows[i]) !== JSON.stringify(changedRows[i])) {

          if (changedRows[i].SBGR_DESCRICAO === "") {
            window.alert("Favor Preencher campo Descrição do Grupo");
          } else {
            cadastraSubGrupoItem(changedRows[i])
          }
        }
      }
    }
    if (deleted) {
      const deletedSet = new Set(deleted);
      changedRows = rows.filter(row => deletedSet.has(row.id));
      deletarSubGrupoItem(changedRows.map(l => l.ID_SUBGRUPO_ITEM));
      // setRows(changedRows);
    }
    setRows(changedRows);
  };
  return (
    <div className='container-fluid'>
      <h3 id='titulos'>SubGrupo: {descricaoGrupo.map(l => l.GRPO_DESCRICAO) }</h3>
      <ArrowBackIcon titleAccess="Voltar" style={{ color: "green" }} className="margemRight" onClick={(e) => navigate(`/ListarGrupoItem`)} type="button"  />        
      <div className="container">
      
        <Paper>
        
          <Grid
            rows={rows}
            columns={columns}
          >
             <ForneceProvider
              for={forneceColumn}
            />  
            <SortingState
            />
            <FilteringState
              defaultFilters={[{ columnName: "SBGR_DESCRICAO", value: "" }]} />
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
            <TableColumnResizing defaultColumnWidths={defaultColumnWidths} />
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

  )

}

export default ListarSubGrupoItem;