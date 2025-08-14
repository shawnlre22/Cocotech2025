import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import "./NavBar.css";

function NavBar() {
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/"> <img src="Cocotech-logo.jpeg" alt="cocotechlogo" width="8%"></img> <span class="navbar-title">CocoTech Trading</span></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="trading">Trading</Nav.Link>
            <Nav.Link href="buysell">BuySell</Nav.Link>
            <Nav.Link href="tradehistory">History</Nav.Link>
            <NavDropdown title="Profile" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">My account</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Settings
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;