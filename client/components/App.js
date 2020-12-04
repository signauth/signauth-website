
// eslint-disable-next-line no-undef
const {BrowserRouter, Route} = ReactRouterDOM

// eslint-disable-next-line no-undef
const {Container, Row, Col} = ReactBootstrap

import ls from 'local-storage'

import Common from './Common'
import Menu from './Menu'
import Home from './Home'
import Signin from './Signin'
import Signout from './Signout'
import Info from './Info'

export default class App extends Common {

  constructor(props) {
    super(props)

    this.state = {
      Store: {
        content: {},
        editing: {},
        temp: {},
        menuVisibility: false
      }
    }
    this.setStore = this.setStore.bind(this)
    let accessToken = ls('accessToken')
    if (accessToken) {
      if (Array.isArray(accessToken)) {
        accessToken = accessToken[0]
      }
      const deadline = parseInt(accessToken.split(';')[2])
      if (Date.now() > deadline) {
        ls.remove('accessToken')
      } else {
        this.setStore({accessToken})
      }
    }
    let email = ls('email')
    if (email) {
      this.setStore({email})
    }
  }

  async componentDidMount() {
  }

  setStore(newProps, localStorage) {
    let store = this.state.Store
    for (let i in newProps) {
      if (newProps[i] === null) {
        if (localStorage) {
          ls.remove(i)
        }
        delete store[i]
      } else {
        if (localStorage) {
          ls(i, newProps[i])
        }
        store[i] = newProps[i]
      }
    }
    this.setState({
      Store: store
    })
  }

  render() {

    const home = () => {
      return (
        <Home
          Store={this.state.Store}
          setStore={this.setStore}
        />
      )
    }

    const signin = () => {
      return (
        <Signin
          Store={this.state.Store}
          setStore={this.setStore}
          scope="signin"
        />
      )
    }

    const signout = () => {
      return (
        <Signout
          Store={this.state.Store}
          setStore={this.setStore}
        />
      )
    }

    const info = () => {
      return (
        <Info
          Store={this.state.Store}
          setStore={this.setStore}
        />
      )
    }

    const signup = () => {
      return (
        <Signin
          Store={this.state.Store}
          setStore={this.setStore}
          scope="signup"
        />
      )
    }

    return <BrowserRouter>
      <Menu
        Store={this.state.Store}
        setStore={this.setStore}
      />
      <main>
        <Container>
          <Row>
            <Col style={{margin: 16}}>
              <Route exact path="/" component={home}/>
              <Route exact path="/signin" component={signin}/>
              <Route exact path="/signup" component={signup}/>
              <Route exact path="/signout" component={signout}/>
              <Route exact path="/info" component={info}/>
            </Col>
          </Row>
        </Container>
      </main>

    </BrowserRouter>
  }
}
