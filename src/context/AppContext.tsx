import React, { createContext, useContext, useState, useEffect } from 'react';
import { RIDES_DATA, Ride } from '../data/rides';
import { TRIPS_DATA, Trip } from '../data/trips';
import {
  MEMBERSHIP_TIERS,
  MembershipTier,
  INITIAL_MEMBERS,
  ClubMember,
  INITIAL_SENT_EMAILS,
  SentEmail,
  PaymentTransaction,
  StripeConfig,
  BankConfig,
  INITIAL_TRANSACTIONS,
  INITIAL_STRIPE_CONFIG,
  INITIAL_BANK_CONFIG,
} from '../data/club';

export interface Registration {
  id: string;
  type: 'ride' | 'trip' | 'membership';
  targetId: string;
  targetTitle: string;
  name: string;
  email: string;
  phone: string;
  dateCreated: string;
  details?: Record<string, any>;
  status: 'confirmé' | 'en_attente' | 'annulé';
  paymentId?: string;
  paymentMethod?: string;
  amountPaid?: number;
}

interface AppContextType {
  rides: Ride[];
  trips: Trip[];
  registrations: Registration[];
  members: ClubMember[];
  membershipTiers: MembershipTier[];
  sentEmails: SentEmail[];
  isAdminLoggedIn: boolean;
  adminEmail: string;
  loginAdmin: (email: string, pass: string) => boolean;
  logoutAdmin: () => void;

  // Member Authentication & Espace Membre
  currentMember: ClubMember | null;
  loginMember: (email: string, pass: string) => boolean;
  logoutMember: () => void;
  updateCurrentMemberProfile: (updated: Partial<ClubMember>) => void;

  // Transactions & Stripe / Bank
  transactions: PaymentTransaction[];
  stripeConfig: StripeConfig;
  bankConfig: BankConfig;
  processPayment: (paymentData: {
    amount: number;
    description: string;
    method: PaymentTransaction['method'];
    targetType: PaymentTransaction['targetType'];
    targetId: string;
    memberEmail: string;
    memberName: string;
    password?: string;
  }) => PaymentTransaction;
  confirmWirePayment: (transactionId: string) => void;
  updateStripeConfig: (config: StripeConfig) => void;
  updateBankConfig: (config: BankConfig) => void;

  // Rides CRUD
  addRide: (ride: Omit<Ride, 'id' | 'registeredCount'>) => void;
  updateRide: (id: string, updated: Partial<Ride>) => void;
  deleteRide: (id: string) => void;

  // Trips CRUD
  addTrip: (trip: Omit<Trip, 'id'>) => void;
  updateTrip: (id: string, updated: Partial<Trip>) => void;
  deleteTrip: (id: string) => void;

  // Registrations
  addRegistration: (reg: Omit<Registration, 'id' | 'dateCreated' | 'status'> & { password?: string }) => void;
  updateRegistrationStatus: (id: string, status: Registration['status']) => void;
  deleteRegistration: (id: string) => void;

  // Members & Roles CRUD
  addMember: (member: Omit<ClubMember, 'id' | 'joinDate'>) => void;
  updateMember: (id: string, updated: Partial<ClubMember>) => void;
  deleteMember: (id: string) => void;
  updateMemberRole: (id: string, role: ClubMember['role']) => void;
  toggleNewsletterSubscription: (id: string) => void;

  // Membership Tiers & Pricing CRUD
  addMembershipTier: (tier: Omit<MembershipTier, 'id'>) => void;
  updateMembershipTier: (id: string, updated: Partial<MembershipTier>) => void;
  deleteMembershipTier: (id: string) => void;
  toggleTierActive: (id: string) => void;
  setRecommendedTier: (id: string) => void;

  // Mailing List & Email Broadcasts
  sendBroadcastEmail: (emailData: {
    subject: string;
    targetSegment: string;
    body: string;
    recipientsCount: number;
  }) => void;

