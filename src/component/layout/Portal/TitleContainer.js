import NewsContent from './NewsContent';
import LinkContent from './LinkContent';

export default function TitleContainer({ title }) {
  return (
    <div className="card h-100 shadow-sm border-0 overflow-hidden hover-lift">
      {/* Card Header with gradient */}
      <div 
        className="card-header text-white text-center py-3"
        style={{
          background: 'linear-gradient(135deg, #6c757d 0%, #5a6268 100%)'
        }}
      >
        <strong className="d-block">{title.tleName}</strong>
      </div>

      {/* Card Body */}
      <div className="card-body bg-light" style={{ minHeight: '200px' }}>
        {title.tleType === 'News' ? (
          <NewsContent contents={title.contents} />
        ) : (
          <LinkContent contents={title.contents} />
        )}
      </div>
    </div>
  );
}