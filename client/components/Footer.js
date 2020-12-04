// const {Link} = ReactRouterDOM
import Base from './Base'

export default class PrimaryContent extends Base {

  render() {
    return (
      <div className="footer">
        <span>(c) 2020+ <a className="item" href="https://github.com/sullof">Francesco Sullo</a></span>
        <a className="item" href="https://github.com/signauth/signauth">
          <i className="fab fa-github"></i> SignAuth
        </a>
        <a className="item" target="_blank" href="https://twitter.com/signauth">
          <i className="fab fa-twitter"></i> Follow SignAuth
        </a>
        <a className="item" href="mailto:signauth@sullo.co">
          <i className="fas fa-envelope-square"></i> Send us an email
        </a>
      </div>
    )
  }
}
