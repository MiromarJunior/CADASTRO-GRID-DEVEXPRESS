/**
 * Lista de Usuários cadastrados no sistema,
 * Podemos cadastrar ou atualizar os usuárioso
 */

import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Input from '@mui/material/Input';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import {
  DataTypeProvider,
  EditingState,
  FilteringState,
  IntegratedFiltering,
  IntegratedSorting,
  SortingState,
} from '@devexpress/dx-react-grid';


import {
  Grid,
  Table,
  TableHeaderRow,
  TableEditRow,
  TableEditColumn,
  TableFilterRow,
  TableColumnResizing,
  TableColumnReordering,
  DragDropProvider,
} from "@devexpress/dx-react-grid-material-ui";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Autenticação/validacao";
import { deleteUsuario, getGrupoAcesso, getUsuarios, saveUsuario } from "../../Service/usuarioService";

import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import IconButton from '@mui/material/IconButton';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { cnpj, cpf } from 'cpf-cnpj-validator';

const CategoriaFormatter = ({ value }) => <Chip label={value} />;

const CategoriaEditor = ({ value, onValueChange }) => (
  <Select
    input={<Input />}
    value={value}
    onChange={event => onValueChange(event.target.value)}
    style={{ width: '100%' }}
  >
  
    <MenuItem value="">
      
    </MenuItem>
    
    <MenuItem value="Gestor">
      Gestor
    </MenuItem>
    <MenuItem value="Oficina">
      Oficina
    </MenuItem>
    <MenuItem value="Vendedor">
      Vendedor
    </MenuItem>
    <MenuItem value="Regulador">
      Regulador
    </MenuItem>
  </Select>
);

const CategoriaProvider = props => (
  <DataTypeProvider
    formatterComponent={CategoriaFormatter}
    editorComponent={CategoriaEditor}
    {...props}
  />
);

const SenhaFormatter = ({ value }) => <Chip label={"****"}  />;

const SenhaEditor = ({ value, onValueChange }) => (
  <Input
    input={<Input />}
    value={value}
    type={"password"}
    onChange={event => onValueChange(event.target.value)}

  >

  </Input>
);

const SenhaProvider = props => (
  <DataTypeProvider
    formatterComponent={SenhaFormatter}
    editorComponent={SenhaEditor}
    {...props}
  />
);


const DeleteButton = ({ onExecute }) => (
  <IconButton
    onClick={() => {
      // eslint-disable-next-line
      if (window.confirm('Deseja excluir esse contato ?')) {
        onExecute();
      }
    }}
    title="Excluir contato"
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
      title="Novo Contato"
    >
      <AddCircleOutlinedIcon style={{ color: "blue" }} fontSize="large" />
    </IconButton>
  </div>
);


const EditButton = ({ onExecute }) => (
  <IconButton onClick={onExecute} title="Alterar Contato" size="large" >
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


// const TableComponent = ({ ...restProps }) => (
//   <Table.Table
//     {...restProps}
//   />
// );

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

const FormatCnpj = ({ value }) => (
  cnpj.format(value)

)
const FormatCnpjProv = (props) => (
  <DataTypeProvider
    formatterComponent={FormatCnpj}
    {...props}

  />
)

const FormatCPF = ({ value }) => (

  cpf.format(value)
)
const FormatCPFProv = (props) => (
  <DataTypeProvider
    formatterComponent={FormatCPF}
    {...props}

  />
)



const ListarUsuario = () => {


  const { logout } = useContext(AuthContext);
  const token = localStorage.getItem("token");
  const [rows, setRows] = useState([]);
  const [listaAcess, setListaAcess] = useState([""]);
  const [booleanColumns] = useState(['USRO_CATEGORIA']);
  const [columnsGrupoAcess] = useState(["GRUPO_ACE"])
  const [SenhaColumns] = useState(['SENHA']);
  const [formatCNPJ] = useState(["USRO_CNPJ_FORNECEDOR"]);
  const [formatCPF] = useState(["USRO_CPF"]);
  const [rowChanges, setRowChanges] = useState({});
  const [addedRows, setAddedRows] = useState([]);
  const [editingRowIds, getEditingRowIds] = useState([]);


  useEffect(() => {
    listaUsuarios();
    listaGrupoAcesso();
  }, []);

  const cadastraUsuario = (lista) => {
    let dados = { lista, token };
  

    saveUsuario(dados)
      .then((res) => {
        if (res.data === "erroLogin") {
          window.alert("Sessão expirada, Favor efetuar um novo login !!");
          logout();
          window.location.reload();
        }
        else if (res.data === "semAcesso") {
          window.alert("Usuário sem permissão !!!");

        } else if (res.data === "sucesso") {
          window.alert("Usuário cadastrado com sucesso !!");
          listaUsuarios();
        } else if (res.data === "sucessoU") {
          window.alert("Usuário atualizado com sucesso !!");
          listaUsuarios();
        }

        else if (res.data === "duplicidade") {
          window.alert("Usuário ou CPF já cadastrados !\nFavor verificar!!");

        } else {
          window.alert(" erro ao tentar cadastrar usuário");
        }

      })
      .catch((err) => {
        console.error(err);
        window.alert("Erro ao cadastrar !!")
      })
  }

  const deletarUsuario = (idUsu) => {

    let dados = { token, idUsu: parseInt(idUsu) };
    deleteUsuario(dados)
      .then((res) => {
        if (res.data === "erroLogin") {
          window.alert("Sessão expirada, Favor efetuar um novo login !!");
          logout();
          window.location.reload();
        }
        else if (res.data === "semAcesso") {
          window.alert("Usuário sem permissão !!!");

        } else if (res.data === "sucesso") {
          window.alert("Usuário excluído com sucesso !!");
          listaUsuarios();
        } else if(res.data === "erro") {
          window.alert(" erro ao tentar excluír usuário");
        }
        else  {
          window.alert(" erro ao tentar excluír usuário");
        }
      })
      .catch((err) => {
        console.error(err);
        window.alert("Erro ao cadastrar !!")
      })
  }

  const listaUsuarios = async () => {
    let dados = { token };
    await getUsuarios(dados)
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

  const listaGrupoAcesso = async ()=>{
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
          
          return setListaAcess(res.data);
        }


      })
      .catch((err) => {
        console.error(err);
        window.alert("Erro ao cadastrar !!")
      })

  }


  const GrupoAcessoFormatter = ({ value }) => <Chip label={value ? value : "Sem Acesso"} />;

