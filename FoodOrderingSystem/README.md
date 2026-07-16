# 🍔 Foodie Express — Food Ordering System

A full production-quality, microservice-based Food Ordering System built with
**Spring Boot 4.1 (Java 21)**, **React**, **MySQL**, and **Apache ActiveMQ**.

---

## 1. Architecture Overview

```
FoodOrderingSystem/
├── order-service/      → Port 8081  (MySQL + REST + JMS Producer)
├── payment-service/     → Port 8080  (MySQL + REST, calls order-service)
├── kitchen-service/      → Port 8082  (No DB, JMS Consumer/Producer)
├── delivery-service/     → Port 8083  (No DB, JMS Consumer)
├── frontend/            → React customer-facing app
├── database/
│   └── schema.sql       → MySQL schema + sample data
└── README.md
```

### Customer Flow
```
Home → Menu → Select Food → Order Page → Place Order
   → Order saved in Order Service (status = PENDING)
   → Order Service publishes message to "order.queue"
   → Kitchen Service consumes message automatically (COOKING → READY)
   → Kitchen Service publishes message to "delivery.queue"
   → Customer proceeds to Payment Page → Pay Now → status = PAID
   → Success Page → Order History Page
   → Delivery Service consumes "delivery.queue" in background
     (OUT_FOR_DELIVERY → DELIVERED)
```

Kitchen and Delivery services run **entirely in the background** — there is
no frontend page for them, matching real food-delivery apps like Swiggy or
Zomato where kitchen/rider operations are invisible to the customer app.

### Why Order Service owns the `orders` table
Only `order-service` talks to the `orders` table directly. Payment,
Kitchen, and Delivery services call a small internal REST endpoint —
`PATCH /orders/{id}/status` — to update order status. This keeps
each service independently deployable while avoiding shared database
access across services (an anti-pattern in microservice architecture).

---

## 2. Tech Stack

| Layer          | Technology                                   |
|-----------------|-----------------------------------------------|
| Backend         | Java 21, Spring Boot 4.1, Spring MVC, Spring Data JPA, Hibernate, Spring Validation, Spring JMS |
| Messaging       | Apache ActiveMQ                              |
| Database        | MySQL 8                                      |
| Build Tool      | Maven                                        |
| Frontend        | React 18, React Router DOM 6, Axios, Bootstrap 5 |
| Boilerplate     | Lombok                                       |

---

## 3. Prerequisites

