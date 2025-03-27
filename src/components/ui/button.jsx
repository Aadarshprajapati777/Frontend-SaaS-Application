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
 * @param {boolean} asChild - Whether to render children as the root element
 */
const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    // If asChild is true, we need to check if children exists before trying to clone it
    if (asChild && props.children) {
      // Clone the child element and pass the appropriate className and ref
      return React.cloneElement(props.children, {
        className: cn(buttonVariants({ variant, size, className })),
        ref,
        ...props,
        // Don't pass children to avoid infinite recursion
        children: props.children.props.children
      });
    }
    
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button }; 