import React, { createContext, useContext, useState, useEffect } from 'react';
import { dispatchRegistrationNotifications } from '../services/notificationService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('medicare_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('medicare_token') || '');

  useEffect(() => {
    if (user) {
      localStorage.setItem('medicare_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('medicare_user');
      localStorage.removeItem('medicare_token');
    }
  }, [user]);

  const login = async (identifier, password) => {
    const ident = identifier ? identifier.trim() : '';
    const pass = password ? password.trim() : '';
    const upperIdent = ident.toUpperCase();
    const normalizedIdent = ident.toLowerCase();

    // 1. Try PHP Backend API first
    try {
      const response = await fetch('http://localhost/medicare-hub/backend/api/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: ident, email: ident, password: pass })
      });
      const data = await response.json();
      if (response.ok && data.status === 'success') {
        setUser(data.data.user);
        setToken(data.data.token);
        localStorage.setItem('medicare_token', data.data.token);
        return { success: true, user: data.data.user };
      }
    } catch (e) {
      console.log('PHP backend offline, using demo auth mode');
    }

    // 2. Check registered users in localStorage FIRST (matches by ID, Full Name, Email, or Phone)
    const registeredUsers = JSON.parse(localStorage.getItem('medicare_registered_users') || '[]');
    const existingUser = registeredUsers.find(u => {
      const uId = String(u.patient_id || u.account_code || u.doctor_code || u.employee_code || u.id || '').toUpperCase();
      const matchId = uId && (uId === upperIdent);
      const matchName = u.name && u.name.trim().toLowerCase() === normalizedIdent;
      const matchEmail = u.email && u.email.toLowerCase() === normalizedIdent;
      const matchPhone = u.phone && String(u.phone).replace(/\D/g, '') === ident.replace(/\D/g, '');
      return matchId || matchName || matchEmail || matchPhone;
    });

    if (existingUser) {
      if (String(existingUser.password || '').trim() === pass) {
        const { password: _, ...safeUser } = existingUser;
        setUser(safeUser);
        localStorage.setItem('medicare_user', JSON.stringify(safeUser));
        return { success: true, user: safeUser };
      } else {
        return { 
          success: false, 
          message: 'Incorrect password! If you recently updated your password, please use your new password.' 
        };
      }
    }

    // 2b. Check accounts staff, lab staff, or doctors directory in case added by admin
    const accountsStaff = JSON.parse(localStorage.getItem('medicare_accounts_staff') || '[]');
    const accFound = accountsStaff.find(a => {
      const c = String(a.account_code || a.id || '').toUpperCase();
      return c === upperIdent || (a.email && a.email.toLowerCase() === normalizedIdent);
    });
    if (accFound) {
      const accPass = String(accFound.password || 'account123').trim();
      if (pass === accPass) {
        const accUser = {
          id: accFound.id,
          patient_id: accFound.account_code || `A${accFound.id}`,
          account_code: accFound.account_code || `A${accFound.id}`,
          name: accFound.name,
          email: accFound.email || `${(accFound.account_code || 'a101').toLowerCase()}@medicare.com`,
          role: 'accountant',
          phone: accFound.phone || '01733445566',
          designation: accFound.designation || 'Accounts Officer'
        };
        setUser(accUser);
        localStorage.setItem('medicare_user', JSON.stringify(accUser));
        return { success: true, user: accUser };
      } else {
        return { success: false, message: 'Incorrect password for Accounts Staff ID ' + upperIdent };
      }
    }

    const doctors = JSON.parse(localStorage.getItem('medicare_doctors') || '[]');
    const docFound = doctors.find(d => {
      const c = String(d.doctor_code || d.id || '').toUpperCase();
      return c === upperIdent || (d.email && d.email.toLowerCase() === normalizedIdent);
    });
    if (docFound) {
      const docPass = String(docFound.password || 'doctor123').trim();
      if (pass === docPass) {
        const docUser = {
          id: docFound.id,
          patient_id: docFound.doctor_code || `D${docFound.id}`,
          doctor_code: docFound.doctor_code || `D${docFound.id}`,
          name: docFound.name,
          email: docFound.email || `${(docFound.doctor_code || 'd101').toLowerCase()}@medicare.com`,
          role: 'doctor',
          phone: docFound.phone || '01711000000',
          specialty: docFound.specialty || 'Specialist Doctor'
        };
        setUser(docUser);
        localStorage.setItem('medicare_user', JSON.stringify(docUser));
        return { success: true, user: docUser };
      } else {
        return { success: false, message: 'Incorrect password for Doctor ID ' + upperIdent };
      }
    }

    const labEmployees = JSON.parse(localStorage.getItem('medicare_lab_employees') || '[]');
    const labFound = labEmployees.find(l => {
      const c = String(l.employee_code || l.id || '').toUpperCase();
      return c === upperIdent || (l.email && l.email.toLowerCase() === normalizedIdent);
    });
    if (labFound) {
      const labPass = String(labFound.password || 'lab123').trim();
      if (pass === labPass) {
        const labUser = {
          id: labFound.id,
          patient_id: labFound.employee_code || `L${labFound.id}`,
          employee_code: labFound.employee_code || `L${labFound.id}`,
          name: labFound.name,
          email: labFound.email || `${(labFound.employee_code || 'l101').toLowerCase()}@medicare.com`,
          role: 'lab_staff',
          phone: labFound.phone || '01711223344',
          specialization: labFound.specialization || 'Clinical Technologist'
        };
        setUser(labUser);
        localStorage.setItem('medicare_user', JSON.stringify(labUser));
        return { success: true, user: labUser };
      } else {
        return { success: false, message: 'Incorrect password for Lab Staff ID ' + upperIdent };
      }
    }

    // 3. Demo Fallback: Admin
    if ((normalizedIdent === 'admin@medicare.com' || normalizedIdent === 'admin') && pass === 'admin123') {
      const adminUser = {
        id: 1,
        patient_id: 'ADMIN',
        name: 'MediCare Admin',
        email: 'admin@medicare.com',
        role: 'admin',
        phone: '01700000000',
        address: 'MediCare Hub Hospital HQ, Dhanmondi 27, Dhaka'
      };
      setUser(adminUser);
      localStorage.setItem('medicare_user', JSON.stringify(adminUser));
      return { success: true, user: adminUser };
    }

    // 4. Demo Fallback: Doctor (D101)
    if ((upperIdent === 'D101' || normalizedIdent === 'doctor@medicare.com') && (pass === 'doctor123' || pass === 'password123')) {
      const doctorUser = {
        id: 101,
        patient_id: 'D101',
        doctor_code: 'D101',
        name: 'Prof. Dr. Mahfuzur Rahman',
        email: 'doctor@medicare.com',
        role: 'doctor',
        phone: '01711000000',
        address: 'House 42, Road 11, Banani, Dhaka',
        specialty: 'Cardiologist & Internal Medicine'
      };
      setUser(doctorUser);
      localStorage.setItem('medicare_user', JSON.stringify(doctorUser));
      return { success: true, user: doctorUser };
    }

    // 5. Demo Fallback: Lab Employee (L101)
    if ((upperIdent === 'L101' || normalizedIdent === 'lab@medicare.com') && (pass === 'lab123' || pass === 'password123')) {
      const labUser = {
        id: 201,
        patient_id: 'L101',
        employee_code: 'L101',
        name: 'Md. Rafiqul Islam',
        email: 'lab@medicare.com',
        role: 'lab_staff',
        phone: '01711223344',
        address: 'Plot 18, Block D, Mirpur-10, Dhaka',
        specialization: 'Senior Pathologist & Lab Technologist'
      };
      setUser(labUser);
      localStorage.setItem('medicare_user', JSON.stringify(labUser));
      return { success: true, user: labUser };
    }

    // 6. Demo Fallback: Accounts Section (A101)
    if ((upperIdent === 'A101' || normalizedIdent === 'accounts@medicare.com') && (pass === 'account123' || pass === 'password123')) {
      const accountsUser = {
        id: 301,
        patient_id: 'A101',
        account_code: 'A101',
        name: 'Kamal Hossain',
        email: 'accounts@medicare.com',
        role: 'accountant',
        phone: '01733445566',
        address: 'Sector 7, Road 14, Uttara, Dhaka',
        designation: 'Chief Accounts & Billing Officer'
      };
      setUser(accountsUser);
      localStorage.setItem('medicare_user', JSON.stringify(accountsUser));
      return { success: true, user: accountsUser };
    }

    // 7. Demo Fallback: Patient (P01)
    if ((upperIdent === 'P01' || normalizedIdent === 'patient@medicare.com') && (pass === 'patient123' || pass === 'password123')) {
      const patientUser = {
        id: 2,
        patient_id: 'P01',
        name: 'John Doe',
        email: 'patient@medicare.com',
        role: 'patient',
        phone: '01811112233',
        address: 'House 14, Road 5, Dhanmondi, Dhaka',
        blood_group: 'B+'
      };
      setUser(patientUser);
      localStorage.setItem('medicare_user', JSON.stringify(patientUser));
      return { success: true, user: patientUser };
    }

    return { 
      success: false, 
      message: 'Invalid credentials. Please enter your registered Name, Patient ID (P01, D101, L101, A101), or Email, and password.' 
    };
  };

  const register = async (userData) => {
    // 1. Try PHP backend
    try {
      const response = await fetch('http://localhost/medicare-hub/backend/api/register.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await response.json();
      if (response.ok && data.status === 'success') {
        const registeredUser = data.data.user;
        setUser(registeredUser);
        if (data.data.token) {
          setToken(data.data.token);
          localStorage.setItem('medicare_token', data.data.token);
        }
        const notif = await dispatchRegistrationNotifications(registeredUser);
        return { success: true, user: registeredUser, patient_id: registeredUser.patient_id, notifications: notif };
      }
    } catch (e) {
      console.log('PHP backend offline, registering in local store');
    }

    // 2. Fallback store in localStorage
    const registeredUsers = JSON.parse(localStorage.getItem('medicare_registered_users') || '[]');

    const role = userData.role || 'patient';
    let assignedId = '';

    if (role === 'doctor') {
      let maxNum = 106;
      const doctors = JSON.parse(localStorage.getItem('medicare_doctors') || '[]');
      [
        ...doctors.map(d => d.doctor_code || (typeof d.id === 'number' && d.id < 100 ? `D${100 + d.id}` : '')),
        ...registeredUsers.filter(u => u.role === 'doctor').map(u => u.patient_id)
      ].forEach(code => {
        const m = (code || '').match(/^D(\d+)$/i);
        if (m) {
          const n = parseInt(m[1], 10);
          if (n > maxNum) maxNum = n;
        }
      });
      assignedId = `D${maxNum + 1}`;
    } else if (role === 'lab_staff') {
      let maxNum = 100;
      const labEmployees = JSON.parse(localStorage.getItem('medicare_lab_employees') || '[]');
      [...labEmployees.map(l => l.employee_code), ...registeredUsers.filter(u => u.role === 'lab_staff').map(u => u.patient_id)].forEach(code => {
        const m = (code || '').match(/^L(\d+)$/i);
        if (m) {
          const n = parseInt(m[1], 10);
          if (n > maxNum) maxNum = n;
        }
      });
      assignedId = `L${maxNum + 1}`;
    } else if (role === 'accountant') {
      let maxNum = 100;
      const accounts = JSON.parse(localStorage.getItem('medicare_accounts_staff') || '[]');
      [...accounts.map(a => a.account_code), ...registeredUsers.filter(u => u.role === 'accountant').map(u => u.patient_id)].forEach(code => {
        const m = (code || '').match(/^A(\d+)$/i);
        if (m) {
          const n = parseInt(m[1], 10);
          if (n > maxNum) maxNum = n;
        }
      });
      assignedId = `A${maxNum + 1}`;
    } else {
      // Patient default: P01, P02...
      let maxNum = 0;
      ['P01', ...registeredUsers.filter(u => u.role === 'patient').map(u => u.patient_id)].forEach(code => {
        const m = (code || '').match(/^P(\d+)$/i);
        if (m) {
          const n = parseInt(m[1], 10);
          if (n > maxNum) maxNum = n;
        }
      });
      assignedId = `P${String(maxNum + 1).padStart(2, '0')}`;
    }

    const newUser = {
      id: Date.now(),
      patient_id: assignedId, // PERMANENT IMMUTABLE ID
      name: userData.name,
      email: userData.email,
      phone: userData.phone || '01700000000',
      address: userData.address || 'Dhaka, Bangladesh',
      blood_group: userData.blood_group || 'O+',
      gender: userData.gender || 'Male',
      role: role,
      specialty: userData.specialty || '',
      password: userData.password
    };

    registeredUsers.push(newUser);
    localStorage.setItem('medicare_registered_users', JSON.stringify(registeredUsers));

    const { password: _, ...safeUser } = newUser;
    setUser(safeUser);
    const notif = await dispatchRegistrationNotifications(newUser);
    return { success: true, user: safeUser, patient_id: assignedId, notifications: notif };
  };

  // UPDATE PROFILE METHOD: Allows modifying phone, address, password, name
  // ENFORCES: patient_id / system ID is PERMANENT and can NEVER be changed!
  const updateUserProfile = async (updates) => {
    if (!user) return { success: false, message: 'No user is currently signed in' };

    // STRICT LOCK: ID and Role are NEVER allowed to be changed
    const { patient_id: _ignoredId, id: _ignoredPk, role: _ignoredRole, ...allowedUpdates } = updates;
    const permanentId = String(user.patient_id || user.account_code || user.doctor_code || user.employee_code || user.id || '').toUpperCase();
    const updatedPassword = allowedUpdates.password ? String(allowedUpdates.password).trim() : null;

    // Try PHP backend
    try {
      await fetch('http://localhost/medicare-hub/backend/api/update_profile.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient_id: permanentId,
          email: user.email || '',
          id: user.id || '',
          name: allowedUpdates.name || user.name,
          phone: allowedUpdates.phone || user.phone,
          address: allowedUpdates.address || user.address,
          password: updatedPassword
        })
      });
    } catch (e) {
      console.log('PHP backend offline, synced profile in localStorage');
    }

    const updatedUser = {
      ...user,
      ...allowedUpdates,
      patient_id: permanentId, // LOCKED PERMANENT ID
      id: user.id,
      role: user.role
    };

    setUser(updatedUser);
    localStorage.setItem('medicare_user', JSON.stringify(updatedUser));

    // Update in registeredUsers
    const registeredUsers = JSON.parse(localStorage.getItem('medicare_registered_users') || '[]');
    const userIndex = registeredUsers.findIndex(u => {
      const uCode = String(u.patient_id || u.account_code || u.doctor_code || u.employee_code || u.id || '').toUpperCase();
      const uEmail = String(u.email || '').toLowerCase();
      return (permanentId && uCode === permanentId) || (user.email && uEmail === String(user.email).toLowerCase());
    });

    if (userIndex !== -1) {
      registeredUsers[userIndex] = {
        ...registeredUsers[userIndex],
        ...allowedUpdates,
        patient_id: permanentId,
        account_code: user.account_code || (user.role === 'accountant' ? permanentId : undefined),
        doctor_code: user.doctor_code || (user.role === 'doctor' ? permanentId : undefined),
        employee_code: user.employee_code || (user.role === 'lab_staff' ? permanentId : undefined),
        id: registeredUsers[userIndex].id || user.id,
        role: registeredUsers[userIndex].role || user.role,
        ...(updatedPassword ? { password: updatedPassword } : {})
      };
    } else {
      registeredUsers.push({
        ...updatedUser,
        patient_id: permanentId,
        account_code: user.account_code || (user.role === 'accountant' ? permanentId : undefined),
        doctor_code: user.doctor_code || (user.role === 'doctor' ? permanentId : undefined),
        employee_code: user.employee_code || (user.role === 'lab_staff' ? permanentId : undefined),
        password: updatedPassword || (user.role === 'doctor' ? 'doctor123' : user.role === 'lab_staff' ? 'lab123' : user.role === 'accountant' ? 'account123' : 'patient123')
      });
    }
    localStorage.setItem('medicare_registered_users', JSON.stringify(registeredUsers));

    // Sync in respective sub-tables
    if (user.role === 'doctor') {
      const doctors = JSON.parse(localStorage.getItem('medicare_doctors') || '[]');
      const docIdx = doctors.findIndex(d => {
        const c = String(d.doctor_code || d.id || '').toUpperCase();
        return c === permanentId || d.name === user.name;
      });
      if (docIdx !== -1) {
        doctors[docIdx].phone = allowedUpdates.phone || doctors[docIdx].phone;
        doctors[docIdx].address = allowedUpdates.address || doctors[docIdx].address;
        doctors[docIdx].name = allowedUpdates.name || doctors[docIdx].name;
        if (updatedPassword) doctors[docIdx].password = updatedPassword;
        localStorage.setItem('medicare_doctors', JSON.stringify(doctors));
      }
    } else if (user.role === 'lab_staff') {
      const labEmployees = JSON.parse(localStorage.getItem('medicare_lab_employees') || '[]');
      const labIdx = labEmployees.findIndex(l => {
        const c = String(l.employee_code || l.id || '').toUpperCase();
        return c === permanentId || l.name === user.name;
      });
      if (labIdx !== -1) {
        labEmployees[labIdx].phone = allowedUpdates.phone || labEmployees[labIdx].phone;
        labEmployees[labIdx].address = allowedUpdates.address || labEmployees[labIdx].address;
        labEmployees[labIdx].name = allowedUpdates.name || labEmployees[labIdx].name;
        if (updatedPassword) labEmployees[labIdx].password = updatedPassword;
        localStorage.setItem('medicare_lab_employees', JSON.stringify(labEmployees));
      }
    } else if (user.role === 'accountant') {
      const accounts = JSON.parse(localStorage.getItem('medicare_accounts_staff') || '[]');
      const accIdx = accounts.findIndex(a => {
        const c = String(a.account_code || a.id || '').toUpperCase();
        return c === permanentId || a.name === user.name;
      });
      if (accIdx !== -1) {
        accounts[accIdx].phone = allowedUpdates.phone || accounts[accIdx].phone;
        accounts[accIdx].address = allowedUpdates.address || accounts[accIdx].address;
        accounts[accIdx].name = allowedUpdates.name || accounts[accIdx].name;
        if (updatedPassword) accounts[accIdx].password = updatedPassword;
        localStorage.setItem('medicare_accounts_staff', JSON.stringify(accounts));
      }
    }

    return { 
      success: true, 
      user: updatedUser, 
      message: `Profile updated successfully! Permanent ID ${permanentId} is permanently locked.` 
    };
  };

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('medicare_user');
    localStorage.removeItem('medicare_token');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      register, 
      updateUserProfile,
      logout, 
      isAdmin: user?.role === 'admin',
      isDoctor: user?.role === 'doctor',
      isLabStaff: user?.role === 'lab_staff',
      isAccountant: user?.role === 'accountant',
      isStaffOrAdmin: ['admin', 'doctor', 'lab_staff', 'accountant'].includes(user?.role)
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
