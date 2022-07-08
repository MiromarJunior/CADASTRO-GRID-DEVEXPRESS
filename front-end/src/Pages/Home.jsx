/**

Página Principal onde é carregado o MENU com os atalhos para as paginas


 */



import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Autenticação/validacao";


import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListIcon from '@mui/icons-material/List';
import ExitToAppTwoToneIcon from '@mui/icons-material/ExitToAppTwoTone';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TreeItem from '@mui/lab/TreeItem';
import { getAcessoUserMenu } from "../Service/usuarioService";
import { accordionActionsClasses } from "@mui/material";



const drawerWidth = 320;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));







const  HomePage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { logout, nomeUser } = useContext(AuthContext);
  const [displayAcessoGeral, setDisplayAcessoGeral] = useState("none")
  const [displayAcessoSGRA, setDisplayAcessoSGRA] = useState("none")

  useEffect(() => {
    if(nomeUser()){
    const acessoMenuUser = async ()=>{
      let dados = { token, usuario :nomeUser() };
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
            (res.data).forEach((ac)=>{
          
              if(process.env.REACT_APP_API_ACESSO_GERAL === ac){               
                setDisplayAcessoGeral(""); 
                setDisplayAcessoSGRA("");      
              }else if(process.env.REACT_APP_API_LISTA_SGRA === ac || process.env.REACT_APP_API_ADM_SGRA === ac ) {
                setDisplayAcessoSGRA("");
              }
            })            
          } 
  
        })
        .catch((err) => {
          console.error(err);
          window.alert("Erro ao buscar Usuário!!")
        })  
    }
    acessoMenuUser();   

  }

  
    }, [logout,token,nomeUser]); 



  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

 
  return (
    <div style={{ display: nomeUser() ? "" : "none" }} >

<Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} style={{color : "black"}}>
        <Toolbar style={{backgroundColor: "rgb(171, 239, 191)"}}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" style={{color : "black"}} >
            SISTEMA DE COTAÇÕES
          
          </Typography>
          
                 
          <Typography marginLeft={"60%"} style={{color : "black"}} >
            <button  style={{backgroundColor: "rgb(171, 239, 191)", border : 0}} onClick={ ()=> navigate("/listarUsuario")} > Usuário(a)  {nomeUser()}</button>
           
          
          </Typography>
           
        </Toolbar>
       
        
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
        <Typography variant="h6" fontFamily={"serif"} noWrap component="div" marginRight={"65%"}>
           MENU
          
          </Typography>
      
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
          
          
        </DrawerHeader>
        
        <Divider />

        <TreeView
      aria-label="file system navigator"
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      
    >
      
      <TreeItem nodeId="1" label="CADASTROS GERAIS">

       

        <TreeItem nodeId="2" label="BÁSICO">
        <ListItem  disablePadding style={{display : displayAcessoSGRA}}>
              <ListItemButton onClick={ ()=> navigate("/listarSeguradora") }>
                <ListItemIcon>
                  <ListIcon /> 
                </ListItemIcon>
                <ListItemText primary={"Seguradoras"} />
              </ListItemButton>
            </ListItem>

            


          


        </TreeItem>

        <TreeItem nodeId="3" label="USUÁRIO">
        <ListItem  disablePadding>
              <ListItemButton onClick={ ()=> navigate("/listarUsuario")}>
                <ListItemIcon>
                <ListIcon /> 
                </ListItemIcon>
                <ListItemText primary={"Usuários"}   />
              </ListItemButton>
            </ListItem>

            <ListItem  disablePadding style={{display : displayAcessoGeral}}>
              <ListItemButton onClick={ ()=> navigate("/gruposDeAcesso")}>
                <ListItemIcon>
                <ListIcon /> 
                </ListItemIcon>
                <ListItemText primary={"Grupos de Acesso"}   />
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

        
            <ListItem  disablePadding  style={{marginTop : 300}}>
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

  )

}

export default HomePage;



