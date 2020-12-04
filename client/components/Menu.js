// eslint-disable-next-line no-undef
const {Link} = ReactRouterDOM

// eslint-disable-next-line no-undef
const {Navbar, Nav} = ReactBootstrap

import Base from './Base'

export default class Menu extends Base {

  constructor(props) {
    super(props)

    this.state = {
      count: 0
    }

    this.updateState = this.updateState.bind(this)
    this.toggleAdminMode = this.toggleAdminMode.bind(this)
    this.makeNotVisible = this.makeNotVisible.bind(this)
  }

  updateState() {
    this.setState({
      count: this.state.count + 1
    })
  }

  isMe(me) {
    if (!window.location.pathname && me === '/') {
      return 'selected'
    }
    if (window.location.pathname === me) {
      return 'selected'
    }
    return ''
  }

  toggleAdminMode() {
    this.store({
      isAdminMode: !(this.Store.isAdminMode || false)
    })
  }

  makeNotVisible() {
    this.store({
      menuVisibility: false
    })
  }

  render() {
    return <Navbar bg="light" expand="lg">
      <Navbar.Brand href="#home">SignAuth Boilerplate</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav"/>
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Navbar.Text>
          <Link to="/">Home</Link>

          </Navbar.Text>
        </Nav>
        {
          this.Store.accessToken
            ? <Navbar.Text>
              Signed in as: <Link to="/info">{this.Store.email}</Link>
            </Navbar.Text>
            : null
        }
        {
          this.Store.accessToken
            ? <Link to="/signout">Signout</Link>
            : <span><Link to="/signin">Signin</Link> <Link to="/signup">Signup</Link></span>
        }
        <span> &nbsp; | &nbsp; </span>
        <a className="item" target="_blank" href="https://github.com/signauth">
          <i className="fab fa-github"></i>
        </a>
        <a className="item" target="_blank" href="https://twitter.com/signauth">
          <i className="fab fa-twitter"></i>
        </a>
        <a className="item" href="mailto:signauth@sullo.co">
          <i className="fas fa-envelope-square"></i>
        </a>
      </Navbar.Collapse>
    </Navbar>
  }
}
