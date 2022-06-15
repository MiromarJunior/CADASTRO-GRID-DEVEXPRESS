import logo from './logo.svg';
import './App.css';
import 'ag-grid-community/dist/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'; // Optional theme CSS
import '@devexpress/dx-react-grid-bootstrap4/dist/dx-react-grid-bootstrap4.css';
import 'bootstrap/dist/css/bootstrap.min.css';



import AppRotas from './AppRotas';


function App() {
  return (
    <div className="App">
      <AppRotas/>


      
    </div>
  );
}

export default App;
