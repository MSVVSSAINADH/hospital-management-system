import React, { useState, useEffect } from "react";
// All imports now correctly assume the component lives in 'src/components/Doctors/'
// and are importing siblings or components from other feature folders (../folder/Component)

import { DoctorCard } from "../Doctors/DoctorCard"; // Path to DoctorCard
import styles from "./DoctorsSection.module.css";



const DoctorsSection = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:8086";

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(`${apiBase}/api/doctors`);
        if (response.ok) {
          const data = await response.json();
          setDoctors(data);
        }
      } catch (err) {
        console.error("Failed to fetch doctors:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [apiBase]);

  return (
    <section className={styles.doctors}>
      <img
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/cf44c0ce78c240a28faac630188f1a27/7e28aeb77ab122df05cdb236545a8401afc25a136342bf2bbeb4b4ef296ed587?placeholderIfAbsent=true"
        alt="Hero banner"
        className={styles.heroImage}
      />
      <div className={styles.doctorsGrid}>
        <h2 className={styles.sectionTitle}>Meet Our Experts</h2>
        <p className={styles.sectionSubtitle}>
          Our team of dedicated professionals is here to provide you with the best care.
        </p>
        
        {loading ? (
          <div className={styles.loadingContainer}>
            <p className={styles.loading}>Loading Doctors...</p>
          </div>
        ) : (
          <div className={styles.doctorResults}>
            {doctors.length > 0 ? (
              <div className={styles.doctorList}>
                {doctors.map((doctor) => (
                  <DoctorCard
                    key={doctor.id}
                    image={doctor.image || `https://via.placeholder.com/150?text=${doctor.name.split(' ').join('+')}`}
                    name={doctor.name}
                    specialty={doctor.specialization || doctor.department || "Medical Expert"}
                  />
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <p>Register as an admin to add doctors or check back later.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default DoctorsSection;