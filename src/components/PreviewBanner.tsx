import { PREVIEW_MODE } from '@/lib/preview';

/** Shown only in temporary preview builds. */
const PreviewBanner = () =>
  PREVIEW_MODE ? (
    <div role="status"
      className="pointer-events-none fixed left-3 top-20 z-[70] rounded-full bg-amber-400 px-3 py-1 text-[11px] font-medium text-black shadow">
      Preview mode: login bypassed, sample data only
    </div>
  ) : null;

export default PreviewBanner;
