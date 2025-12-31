-- NEEDS UPDATE (SOME FIELDS WERE CHANGED, REFER TO SETUP_DATABASE MIGRATION)

-- -- ==========================================================
-- -- SEED DATA FOR TASKI PROJECT
-- -- Creates 3 auth users and 1–3 projects per user
-- -- ==========================================================

-- -- Ensure UUID extension
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -- ==========================================================
-- -- USERS (profiles auto-created by trigger)
-- -- ==========================================================

-- -- User 1
-- DO $$
-- BEGIN
--     PERFORM auth.create_user(
--         email := 'alice@example.com',
--         password := 'Password123!',
--         email_confirm := true,
--         raw_app_meta_data := jsonb_build_object('role', 'user', 'provider', 'email'),
--         raw_user_meta_data := jsonb_build_object('name', 'Alice')
--     );
-- END $$;

-- -- User 2
-- DO $$
-- BEGIN
--     PERFORM auth.create_user(
--         email := 'bob@example.com',
--         password := 'Password123!',
--         email_confirm := true,
--         raw_app_meta_data := jsonb_build_object('role', 'user', 'provider', 'email'),
--         raw_user_meta_data := jsonb_build_object('name', 'Bob')
--     );
-- END $$;

-- -- User 3
-- DO $$
-- BEGIN
--     PERFORM auth.create_user(
--         email := 'carol@example.com',
--         password := 'Password123!',
--         email_confirm := true,
--         raw_app_meta_data := jsonb_build_object('role', 'user', 'provider', 'email'),
--         raw_user_meta_data := jsonb_build_object('name', 'Carol')
--     );
-- END $$;

-- -- ==========================================================
-- -- PROJECTS
-- -- ==========================================================
-- -- For each user, create 1–2 projects randomly

-- INSERT INTO public.projects (id, title, description, data, user_id, created_at, updated_at)
-- SELECT
--     uuid_generate_v4(),
--     'Project ' || gs.n || ' for ' || p.name,
--     'This is a sample project for ' || p.name,
--     '{}',
--     p.id,
--     NOW(),
--     NOW()
-- FROM public.profiles p
-- JOIN generate_series(1, (floor(random() * 2 + 1))::int) AS gs(n) ON true;