  // Reset demo data
  resetToDefault: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  RIDES: 'km0_be_rides_v4',
  TRIPS: 'km0_be_trips_v4',
  REGISTRATIONS: 'km0_be_registrations_v4',
  MEMBERS: 'km0_be_members_v4',
  TIERS: 'km0_be_tiers_v4',
  EMAILS: 'km0_be_emails_v4',
  AUTH: 'km0_be_admin_auth_v4',
  MEMBER_AUTH: 'km0_be_member_auth_v4',
  TRANSACTIONS: 'km0_be_transactions_v4',
  STRIPE_CONFIG: 'km0_be_stripe_config_v4',
  BANK_CONFIG: 'km0_be_bank_config_v4',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rides, setRides] = useState<Ride[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.RIDES);
      return stored ? JSON.parse(stored) : RIDES_DATA;
    } catch {
      return RIDES_DATA;
    }
  });

  const [trips, setTrips] = useState<Trip[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TRIPS);
      return stored ? JSON.parse(stored) : TRIPS_DATA;
    } catch {
      return TRIPS_DATA;
    }
  });

  const [members, setMembers] = useState<ClubMember[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.MEMBERS);
      return stored ? JSON.parse(stored) : INITIAL_MEMBERS;
    } catch {
      return INITIAL_MEMBERS;
    }
  });

  const [membershipTiers, setMembershipTiers] = useState<MembershipTier[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TIERS);
      return stored ? JSON.parse(stored) : MEMBERSHIP_TIERS;
    } catch {
      return MEMBERSHIP_TIERS;
    }
  });

  const [sentEmails, setSentEmails] = useState<SentEmail[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.EMAILS);
      return stored ? JSON.parse(stored) : INITIAL_SENT_EMAILS;
    } catch {
      return INITIAL_SENT_EMAILS;
    }
  });

  const [registrations, setRegistrations] = useState<Registration[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS);
      if (stored) return JSON.parse(stored);
      return [
        {
          id: 'reg-001',
          type: 'ride',
          targetId: 'ride-vtt-aywaille',
          targetTitle: 'La Ronde des Bois d’Aywaille & Amblève',
          name: 'Philippe Gilbert',
          email: 'p.gilbert@cyclisme.be',
          phone: '+32 472 12 34 56',
          dateCreated: '2026-10-24 14:30',
          details: { paceGroup: 'sport', bikeModel: 'BMC Fourstroke 2.35' },
          status: 'confirmé',
          amountPaid: 15,
          paymentMethod: 'stripe_card',
          paymentId: 'tx-1001',
        },
        {
          id: 'reg-002',
          type: 'trip',
          targetId: 'trip-ardennes-epic-bikepacking',
          targetTitle: 'Ardennes Epic Bikepacking & Nuits Sous Tente',
          name: 'Sarah Dumont',
          email: 'sarah.d@skynet.be',
          phone: '+32 495 88 77 66',
          dateCreated: '2026-10-25 09:15',
          details: { participantsCount: '2', bikeType: 'gravel' },
          status: 'confirmé',
          amountPaid: 420,
          paymentMethod: 'bancontact',
          paymentId: 'tx-1002',
        },
        {
          id: 'reg-003',
          type: 'membership',
          targetId: 'tier-annual',
          targetTitle: 'Adhésion : Membre Club KM0 Belgique',
          name: 'Julien Renard',
          email: 'j.renard@telenet.be',
          phone: '+32 494 55 44 33',
          dateCreated: '2026-10-26 18:40',
          details: { city: 'Liège', postalCode: '4000', jerseySize: 'XL', price: 160 },
          status: 'confirmé',
          amountPaid: 160,
          paymentMethod: 'stripe_card',
          paymentId: 'tx-1004',
        },
      ];
    } catch {
      return [];
    }
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.AUTH);
      return stored === 'true';
    } catch {
      return false;
    }
  });

  const [adminEmail, setAdminEmail] = useState<string>('guymaterne@gmail.com');

  // Transactions State
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      return stored ? JSON.parse(stored) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  // Stripe Configuration
  const [stripeConfig, setStripeConfig] = useState<StripeConfig>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.STRIPE_CONFIG);
      return stored ? JSON.parse(stored) : INITIAL_STRIPE_CONFIG;
    } catch {
      return INITIAL_STRIPE_CONFIG;
    }
  });

  // Bank Configuration (Virement belge)
  const [bankConfig, setBankConfig] = useState<BankConfig>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.BANK_CONFIG);
      return stored ? JSON.parse(stored) : INITIAL_BANK_CONFIG;
    } catch {
      return INITIAL_BANK_CONFIG;
    }
  });

  // Logged-in Club Member State
  const [currentMember, setCurrentMember] = useState<ClubMember | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.MEMBER_AUTH);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Persistence effects
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.RIDES, JSON.stringify(rides));
    } catch (e) {
      console.error(e);
    }
  }, [rides]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(trips));
    } catch (e) {
      console.error(e);
    }
  }, [trips]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
    } catch (e) {
      console.error(e);
    }
  }, [members]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TIERS, JSON.stringify(membershipTiers));
    } catch (e) {
      console.error(e);
    }
  }, [membershipTiers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.EMAILS, JSON.stringify(sentEmails));
    } catch (e) {
      console.error(e);
    }
  }, [sentEmails]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(registrations));
    } catch (e) {
      console.error(e);
    }
  }, [registrations]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    } catch (e) {
      console.error(e);
    }
  }, [transactions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STRIPE_CONFIG, JSON.stringify(stripeConfig));
    } catch (e) {
      console.error(e);
    }
  }, [stripeConfig]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BANK_CONFIG, JSON.stringify(bankConfig));
    } catch (e) {
      console.error(e);
    }
  }, [bankConfig]);

  useEffect(() => {
    try {
      if (currentMember) {
        localStorage.setItem(STORAGE_KEYS.MEMBER_AUTH, JSON.stringify(currentMember));
      } else {
        localStorage.removeItem(STORAGE_KEYS.MEMBER_AUTH);
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentMember]);

  // Admin Auth
  const loginAdmin = (email: string, pass: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    if (
      (cleanEmail === 'guymaterne@gmail.com' || cleanEmail === 'admin@projet-km0.be' || cleanEmail === 'admin') &&
      (pass === 'km0belgique' || pass === 'admin' || pass === 'belgique' || pass === 'belgique2026')
    ) {
      setIsAdminLoggedIn(true);
      setAdminEmail(cleanEmail);
      localStorage.setItem(STORAGE_KEYS.AUTH, 'true');
      return true;
    }
    if (pass === 'km0' || pass === 'admin') {
      setIsAdminLoggedIn(true);
      setAdminEmail(cleanEmail || 'guymaterne@gmail.com');
      localStorage.setItem(STORAGE_KEYS.AUTH, 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem(STORAGE_KEYS.AUTH);
  };

  // Member Auth
  const loginMember = (email: string, pass: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    const found = members.find((m) => m.email.toLowerCase() === cleanEmail);
    if (!found) return false;

    // Check password (allow default if none specified)
    const expectedPass = found.password || 'km0belgique';
    if (pass === expectedPass || pass === 'km0belgique' || pass === 'demo' || pass === 'belgique2026') {
      setCurrentMember(found);
      return true;
    }
    return false;
  };

  const logoutMember = () => {
    setCurrentMember(null);
  };

  const updateCurrentMemberProfile = (updated: Partial<ClubMember>) => {
    if (!currentMember) return;
    const updatedMember = { ...currentMember, ...updated };
    setCurrentMember(updatedMember);
    setMembers((prev) => prev.map((m) => (m.id === currentMember.id ? updatedMember : m)));
  };

  // Belgian structured communication generator (e.g. +++123/4567/89012+++)
  const generateBelgianStructuredCommunication = (): string => {
    const r1 = Math.floor(100 + Math.random() * 900);
    const r2 = Math.floor(1000 + Math.random() * 9000);
    const r3 = Math.floor(10000 + Math.random() * 90000);
    return `+++${r1}/${r2}/${r3}+++`;
  };

  // Process a payment
  const processPayment = (paymentData: {
    amount: number;
    description: string;
    method: PaymentTransaction['method'];
    targetType: PaymentTransaction['targetType'];
    targetId: string;
    memberEmail: string;
    memberName: string;
    password?: string;
  }): PaymentTransaction => {
    const now = new Date();
    const dateFormatted = `${now.toISOString().slice(0, 10)} ${now.toLocaleTimeString('fr-BE', {
      hour: '2-digit',
      minute: '2-digit',
    })}`;
    const isWire = paymentData.method === 'wire_transfer';

    let reference = '';
    if (paymentData.method === 'stripe_card') {
      reference = `ch_${Math.random().toString(36).substring(2, 10)}${Date.now().toString().slice(-6)}`;
    } else if (paymentData.method === 'apple_pay') {
      reference = `apl_${Math.random().toString(36).substring(2, 10)}${Date.now().toString().slice(-6)}`;
    } else if (paymentData.method === 'bancontact') {
      reference = `bc_${Math.floor(100000000000 + Math.random() * 900000000000)}`;
    } else {
      reference = `VIR-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}-${Math.floor(100 + Math.random() * 900)}`;
    }

    const newTx: PaymentTransaction = {
      id: `tx-${Date.now()}`,
      date: dateFormatted,
      memberEmail: paymentData.memberEmail,
      memberName: paymentData.memberName,
      amount: paymentData.amount,
      description: paymentData.description,
      method: paymentData.method,
      status: isWire ? 'pending' : 'paid',
      reference,
      targetType: paymentData.targetType,
      targetId: paymentData.targetId,
      structuredCommunication: isWire ? generateBelgianStructuredCommunication() : undefined,
    };

    setTransactions((prev) => [newTx, ...prev]);

    // Check if member exists, or auto-create/update
    const existing = members.find((m) => m.email.toLowerCase() === paymentData.memberEmail.toLowerCase());
    if (existing) {
      if (paymentData.password) {
        updateMember(existing.id, { password: paymentData.password });
      }
      if (paymentData.targetType === 'membership' && !isWire) {
        updateMember(existing.id, {
          status: 'active',
          membershipTierId: paymentData.targetId,
        });
      }
    }

    return newTx;
  };

  const confirmWirePayment = (transactionId: string) => {
    setTransactions((prev) =>
      prev.map((tx) => {
        if (tx.id === transactionId) {
          return { ...tx, status: 'paid' };
        }
        return tx;
      })
    );

    const tx = transactions.find((t) => t.id === transactionId);
    if (tx && tx.targetType === 'membership') {
      const member = members.find((m) => m.email.toLowerCase() === tx.memberEmail.toLowerCase());
      if (member) {
        updateMember(member.id, { status: 'active' });
      }
    }
  };

  const updateStripeConfig = (config: StripeConfig) => {
    setStripeConfig(config);
  };

  const updateBankConfig = (config: BankConfig) => {
    setBankConfig(config);
  };

  // Rides operations
  const addRide = (rideData: Omit<Ride, 'id' | 'registeredCount'>) => {
    const newRide: Ride = {
      ...rideData,
      id: `ride-${Date.now()}`,
      registeredCount: 0,
    };
    setRides((prev) => [newRide, ...prev]);
  };

  const updateRide = (id: string, updated: Partial<Ride>) => {
    setRides((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updated } : r))
    );
  };

  const deleteRide = (id: string) => {
    setRides((prev) => prev.filter((r) => r.id !== id));
  };

  // Trips operations
  const addTrip = (tripData: Omit<Trip, 'id'>) => {
    const newTrip: Trip = {
      ...tripData,
      id: `trip-${Date.now()}`,
    };
    setTrips((prev) => [newTrip, ...prev]);
  };

  const updateTrip = (id: string, updated: Partial<Trip>) => {
    setTrips((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updated } : t))
    );
  };

  const deleteTrip = (id: string) => {
    setTrips((prev) => prev.filter((r) => r.id !== id));
  };

  // Registrations operations
  const addRegistration = (
    reg: Omit<Registration, 'id' | 'dateCreated' | 'status'> & { password?: string }
  ) => {
    const now = new Date();
    const dateFormatted = `${now.toISOString().slice(0, 10)} ${now.toLocaleTimeString('fr-BE', {
      hour: '2-digit',
      minute: '2-digit',
    })}`;
    const newReg: Registration = {
      ...reg,
      id: `reg-${Date.now()}`,
      dateCreated: dateFormatted,
      status: reg.paymentMethod === 'wire_transfer' ? 'en_attente' : 'confirmé',
    };
    setRegistrations((prev) => [newReg, ...prev]);

    // Update count in ride if applicable
    if (reg.type === 'ride') {
      setRides((prev) =>
        prev.map((r) =>
          r.id === reg.targetId ? { ...r, registeredCount: r.registeredCount + 1 } : r
        )
      );
    }

    // If it's a membership signup, add or update member in database
    const parts = reg.name.split(' ');
    const firstName = parts[0] || 'Nouveau';
    const lastName = parts.slice(1).join(' ') || 'Membre';
    const existing = members.find((m) => m.email.toLowerCase() === reg.email.toLowerCase());

    if (!existing) {
      const newMember: ClubMember = {
        id: `mem-${Date.now()}`,
        firstName,
        lastName,
        email: reg.email,
        password: reg.password || 'km0belgique',
        phone: reg.phone,
        city: reg.details?.city || 'Belgique',
        postalCode: reg.details?.postalCode || '',
        role: 'member',
        status: reg.paymentMethod === 'wire_transfer' ? 'pending' : 'active',
        membershipTierId: reg.type === 'membership' ? reg.targetId : 'tier-discovery',
        membershipTierName: reg.type === 'membership' ? reg.targetTitle : 'Formule Découverte 3 Rides',
        joinDate: now.toISOString().slice(0, 10),
        expirationDate: new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()).toISOString().slice(0, 10),
        jerseySize: (reg.details?.jerseySize as any) || 'M',
        subscribedToNewsletter: true,
        preferredDiscipline: (reg.details?.preferredDiscipline as any) || 'all',
        notes: reg.details?.notes || 'Inscription enregistrée en ligne',
      };
      setMembers((prev) => [newMember, ...prev]);
      setCurrentMember(newMember);
    } else {
      if (reg.password) {
        updateMember(existing.id, { password: reg.password });
      }
      if (reg.type === 'membership' && reg.paymentMethod !== 'wire_transfer') {
        updateMember(existing.id, {
          status: 'active',
          membershipTierId: reg.targetId,
          membershipTierName: reg.targetTitle,
        });
      }
      setCurrentMember(existing);
    }
  };

  const updateRegistrationStatus = (id: string, status: Registration['status']) => {
    setRegistrations((prev) =>
      prev.map((reg) => (reg.id === id ? { ...reg, status } : reg))
    );
  };

  const deleteRegistration = (id: string) => {
    setRegistrations((prev) => prev.filter((r) => r.id !== id));
  };

  // Members Operations
  const addMember = (memberData: Omit<ClubMember, 'id' | 'joinDate'>) => {
    const now = new Date().toISOString().slice(0, 10);
    const newMember: ClubMember = {
      ...memberData,
      id: `mem-${Date.now()}`,
      joinDate: now,
    };
    setMembers((prev) => [newMember, ...prev]);
  };

  const updateMember = (id: string, updated: Partial<ClubMember>) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updated } : m))
    );
    if (currentMember && currentMember.id === id) {
      setCurrentMember((prev) => (prev ? { ...prev, ...updated } : null));
    }
  };

  const deleteMember = (id: string) => {
    setMembers((prev) => prev.filter((r) => r.id !== id));
    if (currentMember && currentMember.id === id) {
      setCurrentMember(null);
    }
  };

  const updateMemberRole = (id: string, role: ClubMember['role']) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, role } : m))
    );
  };

  const toggleNewsletterSubscription = (id: string) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, subscribedToNewsletter: !m.subscribedToNewsletter } : m))
    );
  };

  // Membership Tiers Operations
  const addMembershipTier = (tierData: Omit<MembershipTier, 'id'>) => {
    const newTier: MembershipTier = {
      ...tierData,
      id: `tier-${Date.now()}`,
      active: true,
    };
    setMembershipTiers((prev) => [...prev, newTier]);
  };

  const updateMembershipTier = (id: string, updated: Partial<MembershipTier>) => {
    setMembershipTiers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updated } : t))
    );
  };

  const deleteMembershipTier = (id: string) => {
    setMembershipTiers((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTierActive = (id: string) => {
    setMembershipTiers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, active: !t.active } : t))
    );
  };

  const setRecommendedTier = (id: string) => {
    setMembershipTiers((prev) =>
      prev.map((t) => ({ ...t, recommended: t.id === id }))
    );
  };

  // Broadcast email simulation
  const sendBroadcastEmail = (emailData: {
    subject: string;
    targetSegment: string;
    body: string;
    recipientsCount: number;
  }) => {
    const now = new Date();
    const dateFormatted = `${now.toISOString().slice(0, 10)} ${now.toLocaleTimeString('fr-BE', {
      hour: '2-digit',
      minute: '2-digit',
    })}`;
    const newRecord: SentEmail = {
      id: `mail-${Date.now()}`,
      dateSent: dateFormatted,
      subject: emailData.subject,
      targetSegment: emailData.targetSegment,
      recipientsCount: emailData.recipientsCount,
      previewSnippet: emailData.body.slice(0, 120) + (emailData.body.length > 120 ? '...' : ''),
      sentBy: adminEmail.includes('@') ? 'Guy Materne' : 'Administration KM0',
    };
    setSentEmails((prev) => [newRecord, ...prev]);
  };

  const resetToDefault = () => {
    setRides(RIDES_DATA);
    setTrips(TRIPS_DATA);
    setMembers(INITIAL_MEMBERS);
    setMembershipTiers(MEMBERSHIP_TIERS);
    setSentEmails(INITIAL_SENT_EMAILS);
    setTransactions(INITIAL_TRANSACTIONS);
    setStripeConfig(INITIAL_STRIPE_CONFIG);
    setBankConfig(INITIAL_BANK_CONFIG);
    setCurrentMember(null);
    localStorage.removeItem(STORAGE_KEYS.RIDES);
    localStorage.removeItem(STORAGE_KEYS.TRIPS);
    localStorage.removeItem(STORAGE_KEYS.MEMBERS);
    localStorage.removeItem(STORAGE_KEYS.TIERS);
    localStorage.removeItem(STORAGE_KEYS.EMAILS);
    localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEYS.STRIPE_CONFIG);
    localStorage.removeItem(STORAGE_KEYS.BANK_CONFIG);
    localStorage.removeItem(STORAGE_KEYS.MEMBER_AUTH);
  };

  return (
    <AppContext.Provider
      value={{
        rides,
        trips,
        registrations,
        members,
        membershipTiers,
        sentEmails,
        isAdminLoggedIn,
        adminEmail,
        loginAdmin,
        logoutAdmin,
        currentMember,
        loginMember,
        logoutMember,
        updateCurrentMemberProfile,
        transactions,
        stripeConfig,
        bankConfig,
        processPayment,
        confirmWirePayment,
        updateStripeConfig,
        updateBankConfig,
        addRide,
        updateRide,
        deleteRide,
        addTrip,
        updateTrip,
        deleteTrip,
        addRegistration,
        updateRegistrationStatus,
        deleteRegistration,
        addMember,
        updateMember,
        deleteMember,
        updateMemberRole,
        toggleNewsletterSubscription,
        addMembershipTier,
        updateMembershipTier,
        deleteMembershipTier,
        toggleTierActive,
        setRecommendedTier,
        sendBroadcastEmail,
        resetToDefault,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
