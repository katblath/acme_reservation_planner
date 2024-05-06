const pg = require("pg");
//RUBRIC ITEM 1
const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/acme_reservation_planner_db"
);

const uuid = require("uuid");

//RUBRIC ITEM 2: create tabls in code... for some reason
const createTables = async () => {
  const SQL = `--sql
    DROP TABLE IF EXISTS reservations;
    DROP TABLE IF EXISTS customers;
    DROP TABLE IF EXISTS restaurants;
    CREATE TABLE restaurants(
      id UUID PRIMARY KEY,
      name VARCHAR(255) NOT NULL
    );
    CREATE TABLE customers(
      id UUID PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL
    );
    CREATE TABLE reservations(
      id UUID PRIMARY KEY,
      rez_date DATE NOT NULL,
      party_size INTEGER NOT NULL,
      customer_id UUID REFERENCES customers(id) NOT NULL,
      restaurant_id UUID REFERENCES restaurants(id) NOT NULL
    );
    `;
  await client.query(SQL);
};

//RUBRIC ITEM 3: create customers
const createCustomer = async (name) => {
  const SQL = `--sql 
  INSERT INTO customers(id, name) VALUES($1, $2)
  RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), name]);
  return response.rows[0];
};

//RUBRIC ITEM 4: create restaurants
const createRestaurant = async (name) => {
  const SQL = `--sql 
  INSERT INTO restaurants(id, name) VALUES($1, $2) RETURNING *`;
  const response = await client.query(SQL, [uuid.v4(), name]);
  return response.rows[0];
};

fetchCustomers = async () => {
  const SQL = `--sql 
  SELECT * FROM customers`;
  const response = await client.query(SQL);
  return response.rows;
};
fetchRestaurants = async () => {
  const SQL = `--sql 
  SELECT * FROM restaurants`;
  const response = await client.query(SQL);
  return response.rows;
};

//RUBIRC ITEM 7: first part
createReservation = async (
  customer_id,
  restaurant_id,
  rez_date,
  party_size
) => {
  const SQL = `--sql 
  INSERT INTO reservations(id, customer_id, restaurant_id, rez_date, party_size) VALUES($1, $2, $3, $4, $5) RETURNING *`;
  const response = await client.query(SQL, [
    uuid.v4(),
    customer_id,
    restaurant_id,
    rez_date,
    party_size,
  ]);
  return response.rows[0];
};

//extra credit obviously
const fetchReservations = async () => {
  const SQL = `--sql 
  SELECT * FROM reservations`;
  const response = await client.query(SQL);
  return response.rows;
};

//RUBRIC ITEM 8: destroy reservation
const destroyReservation = async ({ id }) => {
  const SQL = `--sql 
  DELETE FROM reservations WHERE id = $1`;
  await client.query(SQL, [id]);
};

module.exports = {
  client,
  createTables,
  createCustomer,
  createRestaurant,
  fetchCustomers,
  fetchRestaurants,
  createReservation,
  fetchReservations,
  destroyReservation,
};
