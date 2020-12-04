import App from './components/App'
import * as serviceWorker from './utils/serviceWorker'

// eslint-disable-next-line no-undef
ReactDOM.render(<App />, document.getElementById('root'))

serviceWorker.unregister()
