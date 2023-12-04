let url = window.location.search
token = url.split('=')[1]

console.log(token);

const createUser = async (token) => {

  const params = {
    token: token,
    firstName: "yacine",
    lastName: "lyoubi",
    password: "Admin123!",
    phoneNumber: "0782716090"
  };

  let urlApi = "http://10.6.112.45:3000"
  let apiPath = "/api"
  let registerPath = "/user/auth/register"

  const queryParams = new URLSearchParams(params);
  const url = urlApi + apiPath + registerPath + "/?" + queryParams

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    // Do something with the response data.
  } catch (error) {
    // Handle errors here.
    console.error('Error:', error);
  }
};

const loginUser = async () => {

  const params = {
    phoneNumber: "0782716090",
    password: "Admin123!"
  };

  let urlApi = "http://10.6.112.45:3000"
  let apiPath = "/api"
  let registerPath = "/user/auth/login"

  const queryParams = new URLSearchParams(params);
  const url = urlApi + apiPath + registerPath + "/?" + queryParams

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    // Do something with the response data.
  } catch (error) {
    // Handle errors here.
    console.error('Error:', error);
  }
};

const redirectUser = async (token) => {
  const params = {
    token: token
  };

  let urlApi = "http://10.6.112.45:3000"
  let apiPath = "/api"
  let registerPath = "/user/auth/get"

  const queryParams = new URLSearchParams(params);
  const url = urlApi + apiPath + registerPath + "/?" + queryParams

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) window.location.replace("http://localhost:5500/register.html")
    if (data.info) window.location.replace("http://localhost:5500/login.html")

    // Do something with the response data.
  } catch (error) {
    // Handle errors here.
    console.error('Error:', error);
  }
}



// loginUser();
// createUser(token);
redirectUser(token);