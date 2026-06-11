import { Module } from '@nestjs/common';
import { ConfigModule } from './common/config.module';
import { PrismaModule } from './common/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ShopsModule } from './modules/shops/shops.module';
import { CouponsModule } from './modules/coupons/coupons.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { ShippingModule } from './modules/shipping/shipping.module';
import { AdminModule } from './modules/admin/admin.module';
import { UploadModule } from './modules/upload/upload.module';
import { SettingsModule } from './modules/settings/settings.module';
import { SlidesModule } from './modules/slides/slides.module';
import { VariantsModule } from './modules/variants/variants.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { WishlistModule } from './modules/wishlist/wishlist.module';
import { AddressesModule } from './modules/addresses/addresses.module';
import { CartModule } from './modules/cart/cart.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { PagesModule } from './modules/pages/pages.module';
import { BrandsModule } from './modules/brands/brands.module';

@Module({
  imports: [
    ConfigModule,
    PrismaModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    CategoriesModule,
    OrdersModule,
    ShopsModule,
    CouponsModule,
    ReviewsModule,
    PaymentsModule,
    AdminModule,
    ShippingModule,
    UploadModule,
    SettingsModule,
    SlidesModule,
    VariantsModule,
    InventoryModule,
    WishlistModule,
    AddressesModule,
    CartModule,
    WalletModule,
    PagesModule,
    BrandsModule,
  ],
})
export class AppModule {}
