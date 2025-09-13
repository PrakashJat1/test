const formatTime = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const FromtoTo = (from, to) => {
  return `${formatTime(from)} – ${formatTime(to)}`;
};

const single = (date) => {
  return `${formatTime(date)}`;
};

export default {
  FromtoTo,
  single,
};
