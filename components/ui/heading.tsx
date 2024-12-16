import { forwardRef } from "react";

const Heading = forwardRef<HTMLHeadingElement, React.ComponentProps<"h1">>(
  ({ className, children, ...props }, ref) => {
    return (
      <h1
        className={`text-2xl font-semibold text-gray-800 dark:text-gray-200 my-4 ${className}`}
        ref={ref}
        {...props}
      >
        {children}
      </h1>
    );
  }
);

Heading.displayName = "Heading";

export { Heading };
