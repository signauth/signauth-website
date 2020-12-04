module.exports = {

  sleep: async millis => {
    return new Promise(resolve => setTimeout(resolve, millis))
  }

}
