// ✨ helper right above the component (or extract it to utils)
export default function getPageItems(current: number, total: number): (number | "ellipsis")[] {
  // Show everything when pages are few
  if (total <= 7) return Array.from({ length: total }, (_, i) => i);

  const pages: (number | "ellipsis")[] = [];

  // Always show first page
  pages.push(0);

  // Left side
  if (current > 3) pages.push("ellipsis");
  for (let i = Math.max(1, current - 1); i <= Math.min(current + 1, total - 2); i++) {
    pages.push(i);
  }

  // Right side
  if (current < total - 4) pages.push("ellipsis");

  // Always show last page
  pages.push(total - 1);

  return pages;
}
