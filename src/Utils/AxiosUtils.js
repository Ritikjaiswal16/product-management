export const getHeaderOptions = (token) => ({
        headers: {
          'Content-Type': "application/json;charset=UTF-8",
          'access-control-allow-origin': "*",
          'access-control-allow-methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
          "Authorization": "Bearer "+token,
        }
    })