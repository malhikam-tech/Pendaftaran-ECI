/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface RegistrationForm {
  fullName: string;
  birthDate: string; // YYYY-MM-DD
  gender: 'Laki-laki' | 'Perempuan' | '';
  status: 'Pelajar' | 'Mahasiswa' | 'Bekerja' | 'Berkeluarga' | 'Lainnya' | '';
  interest: 
    | 'Astronomi'
    | 'History/Sejarah'
    | 'Teknologi informasi & Coding'
    | 'Psikologi & Mental health'
    | 'Linguistik & Bahasa asing'
    | 'Sastra & Kepenulisan kreatif'
    | 'Fisika & Matematika murni'
    | 'Desain grafis & Visual'
    | 'Lainnya'
    | '';
  interestKnowledge: string; // Pengetahuan terhadap minat
  joinReason: string; // Alasan bergabung
  profilePicture: string; // Base64 string / DataURL
  agreement: boolean; // Persetujuan kebijakan
}

export interface RegistrationRecord extends RegistrationForm {
  id: string; // Unique ID (e.g. ECI-2026-XXXX)
  registrationDate: string; // DD/MM/YYYY or similar
}
