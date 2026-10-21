package com.petcare.app.repository;

import com.petcare.app.entity.Reminder;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReminderRepository extends MongoRepository<Reminder, String> {

    List<Reminder> findByAnimalIdOrderByDateTimeDesc(String animalId);

    @Query("{ 'animalId': ?0, 'active': true }")
    List<Reminder> findActiveReminders(String animalId);

    List<Reminder> findByAnimalIdAndDateTimeBetween(String animalId, LocalDateTime start, LocalDateTime end);

    @Query("{ 'active': true, 'dateTime': { $lte: ?0 } }")
    List<Reminder> findDueReminders(LocalDateTime dateTime);
}
