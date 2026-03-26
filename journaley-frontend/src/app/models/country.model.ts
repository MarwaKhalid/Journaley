/** Country row for home carousel and country modals. */
export interface Country {
  id: number;
  name: string;
  slug: string;
  /** Full URL from API when a cover image exists. */
  imageUrl: string | null;
}
