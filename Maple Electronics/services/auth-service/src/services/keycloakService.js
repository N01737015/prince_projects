const axios = require('axios');

const getTokenWithPassword = async (username, password) => {
  const params = new URLSearchParams();
  params.append('client_id', process.env.KEYCLOAK_CLIENT_ID);
  params.append('grant_type', 'password');
  params.append('username', username);
  params.append('password', password);

  if (process.env.KEYCLOAK_CLIENT_SECRET) {
    params.append('client_secret', process.env.KEYCLOAK_CLIENT_SECRET);
  }

  const response = await axios.post(
    `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`,
    params,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  );

  return response.data;
};

module.exports = {
  getTokenWithPassword
};