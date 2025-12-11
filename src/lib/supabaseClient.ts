import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://jkrjpkqvxomtmezjkltg.supabase.co"
const supabaseAnonKey = "sb_publishable_pjUop-dfmZHT7tSgeRGYVg_isBu4y4E"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
