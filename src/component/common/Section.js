import TitleContainer from './TitleContainer';

export default function Section({ section }) {
  const titleCount = section.titles.length;
  const col = titleCount >= 4 ? 3 : Math.floor(12 / titleCount);

  return (
    <section className="mb-5">
      {/* Header with gradient */}
      <div 
        className="text-white px-4 py-3 rounded-top shadow-sm"
        style={{
          background: 'linear-gradient(135deg, #6c757d 0%, #495057 100%)'
        }}
      >
        <h2 className="h5 mb-0 fw-bold">{section.secName}</h2>
      </div>

      {/* Content */}
      <div className="bg-white p-4 rounded-bottom shadow border border-top-0">
        <div className="row g-4">
          {section.titles.map(title => (
            <div key={title.tleId} className={`col-md-${col}`}>
              <TitleContainer title={title} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}