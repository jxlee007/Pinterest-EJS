export default function Marquee() {
  const renderMarqueeColumn = (start, end) => {
    const images = [];
    for (let i = start; i <= end; i++) {
      images.push(
        <img
          key={i}
          data-value={i}
          className="my-4 rounded-xl w-full min-w-full"
          src={`https://source.unsplash.com/random/640x480?${i}`}
          alt={`image${i}`}
        />
      );
    }
    return <div className="marquee p-2 w-80 h-full">{images}</div>;
  };

  return (
    <div className="bg-black absolute overflow-hidden h-screen w-screen flex -z-10 top-0 left-0">
      {renderMarqueeColumn(1, 10)}
      {renderMarqueeColumn(11, 20)}
      {renderMarqueeColumn(21, 30)}
      {renderMarqueeColumn(31, 40)}
      {renderMarqueeColumn(41, 50)}
    </div>
  );
}
