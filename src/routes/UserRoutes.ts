import BaseRoutes from './BaseRoutes'

import UserController from "../controllers/UserController";
import { isAuth } from "../middlewares/AuthMiddleware";

class Routes extends BaseRoutes {
    public routes(): void {
        this.router.get('/', isAuth, UserController.index)
        this.router.get('/:id', UserController.show)
        this.router.post('/', UserController.create)
        this.router.put('/:id', UserController.update)
        this.router.delete('/:id', UserController.delete)
    }
}

export default new Routes().router;