export const textcolor = (score: number | undefined) => {
  if (typeof score === "undefined") return "text-black";
  return score < 0.25
    ? "text-red-500"
    : score < 0.7
    ? "text-yellow-500"
    : "text-green-400";
};

export const bgcolor = (score: number | undefined) => {
  if (!score) return "text-black";
  return score < 0.25
    ? "bg-red-500"
    : score < 0.7
    ? "bg-yellow-500"
    : "bg-green-400";
};
