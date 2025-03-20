interface Book {
  id: string;
  title: string;
  author: string;
  metadata: BookMetadata;
}

interface BookMetadata {
  isbn: string;
  publisher: string;
  yearPublished: number;
  edition: number;
}

export function getBookDisplayTitle(book: Book): string {
  return `${book.title} by ${book.author}`;
}