const GrupoAcessoEditor = ({ value, onValueChange }) => (
  <Select
    input={<Input />}
    value={value ? value : ""}
    onChange={event => onValueChange(event.target.value)}
    style={{ width: '100%' }}
  >
    <MenuItem value="null" >      
      </MenuItem>
    {listaAcess.map((l, index)=>
    <MenuItem key={index} value={l.GRAC_DESCRICAO ? l.GRAC_DESCRICAO : "Sem Acesso"}>
      {l.GRAC_DESCRICAO}
    
    </MenuItem>    
    )}      
  
  </Select>
);

const GrupoAcessoProvider = props => (
  <DataTypeProvider
    formatterComponent={GrupoAcessoFormatter}
    editorComponent={GrupoAcessoEditor}
    {...props}
  />
);


  

  const [columns] = useState([
    { name: 'USRO_USUARIO', title: `USUARIO` },
    { name: 'USRO_NOME', title: "NOME" },
    { name: 'SENHA', title: "SENHA" },
    { name: 'USRO_CATEGORIA', title: "CATEGORIA" },
    { name: 'USRO_CNPJ_FORNECEDOR', title: "CNPJ FORNECEDOR" },
    { name: 'USRO_CPF', title: "CPF" },
    { name: 'GRUPO_ACE', title: "GRUPO DE ACESSOS" },

  ])
  const [defaultColumnWidths] = useState([
    { columnName: 'USRO_USUARIO', width: 180 },
    { columnName: 'USRO_NOME', width: 180 },
    { columnName: 'SENHA', width: 180 },
    { columnName: 'USRO_CATEGORIA', width: 130 },
    { columnName: 'USRO_CNPJ_FORNECEDOR', width: 180 },
    { columnName: 'USRO_CPF', width: 130 },
    { columnName: 'GRUPO_ACE', width: 240 },
 
  ]);
  const [columnOrder, setColumnOrder] = useState(['USRO_USUARIO', 'USRO_NOME', 
  'SENHA', 'USRO_CATEGORIA','USRO_CNPJ_FORNECEDOR','USRO_CPF','GRUPO_ACE',]);

  const changeAddedRows = value => setAddedRows(
    value.map(row => (Object.keys(row).length ? row : {
      ID_USUARIO: null,
      USRO_USUARIO: "",
      USRO_NOME: "",
      SENHA: "",
      USRO_CATEGORIA: "",
      USRO_CNPJ_FORNECEDOR: "",
      USRO_CPF: "",

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
        if (!(changedRows[i].ID_USUARIO)) {

          if (changedRows[i].USRO_USUARIO === "" || changedRows[i].USRO_USUARIO.length > 64) {
            window.alert("Tamanho do campo Usuário inválido");
          } else if (changedRows[i].USRO_NOME === "" || changedRows[i].USRO_NOME.length > 128) {
            window.alert("Tamanho do campo Nome inválido");
          }
          else if (changedRows[i].SENHA === "" || changedRows[i].SENHA.length > 64) {
            window.alert("Tamanho do campo Senha inválido");
          } else if (changedRows[i].USRO_CATEGORIA === "" || changedRows[i].USRO_CATEGORIA.length > 32) {
            window.alert("Tamanho do campo Categoria inválido");
          } else if (!cnpj.isValid(changedRows[i].USRO_CNPJ_FORNECEDOR)) {
            window.alert("CNPJ Fornecedor inválido");
          } else if (!cpf.isValid(changedRows[i].USRO_CPF)) {
            window.alert("CPF inválido");
          } else {
            cadastraUsuario(changedRows[i])
          }

        }
      }

    }
    if (changed) {
      changedRows = rows.map(row => (changed[row.id] ? { ...row, ...changed[row.id] } : row));
      for (let i = 0; i < rows.length; i++) {
        if (JSON.stringify(rows[i]) !== JSON.stringify(changedRows[i])) {

          if (changedRows[i].USRO_USUARIO === "" || changedRows[i].USRO_USUARIO.length > 64) {
            window.alert("Tamanho do campo Usuário inválido");
          } else if (changedRows[i].USRO_NOME === "" || changedRows[i].USRO_NOME.length > 128) {
            window.alert("Tamanho do campo Nome inválido");
          }
          else if (changedRows[i].SENHA === "") {
            window.alert("Tamanho do campo Senha inválido");
          } else if (changedRows[i].USRO_CATEGORIA === "" || changedRows[i].USRO_CATEGORIA.length > 32) {
            window.alert("Tamanho do campo Categoria inválido");
          } else if (!cnpj.isValid(changedRows[i].USRO_CNPJ_FORNECEDOR)) {
            window.alert("CNPJ Fornecedor inválido");
          } else if (!cpf.isValid(changedRows[i].USRO_CPF)) {
            window.alert("CPF inválido");
          } else {
            cadastraUsuario(changedRows[i])
          }
        }
      }


    }
    if (deleted) {
      const deletedSet = new Set(deleted);
      changedRows = rows.filter(row => !deletedSet.has(row.id));
      let changedRowsDel = rows.filter(row => deletedSet.has(row.id));
      let idUsu = parseInt(changedRowsDel.map(l => l.ID_USUARIO));
      deletarUsuario(idUsu);
      // setRows(changedRows);
    }
    setRows(changedRows);
  };
  const [editingStateColumnExtensions] = useState([
  //  { columnName: 'GRUPO_ACE', editingEnabled: false },
  ]);


  return (
    <div className='container-fluid'>
      <h3 id='titulos'>🙋‍♂️​Usuários🙋‍♀️​</h3>

      <div className="card">
        <Paper>
          <Grid
            rows={rows}
            columns={columns}

          >
            <CategoriaProvider
              for={booleanColumns}
            />
            <GrupoAcessoProvider
            for={columnsGrupoAcess}
            />
            <FormatCnpjProv
              for={formatCNPJ}
            />
            <FormatCPFProv
              for={formatCPF}
            />
            <SenhaProvider
              for={SenhaColumns}
            />
            <SortingState />
            <FilteringState 
            defaultFilters={[{ columnName : "USRO_CATEGORIA", value : ""}]} />
            <IntegratedFiltering />
            <IntegratedSorting />

            <EditingState
             columnExtensions={editingStateColumnExtensions}
              editingRowIds={editingRowIds}
              onEditingRowIdsChange={getEditingRowIds}
              rowChanges={rowChanges}
              onRowChangesChange={setRowChanges}
              addedRows={addedRows}
              onAddedRowsChange={changeAddedRows}
              onCommitChanges={commitChanges}
            // defaultEditingRowIds={}
            />
            <DragDropProvider />
            <Table
              //columnExtensions={tableColumnExtensions}
              // tableComponent={TableComponent}

            />
          <TableColumnResizing defaultColumnWidths={defaultColumnWidths} />
            <TableHeaderRow
              showSortingControls
              contentComponent={TableComponentTitle}


            />
            <TableColumnReordering
          order={columnOrder}
          onOrderChange={setColumnOrder}
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

export default ListarUsuario;


/*


// const [tableColumnExtensions] = useState([
//   { columnName: 'USRO_CPF', align: 'right' },
// ]);


// const TableComponentDA = ({ ...restProps }) => (
//   <Table.TableBody
//   {...restProps}
//  className="abaTable1"
//   />
// );

// const TableComponentD = ({ value, style, ...restProps }) => (
//   <Table.Row
//     {...restProps}
//     style={{
//       backgroundColor: 'red',
//       ...style,
//     }}
//   ></Table.Row>
// )


*/