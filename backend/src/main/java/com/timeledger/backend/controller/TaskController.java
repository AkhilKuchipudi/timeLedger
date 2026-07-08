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
    public Map<String, Long> getTaskStats(@RequestParam(required = false) Long userId) {
        Map<String, Long> stats = new HashMap<>();
        
        if (userId != null) {
            stats.put("TODO", taskService.countByAssigneeAndStatus(userId, TaskStatus.TODO));
            stats.put("IN_PROGRESS", taskService.countByAssigneeAndStatus(userId, TaskStatus.IN_PROGRESS));
            stats.put("DONE", taskService.countByAssigneeAndStatus(userId, TaskStatus.COMPLETED));
        } else {
            stats.put("TODO", taskService.countByStatus(TaskStatus.TODO));
            stats.put("IN_PROGRESS", taskService.countByStatus(TaskStatus.IN_PROGRESS));
            stats.put("DONE", taskService.countByStatus(TaskStatus.COMPLETED));
        }
        
        return stats;
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
