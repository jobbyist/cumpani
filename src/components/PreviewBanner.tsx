import { PREVIEW_MODE, previewView, setPreviewView } from '@/lib/preview';

/** Shown only in temporary preview builds: switch between the logged-out and member views. */
const PreviewBanner = () => {
  if (!PREVIEW_MODE) return null;
  const view = previewView();
  const btn = (v: 'guest' | 'member', label: string) => (
    <button type="button" onClick={() => v !== view && setPreviewView(v)}
      className={`rounded-full px-2 py-0.5 ${view === v ? 'bg-black text-white' : 'hover:bg-black/10'}`}>{label}</button>
  );
  return (
    <div role="status"
      className="fixed left-3 top-20 z-[70] flex items-center gap-1 rounded-full bg-amber-400 px-2 py-1 text-[11px] font-medium text-black shadow">
      Preview · view as {btn('guest', 'Guest')}{btn('member', 'Member')}
    </div>
  );
};

export default PreviewBanner;
