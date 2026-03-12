export default function Stars({ rating, size = 14 }) {
  return (
    <span style={{ fontSize: size }}>
      {[1,2,3,4,5].map(n => (
        <span key={n}>
          {n <= Math.round(rating) ? "★" : "☆"}
        </span>
      ))}
    </span>
  );
}