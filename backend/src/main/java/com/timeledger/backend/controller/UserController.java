package com.timeledger.backend.controller;

import com.timeledger.backend.model.User;
import com.timeledger.backend.service.UserService;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            return ResponseEntity.ok(userService.registerUser(user));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User loginRequest) {
        try {
            String jwt = userService.loginUser(loginRequest.getUsername(), loginRequest.getPassword());
            User user = userService.findByUsernameOrEmail(loginRequest.getUsername()).get();
            
            // Verify account type if provided by frontend
            if (loginRequest.getAccountType() != null && !loginRequest.getAccountType().equalsIgnoreCase(user.getAccountType())) {
                return ResponseEntity.status(401).body("Account type mismatch. Please select the correct account type.");
            }
            
            return ResponseEntity.ok(new JwtResponse(jwt, user.getId(), user.getUsername(), user.getEmail(), user.getRole(), user.getAccountType()));
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid username or password");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Helper class for JWT response
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    private static class JwtResponse {
        private String token;
        private String type = "Bearer";
        private Long id;
        private String username;
        private String email;
        private String role;
        private String accountType;

        public JwtResponse(String token, Long id, String username, String email, String role, String accountType) {
            this.token = token;
            this.id = id;
            this.username = username;
            this.email = email;
            this.role = role;
            this.accountType = accountType;
        }
    }
}
