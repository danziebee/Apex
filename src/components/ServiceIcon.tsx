type ServiceIconProps = { name: string };

export function ServiceIcon({ name }: ServiceIconProps) {
  const common = "h-7 w-7 text-white/90";

  switch (name) {
    case "revenue":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 3v18M8 7a8 8 0 1016 0" />
        </svg>
      );
    case "offer":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 3l2.4 6h6.3l-5 3.8 1.9 6.2L12 16.8 6.4 19l1.9-6.2-5-3.8h6.3L12 3z" />
        </svg>
      );
    case "pipeline":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M6 18V8M12 18V4M18 18v-6" />
        </svg>
      );
    case "performance":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="9" />
          <path d="M8 12l3 3 5-6" />
        </svg>
      );
    case "scale":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M4 16c3-8 13-8 16 0" />
        </svg>
      );
    case "team":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="9" cy="10" r="3" />
          <circle cx="16" cy="11" r="2.5" />
          <path d="M4 19c0-2.5 2.2-4 5-4s5 1.5 5 4M13 19c0-2 1.5-3.5 3.5-3.5" />
        </svg>
      );
    case "automation":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="6" cy="12" r="2" />
          <circle cx="18" cy="6" r="2" />
          <circle cx="18" cy="18" r="2" />
          <path d="M8 12h4M14 8l2-2M14 16l2 2" />
        </svg>
      );
    default:
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M6 14h12M6 10h12M6 6h12" />
        </svg>
      );
  }
}
