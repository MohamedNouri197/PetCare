package com.petcare.app.repository;

import com.petcare.app.entity.Vaccination;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface VaccinationRepository extends MongoRepository<Vaccination, String> {

    List<Vaccination> findByAnimalIdOrderByDateDesc(String animalId);

    @Query("{ 'animalId': ?0, 'nextDueDate': { $ne: null, $lte: ?1 } }")
    List<Vaccination> findUpcomingVaccinations(String animalId, LocalDate date);

    List<Vaccination> findByAnimalIdAndDateBetween(String animalId, LocalDate start, LocalDate end);
}
