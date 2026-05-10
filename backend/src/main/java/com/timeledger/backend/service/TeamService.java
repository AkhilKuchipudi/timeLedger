package com.timeledger.backend.service;

import com.timeledger.backend.model.Team;
import com.timeledger.backend.model.User;
import com.timeledger.backend.repository.TeamRepository;
import com.timeledger.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TeamService {
    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Team> getAllTeams() {
        return teamRepository.findAll();
    }

    public Team createTeam(Team team) {
        if (team.getOwner() != null && !"ORGANIZATION".equalsIgnoreCase(team.getOwner().getAccountType())) {
            throw new RuntimeException("Only Organization accounts can create teams.");
        }
        return teamRepository.save(team);
    }

    public Team addMember(Long teamId, Long userId) {
        Team team = teamRepository.findById(teamId).orElseThrow(() -> new RuntimeException("Team not found"));
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        team.getMembers().add(user);
        return teamRepository.save(team);
    }

    public Team addMemberByEmail(Long teamId, String email) {
        Team team = teamRepository.findById(teamId).orElseThrow(() -> new RuntimeException("Team not found"));
        
        // Verify owner is an ORGANIZATION
        if (team.getOwner() != null && !"ORGANIZATION".equalsIgnoreCase(team.getOwner().getAccountType())) {
            throw new RuntimeException("Only Organization accounts can invite team members.");
        }

        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User with email " + email + " not found"));
        team.getMembers().add(user);
        return teamRepository.save(team);
    }

    public Team removeMember(Long teamId, Long userId) {
        Team team = teamRepository.findById(teamId).orElseThrow(() -> new RuntimeException("Team not found"));
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        team.getMembers().remove(user);
        return teamRepository.save(team);
    }

    public void deleteTeam(Long id) {
        teamRepository.deleteById(id);
    }
}
