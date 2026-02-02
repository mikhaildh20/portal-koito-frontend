export default function NewsContent({ contents }) {
  if (!contents.length) {
    return (
      <div className="text-center text-muted fst-italic py-5">
        <svg 
          className="mb-2" 
          width="48" 
          height="48" 
          fill="currentColor" 
          viewBox="0 0 16 16"
        >
          <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z"/>
        </svg>
        <p className="mb-0 small">No news available</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-sm table-hover align-middle mb-0">
        <thead>
          <tr className="border-bottom border-2">
            <th className="fw-semibold text-secondary" style={{ width: '140px' }}>
              Issued Date
            </th>
            <th className="fw-semibold text-secondary">News</th>
          </tr>
        </thead>
        <tbody>
          {contents.map((item, index) => (
            <tr 
              key={item.cteId}
              className={index % 2 === 0 ? 'bg-white' : ''}
            >
              <td className="text-muted small">
                {new Date(item.cteDate).toLocaleDateString('id-ID')}
              </td>
              <td className="small">{item.cteName}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}