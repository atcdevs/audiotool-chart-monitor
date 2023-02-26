type Database = { [key: string]: any };

interface Dataset<D extends Database = Database, K extends keyof D = keyof D> {
  /** The Key of the Data Fetched. */
  ID: K;
  /** The Data Fetched. */
  data: D[K];
}

declare class FSDB<D extends Database = Database> {
  /**
   * Create a New FSDB Database.
   * @param path You can specify a path to a file location where your database should be located. (Defaults to `database.json`)
   * @param compact Whether or not to store the database contents in a compact format. It won't be easily readable to humans, but it will save storage space. (Defaults to `true`)
   * @example
   * const db = new FSDB("./db.json", false);
   * // Creates a database at `./db.json` and doesn't compact it, making it easier for humans to read.
   */
  constructor(path?: string, compact?: boolean);

  /**
   * Fetch All Data from the Database.
   * @param verbose Whether or not to escape dot notation and class those as individual entries. (Defaults to `false`)
   * @returns All Data in the Database.
   * @example
   * db.all(false); // with "verbose" disabled
   * // => [{ ID: "key", data: "value" }, { ID: "foo", data: { "bar": "value" } }]
   * @example
   * db.all(true); //with "verbose" enabled
   * // => [{ ID: "key", data: "value" }, { ID: "foo.bar", data: "value" }]
   */
  all(verbose?: boolean): Dataset<D>[] | void;

  /**
   * Retrieve a Value from the Database.
   * @param key The Key of the Data you want to Retrieve.
   * @returns The Data Found. (`null` if not found)
   * @example
   * db.get("key");
   * // => "value"
   */
  get<K extends keyof D>(key: K): D[K] | null;

  /**
   * Retrieve a List of Entries Starting With a Specific Key.
   * @param key The key to search for.
   * @returns The List of Entries.
   * @example
   * db.startsWith("key");
   * // => [{ ID: "key.foo", data: "value" }, { ID: "key.bar", data: "value" }]
   */
  startsWith<K extends keyof D>(key: K): Dataset<D>[] | void;
  // NEEDS WORK

  /**
   * Check if a Key Exists in the Database.
   * @param key The Key to Check.
   * @returns Whether the Key Exists.
   * @example
   * db.has("key");
   * // => true
   */
  has<K extends keyof D>(key: K): boolean | void;

  /**
   * Save a Value to the Database.
   * @param key The Key of the Data you want to Save.
   * @param value The Value you want to Save.
   * @returns Whether the Save was Successful or Not.
   * @example
   * db.set("key", "value");
   * // => { key: "value" }
   * @example
   * db.set("foo.bar", "value");
   * // => { foo: { bar: "value" } }
   */
  set<K extends keyof D, T extends D[K]>(key: K, value: T): boolean;

  /**
   * Push Value(s) to an Array in the Database.
   * @param key The Key of the Array you want to Push to.
   * @param value The Value(s) you want to Push.
   * @returns Whether the Push was Successful or Not.
   * @example
   * db.push("key", "value");
   * // => { key: ["value"] }
   *
   * db.push("key", ["foo", "bar"]);
   * // => { key: ["value", "foo", "bar"] }
   */
  push<K extends keyof D, V extends D[K][number]>(key: K, value: V): boolean;

  /**
   * Remove Value(s) from an Array in the Database.
   * @param key The Key of the Array you want to Remove from.
   * @param value The Value(s) you want to Remove.
   * @returns Whether the Pull was Successful or Not.
   * @example
   * db.pull("key", "value");
   * // => { key: [] }
   */
  pull<K extends keyof D, V extends D[K][number]>(key: K, value: V): boolean;

  /**
   * Add to a Number Value in the Database.
   * @param key The Key of the Number you want to Add to.
   * @param value The Value you want to Add.
   * @returns Whether the Addition was Successful or Not.
   * @example
   * //Assuming the Database contains: { key: 500 }
   * db.add("key", 250);
   * // => { key: 750 }
   */
  add<K extends keyof D, T extends D[K] & number>(key: K, value: T): boolean;

  /**
   * Subtract from a Number Value in the Database.
   * @param key The Key of the Number you want to Subtract from.
   * @param value The Value you want to Subtract.
   * @returns Whether the Subtraction was Successful or Not.
   * @example
   * //Assuming the Database contains: { key: 500 }
   * db.subtract("key", 100);
   * // => { key: 400 }
   */
  subtract<K extends keyof D, T extends D[K] & number>(
    key: K,
    value: T
  ): boolean;

  /**
   * Multiply a Number Value in the Database.
   * @param key The Key of the Number you want to Multiply.
   * @param value The Value you want to Multiply by.
   * @returns Whether the Multiplication was Successful or Not.
   * @example
   * //Assuming the Database contains: { key: 500 }
   * db.multiply("key", 2);
   * // => { key: 1000 }
   */
  multiply<K extends keyof D, T extends D[K] & number>(
    key: K,
    value: T
  ): boolean;

  /**
   * Divide a Number Value in the Database.
   * @param key The Key of the Number you want to Divide.
   * @param value The Value you want to Divide by.
   * @returns Whether the Division was Successful or Not.
   * @example
   * //Assuming the Database contains: { key: 500 }
   * db.divide("key", 2);
   * // => { key: 250 }
   */
  divide<K extends keyof D, T extends D[K] & number>(key: K, value: T): boolean;

  /**
   * Delete a Value from the Database.
   * @param key The Key of the Data you want to Delete.
   * @returns Whether the Deletion was Successful or Not.
   * @example
   * db.delete("key");
   * @example
   * db.delete("foo.bar");
   */
  delete<K extends keyof D>(key: K): boolean;

  /**
   * Delete All Data from the Database. (This cannot be undone!)
   * @returns Whether the Deletion was Successful or Not.
   * @example
   * db.deleteAll();
   */
  deleteAll(): boolean;

  /**
   * Backup all Database Contents to another JSON File. Compact Mode is used on all backups to keep the file size minimal.
   * @param path The Path to the JSON File you want to Backup to.
   * @returns Whether the Backup was Successful or Not.
   * @example
   * db.backup("./Backups/db-backup.json");
   */
  backup(path: string): boolean;
}

declare module "file-system-db" {
  export = FSDB;
}
