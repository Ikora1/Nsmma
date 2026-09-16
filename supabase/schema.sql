-- ====================================================================
-- نَــسْــمَــة (Nasmma) - Supabase Database Schema & Setup Script
-- تشغيل هذا الكود في Supabase SQL Editor لإنشاء الجداول والبيانات
-- ====================================================================

-- 1. جدول الباقات والزهور المخملية (Products Table)
CREATE TABLE IF NOT EXISTS public.nasmma_products (
    id TEXT PRIMARY KEY,
    shopify_id TEXT,
    variant_id TEXT,
    name TEXT NOT NULL,
    description TEXT,
    description_html TEXT,
    price NUMERIC NOT NULL,
    original_price NUMERIC,
    currency_code TEXT DEFAULT 'OMR',
    image TEXT NOT NULL,
    images TEXT[] DEFAULT ARRAY[]::TEXT[],
    badge TEXT,
    category TEXT DEFAULT 'cream',
    product_type TEXT DEFAULT 'باقات الحب والعهود',
    available_for_sale BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. جدول العروض الترويجية والخصم المنبثق (Offers & Popups Table)
CREATE TABLE IF NOT EXISTS public.nasmma_offers (
    id TEXT PRIMARY KEY,
    enabled BOOLEAN DEFAULT true,
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    discount_percentage NUMERIC DEFAULT 10,
    coupon_code TEXT DEFAULT 'NASMMA10',
    badge_text TEXT DEFAULT 'عـرض مـحـدود',
    button_text TEXT DEFAULT 'تـفـعـيـل الـخـصـم واسـتـكـشـاف الـبـاقـات',
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. جدول المشرفين المعتمدين لتوثيق Google و Supabase (Admin Whitelist Table)
-- التوثيق يعتمد بالكامل على Supabase Auth و Google OAuth، ولا تُخزن أي كلمات سر في الكود
CREATE TABLE IF NOT EXISTS public.nasmma_admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ====================================================================
-- تفعيل سياسات الأمان (Row Level Security - RLS)
-- ====================================================================

ALTER TABLE public.nasmma_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nasmma_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nasmma_admin_users ENABLE ROW LEVEL SECURITY;

-- السماح للجميع (الزوار والعملاء) بقراءة المنتجات المتوفرة
CREATE POLICY "Public can read available products" 
ON public.nasmma_products FOR SELECT 
USING (true);

-- السماح للإدارة بالتعديل والإضافة والحذف
CREATE POLICY "Full access on products" 
ON public.nasmma_products FOR ALL 
USING (true);

-- السماح للجميع بقراءة العروض الترويجية
CREATE POLICY "Public can read active offers" 
ON public.nasmma_offers FOR SELECT 
USING (true);

-- السماح للإدارة بالتحكم في العروض
CREATE POLICY "Full access on offers" 
ON public.nasmma_offers FOR ALL 
USING (true);

-- قراءة قائمة المشرفين المصرح لهم
CREATE POLICY "Admin users access" 
ON public.nasmma_admin_users FOR SELECT 
USING (true);

-- ====================================================================
-- إدراج البيانات الأولية بأسعار الريال العُماني (Seed Initial Data)
-- ====================================================================

INSERT INTO public.nasmma_products (
    id, shopify_id, variant_id, name, description, description_html, 
    price, original_price, currency_code, image, images, badge, category, product_type, available_for_sale
) VALUES
(
    'dawn-serenade',
    'gid://shopify/Product/nasmma-1',
    'gid://shopify/ProductVariant/nasmma-v1',
    'بـاقـة فـجـر الـمـحـبـة',
    'باقة ورد مخملي وردي مشغول يدوياً حبة حبة، مربوطة بشريط حرير ناعم مع كرت نسمة البنفسجي.',
    '<p>وردة ناعمة ودافئة مثل الصباحات الهادية. نسجناها بيدينا من خيوط الغليون المخملية عشان تظل في غرفته سنين، وكل ما طالع فيها تذكر ضحكتك وكلامك الطيب. تشمل كرت نسمة البنفسجي الأنيق لكتابة رسالتك الخاصة.</p>',
    18.5,
    22.0,
    'OMR',
    '/images/products/product-1.jpg',
    ARRAY['/images/products/product-1.jpg', '/images/products/product-1-alt.jpg'],
    'Sale',
    'cream',
    'باقات الحب والعهود',
    true
),
(
    'velvet-whisper',
    'gid://shopify/Product/nasmma-2',
    'gid://shopify/ProductVariant/nasmma-v2',
    'مـسـكـة هـمـس الـمـخـمـل',
    'مسكة عروس مخملية بلون التوت الملكي مع مقبض مطرّز بحبات اللؤلؤ الفاخر، صُنعت لتدوم كل العمر.',
    '<p>ليلة عرسك تستاهل مسكة تعيش معك ولا تذبل بعد ليلة الفرح. صممناها ببتلات مخملية قرمزية مطعمة باللؤلؤ، عشان تحطينها في بيتك الجديد وتظل شاهدة على أصدق عهد بينكم.</p>',
    24.0,
    28.0,
    'OMR',
    '/images/products/product-2.jpg',
    ARRAY['/images/products/product-2.jpg', '/images/products/product-2-alt.jpg'],
    'Bestseller',
    'cream',
    'مسكات ليلة العمر',
    true
),
(
    'garden-lily-symphony',
    'gid://shopify/Product/nasmma-3',
    'gid://shopify/ProductVariant/nasmma-v3',
    'مـزهـريـة سـحـر الـبـسـتـان',
    'مزهرية خزفية منقطة تضم زنابق مخملية ملونة مشغولة بحرفية يدوية عالية لتجميل صدر بيتك.',
    '<p>قطعة فنية تجيب ربيع الطبيعة لوسط صالتك بدون أي تعب سقاية أو ذبول. ألوان هادئة تنبض بالحياة والدفء، مصنوعة لتبقى سنين بنفس الرونق والجمال.</p>',
    16.5,
    NULL,
    'OMR',
    '/images/products/product-3.jpg',
    ARRAY['/images/products/product-3.jpg', '/images/products/product-3-alt.jpg'],
    'New',
    'cream',
    'مزهريات الدوام والمكتب',
    true
),
(
    'golden-solstice',
    'gid://shopify/Product/nasmma-4',
    'gid://shopify/ProductVariant/nasmma-v4',
    'بـاقـة شـمـس الـضـحـى',
    'أزهار دوار شمس مخملية مبهجة تبث الأمل والنور في يوم من تحب، وتبقى زاهية للأبد.',
    '<p>شمس ما تغيب... تهديها لشخص يمر بأيام صعبة أو خريج يحتفل بإنجازه، عشان كل ما شافها على مكتبه يتذكر إنك نوره وسنده الدائم.</p>',
    14.0,
    17.0,
    'OMR',
    '/images/products/product-4.jpg',
    ARRAY['/images/products/product-4.jpg', '/images/products/product-4-alt.jpg'],
    'Sale',
    'cream',
    'باقات الحب والعهود',
    true
),
(
    'breeze-of-jasmine',
    'gid://shopify/Product/nasmma-5',
    'gid://shopify/ProductVariant/nasmma-v5',
    'بـاقـة فـجـر الـيـاسـمـيـن',
    'زنابق بيضاء نقية من خيوط الغليون الفاخرة تعكس الهدوء والامتنان العظيم لأغلى الناس.',
    '<p>بيضاء وصافية كقلب الوالدة. هدية مثالية للأم أو للاعتذار الصادق لشخص غالي، تذكره دائماً بصفاء نيتك ومكانته الأزلية بقلبك.</p>',
    15.5,
    NULL,
    'OMR',
    '/images/products/product-5.jpg',
    ARRAY['/images/products/product-5.jpg', '/images/products/product-5-alt.jpg'],
    'Bestseller',
    'cream',
    'باقات الحب والعهود',
    true
),
(
    'blushing-twilight',
    'gid://shopify/Product/nasmma-6',
    'gid://shopify/ProductVariant/nasmma-v6',
    'ثـنـائـيـة بـتـلات الـشـفـق',
    'مزهريتان زجاجيتان مضلعتان بأغصان زهرية ناعمة تخطف الضوء وتهدي المكان لمسة سكينة.',
    '<p>تنسيق عصري راقي يوضع على طاولة السرير أو زاوية القراءة. ملمس ناعم وألوان باستيلية تهدئ النفس وتعطيك نسمة راحة بعد يوم عمل طويل.</p>',
    19.0,
    NULL,
    'OMR',
    '/images/products/product-6.jpg',
    ARRAY['/images/products/product-6.jpg', '/images/products/product-6-alt.jpg'],
    'New',
    'cream',
    'مزهريات الدوام والمكتب',
    true
),
(
    'elysian-blue-bell',
    'gid://shopify/Product/nasmma-7',
    'gid://shopify/ProductVariant/nasmma-v7',
    'بـاقـة روضـة الأقـحـوان',
    'أزهار برية بدرجات الأزرق واللافندر السماوي، صُممت لتكون سلاماً وذكراً لا يغيب عن البال.',
    '<p>مستوحاة من أزهار البراري الحرة. تهديها لشخص مسافر أو صديق بعيد عن العين، وتقول له: ''أنا مو جنبك اليوم، بس وردتي بتظل عندك تذكرك بضحكاتنا سوا''.</p>',
    12.5,
    15.0,
    'OMR',
    '/images/products/product-7.jpg',
    ARRAY['/images/products/product-7.jpg', '/images/products/product-7-alt.jpg'],
    'Sale',
    'cream',
    'باقات الحب والعهود',
    true
),
(
    'lavender-twilight',
    'gid://shopify/Product/nasmma-8',
    'gid://shopify/ProductVariant/nasmma-v8',
    'بـاقـة نـسـمـة الـورد',
    'باقة نسمة المميزة بدرجات الوردي واللافندر الفاخر مع بطاقة الإهداء الفاخرة وشريط الأورجانزا.',
    '<p>الباقة الأيقونية التي تحمل اسم ''نسمة''. تم نسج كل بتلة فيها بعناية فائقة لتكون الهدية الأصدق لكل مناسبة مفاجئة تعبر فيها عن حبك بدون أي سبب مسبق.</p>',
    21.0,
    NULL,
    'OMR',
    '/images/products/product-8.jpg',
    ARRAY['/images/products/product-8.jpg', '/images/products/product-8-alt.jpg'],
    'Bestseller',
    'cream',
    'باقات الحب والعهود',
    true
)
ON CONFLICT (id) DO UPDATE 
SET price = EXCLUDED.price,
    name = EXCLUDED.name,
    currency_code = EXCLUDED.currency_code;

-- إدراج العرض الترويجي الافتراضي
INSERT INTO public.nasmma_offers (
    id, enabled, title, subtitle, discount_percentage, coupon_code, badge_text, button_text, image_url
) VALUES (
    'welcome-offer-10',
    true,
    'هـديـة نَـسْـمَـة لـك · خـصـم 10% عـلـى أول طـلـب',
    'اصنع ذكرى لا تُنسى مع أحبابك بوردة مخملية تدوم لسنوات. استخدم الكود واحصل على خصم فوري 10% على جميع الباقات.',
    10,
    'NASMMA10',
    'عـرض مـحـدود',
    'تـفـعـيـل الـخـصـم واسـتـكـشـاف الـبـاقـات',
    '/images/products/product-1.jpg'
)
ON CONFLICT (id) DO NOTHING;

-- 4. جدول طلبات المتجر وتفاصيل الدفع (Orders Table)
CREATE TABLE IF NOT EXISTS public.nasmma_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT UNIQUE NOT NULL,
    stripe_session_id TEXT UNIQUE,
    amount_omr NUMERIC NOT NULL,
    currency TEXT DEFAULT 'OMR',
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    governorate TEXT NOT NULL,
    delivery_address TEXT,
    gift_message TEXT,
    payment_status TEXT DEFAULT 'pending',
    items JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.nasmma_orders ENABLE ROW LEVEL SECURITY;

-- السماح للإدارة بالوصول الكامل للطلبات
CREATE POLICY "Admin full access on orders"
ON public.nasmma_orders FOR ALL
USING (true);

-- ملاحظة: التوثيق يتم بالكامل عبر Supabase Auth و Google OAuth.
-- لا يتم حفظ أي كلمات سر داخل قاعدة البيانات يدوياً.
-- يمكنك إضافة بريدك المعتمد في جدول nasmma_admin_users أو عبر متغير البيئة ADMIN_EMAILS.
