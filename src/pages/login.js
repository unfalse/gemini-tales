const loginPage = async (request, reply) => {
  return reply.view('login.ejs', {
    message: request.query.message ?? null,
  });
}

export { loginPage };