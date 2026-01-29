import NewsContent from './NewsContent';
import LinkContent from './LinkContent';

export default function TitleContainer({ title }) {
  return (
    <div className="card h-100 shadow-sm">
      {/* Card Header */}
      <div className="card-header bg-secondary text-white text-center">
        <strong>{title.tleName}</strong>
      </div>

      {/* Card Body */}
      <div className="card-body bg-light">
        {title.tleType === 'News' ? (
          <NewsContent contents={title.contents} />
        ) : (
          <LinkContent contents={title.contents} />
        )}
      </div>
    </div>
  );
}
