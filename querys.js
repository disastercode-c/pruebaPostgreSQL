const { Pool } = require("pg");

const config = {
  user: "postgres",
  password: "postgres",
  host: "localhost",
  database: "elecciones",
  port: 5432,
};

const pool = new Pool(config);

const insertar = async (datos) => {
  const datosCandidato = {
    text:
      "INSERT INTO candidatos (nombre, foto, color, votos) VALUES ($1,$2,$3,0) RETURNING *;",
    values: datos,
  };
  try {
    const candidato = await pool.query(datosCandidato);
    return candidato.rows;
  } catch (error) {
    console.log(error.code);
  }
};

const consultar = async () => {
  try {
    const getCandidato = { text: "SELECT * FROM candidatos;" };
    const candidatos = await pool.query(getCandidato);
    return candidatos.rows;
  } catch (e) {
    console.log(e.code);
    return e;
  }
};

const eliminar = async (id) => {
  try {
    const deleteCandidato = `DELETE FROM candidatos WHERE id = ${id} RETURNING *;`;
    const result = await pool.query(deleteCandidato);
    return result;
  } catch (e) {
    console.log(e.code);
    return e;
  }
};

const editar = async (datos) => {
  const datosActualizar = {
    text:
      "UPDATE candidatos SET nombre = $1, foto = $2 WHERE id = $3 RETURNING *;",
    values: datos,
  };
  try {
    const actualizado = await pool.query(datosActualizar);
    return actualizado;
  } catch (e) {
    console.log(e.code);
    return e;
  }
};

const votar = async (datos) => {
  try {
    const actualizaCandidato = {
      text:
        "UPDATE candidatos SET votos = votos + $1 WHERE nombre = $2 RETURNING *;",
      values: [datos[1], datos[2]],
    };

    await pool.query(actualizaCandidato);

    const datosVoto = {
      text: "INSERT INTO historial values ($1, $2, $3) RETURNING *;",
      values: datos,
    };

    const dataVoto = await pool.query(datosVoto);
    
    await pool.query("COMMIT");
    return dataVoto;
  } catch (error) {
    await pool.query("ROLLBACK");
    return error;
  }
};

const getHistorial = async () => {
  const consultaHistorial = {
    text: "SELECT * FROM historial;",
    rowMode: "array",
  };

  try {
    const traerHistorial = await pool.query(consultaHistorial);
    return traerHistorial.rows;
  } catch (e) {
    return e;
  }
};

module.exports = { insertar, consultar, eliminar, editar, votar, getHistorial };
