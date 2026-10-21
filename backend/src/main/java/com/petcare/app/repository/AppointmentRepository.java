package com.petcare.app.repository;

import com.petcare.app.entity.Appointment;
import com.petcare.app.enums.AppointmentStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends MongoRepository<Appointment, String> {

    List<Appointment> findByAnimalIdOrderByDateTimeDesc(String animalId);

    List<Appointment> findByAnimalIdAndStatus(String animalId, AppointmentStatus status);

    List<Appointment> findByAnimalIdAndDateTimeBetween(String animalId, LocalDateTime start, LocalDateTime end);

    List<Appointment> findByAnimalIdAndDateTimeAfterAndStatus(String animalId, LocalDateTime dateTime, AppointmentStatus status);
}
