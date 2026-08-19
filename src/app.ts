import { Application, Request, Response } from "express";
import express from "express"
import cors from "cors"
import config from "./config";
import cookieParser from "cookie-parser";
import { userRouter } from "./modules/users/user.router";
import { authRouter } from "./modules/auth/auth.router";
import { roleRoutes } from "./modules/role/role.router";
import { permissionRouter } from "./modules/permission/permission.router";
import { rolePermissionRouter } from "./modules/rolePermission/rolePermission.router";
import { adminRouter } from "./modules/admin/admin.router";
import { productRouter } from "./modules/product/product.route";
import { categoryRouter } from "./modules/category/category.route";
import { doorTypeRoutes } from "./modules/doorType/doorType.route";
import { doorMaterialRoutes } from "./modules/doorMaterial/doorMaterial.route";
import { doorOpeningTypeRoutes } from "./modules/doorOpeningType/doorOpeningType.route";

const app:Application=express();

app.use(cors({
   origin:config.app_url,
   credentials:true
}));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());


app.get("/",async(req:Request,res:Response)=>{
    res.send("Hello world!");
});

app.use("/api/auth",userRouter);
app.use("/api/auth",authRouter);
app.use("/api/auth",adminRouter)
app.use("/api/v1/role",roleRoutes);
app.use("/api/v1/permissions", permissionRouter);
app.use("/api/v1/roles",rolePermissionRouter);
app.use("/api/v1/products",productRouter);
app.use("/api/v1/categories",categoryRouter);
app.use("/api/v1/door-type",doorTypeRoutes);
app.use("/api/v1/door-materials",doorMaterialRoutes);
app.use("/api/v1/door-opening-types",doorOpeningTypeRoutes);




export default app;