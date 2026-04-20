export default function Marquee() {
  const renderMarqueeColumn = (start, end) => {
    const images = [];
    for (let i = start; i <= end; i++) {
      images.push(
        <img
          key={`orig-${i}`}
          data-value={i}
          className="my-4 rounded-xl w-full min-w-full"
          src={`https://picsum.photos/640/480?random=${i}`}
          alt={`image${i}`}
        />
      );
    }
    // Duplicate images for seamless looping
    for (let i = start; i <= end; i++) {
      images.push(
        <img
          key={`loop-${i}`}
          data-value={i}
          className="my-4 rounded-xl w-full min-w-full"
          src={`https://picsum.photos/640/480?random=${i}`}
          alt={`image${i}`}
        />
      );
    }
    return <div className="marquee p-1 w-40 sm:w-60 md:w-80 h-full">{images}</div>;
  };

  return (
    <div className="bg-black absolute overflow-hidden h-screen w-full flex justify-center -z-10 top-0 left-0">
      <div className="flex gap-2 min-w-max">
        {renderMarqueeColumn(1, 10)}
        {renderMarqueeColumn(11, 20)}
        <div className="hidden sm:block">
          {renderMarqueeColumn(21, 30)}
        </div>
        <div className="hidden md:block">
          {renderMarqueeColumn(31, 40)}
        </div>
        <div className="hidden lg:block">
          {renderMarqueeColumn(41, 50)}
        </div>
      </div>
    </div>
  );
}
