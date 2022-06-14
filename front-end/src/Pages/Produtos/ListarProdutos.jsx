import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {useNavigate } from "react-router-dom";
import apiProdutosService, { updateListaProd } from "../../Service/produtoService";
import { AgGridReact } from 'ag-grid-react';
import { criando, formataValorString, valorBR, valorLiquido } from "../../Service/utilServiceFrontEnd";
import { AuthContext } from "../../Autenticação/validacao";
import { EditingState } from '@devexpress/dx-react-grid';
import {
    Grid,
    Table,
    TableHeaderRow,
    TableEditRow,
    TableEditColumn,
  } from '@devexpress/dx-react-grid-bootstrap4';



  const getRowId = row => row.id;
let rowImmutableStore = [];
function ListarProdutos() {
    const [rows, setRows] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const { logout } = useContext(AuthContext);
    //const [desconto, setdesconto] = useState([]);
    const gridRef = useRef();



    const ButtonDelete = p => {
        const deleteP = () => deletarProduto(p.data.PRDT_ID);
        return (<button onClick={deleteP}>DELETE</button>)
    }
    // const CorBotao = p => {
    //     return (<div className="corFont">{p.value}</div>)
    // }

    // const InputData = p => {
    //     return (<input value={desconto} onChange={(e) => setdesconto(e.target.value)} />)
    // }




    // const deletarProduto = (id) => {
    //     let dados = { id, token };
    //     if (window.confirm("deseja excluir o item ?")) {
    //         apiProdutosService.deleteProduto(dados)
    //             .then((res) => {
    //                 if (res.data === "erroLogin") {
    //                     window.alert("Sessão expirada, Favor efetuar um novo login");
    //                     logout();
    //                 } else {
    //                     alert(res.data);
    //                     window.location.reload();
    //                 }
    //             })
    //             .catch((res) => {
    //                 console.log(res);
    //             })
    //     }

    // };

    const deletarProduto = ()=>{
        const dadosSelecionados = gridRef.current.api.getSelectedNodes();
        dadosSelecionados.map(
            node => node.data.id);
            let id = [];
        dadosSelecionados.forEach((l)=>{
            id.push(l.data.PRDT_ID)
        })
        let dados = { id, token };
        if (window.confirm("deseja excluir o item ?")) {
                    apiProdutosService.deleteProduto(dados)
                        .then((res) => {
                            if (res.data === "erroLogin") {
                                window.alert("Sessão expirada, Favor efetuar um novo login");
                                logout();
                            } else {
                                alert(res.data);
                                window.location.reload();
                            }
                        })
                        .catch((res) => {
                            console.log(res);
                        })
                }
        // rowImmutableStore = rowImmutableStore.filter(
        //     linhas =>idSelecionados.indexOf(linhas.id) <0);
        // setRowData(rowImmutableStore);
    }

  const CorFundo =()=>{
      return  {backgroundColor : '#DCDCDC', margin : "1px"};
  }
    const [columns] = useState([

       { name: 'PRDT_ID', title: "ID", editingEnabled: false },
        { name: 'PRDT_DESCRICAO', title: "DESCRIÇÃO",
        checkboxSelection: true,
        headerCheckboxSelection: true, },

        { name: 'PRDT_CODIGO', title: "CÓDIGO" },
        
        {
            name: 'PRDT_VALOR', headerName: "VALOR", pinned: " right",
            getCellValue: row =>valorBR(row.PRDT_VALOR)
              
         
        },
        { name: 'PRDT_DT_VALIDADE', headerName: "DATA VALIDADE" },
        {
            name: 'PRDT_PERC_DESCONTO', headerName: " % DESCONTO",
          valueGetter : p =>{
              if(p.data.PRDT_PERC_DESCONTO === null ||p.data.PRDT_PERC_DESCONTO  === undefined || !p.data.PRDT_ID){
                  return 0 +"%"
              }else if( typeof(p.data.PRDT_PERC_DESCONTO)=== "string"){
                  return formataValorString(p.data.PRDT_PERC_DESCONTO)
              }
              
              else {

                  return p.data.PRDT_PERC_DESCONTO + "%"
              }

          }
          
            
            
        },
        {
            name: 'PRDT_VALOR_LIQUIDO', headerName: " VALOR LIQUIDO",editable : false, cellStyle : CorFundo,
            
            valueGetter: p => {
                if(!p.data.PRDT_ID){
                    return 0
                }else if( typeof(p.data.PRDT_PERC_DESCONTO)=== "string"){
                        return  valorBR(valorLiquido(p.data.PRDT_VALOR,formataValorString(p.data.PRDT_PERC_DESCONTO)));
                    }else{
                        return  valorBR(valorLiquido(p.data.PRDT_VALOR,p.data.PRDT_PERC_DESCONTO));

                    }              
            
               
            }
           
      },

     

      
        { name: 'EXCLUIR', headerName: "EXCLUIR", cellRenderer: ButtonDelete, editable: false },

    ]);
   
    //const getRowId = useCallback((params) => params.data.id, []);

    const adicionar = (() => {       
        const novoCampo  = criando(rowImmutableStore.length);       
        rowImmutableStore = [novoCampo,...rowImmutableStore];     
      return  setRows(rowImmutableStore);   

    });

    // const defaultColDef = useMemo(() => ({
    //     sortable: true,
    //     editable: true,
    //     resizable: true,
    //     filter: true,
    //     filterParams : {
    //         buttons : ["apply", "clear","cancel","reset"]

    //     },
    //     rowSelection: "multiple",
       
       

       
    // }), []);



    useEffect(() => {
        buscarProdutos();
    }, []);



    const buscarProdutos = ()=> {
        //  setdataN(new Date());
        let dados = { token };
        apiProdutosService.getProdutos(dados)
            .then((res) => {
                if (res.data === "erroLogin") {
                    window.alert("Sessão expirada, Favor efetuar um novo login");
                 return   logout();
                } else {                   
                    (res.data).forEach((item, index) => (item.id = index));
                    rowImmutableStore = (res.data);
                  return  setRows(rowImmutableStore);

                }

            })
            .catch((res) => {
              return  console.log(res);
            })
    };


    const updateProdutos = () => {
        let dados = { lista: rows, token };       
        updateListaProd(dados)
            .then((res) => {
                if (res.data === "erroLogin") {
                    window.alert("Sessão expirada, Favor efetuar um novo login");
                    logout();
                } else {
                    alert(res.data)
                    window.location.reload();
                }

            })
            .catch((err) => {
                console.error("erro ao ataulizar", err)
            })
    }



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
        }
        if (changed) {
          changedRows = rows.map(row => (changed[row.id] ? { ...row, ...changed[row.id] } : row));
        }
        if (deleted) {
            // rows.map((l)=>{
               
            //     console.log(l.PRDT_ID)
            // })
         const deletedSet = new Set(deleted);
          changedRows = rows.filter(row => !deletedSet.has(row.id)  );
         // !deletedSet.has(row.id)
         
        }
        setRows(changedRows);
      };
    
    
    

    return (
        <div>

            <h1>Listar Produtos</h1>

            <div className="centralizar">
                <button onClick={() => navigate("/home")}  > HOME</button>
             <button type='button' onClick={deletarProduto}>EXCLUIR SELECIONADOS</button> 

                <button onClick={(e) => adicionar(e)}  > NOVO PRODUTO </button>

                {/* <button onClick={()=>navigate("/cadastrarProdutos/0")}  > CADASTRAR NOVO PRODUTO</button> */}

                <button onClick={(e) => updateProdutos(e)}  > SALVAR ALTERAÇÕES</button>
                <button onClick={(e) => logout(e)}  > SAIR</button>
            </div>


            <div className="card">
      <Grid
        rows={rows}
        columns={columns}
        getRowId={getRowId}
      >
        <EditingState
          onCommitChanges={commitChanges}
        />
        <Table />
        <TableHeaderRow />
        <TableEditRow />
        <TableEditColumn
          showAddCommand
          showEditCommand
          showDeleteCommand
        />
      </Grid>
    </div>








            {/* <div id="myGrid" className="ag-theme-alpine" style={{ width: "100%", height: 400}}>
                <AgGridReact
                    ref={gridRef}
                    rowData={rowData}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    getRowId={getRowId}
                    onCellEditRequest={true}
                    animateRows={true} // Optional - set to 'true' to have rows animate when sorted
                    rowSelection='multiple' // Options - allows click selection of rows
                    // onCellClicked={cellClickedListener} // Optional - registering for Grid Event
                    pagination={true}
                    enableRangeSelection={true}
                    paginationPageSize={5}
                    editType={'fullRow'}
                   

                />

            </div> */}


        </div>

    )

}

