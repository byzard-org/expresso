const ClientRouterService = require("../../services/client-router");
const AuthService = require("../../services/auth");

ClientRouterService.of("/")
  .register(
    {
      clientView: "index",
    },
    async (req, res) => {
      const user = await AuthService.authUser(req);
      const name = req.query.name || user.name;
      const data = {
        user,
        name,
      };
      return data;
    }
  )
  .register(
    {
      clientView: "custom.ejs",
      route: "/about",
    },
    {}
  );
