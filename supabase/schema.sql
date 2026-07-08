-- 1. Profiles Table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  role TEXT CHECK (role IN ('admin', 'seller', 'customer')) DEFAULT 'customer',
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Shops Table
CREATE TABLE shops (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Categories Table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  parent_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  icon_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Products Table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  product_type TEXT CHECK (product_type IN ('physical', 'digital', 'service')),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(12, 2) NOT NULL DEFAULT 0,
  discount_percentage INTEGER NOT NULL DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT 0,
  status TEXT CHECK (status IN ('active', 'draft', 'archived')) DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Product Images Table
CREATE TABLE product_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Orders Table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  shop_id UUID REFERENCES shops(id) ON DELETE SET NULL,
  total_amount DECIMAL(12, 2) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'paid', 'shipped', 'completed', 'cancelled')) DEFAULT 'pending',
  payment_method TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Order Items Table
CREATE TABLE order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price_at_time DECIMAL(12, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS (Row Level Security) - Basic Setup (You will need to expand policies)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Basic Policies (Examples)
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Public shops are viewable by everyone." ON shops FOR SELECT USING (true);
CREATE POLICY "Users can insert their own shop." ON shops FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users can update their own shop." ON shops FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Public categories are viewable by everyone." ON categories FOR SELECT USING (true);
CREATE POLICY "Admins can insert categories." ON categories FOR INSERT WITH CHECK ( EXISTS ( SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin' ) );
CREATE POLICY "Admins can update categories." ON categories FOR UPDATE USING ( EXISTS ( SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin' ) );
CREATE POLICY "Admins can delete categories." ON categories FOR DELETE USING ( EXISTS ( SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin' ) );
CREATE POLICY "Active products are viewable by everyone." ON products FOR SELECT USING (status = 'active');
CREATE POLICY "Sellers can view their own products." ON products FOR SELECT USING ( EXISTS ( SELECT 1 FROM shops WHERE shops.id = shop_id AND shops.owner_id = auth.uid() ) );
CREATE POLICY "Sellers can insert their own products." ON products FOR INSERT WITH CHECK ( EXISTS ( SELECT 1 FROM shops WHERE shops.id = shop_id AND shops.owner_id = auth.uid() ) );
CREATE POLICY "Sellers can update their own products." ON products FOR UPDATE USING ( EXISTS ( SELECT 1 FROM shops WHERE shops.id = shop_id AND shops.owner_id = auth.uid() ) );
CREATE POLICY "Sellers can delete their own products." ON products FOR DELETE USING ( EXISTS ( SELECT 1 FROM shops WHERE shops.id = shop_id AND shops.owner_id = auth.uid() ) );
CREATE POLICY "Product images are viewable by everyone." ON product_images FOR SELECT USING (true);
CREATE POLICY "Sellers can insert product images." ON product_images FOR INSERT WITH CHECK ( EXISTS ( SELECT 1 FROM products p JOIN shops s ON p.shop_id = s.id WHERE p.id = product_id AND s.owner_id = auth.uid() ) );
CREATE POLICY "Sellers can update product images." ON product_images FOR UPDATE USING ( EXISTS ( SELECT 1 FROM products p JOIN shops s ON p.shop_id = s.id WHERE p.id = product_id AND s.owner_id = auth.uid() ) );
CREATE POLICY "Sellers can delete product images." ON product_images FOR DELETE USING ( EXISTS ( SELECT 1 FROM products p JOIN shops s ON p.shop_id = s.id WHERE p.id = product_id AND s.owner_id = auth.uid() ) );

-- Orders Policies
CREATE POLICY "Customers can insert their own orders." ON orders FOR INSERT WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "Customers can view their own orders." ON orders FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY "Sellers can view orders for their shop." ON orders FOR SELECT USING (EXISTS (SELECT 1 FROM shops WHERE shops.id = shop_id AND shops.owner_id = auth.uid()));
CREATE POLICY "Sellers can update orders for their shop." ON orders FOR UPDATE USING (EXISTS (SELECT 1 FROM shops WHERE shops.id = shop_id AND shops.owner_id = auth.uid()));

-- Order Items Policies
CREATE POLICY "Customers can insert order items for their own orders." ON order_items FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_id AND orders.customer_id = auth.uid()));
CREATE POLICY "Customers can view their own order items." ON order_items FOR SELECT USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_id AND orders.customer_id = auth.uid()));
CREATE POLICY "Sellers can view order items for their shop's orders." ON order_items FOR SELECT USING (EXISTS (SELECT 1 FROM orders JOIN shops ON orders.shop_id = shops.id WHERE order_items.order_id = orders.id AND shops.owner_id = auth.uid()));

-- 8. Wishlists Table
CREATE TABLE wishlists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(customer_id, product_id)
);

-- 9. User Addresses Table
CREATE TABLE user_addresses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  label TEXT,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  full_address TEXT NOT NULL,
  city TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can manage their wishlists." ON wishlists FOR ALL USING (auth.uid() = customer_id);
CREATE POLICY "Customers can manage their addresses." ON user_addresses FOR ALL USING (auth.uid() = customer_id);
