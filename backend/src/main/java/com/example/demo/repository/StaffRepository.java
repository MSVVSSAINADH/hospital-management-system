package com.example.demo.repository;

import com.example.demo.entity.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.query.Param;

import jakarta.transaction.Transactional;
import java.util.List;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Long> {

    // Active staff only
    @Query("SELECT s FROM Staff s WHERE s.deleted = false")
    List<Staff> findAllActive();

    // Deleted staff only
    @Query("SELECT s FROM Staff s WHERE s.deleted = true")
    List<Staff> findAllDeleted();

    // Soft delete
    @Modifying
    @Transactional
    @Query("UPDATE Staff s SET s.deleted = true WHERE s.id = :id")
    void softDelete(@Param("id") Long id);

    // Restore
    @Modifying
    @Transactional
    @Query("UPDATE Staff s SET s.deleted = false WHERE s.id = :id")
    void restore(@Param("id") Long id);
}
