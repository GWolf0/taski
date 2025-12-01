# TODO 1

- [x] Read plan.yml and understand project requirements
- [x] Install required packages (jsonwebtoken, zod, zustand, dnd-kit, nano_id, etc)
- [x] Install required shadcn uis required components
- [x] Setup .env.example with required vars
- [x] Setup initial migartion to setup database schema "/migrations/database_init.sql" to create tables, need uuid for ids, tables are ("users", "projects"), check "plan.yml" and "types/models.ts" for refenrence
- [x] setup supabase for database and auth capabilities (/helpers/supabase.ts)
- [x] setup the files in "/services/systems"
- [x] define zod validations instance in "/helpers/validators" for each model, include partial validations
- [x] check middleware.ts
- [x] implement "/services/requests/authRequests", to handle auth related requests (server functions)
- [x] implement "/helpers/policies", handling policies for the current authUser
- [x] implement "/helpers/converters", to handle conversions from db structure to typescript models structure
- [x] implement the crud server actions for "/services/requests/taskRequests.ts" and "/services/requests/userRequests.ts", handling crud ops for (ProjectModel, ProfileModel)
