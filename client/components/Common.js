import ls from 'local-storage'

// eslint-disable-next-line no-undef
export default class Common extends React.Component {

  constructor(props) {
    super(props)

    this.bindAll = this.bindAll.bind(this)
    this.ls = ls
  }

  bindAll(methods) {
    for (let m of methods) {
      this[m] = this[m].bind(this)
    }
  }

  render() {
    return <div/>
  }
}

