import TitleContainer from './TitleContainer';

export default function Section({ section }) {
  const titleCount = section.titles.length;
  const col =
    titleCount >= 4 ? 3 : Math.floor(12 / titleCount);

  return (
    <section className="mb-4">
      {/* Header */}
      <div className="bg-secondary text-white px-4 py-2 rounded-top">
        <h2 className="h6 mb-0">{section.secName}</h2>
      </div>

      {/* Content */}
      <div className="bg-light p-4 rounded-bottom border">
        <div className="row g-3">
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
