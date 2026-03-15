package com.example.demo.service;

import com.example.demo.entity.Staff;
import com.example.demo.repository.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StaffService {

    @Autowired
    private StaffRepository staffRepository;

    // Active staff
    public List<Staff> getAllStaff() {
        return staffRepository.findAllActive();
    }

    // Deleted staff
    public List<Staff> getAllDeletedStaff() {
        return staffRepository.findAllDeleted();
    }

    public Staff addStaff(Staff staff) {
        return staffRepository.save(staff);
    }

    public Optional<Staff> getStaffById(Long id) {
        return staffRepository.findById(id);
    }

    public Staff updateStaffStatus(Long id, boolean workToday) {
        Optional<Staff> optStaff = staffRepository.findById(id);
        if(optStaff.isPresent()) {
            Staff staff = optStaff.get();
            staff.setWorkToday(workToday);
            return staffRepository.save(staff);
        }
        return null;
    }

    public Staff updateStaff(Long id, Staff details) {
        Optional<Staff> optStaff = staffRepository.findById(id);
        if (optStaff.isPresent()) {
            Staff staff = optStaff.get();
            staff.setName(details.getName());
            staff.setRole(details.getRole());
            staff.setDepartment(details.getDepartment());
            staff.setMobile(details.getMobile());
            staff.setEmail(details.getEmail());
            staff.setWorkToday(details.isWorkToday());
            return staffRepository.save(staff);
        }
        return null;
    }

    public void softDeleteStaff(Long id) {
        staffRepository.softDelete(id);
    }

    public void restoreStaff(Long id) {
        staffRepository.restore(id);
    }
}
