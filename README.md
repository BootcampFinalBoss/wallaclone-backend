<h1 align="center">Welcome to Wallaclone 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
</p>

> Wallaclones is a project that unifies an API Rest and a web application for buying and selling items.

### 🏠 [Homepage](https://wallaclone-frontend.herokuapp.com/)

### ✨ [Demo](https://wallaclone-frontend.herokuapp.com/)

## Install

```sh
npm install
```

## Configuration of environment variables (.env)

Copy .env.example file and apply the necessary configuration parameters following the example.

```
cp .env.example .env
```

## How to start a local mongoDB instance for development

```sh
./bin/mongod --dbpath ./data/db --directoryperdb
```

## Load inital database

To load the initial database, run the following command in your Terminal

```sh
npm run initDB
```

**Warning!** Tris script will delete database contents before the load.
**Use it in production only in the first deployment.**


## Usage

```sh
npm run start
```

## Development Start

```sh
npm run dev
```

## API Methods

### List of all adverts

GET --> /api/adverts

**An example of an expected response in JSON format.**

```
[
  {
    "tags": [
        "mobile",
        "work"
      ],
    "_id": "5ffd9a82d2a7011c761b3d35",
    "name": "IphoneX",
    "onsale": true,
    "price": 850,
    "photo": "iphoneX.jpg",
    "__v": 0
    },
    {
    "tags": [
        "lifestyle"
      ],
    "_id": "5ffd9a82d2a7011c761b3d36",
    "name": "Snow Table",
    "onsale": false,
    "price": 200,
    "photo": "table.jpg",
    "__v": 0
  },
]
```

## Get an advert

GET --> /api/adverts/\_id

- Example: http://localhost:5000/api/adverts/5ffeb60f3ab3af260d351b45

```
{
  "result": {
    "tags": [
      "mobile",
      "work"
      ],
    "_id": "5ffeb60f3ab3af260d351b45",
    "name": "IphoneX",
    "onsale": true,
    "price": 850,
    photo": "iphoneX.jpg",
   "__v": 0
   }
}
```


### Paginated Results

- Example: http://localhost:5000/api/adverts?limit=4&skip=0

```
- After a request for all ads, we will get a paginated result of 10 in 10 ads.

-  We can modify the page limit by changing the limit value in the request, in this example the limit is 4.

```

### Apply search filters

We can apply four different search filters.:

- name: http://localhost:5000/api/adverts?name=Super+Bike

```
[
  {
    "tags": [
      "motor",
      "lifestyle"
    ],
    "_id": "6000a39df385c8396f484de5",
    "name": "Super Bike",
    "onsale": true,
    "price": 5000,
    "photo": "moto.jpg",
   "__v": 0
  }
]
```

- tag: http://localhost:5000/api/adverts?tag=motor

```
[
  {
    "tags": [
      "motor",
      "lifestyle"
    ],
    "_id": "6000a39df385c8396f484de5",
    "name": "Super Bike",
    "onsale": true,
    "price": 5000,
    "photo": "moto.jpg",
    "__v": 0
  },
  {
    "tags": [
      "motor",
      "lifestyle"
    ],
    "_id": "6000a39df385c8396f484de6",
    "name": "Mustang GT",
    "onsale": true,
    "price": 32000,
    "photo": "mustang.jpg",
    "__v": 0
  }
]
```

- onsale: http://localhost:5000/api/adverts?onsale=false

```
[
  {
    "tags": [
      "lifestyle"
    ],
    "_id": "6000a39df385c8396f484de4",
    "name": "Snow Table",
    "onsale": false,
    "price": 200,
    "photo": "table.jpg",
    "__v": 0
  }
]
```

- price and price range:

  - 1000 will looks for ads with an equal price as the assigned:
    http://localhost:5000/api/adverts?price=1000

  - -1000 will look for ads that have a price less than 1000:
    http://localhost:5000/api/adverts?price=-1000
  - 10000- will look for ads that have a price higher than 1000:
    http://localhost:5000/api/adverts?price=1000-

  - 100-1000 will look for ads that have a price between 100 and 1000:
    http://localhost:5000/api/adverts?price=100-5000

  - This is a GET request with all search parameters, result limits and order:
    http://localhost:5000/api/adverts?name=iphone&sort=price&price=-1200&onsale=true&tag=mobile&limit=2&skip=0

### Sort Adverts by name, price, tags

- We can apply parameters in the query to sort the results by name, price, onsale or tag.
- This example will show the results in alphabetical order:

```
http://localhost:5000/api/adverts?sort=name
```


## Create an advert

POST --> /api/adverts

- Example: http://localhost:5000/api/adverts/

* body: { name: 'Jeep', price: 4500, onsale: true, ... }

```
{
    "result": {
        "tags": [],
        "_id": "5ffec6f6bb78932c9e6243af",
        "name": "Jeep",
        "onsale": true,
        "price": 4500,
        "photo": "jeep.jpg",
        "__v": 0
    }
}
```

## Update an advert

PUT -> /api/adverts/<\_id>

- Example: http://localhost:5000/api/adverts/5ffec6f6bb78932c9e6243af

* body: { price: 5000 }

```
{
    "result": {
        "tags": [],
        "_id": "5ffec6f6bb78932c9e6243af",
        "name": "Jeep",
        "onsale": true,
        "price": 5000,
        "photo": "jeep.jpg",
        "__v": 0
    }
}
```

## Delete an advert

DELETE -> /api/adverts/<\_id>

- Example: http://localhost:5000/api/adverts/5ffec6f6bb78932c9e6243af

```
Returns: 'HTTP Code 2000'
Message on console: 'Advert deleted succesfully!'
```

## Create an user

POST --> /api/user

- Example: http://localhost:5000/api/user/

* body: { name: 'Jhon', surname: 'Doe', ... }

```
{
    "message": "Se ha registrado correctamente"
}
```

## Update an user

PUT -> /api/user/<\_id>

- Example: http://localhost:5000/api/users/5ffec6f6bb78932c9e6243af

* body: { name: 'Other name', surname: 'Other surname', ... }

```
```

## Delete an user

DELETE -> /api/user/<\_id>

- Example: http://localhost:5000/api/users/5ffec6f6bb78932c9e6243af

```
Returns: 'HTTP Code 200'
Message on console: 'User has been deleted succesfully!'
```


## Website Routes

If we visit the following URL: http://localhost:5000/adverts , we will get all ads.  In adittion we can apply the same search criteria as in the API.

```
http://localhost:5000/adverts?skip=1&limit=2&sort=name&tag=lifestyle
```


## Author

👤 **Kiara Mendoza, Jose Manuel Signoret, Jonathan Rodríguez**

* Github: [@KiaraMendoza, jsignoretfdez, Jrod-Dev](https://github.com/KiaraMendoza, jsignoretfdez, Jrod-Dev)

## Show your support

Give a ⭐️ if this project helped you!

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_