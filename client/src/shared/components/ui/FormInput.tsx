import { forwardRef } from "react";

type FormInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  icon?: React.ReactNode;
};

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, icon, id, className, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && id && (
          <label htmlFor={id} className="mb-1.5 block text-sm">
            {label}
          </label>
        )}

        <div className="relative">
          {icon && (
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {icon}
            </div>
          )}

          <input
            id={id}
            ref={ref}
            className={`form-input pl-10 pr-4 ${
              icon ? "pl-9" : ""
            } ${className}`}
            {...props}
          />
        </div>
      </div>
    );
  },
);

FormInput.displayName = "FormInput";