- JDK 21+
- Maven 3.9+
- Node.js 18+ and npm
- MySQL 8+ running locally (`root` / `root` — update `application.properties` if different)
- Apache ActiveMQ 5.18+ ([download](https://activemq.apache.org/components/classic/download/))

---

## 4. Database Setup

1. Start MySQL.
2. Run the schema script:

```bash
mysql -u root -p < database/schema.sql
```

This creates the `food_order_db` database along with the `orders` and
`payments` tables (Order Service also auto-creates/updates tables via
`spring.jpa.hibernate.ddl-auto=update`, so running the script is optional
but recommended for indexes and sample data).

---

## 5. Start ActiveMQ

Download and extract Apache ActiveMQ "Classic", then:

```bash
# Linux / macOS
cd apache-activemq-5.18.x/bin
./activemq start

# Windows
cd apache-activemq-5.18.x\bin\win64
activemq.bat start
```

Verify it's running at the admin console:
`http://localhost:8161/admin` (default login: `admin` / `admin`)

Broker URL used by all services: `tcp://localhost:61616`

---

## 6. Import into Eclipse (Backend)

1. Open Eclipse → `File > Import > Maven > Existing Maven Projects`.
2. Browse to `FoodOrderingSystem` and select all four service folders
   (`order-service`, `payment-service`, `kitchen-service`,
   `delivery-service`) — import each as a **separate Maven project**.
3. Wait for Maven to download dependencies (`Right-click project → Maven → Update Project` if needed).
4. Ensure Project Facet / JRE is set to Java 21.

---

## 7. Run the Backend Services

Each service is an **independent Spring Boot application**. Start them in
this order:

```bash
# 1. Order Service (8081) - must start first (DB owner)
cd order-service
mvn spring-boot:run

# 2. Kitchen Service (8082) - background JMS listener
cd kitchen-service
mvn spring-boot:run

# 3. Delivery Service (8083) - background JMS listener
cd delivery-service
mvn spring-boot:run

# 4. Payment Service (8080)
cd payment-service
mvn spring-boot:run
```

Or build & run the jars directly:

```bash
mvn clean package -DskipTests
java -jar target/order-service.jar
```

Repeat for each service. Ensure MySQL and ActiveMQ are running **before**
starting `order-service` and `payment-service`.

---

## 8. Run the Frontend (VS Code)

```bash
cd frontend
npm install
npm start
```

The app runs at `http://localhost:3000` and talks to:
- Order Service → `http://localhost:8081`
- Payment Service → `http://localhost:8080`

(Update the base URLs in `src/api/axiosConfig.js` if you change ports.)

---

## 9. REST API Documentation

### Order Service — `http://localhost:8081`

| Method | Endpoint                          | Description                     |
|--------|-------------------------------------|----------------------------------|
| POST   | `/orders`                          | Create a new order (status=PENDING, publishes to `order.queue`) |
| GET    | `/orders`                          | Get all orders                  |
| GET    | `/orders/{id}`                     | Get order by ID                 |
| PUT    | `/orders/{id}`                     | Update order details            |
| DELETE | `/orders/{id}`                     | Delete an order                 |
| GET    | `/orders/status/{status}`          | Get orders by status            |
| GET    | `/orders/customer/{customerName}`  | Search orders by customer name  |
| GET    | `/orders/food/{foodItem}`          | Search orders by food item      |
| PATCH  | `/orders/{id}/status`              | Internal: update order status   |

**Sample Request — Create Order**
```json
POST /orders
{
  "customerName": "Ravi Kumar",
  "foodItem": "Chicken Biryani",
  "quantity": 2,
  "price": 250.0,
  "address": "221B MG Road, Bengaluru"
}
```

### Payment Service — `http://localhost:8080`

| Method | Endpoint         | Description                              |
|--------|------------------|--------------------------------------------|
| POST   | `/payment/pay`   | Process a payment, marks order as `PAID`   |
| GET    | `/payment`       | Get all payments                           |

**Sample Request — Pay**
```json
POST /payment/pay
{
  "orderId": 1,
  "amount": 500.0,
  "paymentMethod": "UPI"
}
```

### Kitchen & Delivery Services
No public REST APIs / frontend. They operate purely as JMS listeners:

- **Kitchen Service** listens on `order.queue` → sets status `COOKING` →
  (simulated delay) → sets status `READY` → forwards message to
  `delivery.queue`.
- **Delivery Service** listens on `delivery.queue` → sets status
  `OUT_FOR_DELIVERY` → (simulated delay) → sets status `DELIVERED`.

---

## 10. Order Status Lifecycle

```
PENDING → COOKING → READY → PAID → OUT_FOR_DELIVERY → DELIVERED
```

*(`PAID` is set independently by Payment Service once the customer pays —
it can happen in parallel with the kitchen workflow, matching the flow
described in the customer journey.)*

---

## 11. Project Structure Notes

Each backend service follows a clean layered architecture:

```
controller/   → REST endpoints
service/      → Business logic (interface + impl)
repository/   → Spring Data JPA repositories
entity/       → JPA entities
dto/          → Request / Response DTOs
exception/    → Custom exceptions + global exception handler
config/       → JMS, CORS, RestTemplate configuration
jms/ or listener/ → Queue producers / consumers
```

## 12. Troubleshooting

- **`Connection refused` on service start** — ensure MySQL/ActiveMQ are
  running before starting `order-service` / `payment-service`.
- **CORS errors in browser console** — confirm `order-service` and
  `payment-service` are both running; CORS is enabled for all origins in
  `CorsConfig`.
- **Kitchen/Delivery not updating status** — check that `order-service`
  is reachable at `http://localhost:8081` from those services
  (`order.service.base-url` in their `application.properties`).
- **ActiveMQ admin console** — `http://localhost:8161/admin` to inspect
  `order.queue` and `delivery.queue` message counts.

---

Built with ❤️ as a complete, runnable reference implementation.
