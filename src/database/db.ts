import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://kirjiizhqazgzgguqsie.supabase.co";
const supabaseKey: string = process.env.SUPABASE_KEY as string;
let connection: ReturnType<typeof createClient>;

/**
 * Makes a connection to a Supabase database. If a connection already exists, does nothing.
 * Call this function before all API routes.
 * @returns {ReturnType<typeof createClient>}
 */
const connectDB = () => {
  if (!connection) {
    connection = createClient(supabaseUrl, supabaseKey);
  }
  return connection;
};

export default connectDB;
