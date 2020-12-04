import superagent from 'superagent'

class ClientApi {

  async request(
    api,
    method = 'get',
    accessToken = '',
    params = {},
    query = {}
    ) {

    const res = await superagent[method](`${window.location.origin}/api/${api}`)
      .set('Accept', 'application/json')
      .set('Access-Token', accessToken)
      .query(query)
      .send(params)

    return res.body
  }
}

export default new ClientApi()
