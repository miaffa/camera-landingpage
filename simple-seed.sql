-- Simple seed data for testing
-- Plans
INSERT INTO plans (id, name, codename, "default", "hasMonthlyPricing", "monthlyPrice", quotas) VALUES
('free', 'Free', 'free', true, false, 0, '{"canUseApp": true, "numberOfThings": 10, "somethingElse": "basic"}'),
('pro', 'Pro', 'pro', false, true, 2900, '{"canUseApp": true, "numberOfThings": 100, "somethingElse": "advanced"}'),
('premium', 'Premium', 'premium', false, true, 9900, '{"canUseApp": true, "numberOfThings": 1000, "somethingElse": "professional"}');

-- Test Users
INSERT INTO app_user (id, name, email, "emailVerified", image, "createdAt", "planId", "stripeCustomerId") VALUES
('user-001', 'Sarah Chen', 'sarah.chen@example.com', NOW(), 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face', NOW() - INTERVAL '2 years', 'premium', 'cus_stripe_sarah_001'),
('user-002', 'Marcus Rodriguez', 'marcus.rodriguez@example.com', NOW(), 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', NOW() - INTERVAL '18 months', 'premium', 'cus_stripe_marcus_002'),
('user-003', 'Elena Petrov', 'elena.petrov@example.com', NOW(), 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', NOW() - INTERVAL '3 years', 'premium', 'cus_stripe_elena_003'),
('user-004', 'Jake Thompson', 'jake.thompson@example.com', NOW(), 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', NOW() - INTERVAL '1 year', 'pro', 'cus_stripe_jake_004');

-- Test Gear
INSERT INTO gear (id, user_id, name, description, category, brand, model, condition, daily_rate, weekly_rate, monthly_rate, deposit, location, latitude, longitude, is_available, images, specs, created_at, updated_at, is_active) VALUES
(gen_random_uuid(), 'user-001', 'Canon EOS R5', 'Professional mirrorless camera with 45MP sensor', 'Camera', 'Canon', 'EOS R5', 'Excellent', 150.00, 900.00, 3000.00, 500.00, 'Louisville, Kentucky', 38.2527, -85.7585, true, ARRAY['https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800&h=600&fit=crop'], '45MP Full-Frame CMOS Sensor, 8K Video', NOW() - INTERVAL '1 year', NOW(), true),
(gen_random_uuid(), 'user-002', 'Sony A7R IV', 'High-resolution mirrorless camera with 61MP sensor', 'Camera', 'Sony', 'A7R IV', 'Excellent', 120.00, 700.00, 2500.00, 400.00, 'Louisville, Kentucky', 38.2527, -85.7585, true, ARRAY['https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800&h=600&fit=crop'], '61MP Full-Frame CMOS Sensor, 4K Video', NOW() - INTERVAL '8 months', NOW(), true),
(gen_random_uuid(), 'user-003', 'Canon EOS R6', 'Versatile mirrorless camera perfect for fashion work', 'Camera', 'Canon', 'EOS R6', 'Excellent', 100.00, 600.00, 2000.00, 300.00, 'Louisville, Kentucky', 38.2527, -85.7585, true, ARRAY['https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800&h=600&fit=crop'], '20MP Full-Frame CMOS Sensor, 4K Video', NOW() - INTERVAL '1 year', NOW(), true),
(gen_random_uuid(), 'user-004', 'Sony A7 III', 'Popular mirrorless camera for content creation', 'Camera', 'Sony', 'A7 III', 'Good', 80.00, 450.00, 1500.00, 250.00, 'Louisville, Kentucky', 38.2527, -85.7585, true, ARRAY['https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800&h=600&fit=crop'], '24MP Full-Frame CMOS Sensor, 4K Video', NOW() - INTERVAL '6 months', NOW(), true);

-- Test Posts
INSERT INTO posts (id, user_id, caption, location, image_url, image_alt, created_at, updated_at, is_active) VALUES
(gen_random_uuid(), 'user-001', 'Beautiful sunset wedding at the Louisville Palace Theatre. The golden hour lighting was absolutely perfect! 📸✨ #WeddingPhotography #Louisville #GoldenHour', 'Louisville Palace Theatre, Louisville, KY', 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=800&fit=crop&crop=center', 'Wedding couple dancing at sunset in elegant venue', NOW() - INTERVAL '2 days', NOW(), true),
(gen_random_uuid(), 'user-002', 'Architectural photography project for the new downtown development. The Sony A7R IV captures every detail perfectly! 🏢📸 #ArchitecturePhotography #Commercial', 'Downtown Louisville, KY', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=800&fit=crop&crop=center', 'Modern glass building with geometric patterns', NOW() - INTERVAL '1 day', NOW(), true),
(gen_random_uuid(), 'user-003', 'Fashion editorial shoot for a local designer. The 85mm f/1.2 creates such dreamy bokeh! 👗✨ #FashionPhotography #Portrait', 'Louisville, KY', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=800&fit=crop&crop=center', 'Elegant model in designer dress with soft background blur', NOW() - INTERVAL '4 days', NOW(), true),
(gen_random_uuid(), 'user-004', 'Vlogging setup for my latest YouTube video about Louisville food scene! The Sony A7 III is perfect for content creation 🎥🍕 #Vlogging #Louisville #Food', 'Louisville, KY', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=800&fit=crop&crop=center', 'Vlogger with camera setup at local restaurant', NOW() - INTERVAL '1 day', NOW(), true);
