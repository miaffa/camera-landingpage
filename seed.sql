-- ===========================================
-- LENSFLARE TEST USER SEED DATA
-- ===========================================

-- First, let's create some test plans
INSERT INTO plans (id, name, codename, "default", "hasMonthlyPricing", "monthlyPrice", quotas) VALUES
('free', 'Free', 'free', true, false, 0, '{"canUseApp": true, "numberOfThings": 10, "somethingElse": "basic"}'),
('pro', 'Pro', 'pro', false, true, 2900, '{"canUseApp": true, "numberOfThings": 100, "somethingElse": "advanced"}'),
('premium', 'Premium', 'premium', false, true, 9900, '{"canUseApp": true, "numberOfThings": 1000, "somethingElse": "professional"}');

-- ===========================================
-- PROFESSIONAL PHOTOGRAPHERS (Gear Owners)
-- ===========================================

-- Sarah Chen - Professional Wedding Photographer (Verified)
INSERT INTO app_user (id, name, email, "emailVerified", image, "createdAt", "planId", "stripeCustomerId") VALUES
('user-001', 'Sarah Chen', 'sarah.chen@example.com', NOW(), 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face', NOW() - INTERVAL '2 years', 'premium', 'cus_stripe_sarah_001');

-- Marcus Rodriguez - Commercial Photographer (Verified)
INSERT INTO app_user (id, name, email, "emailVerified", image, "createdAt", "planId", "stripeCustomerId") VALUES
('user-002', 'Marcus Rodriguez', 'marcus.rodriguez@example.com', NOW(), 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', NOW() - INTERVAL '18 months', 'premium', 'cus_stripe_marcus_002');

-- Elena Petrov - Fashion Photographer (Verified)
INSERT INTO app_user (id, name, email, "emailVerified", image, "createdAt", "planId", "stripeCustomerId") VALUES
('user-003', 'Elena Petrov', 'elena.petrov@example.com', NOW(), 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', NOW() - INTERVAL '3 years', 'premium', 'cus_stripe_elena_003');

-- ===========================================
-- SEMI-PROFESSIONAL CREATORS (Mixed Users)
-- ===========================================

-- Jake Thompson - Content Creator (Verified)
INSERT INTO app_user (id, name, email, "emailVerified", image, "createdAt", "planId", "stripeCustomerId") VALUES
('user-004', 'Jake Thompson', 'jake.thompson@example.com', NOW(), 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', NOW() - INTERVAL '1 year', 'pro', 'cus_stripe_jake_004');

-- Maya Patel - Event Photographer (Verified)
INSERT INTO app_user (id, name, email, "emailVerified", image, "createdAt", "planId", "stripeCustomerId") VALUES
('user-005', 'Maya Patel', 'maya.patel@example.com', NOW(), 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face', NOW() - INTERVAL '8 months', 'pro', 'cus_stripe_maya_005');

-- Alex Kim - Videographer (Unverified - Limited Access)
INSERT INTO app_user (id, name, email, "emailVerified", image, "createdAt", "planId") VALUES
('user-006', 'Alex Kim', 'alex.kim@example.com', NULL, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face', NOW() - INTERVAL '2 months', 'free');

-- ===========================================
-- HOBBYISTS & ENTHUSIASTS
-- ===========================================

-- Emma Wilson - Photography Student (Unverified)
INSERT INTO app_user (id, name, email, "emailVerified", image, "createdAt", "planId") VALUES
('user-007', 'Emma Wilson', 'emma.wilson@example.com', NULL, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face', NOW() - INTERVAL '1 month', 'free');

-- David Lee - Hobbyist (Verified)
INSERT INTO app_user (id, name, email, "emailVerified", image, "createdAt", "planId", "stripeCustomerId") VALUES
('user-008', 'David Lee', 'david.lee@example.com', NOW(), 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face', NOW() - INTERVAL '6 months', 'free', 'cus_stripe_david_008');

-- ===========================================
-- TEST ACCOUNTS FOR DEVELOPMENT
-- ===========================================

-- Test Admin Account
INSERT INTO app_user (id, name, email, "emailVerified", image, "createdAt", "planId", "stripeCustomerId") VALUES
('user-admin', 'Test Admin', 'admin@lensflare.test', NOW(), 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', NOW() - INTERVAL '1 year', 'premium', 'cus_stripe_admin');

-- Test User with LemonSqueezy
INSERT INTO app_user (id, name, email, "emailVerified", image, "createdAt", "planId", "lemonSqueezyCustomerId") VALUES
('user-lemon', 'Lemon Test', 'lemon@lensflare.test', NOW(), 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', NOW() - INTERVAL '6 months', 'pro', 'cus_lemon_001');

-- Test User with DodoPayments
INSERT INTO app_user (id, name, email, "emailVerified", image, "createdAt", "planId", "dodoCustomerId") VALUES
('user-dodo', 'Dodo Test', 'dodo@lensflare.test', NOW(), 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', NOW() - INTERVAL '3 months', 'pro', 'cus_dodo_001');

-- ===========================================
-- LOUISVILLE LOCAL USERS (Geographic Testing)
-- ===========================================

-- Local Professional
INSERT INTO app_user (id, name, email, "emailVerified", image, "createdAt", "planId", "stripeCustomerId") VALUES
('user-louisville-001', 'Mike Johnson', 'mike.johnson@louisville.com', NOW(), 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', NOW() - INTERVAL '1 year', 'premium', 'cus_stripe_mike_001');

-- Local Hobbyist
INSERT INTO app_user (id, name, email, "emailVerified", image, "createdAt", "planId") VALUES
('user-louisville-002', 'Lisa Brown', 'lisa.brown@louisville.com', NOW(), 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face', NOW() - INTERVAL '4 months', 'free');

-- ===========================================
-- TEST GEAR DATA
-- ===========================================

-- Sarah Chen's Professional Gear
INSERT INTO gear (id, user_id, name, description, category, brand, model, condition, daily_rate, weekly_rate, monthly_rate, deposit, location, latitude, longitude, is_available, images, specs, created_at, updated_at, is_active) VALUES
(gen_random_uuid(), 'user-001', 'Canon EOS R5', 'Professional mirrorless camera with 45MP sensor, perfect for weddings and commercial work', 'Camera', 'Canon', 'EOS R5', 'Excellent', 150.00, 900.00, 3000.00, 500.00, 'Louisville, Kentucky', 38.2527, -85.7585, true, ARRAY['https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800&h=600&fit=crop'], '45MP Full-Frame CMOS Sensor, 8K Video, 20fps Continuous Shooting', NOW() - INTERVAL '1 year', NOW(), true),
(gen_random_uuid(), 'user-001', 'Canon RF 70-200mm f/2.8L IS USM', 'Professional telephoto zoom lens, perfect for portraits and sports', 'Lens', 'Canon', 'RF 70-200mm f/2.8L IS USM', 'Excellent', 80.00, 450.00, 1500.00, 300.00, 'Louisville, Kentucky', 38.2527, -85.7585, true, ARRAY['https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800&h=600&fit=crop'], 'f/2.8 Aperture, Image Stabilization, Weather Sealed', NOW() - INTERVAL '1 year', NOW(), true),
(gen_random_uuid(), 'user-001', 'Canon RF 24-70mm f/2.8L IS USM', 'Versatile standard zoom lens for all-around photography', 'Lens', 'Canon', 'RF 24-70mm f/2.8L IS USM', 'Excellent', 70.00, 400.00, 1300.00, 250.00, 'Louisville, Kentucky', 38.2527, -85.7585, true, ARRAY['https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800&h=600&fit=crop'], 'f/2.8 Aperture, Image Stabilization, Weather Sealed', NOW() - INTERVAL '1 year', NOW(), true);

-- Marcus Rodriguez's Commercial Gear
INSERT INTO gear (id, user_id, name, description, category, brand, model, condition, daily_rate, weekly_rate, monthly_rate, deposit, location, latitude, longitude, is_available, images, specs, created_at, updated_at, is_active) VALUES
('gear-004', 'user-002', 'Sony A7R IV', 'High-resolution mirrorless camera with 61MP sensor, perfect for commercial and landscape photography', 'Camera', 'Sony', 'A7R IV', 'Excellent', 120.00, 700.00, 2500.00, 400.00, 'Louisville, Kentucky', 38.2527, -85.7585, true, ARRAY['https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800&h=600&fit=crop'], '61MP Full-Frame CMOS Sensor, 4K Video, 10fps Continuous Shooting', NOW() - INTERVAL '8 months', NOW(), true),
('gear-005', 'user-002', 'Sony FE 24-70mm f/2.8 GM', 'Professional standard zoom lens with exceptional sharpness', 'Lens', 'Sony', 'FE 24-70mm f/2.8 GM', 'Excellent', 60.00, 350.00, 1200.00, 200.00, 'Louisville, Kentucky', 38.2527, -85.7585, true, ARRAY['https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800&h=600&fit=crop'], 'f/2.8 Aperture, G Master Quality, Weather Sealed', NOW() - INTERVAL '8 months', NOW(), true),
('gear-006', 'user-002', 'DJI Ronin-S', 'Professional 3-axis gimbal for smooth video and photography', 'Accessory', 'DJI', 'Ronin-S', 'Good', 40.00, 200.00, 600.00, 150.00, 'Louisville, Kentucky', 38.2527, -85.7585, true, ARRAY['https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800&h=600&fit=crop'], '3-Axis Stabilization, 3.6kg Payload, 12 Hour Battery', NOW() - INTERVAL '6 months', NOW(), true);

-- Elena Petrov's Fashion Gear
INSERT INTO gear (id, user_id, name, description, category, brand, model, condition, daily_rate, weekly_rate, monthly_rate, deposit, location, latitude, longitude, is_available, images, specs, created_at, updated_at, is_active) VALUES
('gear-007', 'user-003', 'Canon EOS R6', 'Versatile mirrorless camera perfect for fashion and portrait work', 'Camera', 'Canon', 'EOS R6', 'Excellent', 100.00, 600.00, 2000.00, 300.00, 'Louisville, Kentucky', 38.2527, -85.7585, true, ARRAY['https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800&h=600&fit=crop'], '20MP Full-Frame CMOS Sensor, 4K Video, 20fps Continuous Shooting', NOW() - INTERVAL '1 year', NOW(), true),
('gear-008', 'user-003', 'Canon RF 85mm f/1.2L USM', 'Portrait lens with beautiful bokeh and sharpness', 'Lens', 'Canon', 'RF 85mm f/1.2L USM', 'Excellent', 90.00, 500.00, 1600.00, 350.00, 'Louisville, Kentucky', 38.2527, -85.7585, true, ARRAY['https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800&h=600&fit=crop'], 'f/1.2 Aperture, L Series Quality, Weather Sealed', NOW() - INTERVAL '1 year', NOW(), true);

-- Jake Thompson's Content Creator Gear
INSERT INTO gear (id, user_id, name, description, category, brand, model, condition, daily_rate, weekly_rate, monthly_rate, deposit, location, latitude, longitude, is_available, images, specs, created_at, updated_at, is_active) VALUES
('gear-009', 'user-004', 'Sony A7 III', 'Popular mirrorless camera for content creation and photography', 'Camera', 'Sony', 'A7 III', 'Good', 80.00, 450.00, 1500.00, 250.00, 'Louisville, Kentucky', 38.2527, -85.7585, true, ARRAY['https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800&h=600&fit=crop'], '24MP Full-Frame CMOS Sensor, 4K Video, 10fps Continuous Shooting', NOW() - INTERVAL '6 months', NOW(), true),
('gear-010', 'user-004', 'Sony FE 16-35mm f/2.8 GM', 'Wide-angle zoom lens perfect for vlogging and landscape', 'Lens', 'Sony', 'FE 16-35mm f/2.8 GM', 'Good', 50.00, 280.00, 900.00, 180.00, 'Louisville, Kentucky', 38.2527, -85.7585, true, ARRAY['https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=800&h=600&fit=crop'], 'f/2.8 Aperture, G Master Quality, Weather Sealed', NOW() - INTERVAL '6 months', NOW(), true);

-- ===========================================
-- TEST POSTS DATA
-- ===========================================

-- Sarah Chen's Wedding Photography Posts
INSERT INTO posts (id, user_id, caption, location, image_url, image_alt, created_at, updated_at, is_active) VALUES
('post-001', 'user-001', 'Beautiful sunset wedding at the Louisville Palace Theatre. The golden hour lighting was absolutely perfect! 📸✨ #WeddingPhotography #Louisville #GoldenHour', 'Louisville Palace Theatre, Louisville, KY', 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=800&fit=crop&crop=center', 'Wedding couple dancing at sunset in elegant venue', NOW() - INTERVAL '2 days', NOW(), true),
('post-002', 'user-001', 'Behind the scenes of a commercial shoot for a local restaurant. The Canon R5 never disappoints! 🍽️📷 #CommercialPhotography #BehindTheScenes', 'Downtown Louisville, KY', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=800&fit=crop&crop=center', 'Professional photographer setting up camera for food photography', NOW() - INTERVAL '5 days', NOW(), true);

-- Marcus Rodriguez's Commercial Work
INSERT INTO posts (id, user_id, caption, location, image_url, image_alt, created_at, updated_at, is_active) VALUES
('post-003', 'user-002', 'Architectural photography project for the new downtown development. The Sony A7R IV captures every detail perfectly! 🏢📸 #ArchitecturePhotography #Commercial', 'Downtown Louisville, KY', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=800&fit=crop&crop=center', 'Modern glass building with geometric patterns', NOW() - INTERVAL '1 day', NOW(), true),
('post-004', 'user-002', 'Product photography session for a local tech startup. Clean, minimal, professional. 💻📷 #ProductPhotography #Tech', 'Louisville, KY', 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=800&fit=crop&crop=center', 'Modern laptop and smartphone on clean white background', NOW() - INTERVAL '3 days', NOW(), true);

-- Elena Petrov's Fashion Work
INSERT INTO posts (id, user_id, caption, location, image_url, image_alt, created_at, updated_at, is_active) VALUES
('post-005', 'user-003', 'Fashion editorial shoot for a local designer. The 85mm f/1.2 creates such dreamy bokeh! 👗✨ #FashionPhotography #Portrait', 'Louisville, KY', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=800&fit=crop&crop=center', 'Elegant model in designer dress with soft background blur', NOW() - INTERVAL '4 days', NOW(), true),
('post-006', 'user-003', 'Portrait session with natural lighting. Sometimes the best photos happen when you least expect them! 📸💫 #PortraitPhotography #NaturalLight', 'Louisville, KY', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop&crop=center', 'Professional headshot with natural lighting', NOW() - INTERVAL '6 days', NOW(), true);

-- Jake Thompson's Content Creation
INSERT INTO posts (id, user_id, caption, location, image_url, image_alt, created_at, updated_at, is_active) VALUES
('post-007', 'user-004', 'Vlogging setup for my latest YouTube video about Louisville food scene! The Sony A7 III is perfect for content creation 🎥🍕 #Vlogging #Louisville #Food', 'Louisville, KY', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=800&fit=crop&crop=center', 'Vlogger with camera setup at local restaurant', NOW() - INTERVAL '1 day', NOW(), true),
('post-008', 'user-004', 'Behind the scenes of my latest travel vlog. The 16-35mm lens is perfect for capturing the full scene! 🌍✈️ #TravelVlog #BehindTheScenes', 'Louisville, KY', 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=800&fit=crop&crop=center', 'Travel vlogger with wide-angle camera setup', NOW() - INTERVAL '2 days', NOW(), true);

-- ===========================================
-- POST-GEAR LINKING DATA
-- ===========================================

-- Link gear to posts
INSERT INTO post_gear (id, post_id, gear_id, created_at) VALUES
('pg-001', 'post-001', 'gear-001', NOW() - INTERVAL '2 days'),
('pg-002', 'post-001', 'gear-002', NOW() - INTERVAL '2 days'),
('pg-003', 'post-002', 'gear-001', NOW() - INTERVAL '5 days'),
('pg-004', 'post-002', 'gear-003', NOW() - INTERVAL '5 days'),
('pg-005', 'post-003', 'gear-004', NOW() - INTERVAL '1 day'),
('pg-006', 'post-003', 'gear-005', NOW() - INTERVAL '1 day'),
('pg-007', 'post-004', 'gear-004', NOW() - INTERVAL '3 days'),
('pg-008', 'post-005', 'gear-007', NOW() - INTERVAL '4 days'),
('pg-009', 'post-005', 'gear-008', NOW() - INTERVAL '4 days'),
('pg-010', 'post-006', 'gear-007', NOW() - INTERVAL '6 days'),
('pg-011', 'post-007', 'gear-009', NOW() - INTERVAL '1 day'),
('pg-012', 'post-007', 'gear-010', NOW() - INTERVAL '1 day'),
('pg-013', 'post-008', 'gear-009', NOW() - INTERVAL '2 days'),
('pg-014', 'post-008', 'gear-010', NOW() - INTERVAL '2 days');

-- ===========================================
-- POST LIKES DATA
-- ===========================================

-- Add some likes to posts
INSERT INTO post_likes (id, post_id, user_id, created_at) VALUES
('like-001', 'post-001', 'user-002', NOW() - INTERVAL '1 day'),
('like-002', 'post-001', 'user-003', NOW() - INTERVAL '1 day'),
('like-003', 'post-001', 'user-004', NOW() - INTERVAL '1 day'),
('like-004', 'post-002', 'user-002', NOW() - INTERVAL '4 days'),
('like-005', 'post-002', 'user-003', NOW() - INTERVAL '4 days'),
('like-006', 'post-003', 'user-001', NOW()),
('like-007', 'post-003', 'user-003', NOW()),
('like-008', 'post-003', 'user-004', NOW()),
('like-009', 'post-004', 'user-001', NOW() - INTERVAL '2 days'),
('like-010', 'post-004', 'user-003', NOW() - INTERVAL '2 days'),
('like-011', 'post-005', 'user-001', NOW() - INTERVAL '3 days'),
('like-012', 'post-005', 'user-002', NOW() - INTERVAL '3 days'),
('like-013', 'post-005', 'user-004', NOW() - INTERVAL '3 days'),
('like-014', 'post-006', 'user-001', NOW() - INTERVAL '5 days'),
('like-015', 'post-006', 'user-002', NOW() - INTERVAL '5 days'),
('like-016', 'post-007', 'user-001', NOW()),
('like-017', 'post-007', 'user-002', NOW()),
('like-018', 'post-007', 'user-003', NOW()),
('like-019', 'post-008', 'user-001', NOW() - INTERVAL '1 day'),
('like-020', 'post-008', 'user-002', NOW() - INTERVAL '1 day');

-- ===========================================
-- POST COMMENTS DATA
-- ===========================================

-- Add some comments to posts
INSERT INTO post_comments (id, post_id, user_id, content, created_at, updated_at, is_active) VALUES
('comment-001', 'post-001', 'user-002', 'Absolutely stunning work, Sarah! The lighting is perfect! 🔥', NOW() - INTERVAL '1 day', NOW(), true),
('comment-002', 'post-001', 'user-003', 'Love the composition! What lens did you use?', NOW() - INTERVAL '1 day', NOW(), true),
('comment-003', 'post-002', 'user-002', 'Great behind the scenes shot! The R5 is such a beast 💪', NOW() - INTERVAL '4 days', NOW(), true),
('comment-004', 'post-003', 'user-001', 'Incredible architectural work, Marcus! The details are so crisp', NOW(), NOW(), true),
('comment-005', 'post-004', 'user-003', 'Clean and professional! Perfect for tech products', NOW() - INTERVAL '2 days', NOW(), true),
('comment-006', 'post-005', 'user-001', 'That bokeh is dreamy! The 85mm f/1.2 is magical ✨', NOW() - INTERVAL '3 days', NOW(), true),
('comment-007', 'post-006', 'user-002', 'Natural light portraits are the best! Great work Elena', NOW() - INTERVAL '5 days', NOW(), true),
('comment-008', 'post-007', 'user-001', 'Love the vlogging setup! What camera are you using?', NOW(), NOW(), true),
('comment-009', 'post-007', 'user-003', 'The food looks amazing! Can''t wait to see the video', NOW(), NOW(), true),
('comment-010', 'post-008', 'user-002', 'Wide angle shots are perfect for travel content! Great choice', NOW() - INTERVAL '1 day', NOW(), true);

-- ===========================================
-- POST BOOKMARKS DATA
-- ===========================================

-- Add some bookmarks
INSERT INTO post_bookmarks (id, post_id, user_id, created_at) VALUES
('bookmark-001', 'post-001', 'user-002', NOW() - INTERVAL '1 day'),
('bookmark-002', 'post-001', 'user-004', NOW() - INTERVAL '1 day'),
('bookmark-003', 'post-003', 'user-001', NOW()),
('bookmark-004', 'post-003', 'user-003', NOW()),
('bookmark-005', 'post-005', 'user-001', NOW() - INTERVAL '3 days'),
('bookmark-006', 'post-005', 'user-002', NOW() - INTERVAL '3 days'),
('bookmark-007', 'post-007', 'user-001', NOW()),
('bookmark-008', 'post-007', 'user-003', NOW());