import fs from 'fs'

export default class Database {
  /**
     * @param {string} path The path of the json file used for the database.
     */
  constructor (path) {
    this.path = path ?? './data.json'
    if (!this.path.endsWith('.json')) throw new Error('[ FILEPATH ] MUST END WITH .JSON')
    if (!fs.existsSync(this.path)) this.$setAllData({})
  }

  /**
   * Get all the data in all the database.
   * @returns {Array}
   */

  getAll () {
    const data = this.$getAllData()
    const alldata = []
    for (const [key, value] of Object.entries(data)) alldata.push({ id: key, data: value })
    return alldata
  }
  /**
   * Delete all the data in all the database.
   * @returns {Object}
   */

  deleteAll () {
    this.$setAllData({})
    return {}
  }

  /**
     * Set data for an id in the database
     * @param {string} id
     * @param {any} dataToSet
     * @returns {any}
     */

  set (id, dataToSet) {
    if (!id) throw new TypeError('[ SET ] NO <ID> SPECIFIED')
    if (typeof id !== 'string') throw new TypeError('[ SET ] <ID> MUST BE A <STRING>')
    if (!dataToSet) throw new TypeError(`[ SET ] - [ DATA --> ${id} ] NO <DATA> SPECIFIED`)
    return this.$setData(id, dataToSet)
  }

  /**
     * Check if an id data exists.
     * @param {string} id
     * @returns {Boolean}
     */

  has (id) {
    if (!id) throw new TypeError('[ HAS ] NO <ID> SPECIFIED')
    if (typeof id !== 'string') throw new TypeError('[ HAS ] <ID> MUST BE A STRING')
    return Boolean(this.$getData(id))
  }

  /**
     * Get data for an id in the database
     * @param {string} id
     * @returns {any}
     */

  get (id) {
    if (!id) throw new TypeError('[ GET ] NO <ID> SPECIFIED')
    if (typeof id !== 'string') throw new TypeError('[ GET ] <ID> MUST BE A STRING')
    return this.$getData(id)
  }

  /**
     * Delete data for an id in the database
     * @param {string} id
     * @returns {any}
     */

  delete (id) {
    if (!id) throw new TypeError('[ DELETE ] NO <ID> SPECIFIED')
    if (typeof id !== 'string') throw new TypeError(`[ DELETE ] - [ DATA --> ${id} ] NO <DATA> SPECIFIED`)
    return this.$deleteData(id)
  }

  /**
     * Push data for an id in the database
     * @param {string} id
     * @param {any} dataToPush
     * @returns {any}
     */

  push (id, dataToPush) {
    if (!id) throw new TypeError('[ PUSH ] NO <ID> SPECIFIED')
    if (typeof id !== 'string') throw new TypeError('[ PUSH ] <ID> MUST BE A STRING')
    if (!dataToPush) throw new TypeError(`[ PUSH ] - [ DATA --> ${id} ] NO <DATA> SPECIFIED`)
    let data = this.$getData(id)
    if (!Array.isArray(data)) data = []
    data.push(dataToPush)
    this.$setData(id, data)
    return this.$getData(id)
  }

  /**
     * Pull data for an id in the database
     * @param {string} id
     * @param {any} dataToPull
     * @returns {Array}
     */

  pull (id, dataToPull) {
    if (!id) throw new TypeError('[ PULL ] NO <ID> SPECIFIED')
    if (typeof id !== 'string') throw new TypeError('[ PULL ] <ID> MUST BE A STRING')
    if (!dataToPull) throw new TypeError(`[ PULL ] - [ DATA --> ${id} ] NO <DATA> SPECIFIED`)
    const data = this.$getData(id, dataToPull) || []
    if (!Array.isArray(data)) throw new TypeError(`[ PULL ] - [ DATA --> ${id} ] <DATA> MUST BE AN ARRAY`)
    return data.filter(dataToPull)
  }

  /**
     * Pull and Delete data for an id in the database
     * @param {string} id
     * @param {any} condition
     * @returns {any}
     */

  pullDelete (id, condition) {
    if (!id) throw new TypeError('[ PULLDELETE ] NO <ID> SPECIFIED')
    if (typeof id !== 'string') throw new TypeError('[ PULLDELETE ] <ID> MUST BE A STRING')
    if (!condition) throw new TypeError(`[ PULLDELETE ] - [ CONDITION --> ${id} ] NO <CONDITION> SPECIFIED`)
    const newdata = []
    const alldata = this.$getData(id) || []
    if (!Array.isArray(alldata)) throw new TypeError(`[ PULLDELETE ] - [ DATA OF --> ${id} ] <DATA> MUST BE AN ARRAY`)
    for (const data of alldata) { if (!condition(data)) newdata.push(data) };
    this.$setData(id, newdata)
    return this.$getData(id)
  }

  /**
     * Add number for an id in the database
     * @param {string} id
     * @param {Number} number
     * @returns {any}
     */

  add (id, number) {
    if (!id) throw new TypeError('[ ADD ] NO <ID> SPECIFIED')
    if (typeof id !== 'string') throw new TypeError('[ ADD ] <ID> MUST BE A STRING')
    if (!number) throw new TypeError(`[ ADD ] - [ NUMBER --> ${id} ] NO <NUMBER> SPECIFIED`)
    const data = Number(this.$getData(id)) || 0
    const numberdata = Number(number)
    if (!numberdata || isNaN(numberdata)) throw new Error(`[ ADD ] - [ NUMBER --> ${id} ] <DATA> MUST BE A NUMBER`)
    return this.$setData(id, Number(data + numberdata))
  }

  /**
     * Subtract number for an id in the database
     * @param {string} id
     * @param {Number} number
     * @returns {any}
     */

  subtract (id, number) {
    if (!id) throw new TypeError('[ SUBTRACT ] NO <ID> SPECIFIED')
    if (typeof id !== 'string') throw new TypeError('[ SUBTRACT ] <ID> MUST BE A STRING')
    if (!number) throw new TypeError(`[ SUBTRACT ] - [ NUMBER --> ${id} ] NO <NUMBER> SPECIFIED`)
    const data = Number(this.$getData(id)) || 0
    const numberdata = Number(number)
    if (!numberdata || isNaN(numberdata)) throw new Error(`[ SUBTRACT ] - [ NUMBER --> ${id} ] <DATA> MUST BE A NUMBER`)
    return this.$setData(id, Number(data - numberdata))
  }

  $setAllData (obj) {
    fs.writeFileSync(this.path, JSON.stringify(obj))
  }

  $setData (id, dataToSet) {
    const allData = this.$getAllData()
    allData[id] = dataToSet
    fs.writeFileSync(this.path, JSON.stringify(allData))
    return this.$getData(id)
  }

  $deleteData (id) {
    try {
      const data = (this.$getAllData())
      delete data[id]
      this.$setAllData(data)
      return this.$getData(id)
    } catch (error) {

    }
  }

  $getData (id, defaultData) {
    try {
      const fetched = (this.$getAllData())[id]
      if (!fetched && defaultData) this.$setData(id, defaultData)
      return fetched
    } catch (error) {

    }
  }

  $getAllData () {
    try {
      if (!fs.existsSync(this.path)) this.$setAllData({})
      return JSON.parse(fs.readFileSync(this.path))
    } catch (error) {
      this.$setAllData({})
      return {}
    }
  }
};
