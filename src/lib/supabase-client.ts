'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/types_db'

export const supabase = createClientComponentClient<Database>()