const currentYear = new Date().getFullYear();

export const monthOptions = Array.from({ length: 12 }, (_, index) => {
  const monthDate = new Date(currentYear, index, 1);
  const monthName = monthDate.toLocaleString("default", { month: "long" });

  return {
    label: monthName, // "January", "February", ...
    value: `${currentYear}-${String(index + 1).padStart(2, "0")}`, // "2025-01"
  };
});
