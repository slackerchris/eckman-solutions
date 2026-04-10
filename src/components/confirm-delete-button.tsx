"use client";

export function ConfirmDeleteButton({
  action,
  message,
  label = "Delete",
  style,
}: {
  action: () => Promise<void>;
  message: string;
  label?: string;
  style?: React.CSSProperties;
}) {
  return (
    <form action={action}>
      <button
        type="submit"
        onClick={(e) => {
          if (!confirm(message)) e.preventDefault();
        }}
        style={style}
      >
        {label}
      </button>
    </form>
  );
}
