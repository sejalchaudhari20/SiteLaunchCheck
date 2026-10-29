export interface PageData {
  url: string;
  html: string;
  status: number | null;
  headers: Record<string, string>;
  title: string;
  mobileLayoutResults: {
    width: number;
    hasHorizontalOverflow: boolean;
    smallTextNodes: number;
    smallTouchTargets: number;
  }[];
}
