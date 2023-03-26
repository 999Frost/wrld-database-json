import fs from "fs";

export default class Database {
  /**
   * @param {string} path The path of the json file used for the database.
   */
  constructor(path) {
    this.path = path ?? "./data.json";
    if (!this.path.endsWith(".json"))
      throw new Error("[ FILEPATH ] MUST END WITH .JSON");
    if (!this.#fileExist()) this.#overwriteAllData({});
  }

  /**
   * Get all the data in all the database.
   * @returns {Array}
   */
  getAll() {
    try {
      if (!this.#fileExist()) this.#overwriteAllData({});
      const data = this.#getFileToJson();
      return Object.keys(data).map((key) => ({ id: key, data: data[key] }));
    } catch (error) {
      console.log("overwrite");
      this.#overwriteAllData({});
      return {};
    }
  }

  /**
   * Delete all data from the database.
   * @returns {Object}
   */

  deleteAll() {
    this.#overwriteAllData({});
    return {};
  }

  /**
   * Set data for an id in the database
   * @param {string} id
   * @param {any} dataToSet
   * @returns {any}
   */

  set(id, dataToSet) {
    const data = this.#getFileToJson();

    data[id] = dataToSet;

    fs.writeFileSync(this.path, JSON.stringify(data));

    return this.get(id);
  }

  /**
   * Check if an id data exists.
   * @param {string} id
   * @returns {Boolean}
   */

  has(id) {
    if (!id) throw new TypeError("[ HAS ] NO <ID> SPECIFIED");
    if (typeof id !== "string")
      throw new TypeError("[ HAS ] <ID> MUST BE A STRING");
    return Boolean(this.get(id));
  }

  /**
   * Get data for an id in the database
   * @param {string} id
   * @returns {any}
   */

  get(id) {
    if (!id) throw new TypeError("[ GET ] NO <ID> SPECIFIED");

    if (typeof id !== "string")
      throw new TypeError("[ GET ] <ID> MUST BE A STRING");

    const data = this.#getFileToJson();

    return data[id];
  }

  /**
   * Delete data for an id in the database
   * @param {string} id
   * @returns {any}
   */

  delete(id) {
    if (!id) throw new TypeError("[ DELETE ] NO <ID> SPECIFIED");
    if (typeof id !== "string")
      throw new TypeError(
        `[ DELETE ] - [ DATA --> ${id} ] NO <DATA> SPECIFIED`
      );

    const data = this.#getFileToJson();
    delete data[id];
    this.#overwriteAllData(data);
    console.log(`${id} removed`);
  }

  /**
   * Push data for an id in the database
   * @param {string} id
   * @param {any} dataToPush
   * @returns {any}
   */

  push(id, dataToPush) {
    if (!id || !dataToPush)
      throw new TypeError(
        !id
          ? "[ PUSH ] NO <ID> SPECIFIED"
          : `[ PUSH ] - [ DATA --> ${id} ] NO <DATA> SPECIFIED`
      );

    if (typeof id !== "string")
      throw new TypeError("[ PUSH ] <ID> MUST BE A STRING");

    let data = this.get(id);

    if (!Array.isArray(data)) data = [];

    data.push(dataToPush);
    this.set(id, data);
    return this.get(id);
  }

  /**
   * Pull data for an id in the database
   * @param {string} id
   * @param {any} dataToPull
   * @returns {Array}
   */

  pull(id, dataToPull) {
    if (!id) throw new TypeError("[ PULL ] NO <ID> SPECIFIED");
    if (typeof id !== "string")
      throw new TypeError("[ PULL ] <ID> MUST BE A STRING");
    if (!dataToPull)
      throw new TypeError(`[ PULL ] - [ DATA --> ${id} ] NO <DATA> SPECIFIED`);
    const data = this.get(id, dataToPull) || [];
    if (!Array.isArray(data))
      throw new TypeError(
        `[ PULL ] - [ DATA --> ${id} ] <DATA> MUST BE AN ARRAY`
      );
    return data.filter(dataToPull);
  }

  /**
   * Pull and Delete data for an id in the database
   * @param {string} id
   * @param {any} condition
   * @returns {any}
   */

  pullDelete(id, condition) {
    if (!id) throw new TypeError("[ PULLDELETE ] NO <ID> SPECIFIED");
    if (typeof id !== "string")
      throw new TypeError("[ PULLDELETE ] <ID> MUST BE A STRING");
    if (!condition)
      throw new TypeError(
        `[ PULLDELETE ] - [ CONDITION --> ${id} ] NO <CONDITION> SPECIFIED`
      );

    const alldata = this.get(id) || [];
    if (!Array.isArray(alldata))
      throw new TypeError(
        `[ PULLDELETE ] - [ DATA OF --> ${id} ] <DATA> MUST BE AN ARRAY`
      );

    const newData = alldata.filter((data) => !condition(data));

    this.set(id, newData);

    return this.get(id);
  }

  /**
   * Add number for an id in the database
   * @param {string} id
   * @param {Number} number
   * @returns {any}
   */

  add(id, number) {
    if (!id) throw new TypeError("[ ADD ] NO <ID> SPECIFIED");
    if (typeof id !== "string")
      throw new TypeError("[ ADD ] <ID> MUST BE A STRING");
    if (!number)
      throw new TypeError(
        `[ ADD ] - [ NUMBER --> ${id} ] NO <NUMBER> SPECIFIED`
      );
    const data = Number(this.get(id)) || 0;
    const valueToAdd = Number(number);
    if (!valueToAdd || isNaN(valueToAdd))
      throw new Error(`[ ADD ] - [ NUMBER --> ${id} ] <DATA> MUST BE A NUMBER`);
    return this.set(id, Number(data + valueToAdd));
  }

  /**
   * Subtract number for an id in the database
   * @param {string} id
   * @param {Number} number
   * @returns {any}
   */

  subtract(id, number) {
    if (!id) throw new TypeError("[ SUBTRACT ] NO <ID> SPECIFIED");
    if (typeof id !== "string")
      throw new TypeError("[ SUBTRACT ] <ID> MUST BE A STRING");
    if (!number)
      throw new TypeError(
        `[ SUBTRACT ] - [ NUMBER --> ${id} ] NO <NUMBER> SPECIFIED`
      );
    const data = Number(this.get(id)) || 0;
    const valueToSubstract = Number(number);
    if (!valueToSubstract || isNaN(valueToSubstract))
      throw new Error(
        `[ SUBTRACT ] - [ NUMBER --> ${id} ] <DATA> MUST BE A NUMBER`
      );
    return this.set(id, Number(data - valueToSubstract));
  }

  /**
   * PRIVATE METHOD
   */

  #overwriteAllData(obj) {
    fs.writeFileSync(this.path, JSON.stringify(obj));
  }

  #getFileToJson = () => JSON.parse(fs.readFileSync(this.path));
  #fileExist = () => fs.existsSync(this.path);
}
