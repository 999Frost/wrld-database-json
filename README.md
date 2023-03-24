<p align="center"><a href="https://nodei.co/npm/wrld-db/"><img src="https://nodei.co/npm/wrld-db.png"></a></p>

## ⚙️・Installation
To install the package, run this on your terminal :
```
npm i wrld-db@latest
```
or this 
```
yarn add wrld-db
```

## 🏹・Example

Here's an example of how to use this package easily.

```js
const Database = require("wrld-db");
const db = new Database("./users.json");

// Set data in the database ( ./users.json )
db.set("Users", "Frost");

// Get data in the database ( ./users.json )
db.get("Users"); // return : Frost

// Delete data in the database
db.delete("Users");

db.get("Users"); // return : undefined
db.has("Users"); // return : false

// Set data in the database ( ./users.json )
db.set("money", 10);
// add data ( number ) in the database ( ./users.json )
db.add("money", 1); // return : 11
// subtract data ( number ) in the database ( ./users.json )
db.subtract("age", 10); // return : 1

// Set data in the database ( ./users.json )
db.set("fruits", [ "orange" ]);
db.push("fruits", "banana"); // return : [ "orange", "banana" ]

// Delete all the data from all the database
db.deleteAll();

// Get all the data from all the database
db.getAll();
```

## Support
If you need help, contact me on discord [here](https://discord.com/users/548028946097111045)
or on github [here]([https://github.com/999Frost](https://github.com/999Frost/wrld-db)
