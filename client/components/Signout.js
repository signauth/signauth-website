import Base from './Base'

// eslint-disable-next-line no-undef
const {Redirect} = ReactRouterDOM

export default class Signout extends Base {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const {email} = this.Store
    this.request('v1/signout', 'get', undefined, {
      email
    })
    this.store({
      email: null,
      accessToken: null
    }, true)
  }

  render() {

    if (this.Store.accessToken) {
      return <h1>Signing out...</h1>
    } else {
      return <Redirect to="/"/>
    }
  }
}
