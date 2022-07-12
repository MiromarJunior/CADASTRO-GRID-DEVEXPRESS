/**
 * Lista de Usuários cadastrados no sistema,
 * Podemos cadastrar ou atualizar os usuárioso
 */

 import Paper from "@mui/material/Paper";
 import Input from "@mui/material/Input";
 import Select from "@mui/material/Select";
 import MenuItem from "@mui/material/MenuItem";
 
 import {
   DataTypeProvider,
   EditingState,
   FilteringState,
   IntegratedFiltering,
   IntegratedPaging,
   IntegratedSorting,
   PagingState,
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
   TableColumnReordering,
   DragDropProvider,
   PagingPanel,
 } from "@devexpress/dx-react-grid-material-ui";
 import { useContext, useEffect, useState } from "react";
 import { AuthContext } from "../../Autenticação/validacao";
 import {
   deleteSac,
   getSacMontadoras,
   saveSac,
 } from "../../Service/sacMontadorasService";
 
 import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
 import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";
 import AddCircleOutlinedIcon from "@mui/icons-material/AddCircleOutlined";
 import IconButton from "@mui/material/IconButton";
 import SaveIcon from "@mui/icons-material/Save";
 import CancelIcon from "@mui/icons-material/Cancel";
 import { cnpj, cpf } from "cpf-cnpj-validator";
 // import { getSacMontadoras } from "../../Service/sacMontadorasService";
 
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
 let acessoCAD = false;
 let acessoListUsu = false;
 let acessoADM = false;
 const ListarSacMontadoras = () => {
   const { logout, nomeUser } = useContext(AuthContext);
   const token = localStorage.getItem("token");
   const [rows, setRows] = useState([]);
   const [listaAcess, setListaAcess] = useState([""]);
   //  const [booleanColumns] = useState(['USRO_CATEGORIA']);
   //  const [columnsGrupoAcess] = useState(["GRUPO_ACE"])
   //  const [SenhaColumns] = useState(['SENHA']);
   //  const [formatCNPJ] = useState(["USRO_CNPJ_FORNECEDOR"]);
   //  const [formatCPF] = useState(["USRO_CPF"]);
   const [rowChanges, setRowChanges] = useState({});
   const [addedRows, setAddedRows] = useState([]);
   const [editingRowIds, getEditingRowIds] = useState([]);
   const [pageSizes] = useState([5, 10, 15, 20, 0]);
   const [acessoDEL, setAcessoDEL] = useState(false);
   const [displayEDIT, setDisplayEDIT] = useState("");
   const [displayDEL, setDisplayDEL] = useState("none");
   const [displayADD, setDisplayADD] = useState("none");
   const listaUsro = "LIST_USRO";
   const incluirUsro = "ADD_USRO";
   const excluirUsro = "DEL_USRO";
   const editarUsro = "EDIT_USRO";
   const admUsro = "ADM_USRO";
 
   //eslint-disable-next-line
   useEffect(() => {
     const acessoMenuUser = () => {
       let dados = { token, usuario: nomeUser() };
       getSacMontadoras(dados)
         .then((res) => {
           if (typeof res.data === "string") {
             window.alert("Erro ao buscar");
           } else {
             res.data.forEach((ac) => {
               if (process.env.REACT_APP_API_ACESSO_GERAL === ac) {
                 acessoGeral = true;
                 setDisplayADD("");
                 setDisplayDEL("");
                 setDisplayEDIT("");
                 listaCadastro();
               } else if (incluirUsro === ac) {
                 setDisplayADD("");
               } else if (excluirUsro === ac) {
                 setDisplayDEL("");
                 setAcessoDEL(true);
               } else if (editarUsro === ac) {
                 setDisplayEDIT("");
               } else if (listaUsro === ac) {
                 acessoListUsu = true;
                 listaCadastro();
               } else if (admUsro === ac) {
                 acessoADM = true;
                 listaCadastro();
               }
             });
           }
         })
         .catch((err) => {
           console.error(err);
           window.alert("Erro ao buscar Usuário !!");
         });
     };
     acessoMenuUser();
     //  listaGrupoAcesso();
     listaCadastro();
     //eslint-disable-next-line
   }, [logout, token, nomeUser]);
 
   const cadastroSac = (lista) => {
     let dados = { lista, token, acessoGeral, acessoCAD, usuLogado: nomeUser() };
 
     saveSac(dados)
       .then((res) => {
         if (res.data === "erroLogin") {
           window.alert("Sessão expirada, Favor efetuar um novo login !!");
           logout();
           window.location.reload();
         } else if (res.data === "semAcesso") {
           window.alert("Usuário sem permissão !!!");
         } else if (res.data === "sucesso") {
           window.alert("Usuário cadastrado com sucesso !!");
           listaCadastro();
         } else if (res.data === "sucessoU") {
           window.alert("Usuário atualizado com sucesso !!");
           listaCadastro();
         } else if (res.data === "duplicidade") {
           window.alert("Usuário ou CPF já cadastrados !\nFavor verificar!!");
         } else {
           window.alert(" erro ao tentar cadastrar usuário");
         }
       })
       .catch((err) => {
         console.error(err);
         window.alert("Erro ao cadastrar !!");
       });
   };
 
   const deletarSac = (idUsu, usuario) => {
     if (acessoDEL || acessoGeral) {
       let dados = {
         token,
         idUsu: parseInt(idUsu),
         usuario,
         acessoGeral,
         acessoDEL,
       };
       deleteSac(dados)
         .then((res) => {
           if (res.data === "erroLogin") {
             window.alert("Sessão expirada, Favor efetuar um novo login !!");
             logout();
             window.location.reload();
           } else if (res.data === "semAcesso") {
             window.alert("Usuário sem permissão !!!");
             listaCadastro();
           } else if (res.data === "sucesso") {
             window.alert("Usuário excluído com sucesso !!");
             listaCadastro();
           } else if (res.data === "erro") {
             window.alert(" erro ao tentar excluír usuário");
           } else if (res.data === "adm") {
             window.alert(" Não é possivel excluir usuário principal");
           } else {
             window.alert(" erro ao tentar excluír usuário");
           }
         })
         .catch((err) => {
           console.error(err);
           window.alert("Erro ao cadastrar !!");
         });
     }
   };
 
   const listaCadastro = async () => {
     let dados = { token, usuario: nomeUser(), acessoGeral, acessoListUsu };
     await getSacMontadoras(dados)
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
         console.error(err);
         window.alert("Erro ao Listar usuários !!");
       });
   };
 
   const [columns] = useState([
     { name: "SCMN_MARCA", title: `Marca *` },
     { name: "SCMN_TELEFONE", title: "Telefone SAC *" },
     { name: "SCMN_EMAIL", title: "E-mail SAC *" },
   ]);
   const [defaultColumnWidths] = useState([
     { columnName: "SCMN_MARCA", width: 180 },
     { columnName: "SCMN_TELEFONE", width: 180 },
     { columnName: "SCMN_EMAIL", width: 180 },
   ]);
   const [columnOrder, setColumnOrder] = useState([
     "SCMN_MARCA",
     "SCMN_TELEFONE",
     "SCMN_EMAIL",
   ]);
 
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
         if (!changedRows[i].ID_SAC_MONTADORAS) {
           if (
             changedRows[i].SCMN_MARCA === "" ||
             changedRows[i].SCMN_MARCA.length > 64
           ) {
             window.alert("Tamanho do campo Marca inválido");
           } else if (
             changedRows[i].SCMN_TELEFONE === "" ||
             changedRows[i].SCMN_TELEFONE.length > 11
           ) {
             window.alert("Tamanho do campo Telefone SAC inválido");
           } else if (
             changedRows[i].SCMN_EMAIL === "" ||
             changedRows[i].SCMN_EMAIL.length > 64
           ) {
             window.alert("Tamanho do campo E-mail inválido");
           } else {
             cadastroSac(changedRows[i]);
           }
         }
       }
     }
     if (changed) {
       changedRows = rows.map((row) =>
         changed[row.id] ? { ...row, ...changed[row.id] } : row
       );
       for (let i = 0; i < rows.length; i++) {
         if (JSON.stringify(rows[i]) !== JSON.stringify(changedRows[i])) {
           if (
             changedRows[i].SCMN_MARCA === "" ||
             changedRows[i].SCMN_MARCA.length > 64
           ) {
             window.alert("Tamanho do campo Usuário inválido");
           } else if (
             changedRows[i].SCMN_TELEFONE === "" ||
             changedRows[i].SCMN_TELEFONE.length > 11
           ) {
             window.alert("Tamanho do campo Telefone SAC inválido");
           } else if (
             changedRows[i].SCMN_EMAIL === "" ||
             changedRows[i].SCMN_EMAIL.length > 64
           ) {
             window.alert("Tamanho do campo E-mail SAC inválido");
           } else {
             cadastroSac(changedRows[i]);
           }
         }
       }
     }
     if (deleted) {
       const deletedSet = new Set(deleted);
       changedRows = rows.filter((row) => !deletedSet.has(row.id));
       let changedRowsDel = rows.filter((row) => deletedSet.has(row.id));
       let idUsu = parseInt(changedRowsDel.map((l) => l.ID_USUARIO));
       let usuario = changedRowsDel.map((l) => l.USRO_USUARIO);
       deletarSac(idUsu, usuario);
       // setRows(changedRows);
     }
     setRows(changedRows);
   };
 
   const DeleteButton = ({ onExecute }) => (
     <IconButton
       style={{ display: displayDEL }}
       onClick={() => {
         // eslint-disable-next-line
         if (window.confirm("Deseja excluir esse contato ?")) {
           onExecute();
         }
       }}
       title="Excluir Usuário"
       size="large"
     >
       <DeleteForeverOutlinedIcon style={{ color: "red" }} />
     </IconButton>
   );
 
   const AddButton = ({ onExecute }) => (
     <div style={{ textAlign: "center" }}>
       <IconButton
         size="large"
         style={{ display: displayADD }}
         color="primary"
         onClick={onExecute}
         title="Novo Usuário"
       >
         <AddCircleOutlinedIcon style={{ color: "blue" }} fontSize="large" />
       </IconButton>
     </div>
   );
 
   const EditButton = ({ onExecute }) => (
     <IconButton
       onClick={onExecute}
       title="Alterar Usuário"
       size="large"
       style={{ display: displayEDIT }}
     >
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
 
   return (
     <div className="container-fluid">
       <h3 id="titulos">📞SAC Montadoras</h3>
 
       <div className="card">
         <Paper>
           <Grid rows={rows} columns={columns}>
             {" "}
             <SortingState />
             <FilteringState
               defaultFilters={[{ columnName: "USRO_CATEGORIA", value: "" }]}
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
             <DragDropProvider />
             <PagingState defaultCurrentPage={0} defaultPageSize={5} />
             <IntegratedPaging />
             <Table
             //columnExtensions={tableColumnExtensions}
             // tableComponent={TableComponent}
             />
             <TableColumnResizing defaultColumnWidths={defaultColumnWidths} />
             <TableHeaderRow
               showSortingControls
               contentComponent={TableComponentTitle}
             />
             <PagingPanel pageSizes={pageSizes} />
             <TableColumnReordering
               order={columnOrder}
               onOrderChange={setColumnOrder}
             />
             <TableEditRow />
             {displayADD === "none" &&
             displayDEL === "none" &&
             displayEDIT === "none" ? (
               ""
             ) : (
               <TableEditColumn
                 showEditCommand
                 showDeleteCommand
                 showAddCommand={!addedRows.length}
                 commandComponent={Command}
               />
             )}
             <TableFilterRow />
           </Grid>
         </Paper>
       </div>
     </div>
   );
 };
 
 export default ListarSacMontadoras;
 
 /*
  
  
  // const [tableColumnExtensions] = useState([
  //   { columnName: 'USRO_CPF', align: 'right' },
  // ]);
  //<TableColumnVisibility
              defaultHiddenColumnNames={["GRUPO_ACE"]}
              
              />
  
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
 