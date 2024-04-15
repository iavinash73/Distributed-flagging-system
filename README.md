## DEMO
[![Watch the video demo](https://drive.google.com/file/d/14da6duvrd4muRqXoQK2q86zfd9yDjE0j/view?usp=sharing)

## Setup Instructions

### Backend Setup
1. Navigate to the `backend` directory.
2. Create a virtual environment:
    ```bash
    python3 -m venv venv
    ```
3. Activate the virtual environment:
    - On Windows:
        ```bash
        venv\Scripts\activate
        ```
    - On macOS and Linux:
        ```bash
        source venv/bin/activate
        ```
4. Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
5. Set up the database:
    - Modify the `config.py` file to specify your database configuration.
6. Start the Flask server:
    ```bash
    flask run
    ```

### Frontend Setup
1. Navigate to the `d_flag` directory.
2. Install dependencies:
    ```bash
    npm install
    ```
3. Start the React development server:
    ```bash
    npm start
    ```

## Usage
- Access the frontend at `http://localhost:3000`.
- The backend APIs are available at `http://localhost:5000`.
- Hit the endpoint `http://127.0.0.1:5000/initdb` to initialise the DB with reference cat images. This will be required for the algorithms to compare hashes and vote.

## Folder Structure
- `backend`: Contains the Flask backend code.
- `d_flag`: Contains the React frontend code.
