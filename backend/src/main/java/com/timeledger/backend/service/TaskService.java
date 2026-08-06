package com.timeledger.backend.service;

import com.timeledger.backend.model.Task;
import com.timeledger.backend.model.TaskStatus;
import com.timeledger.backend.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public List<Task> getTasksByAssignee(Long userId) {
        return taskRepository.findByAssigneeId(userId);
    }

    public long countByAssigneeAndStatus(Long userId, TaskStatus status) {
        return taskRepository.countByAssigneeIdAndStatus(userId, status);
    }

    public long countByStatus(TaskStatus status) {
        return taskRepository.countByStatus(status);
    }

    public long countByAssigneeAndPriority(Long userId, com.timeledger.backend.model.TaskPriority priority) {
        return taskRepository.countByAssigneeIdAndPriority(userId, priority);
    }

    public long countByPriority(com.timeledger.backend.model.TaskPriority priority) {
        return taskRepository.countByPriority(priority);
    }

    public List<Task> getRecentlyCompletedTasks(Long userId, int days) {
        java.time.LocalDateTime date = java.time.LocalDateTime.now().minusDays(days);
        if (userId != null) {
            return taskRepository.findByAssigneeIdAndStatusAndUpdatedAtAfter(userId, TaskStatus.COMPLETED, date);
        } else {
            return taskRepository.findByStatusAndUpdatedAtAfter(TaskStatus.COMPLETED, date);
        }
    }

    public Optional<Task> getTaskById(String id) {
        return taskRepository.findById(id);
    }

    public Task createTask(Task task) {
        task.onCreate();
        return taskRepository.save(task);
    }

    public Task updateTask(String id, Task taskDetails) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));

        task.setTitle(taskDetails.getTitle());
        task.setDescription(taskDetails.getDescription());
        task.setStatus(taskDetails.getStatus());
        task.setPriority(taskDetails.getPriority());
        task.setDueDate(taskDetails.getDueDate());
        task.onUpdate();

        return taskRepository.save(task);
    }

    public void deleteTask(String id) {
        taskRepository.deleteById(id);
    }
}
