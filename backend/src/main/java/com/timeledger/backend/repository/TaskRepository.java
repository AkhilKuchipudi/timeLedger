package com.timeledger.backend.repository;

import com.timeledger.backend.model.Task;
import com.timeledger.backend.model.TaskStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface TaskRepository extends MongoRepository<Task, String> {
    List<Task> findByAssigneeId(Long assigneeId);
    
    List<Task> findByStatus(String status);

    // New: Find all tasks for a list of team members (for Employers)
    List<Task> findByAssigneeIdIn(List<Long> assigneeIds);

    long countByAssigneeIdAndStatus(Long assigneeId, TaskStatus status);
    
    long countByStatus(TaskStatus status);
}
