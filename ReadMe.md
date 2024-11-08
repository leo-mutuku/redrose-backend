# Red Rose Backend

The Red Rose Backend repository provides the backend functionality for the Red Rose POS system, developed in Node.js. This project utilizes **Object-Oriented Programming (OOP)** principles and follows **Clean Architecture** design patterns for maintainable, scalable, and modular code.

## Core Modules

The backend comprises several core modules essential to the POS system’s operations. Each module is isolated for improved clarity and functionality. The modules include:

- **Administration**: Manages user roles, permissions, and overall system configurations.
- **Finance**: Oversees financial records, including transactions and budget tracking.
- **Store**: Handles inventory management, product categorization, and stock control.
- **Kitchen**: Manages orders, food preparation statuses, and kitchen workflows.
- **Sales**: Extends POS functionalities for frontend interactions, order management, and transaction logging.
- **Purchase**: Supports procurement and supplier management.
- **Payment**: Manages various payment processes and reconciliations.
- **Payroll**: Automates employee payroll and compensation tracking.
- **Payment Gateway**: Integrates with **Mpesa** for seamless online payments.

## Architecture & Design

This project adheres to **Object-Oriented Programming (OOP)** principles, prioritizing modularity and abstraction. The **Clean Architecture** design pattern has been implemented to ensure the system's business logic remains independent of external dependencies, simplifying future expansions or modifications.

## Technology Stack

- **Node.js**: Backend server environment
- **Express**: REST API framework
- **POSTGRESSQL**: Database for data persistence
- **Mpesa API**: Integrated for payment handling

## Setup & Installation

Clone this repository and install dependencies:

```bash
git clone <repository-url>
cd redrose-backend
npm install
