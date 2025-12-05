/**
 * Sample data for concept examples
 * Used to demonstrate SQL queries visually in the concepts section
 */

export interface TableRow {
  [key: string]: string | number | null;
}

export interface SampleTable {
  name: string;
  columns: { name: string; type: string }[];
  rows: TableRow[];
}

// Sample customers data
export const customersTable: SampleTable = {
  name: "customers",
  columns: [
    { name: "id", type: "INTEGER" },
    { name: "name", type: "TEXT" },
    { name: "email", type: "TEXT" },
    { name: "country", type: "TEXT" },
    { name: "age", type: "INTEGER" },
  ],
  rows: [
    { id: 1, name: "Alice Johnson", email: "alice@gmail.com", country: "USA", age: 28 },
    { id: 2, name: "Bob Smith", email: "bob@yahoo.com", country: "Canada", age: 35 },
    { id: 3, name: "Carlos Silva", email: "carlos@gmail.com", country: "Brazil", age: 22 },
    { id: 4, name: "Diana Chen", email: "diana@outlook.com", country: "USA", age: 41 },
    { id: 5, name: "Emma Davis", email: "emma@gmail.com", country: "Canada", age: 19 },
  ],
};

// Sample orders data (some customers have multiple orders, some have none)
export const ordersTable: SampleTable = {
  name: "orders",
  columns: [
    { name: "order_id", type: "INTEGER" },
    { name: "customer_id", type: "INTEGER" },
    { name: "product", type: "TEXT" },
    { name: "amount", type: "DECIMAL" },
    { name: "order_date", type: "DATE" },
  ],
  rows: [
    { order_id: 101, customer_id: 1, product: "Laptop", amount: 1200.00, order_date: "2024-01-15" },
    { order_id: 102, customer_id: 1, product: "Mouse", amount: 25.00, order_date: "2024-01-16" },
    { order_id: 103, customer_id: 2, product: "Keyboard", amount: 75.00, order_date: "2024-01-18" },
    { order_id: 104, customer_id: 3, product: "Monitor", amount: 350.00, order_date: "2024-01-20" },
    { order_id: 105, customer_id: 3, product: "Webcam", amount: 120.00, order_date: "2024-01-22" },
    { order_id: 106, customer_id: 4, product: "Headphones", amount: 150.00, order_date: "2024-01-25" },
    { order_id: 107, customer_id: 5, product: "USB Cable", amount: 12.00, order_date: "2024-02-01" },
    { order_id: 108, customer_id: 5, product: "Laptop Stand", amount: 45.00, order_date: "2024-02-03" },
  ],
};

// Sample products data for demonstrating multiple JOINs
export const productsTable: SampleTable = {
  name: "products",
  columns: [
    { name: "product_id", type: "INTEGER" },
    { name: "product_name", type: "TEXT" },
    { name: "category", type: "TEXT" },
    { name: "price", type: "DECIMAL" },
  ],
  rows: [
    { product_id: 1, product_name: "Laptop", category: "Electronics", price: 1200.00 },
    { product_id: 2, product_name: "Mouse", category: "Accessories", price: 25.00 },
    { product_id: 3, product_name: "Keyboard", category: "Accessories", price: 75.00 },
    { product_id: 4, product_name: "Monitor", category: "Electronics", price: 350.00 },
    { product_id: 5, product_name: "Headphones", category: "Audio", price: 150.00 },
  ],
};

/**
 * Example queries with their results for different concepts
 */

export interface QueryExample {
  title: string;
  description: string;
  inputTable: SampleTable;
  query: string;
  outputRows: TableRow[];
  highlightedRows?: number[]; // Indices of rows to highlight in result
}

// SELECT basics examples
export const selectExamples: QueryExample[] = [
  {
    title: "Select Specific Columns",
    description: "Choose only the columns you need",
    inputTable: customersTable,
    query: "SELECT name, country\nFROM customers",
    outputRows: [
      { name: "Alice Johnson", country: "USA" },
      { name: "Bob Smith", country: "Canada" },
      { name: "Carlos Silva", country: "Brazil" },
      { name: "Diana Chen", country: "USA" },
      { name: "Emma Davis", country: "Canada" },
    ],
  },
  {
    title: "Select with Column Aliases",
    description: "Rename columns in the output for clarity",
    inputTable: customersTable,
    query: "SELECT name AS customer_name,\n       email AS contact_email\nFROM customers",
    outputRows: [
      { customer_name: "Alice Johnson", contact_email: "alice@gmail.com" },
      { customer_name: "Bob Smith", contact_email: "bob@yahoo.com" },
      { customer_name: "Carlos Silva", contact_email: "carlos@gmail.com" },
      { customer_name: "Diana Chen", contact_email: "diana@outlook.com" },
      { customer_name: "Emma Davis", contact_email: "emma@gmail.com" },
    ],
  },
];

