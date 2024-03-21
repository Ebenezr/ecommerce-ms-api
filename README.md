# Ecommerce Api Microservices


## Architecture

The architecture consists of the following services:

- `nosql-db`: A NoSQL database service using MongoDB.
- `rabbitmq`: A RabbitMQ service for message passing between the microservices.
- `products`: A service responsible for product-related operations.
- `shopping`: A service responsible for shopping-related operations.
- `customer`: A service responsible for customer-related operations.

Each service is a separate Node.js application and communicates with the others via RabbitMQ.


## Getting Started

To get started with this project, you need to have Docker and Docker Compose installed on your machine.

1. Clone the repository: `git clone https://github.com/Ebenezr/ecommerce-api-ms.git`
2. Navigate into the project directory: `cd ecommerce-api-ms`
3. Build and start the services: `docker-compose up -d`


## Testing

To run the tests for each service, you can use the following command: `docker-compose run --rm <service-name> pnpm test`, replacing `<service-name>` with the name of the service you want to test.

## Contributing

Contributions are welcome! Please read the contributing guidelines before making any changes.

## License

This project is licensed under the MIT License.
