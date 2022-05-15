import * as mysql from "mysql";
require("dotenv").config();

let pool = mysql.createPool({
  connectionLimit: 50,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB,
  debug: false,
});

function doAcquire() {
  return new Promise(function (resolve, reject) {
    try {
      pool.getConnection(function (error: any, connection: any) {
        if (error) {
          reject(error);
        }
        resolve(connection);
      });
    } catch (connectionError) {
      reject(connectionError);
    }
  });
}

export function get(queryString: string) {
  return new Promise(async function (resolve: any, reject: any) {
    let connection: any = await doAcquire();
    try {
      connection.query(queryString, function (error: any, results: any) {
        if (error) {
          console.log(error.stack);
          reject(error.stack);
        } else {
          resolve(results);
        }
      });
    } catch (error: any) {
      console.log(error.stack);
      reject(error);
    } finally {
      connection.release();
    }
  });
}

export function insert(table: string, dataJson: any) {
  return new Promise(async function (resolve: any, reject: any) {
    let connection: any = await doAcquire();
    try {
      connection.query(
        "INSERT INTO " + table + " SET ?",
        dataJson,
        function (error: any, results: any) {
          if (error) {
            console.log(error.stack);
            reject(error.stack);
          } else {
            dataJson.id = results.insertId;
            resolve(dataJson);
          }
        }
      );
    } catch (error: any) {
      console.log(error.stack);
      reject(error);
    } finally {
      connection.release();
    }
  });
}

export function update(table: string, dataJson: any, id: number) {
  return new Promise(async function (resolve: any, reject: any) {
    let connection: any = await doAcquire();
    try {
      connection.query(
        "UPDATE " + table + " SET ? WHERE id = ?",
        [dataJson, id],
        function (error: any, results: any) {
          if (error) {
            console.log(error.stack);
            reject(error.stack);
          } else {
            dataJson.id = results.insertId;
            resolve(dataJson);
          }
        }
      );
    } catch (error: any) {
      console.log(error.stack);
      reject(error);
    } finally {
      connection.release();
    }
  });
}

export function remove(table: string, id: number) {
  return new Promise(async function (resolve: any, reject: any) {
    let connection: any = await doAcquire();
    try {
      connection.query(
        `Delete from ${table} where id='${id}'`,
        function (error: any, results: any) {
          if (error) {
            console.log(error.stack);
            reject(error.stack);
          } else {
            resolve("Success");
          }
        }
      );
    } catch (error: any) {
      console.log(error.stack);
      reject(error);
    } finally {
      connection.release();
    }
  });
}
