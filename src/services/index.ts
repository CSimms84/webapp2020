import userRoutes from "./user/routes";
import subscriptionRoutes from "./subscription/routes";
import discountRoutes from "./discount/routes";
import helloRoutes from "./hello/routes";
import orderRoutes from "./order/order.routes";
import frontRoutes from "./front/routes";
import postRoutes from "./post/routes";
import notificationRoutes from "./notification/routes";
import messageRoutes from "./message/routes";



export default [...userRoutes,...helloRoutes,...subscriptionRoutes,...orderRoutes,...discountRoutes,...frontRoutes,...postRoutes,...notificationRoutes,...messageRoutes];