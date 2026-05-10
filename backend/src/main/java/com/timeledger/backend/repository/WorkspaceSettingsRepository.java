package com.timeledger.backend.repository;

import com.timeledger.backend.model.WorkspaceSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WorkspaceSettingsRepository extends JpaRepository<WorkspaceSettings, Long> {
}
