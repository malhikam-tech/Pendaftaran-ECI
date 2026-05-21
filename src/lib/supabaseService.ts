/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase } from './supabase';
import { RegistrationRecord } from '../types';

export interface SupabaseRow {
  id: string;
  full_name: string;
  birth_date: string;
  gender: string;
  status: string;
  interest: string;
  interest_knowledge: string;
  join_reason: string;
  profile_picture: string;
  agreement: boolean;
  registration_date: string;
  created_at?: string;
}

// Map database row to RegistrationRecord
export function mapRowToRecord(row: SupabaseRow): RegistrationRecord {
  return {
    id: row.id,
    fullName: row.full_name,
    birthDate: row.birth_date,
    gender: row.gender as any,
    status: row.status as any,
    interest: row.interest as any,
    interestKnowledge: row.interest_knowledge,
    joinReason: row.join_reason,
    profilePicture: row.profile_picture,
    agreement: row.agreement,
    registrationDate: row.registration_date
  };
}

// Map RegistrationRecord to database row
export function mapRecordToRow(record: RegistrationRecord): SupabaseRow {
  return {
    id: record.id,
    full_name: record.fullName,
    birth_date: record.birthDate,
    gender: record.gender,
    status: record.status,
    interest: record.interest,
    interest_knowledge: record.interestKnowledge,
    join_reason: record.joinReason,
    profile_picture: record.profilePicture,
    agreement: record.agreement,
    registration_date: record.registrationDate
  };
}

/**
 * Inserts a registration record into Supabase.
 */
export async function insertRegistration(record: RegistrationRecord): Promise<boolean> {
  try {
    const row = mapRecordToRow(record);
    const { error } = await supabase
      .from('registrations')
      .insert([row]);
    
    if (error) {
      console.error('Supabase insert error details:', error);
      throw error;
    }
    return true;
  } catch (err) {
    console.error('Failed to save to Supabase:', err);
    return false;
  }
}

/**
 * Fetches all registrations ordered by creation date descending.
 */
export async function fetchRegistrations(): Promise<RegistrationRecord[]> {
  try {
    const { data, error } = await supabase
      .from('registrations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase fetch error details:', error);
      throw error;
    }

    if (!data) return [];
    return (data as SupabaseRow[]).map(mapRowToRecord);
  } catch (err) {
    console.error('Failed to fetch from Supabase:', err);
    // If table is not ready or has connection error, fallback to mock data or empty
    return [];
  }
}

/**
 * Deletes a single registration by its unique ID.
 */
export async function deleteRegistration(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('registrations')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase delete error details:', error);
      throw error;
    }
    return true;
  } catch (err) {
    console.error(`Failed to delete ID ${id} from Supabase:`, err);
    return false;
  }
}
