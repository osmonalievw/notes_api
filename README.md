# Notes API

This project is a simple notes API built with Flask and a React frontend.

## Project Structure

- `app.py`: The Flask API for managing notes.
- `notes/`: The React frontend for the notes application.

## How to Use

### Backend (API)

1.  **Navigate to the root directory:**
    ```bash
    cd notes_api
    ```
2.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
    *(Note: You may need to create a `requirements.txt` file first if one doesn't exist. You can do this with `pip freeze > requirements.txt`)*
3.  **Run the API:**
    ```bash
    python app.py
    ```
    The API will be running at `http://127.0.0.1:5000`.

### Frontend (React App)

1.  **Navigate to the `notes` directory:**
    ```bash
    cd notes
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run the app:**
    ```bash
    npm run dev
    ```
    The frontend will be running at `http://localhost:5173`.

**Important:** The frontend is configured to connect to the API at `http://127.0.0.1:5000`. If you change the API's address, you'll need to update the `API_BASE` constant in `notes/src/App.jsx`.