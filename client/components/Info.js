import Base from './Base'

// eslint-disable-next-line no-undef
const {Redirect} = ReactRouterDOM

// eslint-disable-next-line no-undef
export default class Info extends Base {

  constructor(props) {
    super(props)
    this.state = {
      data: null,
      logout: false
    }
  }

  componentDidMount() {
    const {email} = this.Store
    this.request('v1/info', 'get', undefined, {
      email
    }).then(res => {
      if (res.success) {
        this.setState({
          info: res.info
        })
      }
    })

    // else {
    //   this.setState({
    //     logout: true
    //   })
    // }
  }

  render() {

    const {info, logout} = this.state

    return (
      logout
        ? <Redirect to="/signout"/>
        : <div>
          <h1>Info</h1>
          <p>
            User email: <code>{this.Store.email}</code><br/>
          {
            info
              ? <span>
                Public key: <code>{info.publicKey}</code><br/>
                Created at: <code>{(new Date(info.createdAt)).toString()}</code><br/>
                Last signin at: <code>{(new Date(info.lastSigninAt)).toString()}</code><br/>
                Active sessions: <code>{info.activeSessions}</code>
              </span>
              : <p>Loading...</p>
          }
          </p>
        </div>
    )
  }
}
