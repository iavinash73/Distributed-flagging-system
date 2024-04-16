# Distributed Flagging System
A secure social media application which uses Distributed Computing to verify if a image a user wants to post is similar to the images given in the reference database. This is achieved using hashing methods
like Perceptual Hashing, Average hashing, Difference hashing and Median hashing where the hash values are precomputed for reference images in a Database. The uploaded image is then hashed with it's respective hash
and later verified with the precomputed hashes with Hamming Distance and a threshold for the System to decide whether to vote or not for the given image. If a Quorum existsthe image isn't uploaded to the 
social media and the user is flagged and banned from the application after 2 warnings.

<p align="center" width="100%">
    <img src=""></img>
</p>

## DEMO
[Demo video](https://drive.google.com/file/d/14da6duvrd4muRqXoQK2q86zfd9yDjE0j/view?usp=sharing)

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
