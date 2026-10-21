package com.petcare.app.repository;

import com.petcare.app.entity.Animal;
import com.petcare.app.enums.Species;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AnimalRepository extends MongoRepository<Animal, String> {

    List<Animal> findByUserId(String userId);

    Optional<Animal> findByIdAndUserId(String id, String userId);

    List<Animal> findByUserIdAndSpecies(String userId, Species species);

    List<Animal> findByUserIdAndNameContainingIgnoreCase(String userId, String name);
}
