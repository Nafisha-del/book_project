import csv
from server.main import SessionLocal, Book

def import_books_from_csv(csv_path="server/books.csv"):
    db = SessionLocal()
    try:
        with open(csv_path, newline='', encoding="utf-8") as csvfile:
            reader = csv.DictReader(csvfile)
            count = 0
            for row in reader:
                existing_book = db.query(Book).filter(Book.title == row['Title']).first()
                if existing_book:
                    print(f"Skipping duplicate: {row['Title']}")
                    continue

                book = Book(
                    title=row.get('Title'),
                    authors=row.get('Authors'),
                    description=row.get('Description'),
                    category=row.get('Category'),
                    publisher=row.get('Publisher'),
                    price=row.get('Price Starting With ($)'),
                    publish_month=row.get('Publish Date (Month)'),
                    publish_year=int(row.get('Publish Date (Year)') or 0)
                )
                db.add(book)
                count += 1
            db.commit()
            print(f"Successfully imported {count} books into the database.")
    finally:
        db.close()

if __name__ == "__main__":
    import_books_from_csv("server/books.csv")
