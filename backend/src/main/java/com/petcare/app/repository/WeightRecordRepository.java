package com.petcare.app.repository;

import com.petcare.app.entity.WeightRecord;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface WeightRecordRepository extends MongoRepository<WeightRecord, String> {

    List<WeightRecord> findByAnimalIdOrderByDateDesc(String animalId);

    Optional<WeightRecord> findFirstByAnimalIdOrderByDateDesc(String animalId);

    List<WeightRecord> findByAnimalIdAndDateBetween(String animalId, LocalDate start, LocalDate end);
}
