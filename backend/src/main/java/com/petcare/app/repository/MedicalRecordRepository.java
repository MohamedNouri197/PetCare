package com.petcare.app.repository;

import com.petcare.app.entity.MedicalRecord;
import com.petcare.app.enums.MedicalRecordType;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MedicalRecordRepository extends MongoRepository<MedicalRecord, String> {

    List<MedicalRecord> findByAnimalIdOrderByDateDesc(String animalId);

    List<MedicalRecord> findByAnimalIdAndType(String animalId, MedicalRecordType type);

    List<MedicalRecord> findByAnimalIdAndDateBetween(String animalId, LocalDate start, LocalDate end);
}
