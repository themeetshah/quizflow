-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 21, 2025 at 06:34 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `quizflow`
--

-- --------------------------------------------------------

--
-- Table structure for table `questions`
--

CREATE TABLE `questions` (
  `question_id` int(11) NOT NULL,
  `quiz_id` int(11) DEFAULT NULL,
  `question_text` text DEFAULT NULL,
  `option_a` text DEFAULT NULL,
  `option_b` text DEFAULT NULL,
  `option_c` text DEFAULT NULL,
  `option_d` text DEFAULT NULL,
  `correct_option` enum('a','b','c','d') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `questions`
--

INSERT INTO `questions` (`question_id`, `quiz_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_option`) VALUES
(1, 1, 'What is 2 + 2?', '1', '2', '3', '4', 'd'),
(2, 1, 'Solve for x: 2x = 10', 'x = 2', 'x = 5', 'x = 10', 'x = 0', 'b'),
(3, 2, 'What is the chemical symbol for water?', 'H2O', 'O2', 'CO2', 'N2', 'a'),
(4, 2, 'What planet is known as the Red Planet?', 'Earth', 'Mars', 'Jupiter', 'Saturn', 'b'),
(5, 3, 'Who was the first President of the United States?', 'Abraham Lincoln', 'Thomas Jefferson', 'George Washington', 'John Adams', 'c'),
(6, 3, 'In what year did the Titanic sink?', '1912', '1905', '1920', '1918', 'a'),
(7, 4, 'Who wrote \"Romeo and Juliet\"?', 'Charles Dickens', 'William Shakespeare', 'Jane Austen', 'Mark Twain', 'b'),
(8, 4, 'What is the main theme of \"To Kill a Mockingbird\"?', 'Courage', 'Prejudice', 'Adventure', 'Love', 'b'),
(17, 5, 'What is 5 + 5?', '7', '8', '9', '10', 'd'),
(18, 5, 'Solve for x: x + 3 = 7', 'x = 3', 'x = 4', 'x = 5', 'x = 6', 'b'),
(19, 6, 'What is the atomic number of carbon?', '6', '8', '7', '5', 'a'),
(20, 6, 'Which of these elements is a noble gas?', 'Oxygen', 'Nitrogen', 'Argon', 'Carbon', 'c'),
(21, 7, 'What is the capital of France?', 'London', 'Paris', 'Berlin', 'Rome', 'b'),
(22, 7, 'Which continent is known as the \"Dark Continent\"?', 'Asia', 'Africa', 'Europe', 'Australia', 'b'),
(23, 8, 'Who wrote \"Pride and Prejudice\"?', 'Charlotte Bronte', 'Emily Dickinson', 'Jane Austen', 'Mary Shelley', 'c'),
(24, 8, 'Which author wrote \"1984\"?', 'Aldous Huxley', 'George Orwell', 'J.K. Rowling', 'Mark Twain', 'b'),
(25, 9, 'What does the acronym \"HTML\" stand for?', 'Hypertext Markup Language', 'Hyper Transfer Markup Language', 'High-tech Media Language', 'Hyperlink Text Machine Language', 'a'),
(26, 9, 'Which company created the first iPhone?', 'Google', 'Microsoft', 'Apple', 'Samsung', 'c'),
(27, 10, 'Who is known as the father of modern philosophy?', 'Immanuel Kant', 'René Descartes', 'Socrates', 'Plato', 'b'),
(28, 10, 'Which philosopher is associated with the idea of \"Tabula Rasa\"?', 'John Locke', 'David Hume', 'Aristotle', 'Karl Marx', 'a'),
(36, 29, 'Question 1', 'Option A', 'Option B', 'Option C', 'Option D', 'b'),
(37, 29, 'Question 2', 'Option A', 'Option B', 'Option C', 'Option D', 'a');

-- --------------------------------------------------------

--
-- Table structure for table `quizzes`
--

CREATE TABLE `quizzes` (
  `id` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `timer` int(11) DEFAULT NULL,
  `difficulty` enum('easy','medium','hard') DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `exam_date` datetime DEFAULT NULL,
  `created_by` varchar(100) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `quizzes`
--

INSERT INTO `quizzes` (`id`, `title`, `description`, `timer`, `difficulty`, `category`, `exam_date`, `created_by`, `created_at`) VALUES
(1, 'Math Exam', 'Test your algebra, geometry and trigonometry skills with this exam.', 60, 'easy', 'math', '2025-03-15 00:00:00', 'prof_john', '2024-12-11 14:19:24'),
(2, 'Science Exam', 'Prepare to demonstrate your understanding of scientific concepts.', 65, 'hard', 'science', '2025-02-21 00:00:00', 'prof_susan', '2024-12-31 14:19:24'),
(3, 'History Quiz', 'Assess your knowledge of history with this comprehensive history quiz.', 75, 'medium', 'history', '2025-02-25 00:00:00', 'prof_john', '2025-01-15 14:19:24'),
(4, 'English Test', 'Test your understanding of English literature, including analysis of comprehension.', 70, 'medium', 'english', '2025-02-27 00:00:00', 'prof_susan', '2025-01-09 14:19:24'),
(5, 'Math Quiz', 'A quick test of your math skills on basic addition and subtraction.', 30, 'easy', 'math', '2025-03-10 00:00:00', 'prof_alex', '2025-02-18 14:19:24'),
(6, 'Chemistry Test', 'A test that challenges your chemistry knowledge with fundamental concepts.', 45, 'medium', 'science', '2025-04-01 00:00:00', 'prof_jane', '2025-02-22 10:19:24'),
(7, 'Geography Exam', 'Evaluate your knowledge about world geography and major landmarks.', 60, 'medium', 'geography', '2025-03-20 00:00:00', 'prof_anna', '2025-02-23 14:19:24'),
(8, 'Literature Quiz', 'Test your understanding of classic literature and its authors.', 45, 'hard', 'english', '2025-04-10 00:00:00', 'prof_mary', '2025-02-25 14:19:24'),
(9, 'Tech Trivia', 'Challenge your knowledge of the latest technology and innovations.', 50, 'medium', 'technology', '2025-03-30 00:00:00', 'prof_oliver', '2025-02-27 11:19:24'),
(10, 'Philosophy Test', 'Test your knowledge on major philosophical concepts and thinkers.', 60, 'hard', 'philosophy', '2025-04-05 00:00:00', 'prof_nina', '2025-02-28 14:19:24'),
(29, 'Quiz 1', 'This is a testing quiz, created for testing the functionality.', 75, 'hard', 'Testing', '2025-02-22 00:02:00', 'prof_ms', '2025-02-21 22:58:08');

-- --------------------------------------------------------

--
-- Table structure for table `quiz_results`
--

CREATE TABLE `quiz_results` (
  `result_id` int(11) NOT NULL,
  `quiz_id` int(11) NOT NULL,
  `score` varchar(50) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `username` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `quiz_results`
--

INSERT INTO `quiz_results` (`result_id`, `quiz_id`, `score`, `timestamp`, `username`) VALUES
(1, 1, '2/2', '2025-02-20 04:30:00', 'jane_doe'),
(2, 2, '1/2', '2025-02-22 09:00:00', 'mark_smith'),
(3, 3, '3/4', '2025-02-23 06:30:00', 'emily_clark'),
(4, 4, '1/2', '2025-02-24 10:00:00', 'john_brown'),
(5, 1, '2/2', '2025-02-25 05:30:00', 'lucas_white'),
(6, 2, '1/2', '2025-02-26 03:30:00', 'sophie_green'),
(7, 3, '4/4', '2025-02-27 09:15:00', 'olivia_king'),
(125, 3, '0/2', '2025-02-21 17:13:24', 'jane_doe'),
(126, 6, '2/2', '2025-02-21 17:18:23', 'jane_doe'),
(127, 1, '2/2', '2025-02-21 17:22:23', 'mark_smith'),
(128, 3, '0/2', '2025-02-21 17:23:11', 'mark_smith'),
(129, 6, '0/2', '2025-02-21 17:24:24', 'mark_smith'),
(130, 29, '1/2', '2025-02-21 17:30:08', 'stud_ms');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `role` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`username`, `password`, `email`, `role`) VALUES
('emily_clark', 'emily@pass', 'emily_clark@example.com', 'student'),
('jane_doe', 'password123', 'jane_doe@example.com', 'student'),
('john_brown', 'john@pass123', 'john_brown@example.com', 'student'),
('lucas_white', 'lucas123', 'lucas_white@example.com', 'student'),
('mark_smith', 'mark123', 'mark_smith@email.com', 'student'),
('olivia_king', 'olivia@pass', 'olivia_king@example.com', 'student'),
('prof_alex', 'alex12345', 'prof_alex@example.com', 'professor'),
('prof_anna', 'anna@pass', 'prof_anna@example.com', 'professor'),
('prof_jane', 'jane12345', 'prof_jane@example.com', 'professor'),
('prof_john', 'john12345', 'prof_john@example.com', 'professor'),
('prof_mary', 'mary@1234', 'prof_mary@example.com', 'professor'),
('prof_ms', 'prof123', 'prof_ms@email.com', 'professor'),
('prof_nina', 'nina1234', 'prof_nina@example.com', 'professor'),
('prof_oliver', 'oliver@pass', 'prof_oliver@example.com', 'professor'),
('prof_susan', 'susan987', 'prof_susan@example.com', 'professor'),
('sophie_green', 'sophie@greenpass', 'sophie_green@example.com', 'student'),
('stud_ms', 'ms123', 'ms@email.com', 'student');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`question_id`),
  ADD KEY `quiz_id` (`quiz_id`);

--
-- Indexes for table `quizzes`
--
ALTER TABLE `quizzes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `quiz_results`
--
ALTER TABLE `quiz_results`
  ADD PRIMARY KEY (`result_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `questions`
--
ALTER TABLE `questions`
  MODIFY `question_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `quizzes`
--
ALTER TABLE `quizzes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `quiz_results`
--
ALTER TABLE `quiz_results`
  MODIFY `result_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=131;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `questions`
--
ALTER TABLE `questions`
  ADD CONSTRAINT `questions_ibfk_1` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
