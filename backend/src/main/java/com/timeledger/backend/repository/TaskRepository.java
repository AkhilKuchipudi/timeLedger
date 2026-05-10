package com.timeledger.backend.repository;

import com.timeledger.backend.model.Task;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface TaskRepository extends MongoRepository<Task, String> {
    List<Task> findByAssigneeId(Long assigneeId);

    List<Task> findByStatus(String status);
}
