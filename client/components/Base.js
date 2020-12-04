import PropTypes from 'prop-types'

import Common from './Common'
import clientApi from '../utils/ClientApi'

class Base extends Common {

  constructor(props) {
    super(props)
    this.bindAll([
      'store',
      'request'
    ])
    this.Store = this.props.Store
  }

  request(api, method, data = {}, query = {}) {
    let accessToken
    if (this.Store && this.Store.accessToken) {
      accessToken = this.Store.accessToken
    }
    return clientApi.request(api, method, accessToken, data, query)
  }

  store(...params) {
    this.props.setStore(...params)
  }

  render() {
    return <div/>
  }
}

Base.propTypes = {
  Store: PropTypes.object,
  setStore: PropTypes.func
}

export default Base
