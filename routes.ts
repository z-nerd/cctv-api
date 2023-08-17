import { Router } from "oak";
import { signin, signup, refresh } from "./services/users.ts";
import {
      createProduct,
      deleteProductById,
      getProductById,
      getProducts,
      updateProductById,
      uploadProductImage,
      getProductImage,
} from "./services/product.ts";
import { Permission, isAuthourized } from "./middlewares/authorized.ts";


const router = new Router();

//user
router.post("/api/signup", signup)
      .post("/api/signin", signin)
      .post("/api/refresh", refresh)


//Product
router.post("/api/products", isAuthourized(Permission.Create), createProduct)
      .post("/api/product-image", isAuthourized(Permission.Upload), uploadProductImage)
      .get("/api/product-image/:imgId", isAuthourized(Permission.ReadFile), getProductImage)
      .get("/api/products", isAuthourized(Permission.Read), getProducts)
      .get("/api/products/:id", isAuthourized(Permission.Read), getProductById)
      .patch("/api/products/:id", isAuthourized(Permission.Update), updateProductById)
      .delete("/api/products/:id", isAuthourized(Permission.Delete), deleteProductById)


export default router;