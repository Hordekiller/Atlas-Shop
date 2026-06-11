import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@atlas-shop.com' },
    update: {},
    create: {
      name: 'مدیر سیستم',
      email: 'admin@atlas-shop.com',
      password: adminPassword,
      role: 'SUPER_ADMIN',
    },
  });

  const electronics = await prisma.category.upsert({
    where: { slug: 'electronics' },
    update: {},
    create: {
      name: 'لوازم الکترونیکی',
      slug: 'electronics',
      description: 'انواع لوازم الکترونیکی و دیجیتال',
      sortOrder: 1,
    },
  });

  const fashion = await prisma.category.upsert({
    where: { slug: 'fashion' },
    update: {},
    create: {
      name: 'مد و پوشاک',
      slug: 'fashion',
      description: 'انواع پوشاک و اکسسوری',
      sortOrder: 2,
    },
  });

  const mobile = await prisma.category.upsert({
    where: { slug: 'mobile' },
    update: {},
    create: {
      name: 'موبایل',
      slug: 'mobile',
      description: 'گوشی موبایل و تبلت',
      parentId: electronics.id,
      sortOrder: 1,
    },
  });

  // Create brands
  const samsung = await prisma.brand.upsert({
    where: { slug: 'samsung' },
    update: {},
    create: { name: 'سامسونگ', slug: 'samsung', description: 'محصولات الکترونیکی سامسونگ', isActive: true },
  });

  await prisma.brand.upsert({
    where: { slug: 'apple' },
    update: {},
    create: { name: 'اپل', slug: 'apple', description: 'محصولات اپل', isActive: true },
  });

  await prisma.brand.upsert({
    where: { slug: 'xiaomi' },
    update: {},
    create: { name: 'شیائومی', slug: 'xiaomi', description: 'محصولات شیائومی', isActive: true },
  });

  // Create sample products
  const productData = [
    {
      title: 'گوشی سامسونگ گلکسی S24',
      slug: 'samsung-galaxy-s24',
      shortDescription: 'گوشی هوشمند پرچمدار سامسونگ با دوربین پیشرفته',
      description: '<p>گوشی سامسونگ گلکسی S24 با جدیدترین تکنولوژی‌های روز دنیا</p>',
      price: 45000000,
      salePrice: 39900000,
      discountPercent: 11,
      discountStartAt: new Date('2026-06-01'),
      discountEndAt: new Date('2026-07-15'),
      stock: 50,
      lowStockThreshold: 5,
      minOrderQty: 1,
      maxOrderQty: 3,
      status: 'in_stock',
      weight: 200,
      length: 15,
      width: 7,
      height: 0.8,
      images: JSON.stringify([{ url: 's24.jpg', alt: 'گوشی سامسونگ گلکسی S24' }]),
      tags: JSON.stringify(['پرفروش', 'جدید']),
      metaTitle: 'خرید گوشی سامسونگ گلکسی S24',
      metaDesc: 'گوشی سامسونگ گلکسی S24 با گارانتی اصالت کالا',
      categoryId: mobile.id,
      brandId: samsung.id,
    },
    {
      title: 'هدفون بلوتوثی سامسونگ Galaxy Buds Pro',
      slug: 'samsung-galaxy-buds-pro',
      shortDescription: 'هدفون بی‌سیم با کیفیت صدای استثنایی',
      description: '<p>هدفون Galaxy Buds Pro با نویز کنسلینگ فعال</p>',
      price: 8500000,
      salePrice: 7200000,
      discountPercent: 15,
      stock: 120,
      status: 'in_stock',
      weight: 50,
      images: JSON.stringify([{ url: 'buds-pro.jpg', alt: 'هدفون سامسونگ' }]),
      tags: JSON.stringify(['پیشنهاد ویژه']),
      categoryId: mobile.id,
      brandId: samsung.id,
    },
  ];

  for (const data of productData) {
    const { brandId, ...rest } = data;
    await prisma.product.upsert({
      where: { slug: data.slug },
      update: {},
      create: {
        ...rest,
        brandId: brandId || null,
        specifications: {
          create: [
            { name: 'وزن', value: `${data.weight || 0} گرم` },
            { name: 'گارانتی', value: '۱۸ ماه گارانتی' },
          ],
        },
      },
    });
  }

  console.log('Seed completed:');
  console.log(`  Admin: ${admin.email} / admin123`);
  console.log(`  Categories: ${electronics.name}, ${mobile.name}, ${fashion.name}`);
  console.log('  Brands: سامسونگ, اپل, شیائومی');
  console.log('  Products: گوشی S24, هدفون Buds Pro');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
