package com.sportsperformance.batch2;

import com.sportsperformance.batch2.Services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@EntityScan(basePackages = "com.sportsperformance.batch2.models")
public class SportsPerformanceMonitoringSystemApplication {

	public static void main(String[] args) {

		SpringApplication.run(SportsPerformanceMonitoringSystemApplication.class, args);
	}

}
