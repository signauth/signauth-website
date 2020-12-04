import PasswordStrengthBar from 'react-password-strength-bar'
import Base from './Base'
import SignAuth from 'signauth'

// eslint-disable-next-line no-undef
const {Redirect} = ReactRouterDOM

// eslint-disable-next-line no-undef
const {Form, Button, Modal} = ReactBootstrap

export default class Signin extends Base {

  constructor(props) {
    super(props)
    this.state = {
      email: '',
      passphrase: '',
      repeat: '',
      showPwd: false,
      show: false,
      minLength: 12,
      scope: props.scope,
      errorMessage: undefined
    }
    this.bindAll([
      'emailHandler',
      'pwdHandler',
      'pwdHandler2',
      'handleClose',
      'handleShow',
      'submitHandler',
      'togglePwdShow'
    ])
  }

  emailHandler(event) {
    this.setState({
      email: String(event.target.value).toLowerCase()
    })
  }

  pwdHandler(event) {
    this.setState({
      passphrase: event.target.value
    })
  }

  pwdHandler2(event) {
    this.setState({
      repeat: event.target.value
    })
  }

  handleClose() {
    this.setState({
      show: false
    })
  }

  handleShow(errorMessage) {
    this.setState({
      errorMessage,
      show: true
    })
  }

  togglePwdShow() {
    this.setState({
      showPwd: !this.state.showPwd
    })
  }

  validate(email) {
    // eslint-disable-next-line no-control-regex
    const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i
    return expression.test(email)
  }

  async submitHandler(event) {
    event.preventDefault()
    const email = this.state.email
    const scope = this.state.scope
    const isSignup = scope === 'signup'
    if (isSignup && !this.validate(email)) {
      this.handleShow('The email is not valid')
    } else if (!isSignup || this.state.passphrase.length >= this.state.minLength) {
      if (isSignup && this.state.passphrase !== this.state.repeat) {
        this.handleShow('The two passphrases are not the same')
      } else {
        let res = await this.request('v1/challenge/' + scope, 'post', {
          email
        })
        if (!res || !res.success) {
          this.handleShow('Error: ' + res.error)
        } else {
          const pair = SignAuth.getPairFromPassphrase(this.state.email + this.state.passphrase)
          const payload = SignAuth.getPayload(res.challenge, pair)
          res = await this.request('v1/' + scope, 'post', {
            email,
            payload
          })
          if (res && res.success) {
            this.store({
              accessToken: res.accessToken,
              email
            }, true)
          } else {
            this.handleShow('Authentication failed. '+ res.error)
          }
        }
      }
    } else {
      this.handleShow('The passphrase must be at least 12 chars long')
    }

  }


  render() {

    const {passphrase, repeat, email, show, showPwd, minLength, errorMessage} = this.state
    const isSignin = this.props.scope === 'signin'

    if (this.Store.accessToken) {
      return <Redirect to='/'/>
    }

    return (
      <div>
        <h2 className="centered">{
          isSignin ? 'Signin' : 'Signup'
        }</h2>
        <Form>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder="Enter email"
                          value={email}
                          onChange={this.emailHandler}
            />
          </Form.Group>
          <Form.Group controlId="formBasicPassword">
            <Form.Label>Passphrase — min {minLength} chars</Form.Label>
            <Form.Check type="checkbox" label="Show" id="check-1"
                        style={{display: 'inline', marginLeft: 24}}
                        onClick={this.togglePwdShow}
            />
            {
              showPwd
                ? <Form.Control placeholder="Passphrase"
                                value={passphrase}
                                onChange={this.pwdHandler}

                />
                : <Form.Control type="password" placeholder="Passphrase"
                                value={passphrase}
                                onChange={this.pwdHandler}
                />
            }
          </Form.Group>
          {isSignin ? null :
            <PasswordStrengthBar className='strength'
                                 password={passphrase}
                                 minLength={minLength}
            />
          }
          {isSignin ? null :
            <Form.Group controlId="formBasicPassword2">
              <Form.Label>Repeat passphrase</Form.Label>
              <Form.Control type="password" placeholder="Passphrase"
                            value={repeat}
                            onChange={this.pwdHandler2}
              />
            </Form.Group>
          }
          <Button variant="primary"
                  onClick={this.submitHandler}
          >
            Submit
          </Button>
        </Form>
        <Modal show={show} onHide={this.handleClose}
               aria-labelledby="contained-modal-title-vcenter"
               centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Whoops</Modal.Title>
          </Modal.Header>
          <Modal.Body>{errorMessage}</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}
