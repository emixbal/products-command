import BaseRoutes from './BaseRoutes'

import ProductController from "../controllers/ProductController";
import { isAuth } from "../middlewares/AuthMiddleware";
import { validateAllForm } from "../middlewares/validators/ProductValidator";
import { validateUUID } from "../middlewares/validators/UuidValidator";

class Routes extends BaseRoutes {
    public routes(): void {
        this.router.get('/', isAuth, ProductController.index)
        this.router.get('/:id', isAuth, validateUUID, ProductController.show)
        this.router.post('/', isAuth, validateAllForm, ProductController.create)
        this.router.put('/:id', isAuth, validateUUID, validateAllForm, ProductController.update)
        this.router.delete('/:id', isAuth, validateUUID, ProductController.delete)
    }
}

export default new Routes().router;