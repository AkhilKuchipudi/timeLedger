package com.timeledger.backend.config;

import com.timeledger.backend.model.User;
import com.timeledger.backend.repository.*;
import com.timeledger.backend.model.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository,
            TaskRepository taskRepository,
            TeamRepository teamRepository,
            NotificationRepository notificationRepository,
            WorkspaceSettingsRepository settingsRepository,
            LeaveBalanceRepository leaveRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() > 0)
                return;

            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setEmail("admin@timeledger.com");
            admin.setFullName("Admin User");
            admin.setRole("ROLE_ADMIN");
            admin.setAvatar("https://ui-avatars.com/api/?name=Admin+User&background=6366f1&color=fff");
            admin.setAccountType("ORGANIZATION");
            userRepository.save(admin);

            User user = new User();
            user.setUsername("user");
            user.setPassword(passwordEncoder.encode("password123"));
            user.setEmail("user@example.com");
            user.setFullName("Regular User");
            user.setRole("ROLE_USER");
            user.setAvatar("https://ui-avatars.com/api/?name=Regular+User&background=10b981&color=fff");
            user.setAccountType("INDIVIDUAL");
            userRepository.save(user);

            // Initialize Settings
            if (settingsRepository.count() == 0) {
                WorkspaceSettings settings = new WorkspaceSettings();
                settings.setProjectName("TimeLedger Enterprise");
                settings.setWorkspaceUrl("timeledger-corp.app");
                settings.setPrivateWorkspace(true);
                settings.setAutoArchiveTasks(true);
                settings.setArchiveThreshold(30);
                settings.setEmailAlerts(true);
                settings.setSlackIntegration(true);
                settings.setTimerReminders(true);
                settingsRepository.save(settings);
            }

            // Initialize Leave Balances for the base user
            if (leaveRepository.findByUserId(user.getId()).isEmpty()) {
                LeaveBalance lb1 = new LeaveBalance();
                lb1.setUser(user);
                lb1.setType("Casual");
                lb1.setCount(8);
                lb1.setTotal(12);
                lb1.setColor("var(--primary)");
                lb1.setIcon("event_available");
                lb1.setProgress(66);
                leaveRepository.save(lb1);

                LeaveBalance lb2 = new LeaveBalance();
                lb2.setUser(user);
                lb2.setType("Sick");
                lb2.setCount(4);
                lb2.setTotal(6);
                lb2.setColor("#ff4d4d");
                lb2.setIcon("medical_services");
                lb2.setProgress(66);
                leaveRepository.save(lb2);

                LeaveBalance lb3 = new LeaveBalance();
                lb3.setUser(user);
                lb3.setType("Earned");
                lb3.setCount(15);
                lb3.setTotal(20);
                lb3.setColor("var(--tertiary)");
                lb3.setIcon("card_giftcard");
                lb3.setProgress(75);
                leaveRepository.save(lb3);
            }

            System.out.println("Base accounts (admin/user) initialized. No dummy data added.");
        };
    }
}
