import type { ComponentPropsWithoutRef, ReactNode } from "react";

type NoticeProps = {
  title: string;
  tone?: "info" | "success" | "warning";
  actions?: ReactNode;
} & ComponentPropsWithoutRef<"article">;

const toneLabels = {
  info: "Info",
  success: "Done",
  warning: "Check",
};

const Notice = ({
  title,
  tone = "info",
  actions,
  children,
  className = "",
  ...articleProps
}: NoticeProps) => {
  const mergedClassName = ["notice", `notice-${tone}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <article {...articleProps} className={mergedClassName}>
      <div>
        <span className="badge">{toneLabels[tone]}</span>
        <h3>{title}</h3>
      </div>
      <div className="notice-body">{children}</div>
      {actions ? <div className="notice-actions">{actions}</div> : null}
    </article>
  );
};

export default Notice;