// WHERE clause examples
export const whereExamples: QueryExample[] = [
  {
    title: "Filter by Age",
    description: "Get customers who are 30 or older",
    inputTable: customersTable,
    query: "SELECT name, age, country\nFROM customers\nWHERE age >= 30",
    outputRows: [
      { name: "Bob Smith", age: 35, country: "Canada" },
      { name: "Diana Chen", age: 41, country: "USA" },
    ],
  },
  {
    title: "Filter by Country",
    description: "Get only customers from USA",
    inputTable: customersTable,
    query: "SELECT name, email, country\nFROM customers\nWHERE country = 'USA'",
    outputRows: [
      { name: "Alice Johnson", email: "alice@gmail.com", country: "USA" },
      { name: "Diana Chen", email: "diana@outlook.com", country: "USA" },
    ],
  },
  {
    title: "Pattern Matching",
    description: "Find customers with Gmail addresses",
    inputTable: customersTable,
    query: "SELECT name, email\nFROM customers\nWHERE email LIKE '%@gmail.com'",
    outputRows: [
      { name: "Alice Johnson", email: "alice@gmail.com" },
      { name: "Carlos Silva", email: "carlos@gmail.com" },
      { name: "Emma Davis", email: "emma@gmail.com" },
    ],
  },
];

// ORDER BY examples
export const orderByExamples: QueryExample[] = [
  {
    title: "Sort by Name (A-Z)",
    description: "Alphabetical ordering",
    inputTable: customersTable,
    query: "SELECT name, country\nFROM customers\nORDER BY name ASC",
    outputRows: [
      { name: "Alice Johnson", country: "USA" },
      { name: "Bob Smith", country: "Canada" },
      { name: "Carlos Silva", country: "Brazil" },
      { name: "Diana Chen", country: "USA" },
      { name: "Emma Davis", country: "Canada" },
    ],
  },
  {
    title: "Sort by Amount (Highest First)",
    description: "Descending order for amounts",
    inputTable: ordersTable,
    query: "SELECT product, amount\nFROM orders\nORDER BY amount DESC\nLIMIT 3",
    outputRows: [
      { product: "Laptop", amount: 1200.00 },
      { product: "Monitor", amount: 350.00 },
      { product: "Headphones", amount: 150.00 },
    ],
  },
];

// GROUP BY examples
export const groupByExamples: QueryExample[] = [
  {
    title: "Count Orders per Customer",
    description: "Aggregate using COUNT",
    inputTable: ordersTable,
    query: "SELECT customer_id, COUNT(*) as order_count\nFROM orders\nGROUP BY customer_id\nORDER BY customer_id",
    outputRows: [
      { customer_id: 1, order_count: 2 },
      { customer_id: 2, order_count: 1 },
      { customer_id: 3, order_count: 2 },
      { customer_id: 4, order_count: 1 },
      { customer_id: 5, order_count: 2 },
    ],
  },
  {
    title: "Total Spent per Customer",
    description: "Aggregate using SUM",
    inputTable: ordersTable,
    query: "SELECT customer_id, SUM(amount) as total_spent\nFROM orders\nGROUP BY customer_id\nORDER BY total_spent DESC",
    outputRows: [
      { customer_id: 1, total_spent: 1225.00 },
      { customer_id: 3, total_spent: 470.00 },
      { customer_id: 4, total_spent: 150.00 },
      { customer_id: 2, total_spent: 75.00 },
      { customer_id: 5, total_spent: 57.00 },
    ],
  },
];

// JOIN examples
export interface JoinExample {
  title: string;
  description: string;
  leftTable: SampleTable;
  rightTable: SampleTable;
  joinType: "INNER" | "LEFT" | "RIGHT" | "FULL";
  query: string;
  resultColumns: string[];
  matchedLeftRows: number[]; // Indices of rows from left table that have matches
  matchedRightRows: number[]; // Indices of rows from right table that have matches
}

export const joinExamples: JoinExample[] = [
  {
    title: "INNER JOIN",
    description: "Only customers who have placed orders",
    leftTable: customersTable,
    rightTable: ordersTable,
    joinType: "INNER",
    query: "SELECT c.name, o.product, o.amount\nFROM customers c\nINNER JOIN orders o\n  ON c.id = o.customer_id",
    resultColumns: ["name", "product", "amount"],
    matchedLeftRows: [0, 1, 2, 3, 4], // All customers have orders
    matchedRightRows: [0, 1, 2, 3, 4, 5, 6, 7], // All orders have customers
  },
  {
    title: "LEFT JOIN",
    description: "All customers, with their orders (if any)",
    leftTable: customersTable,
    rightTable: ordersTable,
    joinType: "LEFT",
    query: "SELECT c.name, o.product, o.amount\nFROM customers c\nLEFT JOIN orders o\n  ON c.id = o.customer_id",
    resultColumns: ["name", "product", "amount"],
    matchedLeftRows: [0, 1, 2, 3, 4], // All customers included
    matchedRightRows: [0, 1, 2, 3, 4, 5, 6, 7], // All orders included
  },
];
