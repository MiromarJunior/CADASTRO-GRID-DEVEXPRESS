/**

Página Principal onde é carregado o MENU com os atalhos para as paginas


 */

import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Autenticação/validacao";

import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListIcon from "@mui/icons-material/List";
import ExitToAppTwoToneIcon from "@mui/icons-material/ExitToAppTwoTone";
import TreeView from "@mui/lab/TreeView";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TreeItem from "@mui/lab/TreeItem";
import { getAcessoUserMenu } from "../Service/usuarioService";
import PersonIcon from "@mui/icons-material/Person";
import GroupsSharpIcon from "@mui/icons-material/GroupsSharp";
import HdrAutoIcon from "@mui/icons-material/HdrAuto";



const drawerWidth = 280;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));




const HomePage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { logout, nomeUser } = useContext(AuthContext);
  const [displayAcessoGeral, setDisplayAcessoGeral] = useState("none");
  const [displayAcessoSGRA, setDisplayAcessoSGRA] = useState("none");
  const [displayAcessoSac, setDisplayAcessoSac] = useState("none");
  const [displayAcessoReg, setDisplayAcessoReg] = useState("none");
  const [displayAcessoJust, setDisplayAcessoJust] = useState("none");
  const [displayAcessoParamLe, setDisplayAcessoParamLe] = useState("none");
  const [displayAcessoTipoPeca, setDisplayAcessoTipoPeca] = useState("none");
  const [displayAcessoFornecedor, setDisplayAcessoFornecedor] = useState("none");
  const [displayAcessoStatusItem, setDisplayAcessoStatusItem] = useState("none");
  const [displayAcessoRegional, setDisplayAcessoRegional] = useState("none");
  const [displayAcessoReguladora, setDisplayAcessoReguladora] = useState("none");
  const [displayAcessoSucursal, setDisplayAcessoSucursal] = useState("none");

  const listaSgra = "LIST_SGRA";
  const incluirSgra = "ADD_SGRA";
  const excluirSgra = "DEL_SGRA";
  const editarSgra = "EDIT_SGRA";

  const listaSac = "LIST_SACMONT";
  const incluirSac = "ADD_SACMONT";
  const excluirSac = "DEL_SACMONT";
  const editarSac = "EDIT_SACMONT";

  const listaReg = "LIST_REGIAO";
  const incluirReg = "ADD_REGIAO";
  const excluirReg = "DEL_REGIAO";
  const editarReg = "EDIT_REGIAO";

  const listaJust = "LIST_JUSTIFICATIVA";
  const incluirJust = "ADD_JUSTIFICATIVA";
  const excluirJust = "DEL_JUSTIFICATIVA";
  const editarJust = "EDIT_JUSTIFICATIVA";

  const listaParamLe = "LIST_PARAMLE";
  const incluirParamLe = "ADD_PARAMLE";
  const excluirParamLe = "DEL_PARAMLE";
  const editarParamLe = "EDIT_PARAMLE";

  const listaTipoPeca = "LIST_TIPOPECA";
  const incluirTipoPeca = "ADD_TIPOPECA";
  const excluirTipoPeca = "DEL_TIPOPECA";
  const editarTipoPeca = "EDIT_TIPOPECA";

  const listaFornecedor = "LIST_FORNECEDOR";
  const incluirFornecedor = "ADD_FORNECEDOR";
  const excluirFornecedor = "DEL_FORNECEDOR";
  const editarFornecedor = "EDIT_FORNECEDOR";

  const listaStatusItem = "LIST_STIT";
  const incluirStatusItem = "ADD_STIT";
  const excluirStatusItem = "DEL_STIT";
  const editarStatusItem = "EDIT_STIT";

  const listaRegional = "LIST_REGIONAL";
  const incluirRegional = "ADD_REGIONAL";
  const excluirRegional = "DEL_REGIONAL";
  const editarRegional = "EDIT_REGIONAL";

  const listaReguladora = "LIST_REGULADORA";
  const incluirReguladora = "ADD_REGULADORA";
  const excluirReguladora = "DEL_REGULADORA";
  const editarReguladora = "EDIT_REGULADORA";

  const listaSucursal = "LIST_SUCURSAL";
  const incluirSucursal = "ADD_SUCURSAL";
  const excluirSucursal = "DEL_SUCURSAL";
  const editarSucursal = "EDIT_SUCURSAL";

  useEffect(() => {
    if (nomeUser()) {
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
                  setDisplayAcessoGeral("");
                  setDisplayAcessoSGRA("");
                  setDisplayAcessoSac("");
                  setDisplayAcessoReg("");
                  setDisplayAcessoJust("");
                  setDisplayAcessoParamLe("");
                  setDisplayAcessoTipoPeca("");
                  setDisplayAcessoFornecedor("");
                  setDisplayAcessoStatusItem("")
                  setDisplayAcessoRegional("");
                  setDisplayAcessoReguladora("");
                  setDisplayAcessoSucursal("");
                }
                if (listaSgra === ac || incluirSgra === ac || excluirSgra === ac || editarSgra === ac) {
                  setDisplayAcessoSGRA("");
                }
                if (listaSac === ac || incluirSac === ac || excluirSac === ac || editarSac === ac) {
                  setDisplayAcessoSac("");
                }
                if (listaReg === ac || incluirReg === ac || excluirReg === ac || editarReg === ac) {
                  setDisplayAcessoReg("");
                }
                if (listaJust === ac || incluirJust === ac || excluirJust === ac || editarJust === ac) {
                  setDisplayAcessoJust("");
                }
                if (listaParamLe === ac || incluirParamLe === ac || excluirParamLe === ac || editarParamLe === ac) {
                  setDisplayAcessoParamLe("");
                }
                if (listaTipoPeca === ac || incluirTipoPeca === ac || excluirTipoPeca === ac || editarTipoPeca === ac) {
                  setDisplayAcessoTipoPeca("");
                }
                if (listaFornecedor === ac || incluirFornecedor === ac || excluirFornecedor === ac || editarFornecedor === ac) {
                  setDisplayAcessoFornecedor("");
                }
                if (listaStatusItem === ac || incluirStatusItem === ac || excluirStatusItem === ac || editarStatusItem === ac) {
                  setDisplayAcessoStatusItem("");
                }
                if (listaRegional === ac || incluirRegional === ac || excluirRegional === ac || editarRegional === ac) {
                  setDisplayAcessoRegional("");
                }
                if (listaReguladora === ac || incluirReguladora === ac || excluirReguladora === ac || editarReguladora === ac) {
                  setDisplayAcessoReguladora("");
                }
                if (listaSucursal === ac || incluirSucursal === ac || excluirSucursal === ac || editarSucursal === ac) {
                  setDisplayAcessoSucursal("");
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
    }
  }, [logout, token, nomeUser]);

  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const listarSeguradoras = () => {
    navigate("/listarSeguradora");
    handleDrawerClose();
  };
  const listarUsuarios = () => {
    navigate("/listarUsuario");
    handleDrawerClose();
  };
  const listarGrupoDeAcesso = () => {
    navigate("/gruposDeAcesso");
    handleDrawerClose();
  };
  const listarCatMSG = () => {
    navigate("/listarCategMsgs");
    handleDrawerClose();
  };
  const listarGrupoItem = () => {
    navigate("/listarGrupoItem");
    handleDrawerClose();
  };
  const parametrosDeLeilao = () => {
    navigate("/listarparametrosLeilao");
    handleDrawerClose();
  }
  const marcaVeiculo = () => {
    navigate("/marcaVeiculo");
    handleDrawerClose();
  }

  const municipios = () => {
    navigate('/municipios');
    handleDrawerClose();
  }
  const listarFornecedor = () => {
    navigate("/listarFornecedor");
    handleDrawerClose();
  }  

  const jstificativaItem = () => {
    navigate('/justificativaItem');
    handleDrawerClose();
  }

  const regiao = () => {
    navigate('/regiao');
    handleDrawerClose();
  }

  const sacmontadoras = () => {
    navigate("/sacmontadoras");
    handleDrawerClose();
  };

  const tipoPeca = () => {
    navigate("/tipoPeca");
    handleDrawerClose();
  };

  const statusItem = () => {
    navigate("/statusItem");
    handleDrawerClose();
  };

  const listarRegional = () => {
    navigate("/listarRegional");
    handleDrawerClose();
  }  
  const listarReguladora = () => {
    navigate("/listarReguladora");
    handleDrawerClose();
  }  
  const listarSucursal = () => {
    navigate("/listarSucursal");
    handleDrawerClose();
  }  

  const horasLeilao = () => {
    navigate("/horasLeilao");
    handleDrawerClose();
  } 


  return (
    <div style={{ display: nomeUser() ? "" : "none" }}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="fixed" open={open} style={{ color: "black" }}>
          <Toolbar style={{ backgroundColor: "rgb(171, 239, 191)" }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ mr: 2, ...(open && { display: "none" }) }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" style={{ color: "black" }}>
              SISTEMA DE COTAÇÕES
            </Typography>

            <button
              style={{
                backgroundColor: "rgb(171, 239, 191)",
                marginLeft: "65em",
                border: 0,
                fontSize: 12,
              }}
              onClick={() => navigate("/listarUsuario")}
            >
              {" "}
              Usuário(a) {nomeUser()}
            </button>
          </Toolbar>
        </AppBar>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          variant="persistent"
          anchor="left"
          open={open}
        >
          <DrawerHeader>
            <Typography
              variant="h6"
              fontFamily={"serif"}
              noWrap
              component="div"
              marginRight={"4em"}
            >
              MENU
            </Typography>

            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "ltr" ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          </DrawerHeader>

          <Divider />

          <TreeView
            aria-label="file system navigator"
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
          >
            <TreeItem nodeId="CADG" label="CADASTROS GERAIS">
              <TreeItem nodeId="BAS" label="BÁSICO">

              <ListItem disablePadding>
                  <ListItemButton onClick={() => municipios()}>
                    <ListItemIcon>
                      <HdrAutoIcon style={{ color: "green" }} />
                    </ListItemIcon>
                    <ListItemText primary={"Municipios"} />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding style={{ display: displayAcessoReg }} >
                  <ListItemButton onClick={() => regiao()}>
                    <ListItemIcon>
                      <HdrAutoIcon style={{ color: "green" }} />
                    </ListItemIcon>
                    <ListItemText primary={"Regiao"} />
                  </ListItemButton>
                </ListItem>





                <ListItem disablePadding style={{ display: displayAcessoSGRA }}>
                  <ListItemButton onClick={() => listarSeguradoras()}>
                    <ListItemIcon>
                      <ListIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Seguradoras"} />
                  </ListItemButton>
                </ListItem>

                <ListItemButton onClick={() => listarCatMSG()}>
                  <ListItemIcon>
                    <ListIcon />
                  </ListItemIcon>
                  <ListItemText primary={"Categoria Msg"} />
                </ListItemButton>

                <ListItemButton onClick={() => listarGrupoItem()}>
                  <ListItemIcon>
                    <ListIcon />
                  </ListItemIcon>
                  <ListItemText primary={"Grupo do Item"} />
                </ListItemButton>

                <ListItem disablePadding style={{ display: displayAcessoStatusItem }}>
                  <ListItemButton onClick={() => statusItem()}>
                    <ListItemIcon>
                      <ListIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Status Item"} />
                  </ListItemButton>
                </ListItem>




                <ListItemButton onClick={() => marcaVeiculo()}>
                  <ListItemIcon>
                    <HdrAutoIcon style={{ color: "green" }} />
                  </ListItemIcon>
                  <ListItemText primary={"Marca Veículo"} />
                </ListItemButton>


                <ListItem disablePadding style={{ display: displayAcessoJust }} >
                  <ListItemButton onClick={() => jstificativaItem()}>
                    <ListItemIcon>
                      <HdrAutoIcon style={{ color: "green" }} />
                    </ListItemIcon>
                    <ListItemText primary={"Justificativa do Item"} />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding style={{ display: displayAcessoParamLe }}>
                  <ListItemButton onClick={() => parametrosDeLeilao()}>
                    <ListItemIcon>
                      <ListIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Parametros do Leilão"} />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding style={{ display: displayAcessoParamLe }}>
                  <ListItemButton onClick={() => horasLeilao()}>
                    <ListItemIcon>
                      <ListIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Horas Leilão"} />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding  style={{ display: displayAcessoTipoPeca }}>
                  <ListItemButton onClick={() => tipoPeca()}>
                    <ListItemIcon>
                      <ListIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Tipo de Peça"} />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding style={{ display: displayAcessoFornecedor }} >
                  <ListItemButton onClick={() => listarFornecedor()}>
                    <ListItemIcon>
                      <ListIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Fornecedores"} />
                  </ListItemButton>
                </ListItem>



                <ListItem disablePadding style={{ display: displayAcessoSac }}  >
                  <ListItemButton onClick={() => sacmontadoras()}>
                    <ListItemIcon>
                      <ListIcon />
                    </ListItemIcon>
                    <ListItemText primary={"SAC Montadoras"} />
                  </ListItemButton>
                </ListItem>

                <ListItem disablePadding  style={{ display: displayAcessoRegional }}>
                  <ListItemButton onClick={() => listarRegional()}>
                    <ListItemIcon>
                      <ListIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Regional"} />
                  </ListItemButton>
                </ListItem>    
                
                <ListItem disablePadding  style={{ display: displayAcessoReguladora }}>
                  <ListItemButton onClick={() => listarReguladora()}>
                    <ListItemIcon>
                      <ListIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Reguladora"} />
                  </ListItemButton>
                </ListItem>                              

                <ListItem disablePadding  style={{ display: displayAcessoSucursal }}>
                  <ListItemButton onClick={() => listarSucursal()}>
                    <ListItemIcon>
                      <ListIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Sucursal"} />
                  </ListItemButton>
                </ListItem>  

              </TreeItem>

              <TreeItem nodeId="USU" label="USUÁRIO">
                <ListItem disablePadding>
                  <ListItemButton onClick={() => listarUsuarios()}>
                    <ListItemIcon>
                      <PersonIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Usuários"} />
                  </ListItemButton>
                </ListItem>

                <ListItem
                  disablePadding
                  style={{ display: displayAcessoGeral }}
                >
                  <ListItemButton onClick={() => listarGrupoDeAcesso()}>
                    <ListItemIcon>
                      <GroupsSharpIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Grupos de Acesso"} />
                  </ListItemButton>
                </ListItem>

              </TreeItem>




            

            </TreeItem>
          </TreeView>

          <Divider />
          {/* <List>
          {['All mail', 'Trash', 'Spam'].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List> */}

          <ListItem disablePadding  style={{marginTop : "10em"}}>
            <ListItemButton onClick={logout}>
              <ListItemIcon>
                <ExitToAppTwoToneIcon />
              </ListItemIcon>
              <ListItemText primary={"Sair"} />
            </ListItemButton>
          </ListItem>
        </Drawer>
        <Main open={open}>
          <DrawerHeader />
        </Main>
      </Box>
    </div>
  );
};

export default HomePage;


/**
 * 
 * import { useTime} from 'react-timer-hook';
  function TempoHora() {
    const {
      seconds,
      minutes,
      hours,
      ampm,
    } = useTime({ format: '24-hour'});
    if(horasL === (hours+":"+minutes)){
  
     return navigate("/listarparametrosLeilao");
    }
  
    
  } 


 * 
 */
