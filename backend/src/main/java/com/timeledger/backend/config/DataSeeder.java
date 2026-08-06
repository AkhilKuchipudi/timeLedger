package com.timeledger.backend.config;

import com.timeledger.backend.model.Task;
import com.timeledger.backend.model.TaskPriority;
import com.timeledger.backend.model.TaskStatus;
import com.timeledger.backend.model.User;
import com.timeledger.backend.model.SystemLog;
import com.timeledger.backend.repository.SystemLogRepository;
import com.timeledger.backend.repository.TaskRepository;
import com.timeledger.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TaskRepository taskRepository;
    
    @Autowired
    private SystemLogRepository systemLogRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.findByUsername("employer").isEmpty()) {
            // 1. Create Employer
            User employer = new User();
            employer.setUsername("employer");
            employer.setEmail("employer@timeledger.com");
            employer.setPassword(passwordEncoder.encode("password123"));
            employer.setFullName("Akhil Employer");
            employer.setRole("ROLE_ADMIN");
            employer.setAccountType("ORGANIZATION");
            userRepository.save(employer);

            // 2. Create Employee
            User employee = new User();
            employee.setUsername("employee");
            employee.setEmail("employee@timeledger.com");
            employee.setPassword(passwordEncoder.encode("password123"));
            employee.setFullName("John Staff");
            employee.setRole("ROLE_USER");
            employee.setAccountType("INDIVIDUAL");
            userRepository.save(employee);

            // 3. Seed Mongo Tasks
            if (taskRepository.count() == 0) {
                Task task1 = new Task();
                task1.setTitle("Fix Dashboard UI");
                task1.setDescription("Update glassmorphism styles and bind dynamic data");
                task1.setStatus(TaskStatus.IN_PROGRESS);
                task1.setPriority(TaskPriority.HIGH);
                task1.setAssigneeId(employee.getId());
                task1.setDueDate(LocalDateTime.now().plusDays(2));
                task1.onCreate();

                Task task2 = new Task();
                task2.setTitle("Implement JWT Refresh");
                task2.setDescription("Add refresh token logic to backend security");
                task2.setStatus(TaskStatus.TODO);
                task2.setPriority(TaskPriority.MEDIUM);
                task2.setAssigneeId(employee.getId());
                task2.setDueDate(LocalDateTime.now().plusDays(5));
                task2.onCreate();

                taskRepository.saveAll(Arrays.asList(task1, task2));
            }

            // 4. Seed System Logs
            if (systemLogRepository.count() == 0) {
                SystemLog log1 = new SystemLog("system", "System Initialization", "INFO", "Database seeded with initial test data");
                SystemLog log2 = new SystemLog("employer", "Account Created", "INFO", "Employer root account generated successfully");
                SystemLog log3 = new SystemLog("employee", "Account Created", "INFO", "Employee test account generated successfully");
                SystemLog log4 = new SystemLog("system", "Warning Simulation", "WARNING", "Mock warning event generated for UI testing");
                SystemLog log5 = new SystemLog("system", "Error Simulation", "ERROR", "Mock error event generated for UI testing");
                
                systemLogRepository.saveAll(Arrays.asList(log1, log2, log3, log4, log5));
            }

            System.out.println("Data Seeding Completed: Employer (employer/password123) and Employee (employee/password123) created.");
        }
    }
}
