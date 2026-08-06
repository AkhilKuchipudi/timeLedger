package com.timeledger.backend.repository;

import com.timeledger.backend.model.SystemLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SystemLogRepository extends JpaRepository<SystemLog, String> {
    List<SystemLog> findAllByOrderByTimestampDesc();
}
