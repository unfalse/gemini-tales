const loginPage = async (request, reply) => {
  return reply.view('login.ejs');
}

export { loginPage };