# Test Management System

This project consists of several services aimed at providing a comprehensive test management system. The system allows users to create, preview, and administer tests, as well as providing a secure test-taking environment for exam candidates.

## Services

### 1. Main Backend Server

The main backend server handles user authentication, user profiles, test creation, test analytics, and test uploading. It serves as the core backend infrastructure for the entire system.

### 2. OCR Server

The OCR (Optical Character Recognition) server is a Flask-based service responsible for processing scanned PDF files. It utilizes an LLM (Language Model) called Mistral 7b to extract and interpret text from the scanned documents. The OCR server outputs data in a specific format, including equations rendered using LaTeX.

### 3. Main Test Frontend

The main test frontend provides a user interface for creating tests, previewing them, and managing test analytics. Users can create tests with various question types, including text and image-based questions. They can also analyze the performance of test-takers through the provided analytics.

### 4. Test Portal Frontend

The test portal frontend serves as a secure environment for test-takers to attempt exams. It opens when a user starts a test on the main frontend and maintains full-screen mode while preventing access to developer tools. The UI of the test portal mimics the layout of standardized tests like the JEE examination. Test-takers' responses are saved in Redis for the duration of the test to ensure persistence.

## Video Tutorial

For a detailed walkthrough of the features and functionality of the Test Management System, please refer to our video tutorial: [Video Tutorial](https://drive.google.com/file/d/1uDU3SHUYOXYfbbCX-S6X6rTmMajZzcvS/view?usp=sharing)

## Roadmap

- [ ] Complete Analytics Route: Implement additional features and enhancements to the test analytics functionality.
- [ ] Enhance OCR Quality: Improve the OCR server's ability to process scanned PDFs and extract text accurately.
- [ ] Refine Test Portal UI: Make further improvements to the UI and user experience of the test portal frontend.
- [ ] Implement Additional Security Measures: Enhance security measures to ensure the integrity and confidentiality of test data.


