import BaseRoutes from './BaseRoutes'

import TodoController from "../controllers/TodoController";
import { isAuth } from "../middlewares/AuthMiddleware";

class Routes extends BaseRoutes {
    public routes(): void {
        this.router.get('/', isAuth, TodoController.index)
        this.router.get('/:id', isAuth, TodoController.show)
        this.router.post('/', isAuth, TodoController.create)
        this.router.put('/:id', isAuth, TodoController.update)
        this.router.delete('/:id', isAuth, TodoController.delete)
    }
}

export default new Routes().router;