import BaseRoutes from './BaseRoutes'
import AuthController from "../controllers/AuthController";
import { validateRegister, validateLogin } from "../middlewares/validators/AuthValidator";

class Routes extends BaseRoutes {
    public routes(): void {
        this.router.post('/login', validateLogin, AuthController.login)
        this.router.post('/register', validateRegister, AuthController.register)
    }
}

export default new Routes().router;