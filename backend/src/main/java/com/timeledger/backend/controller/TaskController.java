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
    public Map<String, Long> getTaskStats() {
        List<Task> tasks = taskService.getAllTasks();
        Map<String, Long> stats = new HashMap<>();
        stats.put("TODO", tasks.stream().filter(t -> TaskStatus.TODO.equals(t.getStatus())).count());
        stats.put("IN_PROGRESS", tasks.stream().filter(t -> TaskStatus.IN_PROGRESS.equals(t.getStatus())).count());
        stats.put("DONE", tasks.stream().filter(t -> TaskStatus.COMPLETED.equals(t.getStatus())).count());
        return stats;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable String id) {
        return taskService.getTaskById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Task createTask(@RequestBody Task task) {
        return taskService.createTask(task);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable String id, @RequestBody Task taskDetails) {
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
