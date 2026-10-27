import React, { createContext, useContext, useState, useEffect } from 'react';
import { RIDES_DATA, Ride } from '../data/rides';
import { TRIPS_DATA, Trip } from '../data/trips';

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
}

interface AppContextType {
  rides: Ride[];
  trips: Trip[];
  registrations: Registration[];
  isAdminLoggedIn: boolean;
  adminEmail: string;
  loginAdmin: (email: string, pass: string) => boolean;
  logoutAdmin: () => void;
  // Rides CRUD
  addRide: (ride: Omit<Ride, 'id' | 'registeredCount'>) => void;
  updateRide: (id: string, updated: Partial<Ride>) => void;
  deleteRide: (id: string) => void;
  // Trips CRUD
  addTrip: (trip: Omit<Trip, 'id'>) => void;
  updateTrip: (id: string, updated: Partial<Trip>) => void;
  deleteTrip: (id: string) => void;
  // Registrations
  addRegistration: (reg: Omit<Registration, 'id' | 'dateCreated' | 'status'>) => void;
  updateRegistrationStatus: (id: string, status: Registration['status']) => void;
  deleteRegistration: (id: string) => void;
  // Reset demo data
  resetToDefault: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  RIDES: 'km0_be_rides_v2',
  TRIPS: 'km0_be_trips_v2',
  REGISTRATIONS: 'km0_be_registrations_v2',
  AUTH: 'km0_be_admin_auth_v2',
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

  const [registrations, setRegistrations] = useState<Registration[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS);
      if (stored) return JSON.parse(stored);
      // Seed with realistic initial registrations
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
        },
        {
          id: 'reg-003',
          type: 'ride',
          targetId: 'ride-gravel-brabant',
          targetTitle: 'La Brabançonne des Chemins Creux & Pavés Doux',
          name: 'Maxime Van Damme',
          email: 'maxime.vd@proximus.be',
          phone: '+32 486 33 22 11',
          dateCreated: '2026-10-26 18:40',
          details: { paceGroup: 'tempo', bikeModel: 'Ridley Kanzo 45mm' },
          status: 'en_attente',
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
      localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(registrations));
    } catch (e) {
      console.error(e);
    }
  }, [registrations]);

  const loginAdmin = (email: string, pass: string): boolean => {
    // Allows Guy Materne or standard test pass
    const cleanEmail = email.trim().toLowerCase();
    if (
      (cleanEmail === 'guymaterne@gmail.com' || cleanEmail === 'admin@projet-km0.be' || cleanEmail === 'admin') &&
      (pass === 'km0belgique' || pass === 'admin' || pass === 'belgique')
    ) {
      setIsAdminLoggedIn(true);
      setAdminEmail(cleanEmail);
      localStorage.setItem(STORAGE_KEYS.AUTH, 'true');
      return true;
    }
    // Also accept simple login for ease of demo
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
    setTrips((prev) => prev.filter((t) => t.id !== id));
  };

  // Registrations operations
  const addRegistration = (reg: Omit<Registration, 'id' | 'dateCreated' | 'status'>) => {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 16).replace('T', ' ');
    const newReg: Registration = {
      ...reg,
      id: `reg-${Date.now()}`,
      dateCreated: dateStr,
      status: 'confirmé',
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
  };

  const updateRegistrationStatus = (id: string, status: Registration['status']) => {
    setRegistrations((prev) =>
      prev.map((reg) => (reg.id === id ? { ...reg, status } : reg))
    );
  };

  const deleteRegistration = (id: string) => {
    setRegistrations((prev) => prev.filter((r) => r.id !== id));
  };

  const resetToDefault = () => {
    setRides(RIDES_DATA);
    setTrips(TRIPS_DATA);
    localStorage.removeItem(STORAGE_KEYS.RIDES);
    localStorage.removeItem(STORAGE_KEYS.TRIPS);
  };

  return (
    <AppContext.Provider
      value={{
        rides,
        trips,
        registrations,
        isAdminLoggedIn,
        adminEmail,
        loginAdmin,
        logoutAdmin,
        addRide,
        updateRide,
        deleteRide,
        addTrip,
        updateTrip,
        deleteTrip,
        addRegistration,
        updateRegistrationStatus,
        deleteRegistration,
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
