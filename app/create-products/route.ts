import { NextResponse } from 'next/server';
import postgres from 'postgres';
import dotenv from 'dotenv';

// .env dosyasını yükle
dotenv.config();

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function createProductsTable() {
  await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      price DECIMAL(10, 2) NOT NULL,
      image_url VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // Örnek ürün verileri
  const products = [
    {
      name: 'Ürün 1',
      description: 'Bu bir örnek ürün açıklamasıdır.',
      price: 199.99,
      image_url: '/products/product1.png'
    },
    {
      name: 'Ürün 2',
      description: 'İkinci örnek ürün hakkında detaylı bilgi.',
      price: 299.99,
      image_url: '/products/product2.png'
    },
    {
      name: 'Ürün 3',
      description: 'Üçüncü ürün için açıklama.',
      price: 149.50,
      image_url: '/products/product3.png'
    }
  ];

  // Ürünleri veritabanına ekle
  for (const product of products) {
    await sql`
      INSERT INTO products (name, description, price, image_url)
      VALUES (${product.name}, ${product.description}, ${product.price}, ${product.image_url})
    `;
  }
}

export async function GET() {
  try {
    await createProductsTable();
    return NextResponse.json({ message: '✅ Ürünler tablosu başarıyla oluşturuldu!' }, { status: 200 });
  } catch (error) {
    console.error('❌ Ürünler tablosu oluşturulurken hata:', error);
    return NextResponse.json({ error: 'Ürünler tablosu oluşturulurken bir hata oluştu' }, { status: 500 });
  }
}
