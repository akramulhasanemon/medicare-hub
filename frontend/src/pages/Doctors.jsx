import React, { useState, useMemo } from 'react';
import DoctorCard from '../components/DoctorCard';
import { useData } from '../context/DataContext';
import { Search, Filter, Stethoscope } from 'lucide-react';

const Doctors = ({ setActivePage }) => {
  const { doctors, departments } = useData();
  const [selectedDeptId, setSelectedDeptId] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDoctors = useMemo(() => {
    return doctors.filter(doctor => {
      const matchDept = selectedDeptId === 'all' || Number(doctor.department_id) === Number(selectedDeptId);
      const matchSearch = searchTerm.trim() === '' || 
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.qualification.toLowerCase().includes(searchTerm.toLowerCase());
      return matchDept && matchSearch;
    });
  }, [doctors, selectedDeptId, searchTerm]);

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 text-xs font-bold mb-3">
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Consultant Directory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Find Your Specialist Doctor
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Filter by specialty or search by doctor's name to book your preferred time slot.
          </p>
        </div>

        {/* Search and Filters Bar */}
        <div className="bg-white p-4 sm:p-6 rounded-3xl shadow-sm border border-slate-200/80 mb-10 space-y-4">
          
          {/* Search bar */}
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by doctor name, specialty, degree (e.g. Cardiologist, Sarah, MBBS)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:bg-white transition-all"
            />
          </div>

          {/* Department Pills Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            <button
              onClick={() => setSelectedDeptId('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedDeptId === 'all'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Specialties ({doctors.length})
            </button>
            {departments.map(dept => (
              <button
                key={dept.id}
                onClick={() => setSelectedDeptId(dept.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  Number(selectedDeptId) === Number(dept.id)
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {dept.name}
              </button>
            ))}
          </div>

        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6 text-xs text-slate-500 font-semibold px-2">
          <span>Showing {filteredDoctors.length} available specialist(s)</span>
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')} 
              className="text-cyan-600 hover:underline"
            >
              Clear search
            </button>
          )}
        </div>

        {/* Doctors Grid */}
        {filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDoctors.map(doctor => (
              <DoctorCard key={doctor.id} doctor={doctor} setActivePage={setActivePage} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80 p-8">
            <p className="text-slate-400 text-lg font-medium">No doctors match your filter criteria.</p>
            <button
              onClick={() => { setSelectedDeptId('all'); setSearchTerm(''); }}
              className="mt-4 px-5 py-2.5 bg-cyan-600 text-white text-xs font-bold rounded-xl shadow-sm"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Doctors;
