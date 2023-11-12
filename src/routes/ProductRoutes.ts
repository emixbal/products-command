import BaseRoutes from './BaseRoutes'

import ProductController from "../controllers/ProductController";
import { isAuth } from "../middlewares/AuthMiddleware";
import { validateCreate } from "../middlewares/validators/ProductValidator";

class Routes extends BaseRoutes {
    public routes(): void {
        this.router.get('/', isAuth, ProductController.index)
        this.router.get('/:id', isAuth, ProductController.show)
        this.router.post('/', isAuth, validateCreate, ProductController.create)
        this.router.put('/:id', isAuth, ProductController.update)
        this.router.delete('/:id', isAuth, ProductController.delete)
    }
}

export default new Routes().router;