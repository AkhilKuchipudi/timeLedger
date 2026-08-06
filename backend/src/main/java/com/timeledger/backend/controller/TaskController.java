package com.timeledger.backend.controller;

import com.timeledger.backend.model.Task;
import com.timeledger.backend.model.TaskStatus;
import com.timeledger.backend.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "http://localhost:4200")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @GetMapping
    public List<Task> getAllTasks() {
        return taskService.getAllTasks();
    }

    @GetMapping("/stats")
    public Map<String, Object> getTaskStats(@RequestParam(required = false) Long userId) {
        Map<String, Object> stats = new HashMap<>();
        
        if (userId != null) {
            stats.put("TODO", taskService.countByAssigneeAndStatus(userId, TaskStatus.TODO));
            stats.put("IN_PROGRESS", taskService.countByAssigneeAndStatus(userId, TaskStatus.IN_PROGRESS));
            stats.put("DONE", taskService.countByAssigneeAndStatus(userId, TaskStatus.COMPLETED));
            
            Map<String, Long> priorityStats = new HashMap<>();
            priorityStats.put("LOW", taskService.countByAssigneeAndPriority(userId, com.timeledger.backend.model.TaskPriority.LOW));
            priorityStats.put("MEDIUM", taskService.countByAssigneeAndPriority(userId, com.timeledger.backend.model.TaskPriority.MEDIUM));
            priorityStats.put("HIGH", taskService.countByAssigneeAndPriority(userId, com.timeledger.backend.model.TaskPriority.HIGH));
            stats.put("priorities", priorityStats);
        } else {
            stats.put("TODO", taskService.countByStatus(TaskStatus.TODO));
            stats.put("IN_PROGRESS", taskService.countByStatus(TaskStatus.IN_PROGRESS));
            stats.put("DONE", taskService.countByStatus(TaskStatus.COMPLETED));

            Map<String, Long> priorityStats = new HashMap<>();
            priorityStats.put("LOW", taskService.countByPriority(com.timeledger.backend.model.TaskPriority.LOW));
            priorityStats.put("MEDIUM", taskService.countByPriority(com.timeledger.backend.model.TaskPriority.MEDIUM));
            priorityStats.put("HIGH", taskService.countByPriority(com.timeledger.backend.model.TaskPriority.HIGH));
            stats.put("priorities", priorityStats);
        }
        
        return stats;
    }

    @GetMapping("/productivity")
    public List<Long> getProductivityStats(@RequestParam(required = false) Long userId) {
        List<Task> completed = taskService.getRecentlyCompletedTasks(userId, 7);
        // Simplified: return counts per day for the last 7 days
        Long[] counts = new Long[7];
        for (int i = 0; i < 7; i++) counts[i] = 0L;
        
        java.time.LocalDate today = java.time.LocalDate.now();
        for (Task t : completed) {
            int daysAgo = (int) java.time.temporal.ChronoUnit.DAYS.between(t.getUpdatedAt().toLocalDate(), today);
            if (daysAgo >= 0 && daysAgo < 7) {
                counts[6 - daysAgo]++;
            }
        }
        return java.util.Arrays.asList(counts);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable String id) {
        return taskService.getTaskById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Task createTask(@jakarta.validation.Valid @RequestBody Task task) {
        return taskService.createTask(task);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable String id, @jakarta.validation.Valid @RequestBody Task taskDetails) {
        try {
            return ResponseEntity.ok(taskService.updateTask(id, taskDetails));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable String id) {
        taskService.deleteTask(id);
        return ResponseEntity.ok().build();
    }
}
