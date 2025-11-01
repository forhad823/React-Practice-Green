//........ Read/Get ............

const url1 = "https://jsonplaceholder.typicode.com/users";
fetch(url1)
  .then((res) => res.json())
  .then((data) => console.log(data));

//   .......... Create/Post ..............

const url2 = "https://example.com/api/user";
const user = { name: "John Doe", email: "john.doe@example.com" };
const options2 = {
  method: "POST",
  body: JSON.stringify(user),
  headers: {
    "Content-type": "application/json",
  },
};

fetch(url2, options2)
  .then((res) => res.json())
  .then((data) => console.log(data))
  .catch((error) => console.error(error));

// -----Update (PUT/PATCH)-------

const url3 = "https://jsonplaceholder.typicode.com/users/1";
const updatedUser = { name: "John Doe", email: "john.doe@newemail.com" };
const options3 = {
  method: "PUT",
  body: JSON.stringify(updatedUser),
  headers: {
    "Content-type": "application/json",
  },
};

fetch(url3, options3)
  .then((res) => res.json())
  .then((data) => console.log(data))
  .catch((error) => console.error(error));

// ------ Delete ------

const url = "https://jsonplaceholder.typicode.com/users/1";
const options = {
  method: "DELETE",
};


fetch(url, options)
  .then((res) => res.json())
  .then((data) => console.log("Deleted:", data))
  .catch((error) => console.error(error));
