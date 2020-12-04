
// eslint-disable-next-line no-undef
import Base from './Base'

export default class Home extends Base {

  render() {
    return (
      <div>
        <h2 className="centered">SignAuth Boilerplate</h2>
        <p>&nbsp;</p>
        <p>
          <b>SignAuth React/Express Boilerplate</b><br/>
          <i>A minimalistic boilerplate to show how SignAuth works, build with React, Bootstrap and Express.</i>
        </p>
          {
            this.Store.email && this.Store.accessToken
              ? <p>You are <b>connected</b>. Click on the top right on your email to get info about your account.</p>

              : <p>You are <b>not actually connected</b>. Use the top right menu to signin or signup.</p>
          }
        <p>
        </p>
      </div>
    )
  }
}
