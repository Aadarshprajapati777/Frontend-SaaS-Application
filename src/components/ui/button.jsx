import React from 'react';
import { cn } from '../../lib/utils';
import { buttonVariants } from './button-utils';

/**
 * Button Component
 * 
 * A flexible button component with various style variants and sizes
 * 
 * @param {string} className - Additional classes to apply
 * @param {('default'|'primary'|'secondary'|'destructive'|'outline'|'ghost'|'link')} variant - Button style variant
 * @param {('default'|'sm'|'lg'|'icon')} size - Button size
 * @param {React.JSX.Element} asChild - Component to render as a child
 */
const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? React.cloneElement(props.children, { ref }) : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button }; 