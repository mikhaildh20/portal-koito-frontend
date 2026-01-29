export default function NewsContent({ contents }) {
  if (!contents.length) {
    return (
      <div className="text-center text-muted fst-italic py-4">
        No news available
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-sm table-hover align-middle">
        <thead className="table-secondary">
          <tr>
            <th style={{ width: '140px' }}>Issued Date</th>
            <th>News</th>
          </tr>
        </thead>
        <tbody>
          {contents.map(item => (
            <tr key={item.cteId}>
              <td>
                {new Date(item.cteDate).toLocaleDateString('id-ID')}
              </td>
              <td>{item.cteName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
