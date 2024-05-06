const {
  client,
  createTables,
  createCustomer,
  createRestaurant,
  fetchCustomers,
  fetchRestaurants,
  createReservation,
  fetchReservations,
  destroyReservation,
} = require("./db");
const express = require("express");
const app = express();

app.use(express.json());
app.use(require("morgan")("dev"));

// routes -------------------------RUBRIC ITEMS 9-13
//RUBRIC ITEM 9: get customers
app.get("/api/customers", async (req, res, next) => {
  try {
    res.send(await fetchCustomers());
  } catch (error) {
    next(error);
  }
});

//RUBRIC ITEM 10: get restaurants
app.get("/api/restaurants", async (req, res, next) => {
  try {
    res.send(await fetchRestaurants());
  } catch (error) {
    next(error);
  }
});

//RUBRIC ITEM 11: get reservations
app.get("/api/reservations", async (req, res, next) => {
  try {
    res.send(await fetchReservations());
  } catch (error) {
    next(error);
  }
});

//RUBRIC ITEM 12: post reservations
app.post("/api/customers/:customer_id/reservations", async (req, res, next) => {
  try {
    res
      .status(201)
      .send(
        await createReservation(
          req.params.customer_id,
          req.body.restaurant_id,
          req.body.rez_date,
          req.body.party_size
        )
      );
  } catch (error) {
    next(error);
  }
});

//RUBRIC ITEM 13: delete reservations
app.delete("/api/reservations/:id", async (req, res, next) => {
  try {
    await destroyReservation({ id: req.params.id });
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

//ERROR HANDLING-----------------------BONUS ITEM
app.use("/api/error", (error, req, res, next) => {
  res.status(res.status || 500).send({ error: error.message });
});

//init stuff
const init = async () => {
  await client.connect();

  //create tables and say if they are created
  await createTables();
  console.log("tables are set");

  //promise all stuff here
  const [
    alexius,
    muriel,
    aenoheso,
    saule,
    vijaya,
    viktorijia,
    oskar,
    ally,
    jevgenija,
    quirinus,
  ] = await Promise.all([
    createCustomer("Alexius"),
    createCustomer("Muriel"),
    createRestaurant("Aenoheso"),
    createCustomer("Saule"),
    createCustomer("Vijaya"),
    createCustomer("Viktorijia"),
    createCustomer("Oskar"),
    createRestaurant("Ally"),
    createRestaurant("Jevgenija"),
    createRestaurant("Quirinus"),
  ]);
  console.log(`data made`);

  //RUBRIC ITEM 5 & 6: comment it back IN to see it work!
  // console.log(await fetchCustomers());
  // console.log(await fetchRestaurants());

  //RUBIRC ITEM 7: the actual create part
  const [reservation] = await Promise.all([
    createReservation(alexius.id, aenoheso.id, "2029-1-25", 10000),
  ]);
  //extra credit obviously. Just comment-IN the lines below and enjoy
  // console.log(`reservations made - which is your favorite?`);
  // console.log(await fetchReservations());

  //destroy stuff
  await destroyReservation({
    id: reservation.id,
    // customer_id: reservation.customer_id,
    // restaurant_id: reservation.restaurant_id,
  });

  const port = process.env.PORT || 3000;
  app.listen(port, () =>
    console.log(`creeping on port 3000, say it twice ${port}`)
  );
};
init();
