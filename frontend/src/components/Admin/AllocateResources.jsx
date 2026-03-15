import React, { useState, useEffect } from 'react';
import { FaBed, FaPlus, FaUser, FaCalendarAlt, FaSearch, FaTimesCircle, FaDownload } from 'react-icons/fa';
import styles from './AllocateResources.module.css';

const AllocateResources = () => {
  const [beds, setBeds] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [newBedName, setNewBedName] = useState('');
  const [selectedBedId, setSelectedBedId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [date, setDate] = useState('');
  const [bedFilter, setBedFilter] = useState('');

  // Load data from localStorage on component mount
  useEffect(() => {
    try {
      const storedBeds = JSON.parse(localStorage.getItem('beds')) || [];
      const storedAllocations = JSON.parse(localStorage.getItem('allocations')) || [];
      setBeds(storedBeds);
      setAllocations(storedAllocations);
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    }
  }, []);

  // Save data to localStorage whenever beds or allocations change
  useEffect(() => {
    localStorage.setItem('beds', JSON.stringify(beds));
  }, [beds]);

  useEffect(() => {
    localStorage.setItem('allocations', JSON.stringify(allocations));
  }, [allocations]);

  const handleAddBed = (e) => {
    e.preventDefault();
    if (!newBedName) {
      alert('Enter a bed name!');
      return;
    }

    if (beds.some((bed) => bed.name === newBedName)) {
      alert('Bed name already exists!');
      return;
    }

    const newBed = {
      id: Date.now(),
      name: newBedName,
      status: 'Free',
    };
    setBeds([...beds, newBed]);
    setNewBedName('');
  };

  const handleAllocateBed = (e) => {
    e.preventDefault();
    if (!selectedBedId || !patientName || !date) {
      alert('Please fill all fields');
      return;
    }

    const bedToAllocate = beds.find((bed) => bed.id === parseInt(selectedBedId));
    if (!bedToAllocate || bedToAllocate.status !== 'Free') {
      alert('Selected bed is not free!');
      return;
    }

    const updatedBeds = beds.map((bed) =>
      bed.id === parseInt(selectedBedId) ? { ...bed, status: 'Occupied' } : bed
    );
    setBeds(updatedBeds);

    const allocation = {
      id: Date.now(),
      bedName: bedToAllocate.name,
      patientName,
      date,
    };
    setAllocations([...allocations, allocation]);

    setSelectedBedId('');
    setPatientName('');
    setDate('');
  };

  const handleCancelAllocation = (allocationId) => {
    if (window.confirm('Are you sure you want to cancel this allocation?')) {
      const allocation = allocations.find((a) => a.id === allocationId);
      if (!allocation) return;

      const updatedBeds = beds.map((bed) =>
        bed.name === allocation.bedName ? { ...bed, status: 'Free' } : bed
      );
      setBeds(updatedBeds);

      const updatedAllocations = allocations.filter((a) => a.id !== allocationId);
      setAllocations(updatedAllocations);
    }
  };

  const filteredBeds = beds.filter((bed) =>
    bed.name.toLowerCase().includes(bedFilter.toLowerCase())
  );
  
  const handleExport = () => {
    const data = { beds, allocations };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hospital_resources_data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Resource Allocation</h1>
        <p className={styles.subtitle}>Manage and allocate hospital beds efficiently.</p>
        <button className={styles.exportBtn} onClick={handleExport}>
          <FaDownload /> Export Data
        </button>
      </header>

      <main className={styles.mainContent}>
        {/* Left Section: Add Bed and Allocate Bed Forms */}
        <div className={styles.formSection}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>
              <FaPlus className={styles.icon} /> Add New Bed
            </h3>
            <form onSubmit={handleAddBed}>
              <input
                type="text"
                className={styles.input}
                value={newBedName}
                onChange={(e) => setNewBedName(e.target.value)}
                placeholder="e.g., Ward 3-A, ICU-2"
              />
              <button type="submit" className={styles.primaryBtn}>
                <FaBed /> Add Bed
              </button>
            </form>
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}>
              <FaUser className={styles.icon} /> Allocate Bed
            </h3>
            <form onSubmit={handleAllocateBed}>
              <div className={styles.formGroup}>
                <label>Patient Name</label>
                <input
                  type="text"
                  className={styles.input}
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Enter patient name"
                />
              </div>

              <div className={styles.formGroup}>
                <label>Select Free Bed</label>
                <select
                  className={styles.select}
                  value={selectedBedId}
                  onChange={(e) => setSelectedBedId(e.target.value)}
                >
                  <option value="">-- Select Bed --</option>
                  {beds.filter((bed) => bed.status === 'Free').map((bed) => (
                    <option key={bed.id} value={bed.id}>
                      {bed.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Date of Allocation</label>
                <input
                  type="date"
                  className={styles.input}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              <button type="submit" className={styles.primaryBtn}>
                <FaCalendarAlt /> Allocate Bed
              </button>
            </form>
          </div>
        </div>

        {/* Right Section: Bed List and Allocations Table */}
        <div className={styles.tableSection}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>All Beds</h3>
            <div className={styles.searchInputWrapper}>
              <FaSearch className={styles.searchIcon} />
              <input
                type="text"
                className={styles.input}
                placeholder="Search beds..."
                value={bedFilter}
                onChange={(e) => setBedFilter(e.target.value)}
              />
            </div>
            <div className={styles.bedList}>
              {filteredBeds.length > 0 ? (
                filteredBeds.map((bed) => (
                  <div key={bed.id} className={styles.bedCard}>
                    <FaBed className={styles.bedIcon} />
                    <span className={styles.bedName}>{bed.name}</span>
                    <span className={`${styles.statusBadge} ${bed.status === 'Free' ? styles.statusFree : styles.statusOccupied}`}>
                      {bed.status}
                    </span>
                  </div>
                ))
              ) : (
                <p className={styles.noData}>No beds found.</p>
              )}
            </div>
          </div>
          
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Current Allocations</h3>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Bed</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {allocations.length > 0 ? (
                    allocations.map((allocation) => (
                      <tr key={allocation.id}>
                        <td>{allocation.patientName}</td>
                        <td>{allocation.bedName}</td>
                        <td>{allocation.date}</td>
                        <td>
                          <button
                            onClick={() => handleCancelAllocation(allocation.id)}
                            className={styles.cancelBtn}
                          >
                            <FaTimesCircle /> Cancel
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className={styles.noData}>No allocations yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AllocateResources;