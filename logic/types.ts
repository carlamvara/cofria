export interface Message {
  id: number;
  type: 'direct' | 'custody';
  recipientName: string;
  recipient: string;
  status: 'draft' | 'sealed';
  content: string;
  title: string;
  attachment?: string;
  openingDate?: string;
  sealingDate?: string;
  hasCustodian: boolean;
  custodianName?: string;
  custodianEmail?: string;
  custodianAccepted?: boolean;
  lastAction: string;
  remainingEdits: number;
}

export interface User {
  email: string;
  name: string;
  surname: string;
  phone: string;
  country: string;
  isProfessional?: boolean;
  profession?: string;
  licenseNumber?: string;
  businessAddress?: string;
  businessPhone?: string;
  webLinks?: string;
  socialMedia?: string;
  patientCount?: string;
  isEthicalProfessional?: boolean;
}

export interface ProfessionalInvitation {
  email: string;
  status: 'pending' | 'sent' | 'activated';
  date: string;
  messageType: 'direct' | 'custody';
}
