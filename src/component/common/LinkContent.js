export default function LinkContent({ contents }) {
  if (!contents.length) {
    return <p className="text-muted small">No links</p>;
  }

  return (
    <ul className="list-unstyled small">
      {contents.map(item => (
        <li key={item.cteId} className="mb-1">
          <a
            href={item.cteLink}
            target="_blank"
            rel="noopener noreferrer"
            className="link-primary text-decoration-none"
          >
            {item.cteName}
          </a>
        </li>
      ))}
    </ul>
  );
}
