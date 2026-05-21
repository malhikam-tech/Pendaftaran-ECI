/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from '@supabase/supabase-js';

const metaEnv = (import.meta as any).env || {};
const supabaseUrl = metaEnv.VITE_SUPABASE_URL || 'https://xzlbkhrroinoavsxqiha.supabase.co';
const supabaseAnonKey = metaEnv.VITE_SUPABASE_ANON_KEY || 'sb_publishable_aQCA5NSgUtq_WFKjE8z4pA_1x1C_7FE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
