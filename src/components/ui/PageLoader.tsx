interface PageLoaderProps {
  visible: boolean;
}

export const PageLoader = ({ visible }: PageLoaderProps) => {
  if (!visible) return null;

  return (
    <div
      role="status"
      aria-label="Loading"
      className="fixed inset-0 z-9998 flex items-center justify-center bg-white"
    >
      <div className="flex flex-col items-center gap-5">
        <div className="relative flex size-20 items-center justify-center">
          <svg
            viewBox="0 0 80 80"
            aria-hidden="true"
            className="absolute inset-0 size-full animate-spin"
          >
            <circle
              cx="40"
              cy="40"
              r="34"
              fill="none"
              stroke="#dbeafe"
              strokeWidth="3"
            />
            <path
              d="M40 6a34 34 0 0 1 29.45 17"
              fill="none"
              stroke="#2563eb"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M69.45 57A34 34 0 0 1 40 74"
              fill="none"
              stroke="#facc15"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>

          <svg
            viewBox="0 0 64 64"
            aria-hidden="true"
            className="relative size-14 drop-shadow-[0_8px_18px_rgba(37,99,235,0.16)]"
          >
            <circle cx="32" cy="32" r="27" fill="#eff6ff" />
            <path
              d="M32 39.5S19 32.2 19 23.8c0-4.3 3.2-7.3 7.2-7.3 2.5 0 4.7 1.3 5.8 3.4 1.1-2.1 3.3-3.4 5.8-3.4 4 0 7.2 3 7.2 7.3 0 8.4-13 15.7-13 15.7Z"
              fill="#facc15"
              className="origin-center animate-pulse"
            />
            <path
              d="M9.5 31.5c4.6.8 8.2 3.2 10.4 7.2 2.6 4.8 6.2 7.2 12.1 8.8"
              fill="none"
              stroke="#2563eb"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <path
              d="M54.5 31.5c-4.6.8-8.2 3.2-10.4 7.2-2.6 4.8-6.2 7.2-12.1 8.8"
              fill="none"
              stroke="#2563eb"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <path
              d="M12.5 27.5 8 31.5l5.5 2.5M51.5 27.5l4.5 4-5.5 2.5"
              fill="none"
              stroke="#2563eb"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <span className="font-nunito text-sm font-bold tracking-[0.22em] text-slate-700 uppercase">
          Berehynja
        </span>
      </div>
    </div>
  );
};

