backend/
├── calculators/ # Calculator Classes (OOP)
│ ├── Calculator.js # Abstract Base Class
│ ├── DCACalculator.js # DCA Calculator (Inheritance)
│ ├── CompoundInterestCalculator.js # Compound Interest
│ └── RetirementPlanner.js # Retirement Planner
│
├── models/ # Database Models (Mongoose)
│ ├── User.js # User Model + Methods
│ └── Calculation.js # Calculation Model + Methods
│
├── routes/ # API Routes
│ ├── auth.js # Authentication routes
│ ├── calculate.js # Calculation routes
│ └── calculations.js # CRUD routes
│
├── middleware/ # Middleware Classes
│ ├── auth.js # Auth middleware
│ └── validation.js # Validation middleware
│
├── services/ # Business Logic Services
│ └── CalculatorFactory.js # Factory Pattern
│
├── utils/ # Utility Classes
│ ├── ErrorHandler.js # Custom Error Classes
│ └── Logger.js # Logging utility
│
├── server.js # Main server file
├── package.json # Dependencies
├── .env # Environment variables
├── .gitignore # Git ignore
└── README.md # Documentation
