import { useNavigate } from "react-router-dom";
import("./home.css");



const HomePage = ()=>{
    const navigate = useNavigate();
      
      
    return(
        <div >
           <div className="d-flex flex-column flex-shrink-0 bg-light vh-100" >
    <ul className="nav nav-pills nav-flush flex-column mb-auto text-center">
        <li className="nav-item"> <a href="#" className="nav-link active py-3 border-bottom"> <i className="fa fa-home"></i> <small>Home</small> </a> </li>
        <li> <a href="#" className="nav-link py-3 border-bottom"> <i className="fa fa-dashboard"></i> <small>Dashboard</small> </a> </li>
        <li> <a href="#" className="nav-link py-3 border-bottom"> <i className="fa fa-first-order"></i> <small>My Orders</small> </a> </li>
        <li> <a href="#" className="nav-link py-3 border-bottom"> <i className="fa fa-cog"></i> <small>Settings</small> </a> </li>
        <li> <a href="#" className="nav-link py-3 border-bottom"> <i className="fa fa-bookmark"></i> <small>Bookmark</small> </a> </li>
    </ul>
    <div className="dropdown border-top"> <a href="#" className="d-flex align-items-center justify-content-center p-3 link-dark text-decoration-none dropdown-toggle" id="dropdownUser3" data-bs-toggle="dropdown" aria-expanded="false"> <img src="https://github.com/mdo.png" alt="mdo" width="24" height="24" className="rounded-circle"/> </a>
        <ul className="dropdown-menu text-small shadow" aria-labelledby="dropdownUser3">
            <li><a className="dropdown-item" href="#">New project...</a></li>
            <li><a className="dropdown-item" href="#">Settings</a></li>
            <li><a className="dropdown-item" href="#">Profile</a></li>
            <li>
                <hr className="dropdown-divider"/>
            </li>
            <li><a className="dropdown-item" href="#">Sign out</a></li>
        </ul>
    </div>
</div>
        </div>

    )

}

export default HomePage;