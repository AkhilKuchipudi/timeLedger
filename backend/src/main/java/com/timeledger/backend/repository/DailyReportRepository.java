package com.timeledger.backend.repository;

import com.timeledger.backend.model.DailyReport;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.time.LocalDate;

public interface DailyReportRepository extends JpaRepository<DailyReport, Long> {
    Optional<DailyReport> findByUser_IdAndDate(Long userId, LocalDate date);
}