export default ListarProdutos;



/** 
 * 
 * 
 * 
 *    {
            field: 'PRDT_PERC_DESCONTO', headerName: " % DESCONTO",
            
            
        },
        {
            field: 'PRDT_VALOR_LIQUIDO', headerName: " VALOR LIQUIDO",
            
            valueGetter: p => {
             return   valorLiquido(p.data.PRDT_VALOR,p.data.PRDT_PERC_DESCONTO)
               
            }
           
      },
 * 
 * // const formNumber  = Intl.NumberFormat("pt-BR", {
// style : "currency",
// currency : "BRL",
// minimumFractionDigits: 2
// })
const onButtonClick = (data) => {
        return gridRef.current.exportDataAsCsv(data);
    }
    const onBtExport = useCallback(() => {
        console.log("ola")
        gridRef.current.api.exportDataAsCsv();
    }, []);



 * 
 * 
 *  // const adicionar = () => {    
    //     newData.push({
    //         id: rowData.length + 1,
    //         PRDT_DESCRICAO: '',
    //         PRDT_CODIGO: "",
    //         PRDT_VALOR: 0,
    //         PRDT_DT_VALIDADE: 'dd/mm/yyyy',
    //     })
    //     newData.concat(newData);
    //     let lista = newData.concat(rowImmutableStore);
    //     setRowData(lista);
    //     return lista;

    // }



//     function criar (){
// console.log(getRowId());
//        let newData ={
//             id : getRowId +1,        
//             PRDT_DESCRICAO: '',
//             PRDT_CODIGO: "",
//             PRDT_VALOR: 0,
//             PRDT_DT_VALIDADE: 'dd/mm/yyyy',
//         }
       

// return newData

//     }
 *    // const getRowId = useCallback((params) => params.data.id, []);
    // const onCellEditRequest = useCallback(
    //     (e)=>{
    //         const data = e.data;
    //         const field = e.colDef.field;
    //         const newValue = e.newValue;
    //         const newItem = {...data};
    //         newItem[field] = e.newValue;
           
    //         console.log('onCellEditRequest, updating ' + field + ' to ' + newValue);
    //         rowImmutableStore = rowImmutableStore.map((oldItem)=>oldItem.id === newItem.id ? newItem : oldItem);
    //         setRowData(rowImmutableStore);
    //     },
    //     [rowImmutableStore]
    // );

    // const cellClickedListener = useCallback(e=>{       
    //     console.log("celulaSelecionada",e.data.PRDT_VALOR);
    // },[]);

 * 

        // const adicionar = useCallback((addIndex) => {
        //     const newItems = [
        //         addRow(),
                

              
        //     ];
         
        // },[rowData]);
 
 * 
 * 
 * 
 * 
// function adicionar(e){
//     e.preventDefault();
//     rowImmutableStore.push(
//         {
//             PRDT_DESCRICAO: "",
//             PRDT_CODIGO: "",
//             PRDT_VALOR: "",
//             PRDT_DT_VALIDADE: "",
//             PRDT_ID: "",   
                         
            
        
//         },
//       setRowData(rowImmutableStore)

//     )
  
   
//    // console.log(rowData);
    

// }
// let newCount = 1;

// const onCellEditRequest = useCallback(
//     (e)=>{
//         const data = e.data;
//         const field = e.colDef.field;
//         const newValue = e.newValue;
//         const newItem = {...data};
//         newItem[field] = e.newValue;
       
//         console.log('onCellEditRequest, updating ' + field + ' to ' + newValue);
//         rowImmutableStore = rowImmutableStore.map((oldItem)=>oldItem.id === newItem.id ? newItem : oldItem);
//         setRowData(rowImmutableStore);
//     },
//     [rowImmutableStore]
// );

   


// const adicionar = () => {

//   const newData = {
//     PRDT_ID: 'Toyota ' + newCount,
//     PRDT_DESCRICAO: 'Celica ' + newCount,
//     PRDT_CODIGO: 35000 + newCount * 17,
//     PRDT_VALOR: 'Headless',
//     PRDT_DT_VALIDADE: 'Little',
  
//   };
//   newCount++;
 
//   return setRowData(rowImmutableStore.push(newData));
//   [rowImmutableStore]
// };












 * const adicionar = useCallback(
        (e)=>{
            const newData =[ {
                PRDT_ID: newCount,
                PRDT_DESCRICAO: '0 ' + newCount,
                PRDT_CODIGO: 35000 + newCount * 17,
                PRDT_VALOR: 'Headless',
                PRDT_DT_VALIDADE: 'Little',
              
              }];
              newCount++;
            let lista  = rowImmutableStore.concat(newData);
              console.log(lista)
             
              return setRowData(lista);
           
        },
        [rowImmutableStore]
    );
 * 
 * 
 * 
 * 
 * 
 * <div className="centralizar tableLista" >
         <table>
         <tbody>
                 <tr style={{backgroundColor : "silver"}} >
                     <th>DESCRIÇÃO</th>
                     <th>CÓDIGO</th>
                     <th>VALOR</th>
                     <th>DATA VENCIMENTO</th>
                     <th>ALTERAÇÃO</th>
                     <th>EXCLUIR</th>

                 </tr>
             </tbody>

             <tbody>         
                      { listaProdutos.map((a)=>
                 <tr key={a.PRDT_ID}>
                     <th>{a.PRDT_DESCRICAO}</th>
                     <th>{a.PRDT_CODIGO}</th>
                     <th className="alinharDir" >{(a.PRDT_VALOR).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}</th>
                     <th>            
                         {apiProdutosService.dataFormatadaListar(a.PRDT_DT_VALIDADE)}
                     </th>


                     <th>
                         <button onClick={()=>navigate( `/cadastrarProdutos/${a.PRDT_ID}`)}>EDITAR</button>
                         </th>


                         <th>
                         <button onClick={()=>deletarProduto(a.PRDT_ID)}>EXCLUIR</button>                      
                            </th>
            
                 </tr>

                  )} 

             </tbody> 
             



             </table>  
             </div>        */ 