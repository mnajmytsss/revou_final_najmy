# Disaster Management API

## Introduction

This project is a Disaster Management API built using Express.js, MySQL, and JWT for authentication. The API allows users to manage information about disasters, including creating, retrieving, updating, and deleting disaster entries.

## Project Structure

The project is organized into the following structure:

bashCopy code

```
/Group-Project-Backend
  /controllers
    - disastersController.js
  /middleware
    - authenticationMiddleware.js
  /routes
    - disastersRoutes.js
- app.js
```

- **controllers**: Contains the disaster controller responsible for handling disaster-related logic.
- **middleware**: Includes the authentication middleware for verifying JWT tokens.
- **routes**: Defines the API routes and connects them to the corresponding controller methods.
- **server.js**: The main entry point of the application, where the Express server is configured.

## Installation

To install the project locally, follow these steps:

bashCopy code

```
# Clone the repository
git clone <repository-url>

# Navigate to the project directory
cd <project-directory>

# Install dependencies
npm install
```

## Usage

Run the server using the following command:

bashCopy code

`# Run the server npm start`

The server will be accessible at `http://localhost:7001`.

## Endpoints

### Register User

### `POST /auth/register`


**Request:**

```
{ 
"USER_EMAIL": example@mail.com, 
"USER_PASS": "Password123", 
"USER_ROLE": "1/2/3"
}
```

**Response:

```
{
"id": 1
}
```

### Login User

### `POST /auth/login`

**Response:**

```
{
    "user_email": "najmy@gmail.com",
    "user_pass": "najmy123"
}

```

**Response:

```
{
    "message": "Selamat datang! Anda berhasil masuk.",
    "data": {
        "token": "sadsfsadfa2324fq23fewf......"
    }
}
```
## Register Doctor

### `POST /api/v1/doctor/register`

Token Authorization Reguired

**Request:**

```
{
    "dok_name": "Dr. John Doe",
    "dok_spec": "Cardiologist",
    "dok_email": "dok@email.com",
    "dok_telp": "1234567890",
    "dok_bio": "Experienced cardiologist with a passion for patient care.",
    "dok_nostr": "12345",
    "dok_location": "Hospital XYZ, City",
    "dok_exp": "10 years"
}
```

**Response:**

```
{
    "dok_id": number
}
```

### Get All Doctors

### `GET /api/v1/doctor/getAllDoctors`

Token Authorization Reguired

**Response:**

```
{
    "doctors": [
        {
            "DOK_ID": 4,
            "USER_ID": 7,
            "DOK_NAME": "Dr. John Doe",
            "DOK_SPEC": "Cardiologist",
            "DOK_EMAIL": "dok@email.com",
            "DOK_TELP": "1234567890",
            "DOK_BIO": "Experienced cardiologist with a passion for patient care.",
            "DOK_NOSTR": "12345",
            "DOK_LOCATION": "Hospital XYZ, City",
            "DOK_EXP": "10 years"
        }
    ]
}
```

## Get Doctor By ID

### `GET /api/v1/doctor/getDoctorById/:dok_id`

Token Authorization Reguired

**Response:**

```
{
    "DOK_ID": 4,
    "dok_name": "Dr. John Doe",
    "dok_spec": "Cardiologist",
    "dok_email": "dok@email.com",
    "dok_telp": "1234567890",
    "dok_bio": "Experienced cardiologist with a passion for patient care.",
    "dok_nostr": "12345",
    "dok_location": "Hospital XYZ, City",
    "dok_exp": "10 years"
}
```

### Update Doctor 

### `PUT /api/v1/doctor/updateDoctor/:dok_id`

**Request:**

```
{
    "dok_name": "Dr. John Doe",
    "dok_spec": "Cardiologist",
    "dok_email": "dok@email.com",
    "dok_telp": "1234567890",
    "dok_bio": "Experienced cardiologist with a passion for patient care.",
    "dok_nostr": "12345",
    "dok_location": "Hospital XYZ, City",
    "dok_exp": "10 years"
}

```

**Response:**

```
{
    "error": "Informasi dokter berhasil diperbarui."
}
```

### Activate Doctor Account

### `PUT /api/v1/admin/activateDoctor/:dok_id`

**Request:**

```
{
    "dok_status": "1"
}

```

**Response:**

```
{
    "error": "Status dokter sudah aktif."
}
```

### Dectivate Doctor Account

### `PUT /api/v1/admin/deactivateDoctor/:dok_id`

**Request:**

```
{
    "dok_status": "0"
}

```

**Response:**

```
{
    "message": "Status dokter sudah tidak aktif"
}
```

## Authentication

The API uses JWT (JSON Web Token) for authentication. Include the token in the `Authorization` header of your requests.

## Contributing

Feel free to contribute to this project by submitting issues or creating pull requests. Follow the contribution guidelines in the repository.

## License

This project is licensed under the [Your License Name] - see the [LICENSE.md](https://chat.openai.com/c/LICENSE.md) file for details.
