from flask import Flask, jsonify, request
from flask_cors import CORS
import sqlite3
import os

DB_PATH = "notes.db"


def init_db():
    if not os.path.exists(DB_PATH):
        with sqlite3.connect(DB_PATH) as conn:
            cursor = conn.cursor()
            cursor.execute(
                """
                CREATE TABLE notes (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        title TEXT NOT NULL,
                        content TEXT NOT NULL)"""
            )
            conn.commit()


def hello():
    return "📚 Notes API: use /notes"


def get():
    with sqlite3.connect(DB_PATH) as conn:
        conn.row_factory = sqlite3.Row
        notes = conn.execute("SELECT * FROM notes ORDER BY id DESC").fetchall()
    return jsonify({"success": True, "notes": [dict(note) for note in notes]})


def create_note():
    data = request.get_json()
    title = data.get("title")
    content = data.get("content")

    with sqlite3.connect(DB_PATH) as conn:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO notes (title, content) VALUES (?, ?)", (title, content)
        )
        conn.commit()
        note_id = cursor.lastrowid
    return (
        jsonify({"id": note_id, "title": data["title"], "content": data["content"]}),
        201,
    )


def get_note(id):
    with sqlite3.connect(DB_PATH) as conn:
        conn.row_factory = sqlite3.Row
        note = conn.execute("SELECT * FROM notes WHERE  id = ?", (id,)).fetchone()
    if note:
        return jsonify(dict(note))
    return jsonify({"Error": "note not found"}), 404


def delete_note(id):
    with sqlite3.connect(DB_PATH) as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM notes WHERE id = ?", (id,))
        conn.commit()
    if cursor.rowcount == 0:
        return jsonify({"Error": "note not found"}), 404
    return jsonify({"message": "Note deleted successfully"})


def update_note(id):
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    with sqlite3.connect(DB_PATH) as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM notes WHERE id = ?", (id,))
        if not cursor.fetchone():
            return jsonify({"error": "Note not found"}), 404

        if "title" in data:
            cursor.execute(
                "UPDATE notes SET title = ? WHERE id = ?", (data["title"], id)
            )
        if "content" in data:
            cursor.execute(
                "UPDATE notes SET content = ? WHERE id = ?", (data["content"], id)
            )
        conn.commit()
    return jsonify({"message": "Note updated"})


def create_app():
    app = Flask(__name__)

    CORS(app)

    app.add_url_rule("/", "hello", hello)
    app.add_url_rule("/notes", "get", get, methods=["GET"])
    app.add_url_rule("/notes", "create_note", create_note, methods=["POST"])
    app.add_url_rule("/notes/<int:id>", "get_note", get_note, methods=["GET"])
    app.add_url_rule("/notes/<int:id>", "delete_note", delete_note, methods=["DELETE"])
    app.add_url_rule("/notes/<int:id>", "update_note", update_note, methods=["PUT"])

    return app


def main():
    init_db()
    app = create_app()
    print("🚀 API запущен!")
    print("📝 Доступные методы:")
    print("   GET    /notes      - Все заметки")
    print("   POST   /notes      - Создать заметку")
    print("   GET    /notes/1    - Получить заметку #1")
    print("   DELETE /notes/1    - Удалить заметку #1")
    app.run(debug=True)


if __name__ == "__main__":
    main()
