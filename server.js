const app = require("./app");
const withDB = require("./db");

// Sets the PORT for our app to have access to it. If no env has been set, we hard code it to 5005
const PORT = process.env.PORT || 3000;

// Connects to the database
withDB(() => {
  // If connection was successful, start listening for requests
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
});
