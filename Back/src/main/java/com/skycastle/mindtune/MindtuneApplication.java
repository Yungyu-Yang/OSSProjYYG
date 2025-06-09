package com.skycastle.mindtune;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
public class MindtuneApplication {

	public static void main(String[] args) {
		SpringApplication.run(MindtuneApplication.class, args);
		System.out.println("Current working directory: " + System.getProperty("user.dir"));
	}

}
